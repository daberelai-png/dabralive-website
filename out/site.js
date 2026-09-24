(() => {
  const languageSwitch = document.querySelector('.language-switch');
  function syncLanguageLink() {
    if (languageSwitch) languageSwitch.href = (document.documentElement.lang === 'he' ? 'index.html' : 'he.html') + location.hash;
  }
  syncLanguageLink();
  window.addEventListener('hashchange', syncLanguageLink);
  const pilot = document.querySelector('#pilot');
  const header = document.querySelector('.site > header');
  const sections = [...document.querySelectorAll('main > section[id]')];
  const navLinks = [...document.querySelectorAll('header nav a, footer nav a')];
  const finePointer = matchMedia('(hover:hover) and (pointer:fine)');

  function selectTechTab(tab, focus = false) {
    const spec = tab.closest('.engineering-spec');
    if (!spec) return;
    spec.querySelectorAll('[role="tab"]').forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
    });
    if (focus) tab.focus();
  }
  function selectConnection(button, selected = true) {
    const panel = button.closest('.rear-panel');
    if (!panel) return;
    if (selected) panel.dataset.connection = button.dataset.connection;
    else delete panel.dataset.connection;
    panel.querySelectorAll('button[data-connection]').forEach(control => {
      control.setAttribute('aria-pressed', String(selected && control.dataset.connection === button.dataset.connection));
    });
  }
  document.addEventListener('pointerover', event => {
    const control = event.target.closest('button[data-connection]');
    if (control && finePointer.matches && !control.contains(event.relatedTarget)) selectConnection(control);
  });
  document.addEventListener('focusin', event => {
    const control = event.target.closest('button[data-connection]');
    if (control) selectConnection(control);
  });
  document.addEventListener('click', event => {
    const tab = event.target.closest('.tech-tabs [role="tab"]');
    if (tab) { selectTechTab(tab); return; }
    const connection = event.target.closest('button[data-connection]');
    if (connection) { selectConnection(connection); return; }
    if (event.target.closest('[data-pilot]')) { pilot.showModal(); return; }
    if (event.target.closest('#pilot .close, #dismiss')) pilot.close();
  });
  document.addEventListener('keydown', event => {
    const tab = event.target.closest('.tech-tabs [role="tab"]');
    if (tab && ['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const tabs = [...tab.parentElement.querySelectorAll('[role="tab"]')];
      let index = tabs.indexOf(tab);
      index = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1
        : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      selectTechTab(tabs[index], true);
    }
    const connection = event.target.closest('button[data-connection]');
    if (event.key === 'Escape' && connection) selectConnection(connection, false);
  });
  pilot?.addEventListener('click', event => {
    if (event.target !== pilot) return;
    const r = pilot.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) pilot.close();
  });

  let queued = false;
  function updateNavigation() {
    queued = false;
    const threshold = header.getBoundingClientRect().height + 48;
    let active = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= threshold) active = section;
    }
    if (!active) return;
    if (languageSwitch) languageSwitch.href = (document.documentElement.lang === 'he' ? 'index.html' : 'he.html') + (location.hash || '#' + active.id);
    navLinks.forEach(link => {
      if (link.hash === `#${active.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function queueNavigation() {
    if (!queued) { queued = true; requestAnimationFrame(updateNavigation); }
  }
  function measureHeader() {
    document.documentElement.style.setProperty('--header-height', `${header.getBoundingClientRect().height}px`);
    queueNavigation();
  }
  if (header && sections.length) {
    new ResizeObserver(measureHeader).observe(header);
    window.addEventListener('scroll', queueNavigation, {passive: true});
    window.addEventListener('hashchange', queueNavigation);
    measureHeader();
  }
})();
