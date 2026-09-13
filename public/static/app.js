const app = document.querySelector('#app')
const logoutButton = document.querySelector('#logout-button')

const state = { workspaceId: localStorage.getItem('nura_workspace_id'), session: null, workspaces: [] }

async function api(path, options = {}) {
  const headers = { 'content-type': 'application/json', ...(options.headers || {}) }
  if (state.workspaceId) headers['x-workspace-id'] = state.workspaceId
  const response = await fetch(path, { ...options, headers })
  const payload = await response.json()
  if (!response.ok) throw new Error(payload.error?.message || 'Permintaan gagal.')
  return payload.data
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character])
}

function formatTime(value) {
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

function renderAuth(message = '') {
  logoutButton.hidden = true
  app.innerHTML = `
    <section class="auth-layout">
      <article class="welcome-panel">
        <p class="eyebrow">Nura Discovery Core</p>
        <h1>Mulai dari permintaan nyata, bukan asumsi solusi.</h1>
        <p class="lede">Bangun konteks kerja yang aman untuk menemukan kebutuhan, memahami alur, dan memvalidasi masalah sebelum memilih intervensi.</p>
        <ol class="flow-list">
          <li><span>01</span> Demand</li><li><span>02</span> Context</li><li><span>03</span> Validation</li><li><span>04</span> Execution</li>
        </ol>
      </article>
      <article class="auth-card">
        <div class="tab-list" role="tablist">
          <button class="tab active" data-tab="login" role="tab">Masuk</button>
          <button class="tab" data-tab="register" role="tab">Buat workspace</button>
        </div>
        ${message ? `<p class="form-message" role="alert">${escapeHtml(message)}</p>` : ''}
        <form id="login-form" class="form-stack">
          <label>Email<input name="email" type="email" required autocomplete="email"></label>
          <label>Kata sandi<input name="password" type="password" required autocomplete="current-password"></label>
          <button class="button button-primary" type="submit">Masuk ke Nura</button>
        </form>
        <form id="register-form" class="form-stack" hidden>
          <label>Email pemilik<input name="email" type="email" required autocomplete="email"></label>
          <label>Kata sandi <small>minimal 12 karakter</small><input name="password" type="password" minlength="12" required autocomplete="new-password"></label>
          <label>Nama tenant<input name="tenant_name" required maxlength="100"></label>
          <label>Workspace pertama<input name="workspace_name" required maxlength="100"></label>
          <button class="button button-primary" type="submit">Inisialisasi tenant</button>
        </form>
      </article>
    </section>`

  document.querySelectorAll('.tab').forEach((tab) => tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((item) => item.classList.toggle('active', item === tab))
    document.querySelector('#login-form').hidden = tab.dataset.tab !== 'login'
    document.querySelector('#register-form').hidden = tab.dataset.tab !== 'register'
  }))
  document.querySelector('#login-form').addEventListener('submit', submitLogin)
  document.querySelector('#register-form').addEventListener('submit', submitRegister)
}

async function submitLogin(event) {
  event.preventDefault()
  try {
    await api('/api/v1/auth/login', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) })
    await loadWorkspace()
  } catch (error) { renderAuth(error.message) }
}

async function submitRegister(event) {
  event.preventDefault()
  try {
    const result = await api('/api/v1/auth/register', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) })
    state.workspaceId = result.workspaceId
    localStorage.setItem('nura_workspace_id', state.workspaceId)
    await loadWorkspace()
  } catch (error) { renderAuth(error.message) }
}

async function loadWorkspace() {
  try {
    const status = await api('/api/v1/auth/status')
    if (!status.authenticated) return renderAuth()
    state.workspaces = await api('/api/v1/workspaces')
    if (!state.workspaceId || !state.workspaces.some((workspace) => workspace.id === state.workspaceId)) {
      state.workspaceId = state.workspaces[0]?.id
      if (state.workspaceId) localStorage.setItem('nura_workspace_id', state.workspaceId)
    }
    state.session = await api('/api/v1/auth/session')
    await renderDiscovery()
  } catch { renderAuth() }
}

