export function appShell(): string {
  return `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Nura Discovery Core workspace">
  <title>Nura — Discovery Core</title>
  <link rel="icon" href="/static/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/static/style.css">
</head>
<body>
  <header class="site-header">
    <a class="brand" href="/" aria-label="Nura home"><span class="brand-mark">N</span><span>Nura</span></a>
    <p class="principle">Demand First <span>→</span> Context First <span>→</span> Solution Second</p>
    <button id="logout-button" class="button button-ghost" hidden>Keluar</button>
  </header>
  <main id="app" class="page-shell" aria-live="polite">
    <section class="loading-card"><p>Memuat workspace Nura…</p></section>
  </main>
  <script type="module" src="/static/app.js"></script>
</body>
</html>`
}
