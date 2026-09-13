const app = document.querySelector('#app')
const logoutButton = document.querySelector('#logout-button')

const state = { workspaceId: localStorage.getItem('nura_workspace_id') }

async function api(path, options = {}) {
  const headers = { 'content-type': 'application/json', ...(options.headers || {}) }
  if (state.workspaceId) headers['x-workspace-id'] = state.workspaceId
  const response = await fetch(path, { ...options, headers })
  const payload = await response.json()
  if (!response.ok) throw new Error(payload.error?.message || 'Permintaan gagal.')
  return payload.data
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character])
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
  const values = Object.fromEntries(new FormData(event.currentTarget))
  try {
    await api('/api/v1/auth/login', { method: 'POST', body: JSON.stringify(values) })
    await loadWorkspace()
  } catch (error) { renderAuth(error.message) }
}

async function submitRegister(event) {
  event.preventDefault()
  const values = Object.fromEntries(new FormData(event.currentTarget))
  try {
    const result = await api('/api/v1/auth/register', { method: 'POST', body: JSON.stringify(values) })
    state.workspaceId = result.workspaceId
    localStorage.setItem('nura_workspace_id', state.workspaceId)
    await loadWorkspace()
  } catch (error) { renderAuth(error.message) }
}

async function loadWorkspace() {
  try {
    const status = await api('/api/v1/auth/status')
    if (!status.authenticated) return renderAuth()
    let workspaces = await api('/api/v1/workspaces')
    if (!state.workspaceId || !workspaces.some((workspace) => workspace.id === state.workspaceId)) {
      state.workspaceId = workspaces[0]?.id
      if (state.workspaceId) localStorage.setItem('nura_workspace_id', state.workspaceId)
    }
    const session = await api('/api/v1/auth/session')
    workspaces = await api('/api/v1/workspaces')
    renderShell(session, workspaces)
  } catch { renderAuth() }
}

function renderShell(session, workspaces) {
  logoutButton.hidden = false
  app.innerHTML = `
    <section class="workspace-bar" aria-label="Workspace context">
      <div><p class="eyebrow">Tenant</p><strong>${escapeHtml(session.tenant_name)}</strong></div>
      <label>Workspace
        <select id="workspace-select">${workspaces.map((workspace) => `<option value="${workspace.id}" ${workspace.id === session.workspace_id ? 'selected' : ''}>${escapeHtml(workspace.name)}</option>`).join('')}</select>
      </label>
      <div class="identity"><p class="eyebrow">Masuk sebagai</p><strong>${escapeHtml(session.email)}</strong><small>${escapeHtml(session.tenant_role)}</small></div>
    </section>
    <section class="dashboard-grid">
      <aside class="side-nav" aria-label="Navigasi utama">
        <a class="nav-item active" href="#overview">Overview</a>
        <a class="nav-item" href="#discovery">Discovery</a>
        <span class="nav-divider">Phase 01</span>
        <a class="nav-item" href="#workspace">Workspace</a>
      </aside>
      <article class="content-panel" id="overview">
        <p class="eyebrow">Foundation ready</p>
        <h1>Ruang kerja untuk discovery yang dapat dipercaya.</h1>
        <p class="lede compact">Identitas, tenant, dan workspace sudah membentuk batas kepemilikan. Setiap objek Discovery berikutnya akan mengikuti konteks ini.</p>
        <div class="status-grid">
          <section class="status-card"><span class="status-dot ready"></span><p>Identity boundary</p><strong>Aktif</strong></section>
          <section class="status-card"><span class="status-dot ready"></span><p>Tenant isolation</p><strong>Server-side</strong></section>
          <section class="status-card"><span class="status-dot ready"></span><p>Workspace context</p><strong>${escapeHtml(session.workspace_name)}</strong></section>
        </div>
        <section class="discovery-entry" id="discovery">
          <div><p class="eyebrow">Next: Phase 02</p><h2>Demand Signal → Opportunity</h2><p>Discovery dimulai tanpa memaksa industri atau solusi. Fondasi ownership siap menerima objek pertama.</p></div>
          <button class="button button-disabled" disabled title="Tersedia pada Phase 02">Tangkap demand</button>
        </section>
      </article>
    </section>`
  document.querySelector('#workspace-select').addEventListener('change', async (event) => {
    state.workspaceId = event.target.value
    localStorage.setItem('nura_workspace_id', state.workspaceId)
    await loadWorkspace()
  })
}

logoutButton.addEventListener('click', async () => {
  await api('/api/v1/auth/logout', { method: 'POST' }).catch(() => undefined)
  localStorage.removeItem('nura_workspace_id')
  state.workspaceId = null
  renderAuth()
})

loadWorkspace()