async function renderDiscovery(message = '') {
  const [signals, opportunities] = await Promise.all([
    api('/api/v1/signals'),
    api('/api/v1/opportunities'),
  ])
  logoutButton.hidden = false
  app.innerHTML = `
    <section class="workspace-bar" aria-label="Workspace context">
      <div><p class="eyebrow">Tenant</p><strong>${escapeHtml(state.session.tenant_name)}</strong></div>
      <label>Workspace
        <select id="workspace-select">${state.workspaces.map((workspace) => `<option value="${workspace.id}" ${workspace.id === state.session.workspace_id ? 'selected' : ''}>${escapeHtml(workspace.name)}</option>`).join('')}</select>
      </label>
      <div class="identity"><p class="eyebrow">Masuk sebagai</p><strong>${escapeHtml(state.session.email)}</strong><small>${escapeHtml(state.session.tenant_role)}</small></div>
    </section>
    <section class="dashboard-grid">
      <aside class="side-nav" aria-label="Navigasi utama">
        <a class="nav-item" href="#capture">Capture Signal</a>
        <a class="nav-item active" href="#signals">Signals <span>${signals.length}</span></a>
        <a class="nav-item" href="#opportunities">Opportunities <span>${opportunities.length}</span></a>
        <span class="nav-divider">Phase 02</span>
        <p class="nav-note">Demand → Opportunity</p>
      </aside>
      <article class="content-panel">
        <p class="eyebrow">Discovery / Phase 02</p>
        <h1>Demand yang dapat ditelusuri.</h1>
        <p class="lede compact">Tangkap observasi asli, pertahankan provenance, lalu bentuk opportunity tanpa menganggapnya sudah tervalidasi.</p>
        ${message ? `<p class="form-message" role="status">${escapeHtml(message)}</p>` : ''}
        <section class="capture-panel" id="capture">
          <div><p class="eyebrow">Manual capture</p><h2>Catat demand signal</h2></div>
          <form id="signal-form" class="signal-form">
            <label>Tipe sumber<select name="source_type"><option>MANUAL</option><option>DIRECT</option><option>REFERRAL</option><option>WEB</option><option>SOCIAL</option><option>MARKETPLACE</option><option>OTHER</option></select></label>
            <label>Referensi sumber <small>opsional</small><input name="source_reference" maxlength="1000" placeholder="URL, tiket, atau referensi"></label>
            <label class="field-wide">Konten asli<textarea name="raw_content" required maxlength="5000" rows="4" placeholder="Apa yang benar-benar diamati atau diminta?"></textarea></label>
            <button class="button button-primary" type="submit">Simpan signal</button>
          </form>
        </section>
        <section class="discovery-section" id="signals">
          <div class="section-heading"><div><p class="eyebrow">Observed evidence</p><h2>Signals</h2></div><span class="count-badge">${signals.length}</span></div>
          <div class="record-list">${signals.length ? signals.map(signalCard).join('') : emptyState('Belum ada signal', 'Tangkap observasi manual pertama untuk memulai Discovery.')}</div>
        </section>
        <section class="discovery-section" id="opportunities">
          <div class="section-heading"><div><p class="eyebrow">Candidate, not validation</p><h2>Opportunities</h2></div><span class="count-badge">${opportunities.length}</span></div>
          <div class="record-list">${opportunities.length ? opportunities.map(opportunityCard).join('') : emptyState('Belum ada opportunity', 'Bentuk opportunity dari signal yang relevan.')}</div>
        </section>
      </article>
    </section>`

  document.querySelector('#workspace-select').addEventListener('change', async (event) => {
    state.workspaceId = event.target.value
    localStorage.setItem('nura_workspace_id', state.workspaceId)
    await loadWorkspace()
  })
  document.querySelector('#signal-form').addEventListener('submit', captureSignal)
  document.querySelectorAll('[data-form-opportunity]').forEach((button) => button.addEventListener('click', () => formOpportunity(button.dataset.formOpportunity)))
  document.querySelectorAll('[data-status]').forEach((select) => select.addEventListener('change', () => changeOpportunityStatus(select.dataset.status, select.value)))
}

function signalCard(signal) {
  return `<article class="record-card">
    <div class="record-topline"><span class="source-badge">${escapeHtml(signal.source_type)}</span><span class="status-pill">${escapeHtml(signal.status)}</span></div>
    <h3>${escapeHtml(signal.normalized_content.slice(0, 120))}</h3>
    <details><summary>Lihat observasi & provenance</summary><blockquote>${escapeHtml(signal.raw_content)}</blockquote><dl class="provenance"><div><dt>Sumber</dt><dd>${escapeHtml(signal.source_reference || 'Tidak diketahui')}</dd></div><div><dt>Ditangkap</dt><dd>${formatTime(signal.captured_at)}</dd></div><div><dt>Mekanisme</dt><dd>${escapeHtml(signal.capture_mechanism)}</dd></div></dl></details>
    ${signal.status === 'LINKED' ? '<span class="linked-label">Opportunity formed</span>' : `<button class="button button-secondary" data-form-opportunity="${signal.id}">Form opportunity</button>`}
  </article>`
}

function opportunityCard(opportunity) {
  const transitions = {
    NEW: ['REVIEW', 'DISMISSED'], REVIEW: ['QUALIFIED', 'DISMISSED'],
    QUALIFIED: ['REVIEW', 'DISMISSED'], DISMISSED: ['REVIEW'],
  }
  return `<article class="record-card opportunity-card">
    <div class="record-topline"><span class="source-badge">OPPORTUNITY</span><span class="status-pill status-${opportunity.status.toLowerCase()}">${escapeHtml(opportunity.status)}</span></div>
    <h3>${escapeHtml(opportunity.title)}</h3><p>${escapeHtml(opportunity.summary)}</p>
    <div class="record-footer"><small>${opportunity.source_signal_count} linked signal · ${formatTime(opportunity.created_at)}</small><label>Status<select data-status="${opportunity.id}"><option selected>${opportunity.status}</option>${transitions[opportunity.status].map((status) => `<option>${status}</option>`).join('')}</select></label></div>
  </article>`
}

function emptyState(title, text) {
  return `<section class="empty-state"><h3>${title}</h3><p>${text}</p></section>`
}

async function captureSignal(event) {
  event.preventDefault()
  const values = Object.fromEntries(new FormData(event.currentTarget))
  if (!values.source_reference) delete values.source_reference
  try {
    await api('/api/v1/signals', {
      method: 'POST',
      headers: { 'idempotency-key': globalThis.crypto.randomUUID() },
      body: JSON.stringify(values),
    })
    await renderDiscovery('Demand signal tersimpan dengan konten asli dan provenance.')
  } catch (error) { await renderDiscovery(error.message) }
}

async function formOpportunity(signalId) {
  try {
    await api('/api/v1/opportunities/from-signal', { method: 'POST', body: JSON.stringify({ signal_id: signalId }) })
    await renderDiscovery('Opportunity dibentuk sebagai kandidat—belum tervalidasi dan belum memiliki solusi.')
  } catch (error) { await renderDiscovery(error.message) }
}

async function changeOpportunityStatus(opportunityId, status) {
  try {
    await api(`/api/v1/opportunities/${opportunityId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
    await renderDiscovery(`Status opportunity diperbarui ke ${status}.`)
  } catch (error) { await renderDiscovery(error.message) }
}

logoutButton.addEventListener('click', async () => {
  await api('/api/v1/auth/logout', { method: 'POST' }).catch(() => undefined)
  localStorage.removeItem('nura_workspace_id')
  state.workspaceId = null
  state.session = null
  renderAuth()
})

loadWorkspace()
