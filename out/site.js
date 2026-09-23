(() => {
  const pilot = document.querySelector('#pilot');
  const main = document.querySelector('main');
  const routes = ['index.html', 'solutions.html', 'technology.html', 'use-cases.html', 'about.html'];
  const labels = ['Product', 'Solutions', 'Technology', 'Use Cases', 'About'];
  const controls = document.querySelector('.slideshow-controls');
  const play = controls.querySelector('.play-toggle');
  const position = controls.querySelector('.slide-position');
  const finePointer = matchMedia('(hover:hover) and (pointer:fine)');
  const desktop = matchMedia('(min-width:901px)');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const cache = new Map();
  let current = Math.max(0, routes.indexOf(location.pathname.split('/').pop() || 'index.html'));
  let playing = desktop.matches && !reduced.matches;
  let timer, hoverTimer, request = 0, touchStart;
  const readPreference = () => { try { const p = sessionStorage.getItem('wave22-slideshow'); if (p !== null) playing = p === 'play' && desktop.matches && !reduced.matches; } catch {} };
  readPreference();
  controls.hidden = false;
  function updateControls() {
    position.textContent = `${current + 1} / ${routes.length} · ${labels[current]}`;
    play.textContent = playing ? 'Pause slideshow' : 'Play slideshow';
    play.setAttribute('aria-pressed', String(playing));
    document.querySelectorAll('header nav a, footer nav a').forEach(link => {
      if (link.getAttribute('href') === routes[current]) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }
  function schedule() {
    clearTimeout(timer);
    if (playing && !document.hidden && !pilot.open) timer = setTimeout(() => show(current + 1, 'auto'), 14000);
  }
  function pause(remember = false) {
    playing = false;
    clearTimeout(timer);
    if (remember) { try { sessionStorage.setItem('wave22-slideshow', 'pause'); } catch {} }
    updateControls();
  }
  async function show(index, mode = 'manual') {
    index = (index + routes.length) % routes.length;
    if (mode !== 'auto') pause();
    const ticket = ++request;
    if (index === current) return;
    try {
      let doc = cache.get(routes[index]);
      if (!doc) {
        const response = await fetch(routes[index]);
        if (!response.ok) throw new Error('Page unavailable');
        doc = new DOMParser().parseFromString(await response.text(), 'text/html');
        if (!doc.querySelector('main')) throw new Error('Missing page');
        cache.set(routes[index], doc);
      }
      if (ticket !== request) return;
      const next = doc.querySelector('main');
      main.className = next.className;
      main.innerHTML = next.innerHTML;
      main.classList.remove('page-enter');
      void main.offsetWidth;
      main.classList.add('page-enter');
      document.title = doc.title;
      current = index;
      if (mode !== 'history') history[mode === 'auto' ? 'replaceState' : 'pushState']({}, '', routes[index]);
      updateControls();
      if (mode !== 'auto' && mode !== 'hover') {
        window.scrollTo({top: 0, behavior: 'instant'});
        const heading = main.querySelector('h1');
        heading?.setAttribute('tabindex', '-1');
        heading?.focus({preventScroll: true});
      }
      schedule();
    } catch {
      if (ticket !== request) return;
      pause();
      if (mode !== 'auto') location.href = routes[index];
    }
  }
  function selectTechTab(tab, focus = false) {
    const spec = tab.closest('.engineering-spec');
    if (!spec) return;
    pause();
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
    panel.querySelectorAll('button[data-connection]').forEach(control => control.setAttribute('aria-pressed', String(selected && control.dataset.connection === button.dataset.connection)));
  }
  document.addEventListener('pointerover', event => {
    const control = event.target.closest('button[data-connection]');
    if (control && finePointer.matches && !control.contains(event.relatedTarget)) {
      pause(); selectConnection(control);
    }
  });
  document.addEventListener('focusin', event => {
    const control = event.target.closest('button[data-connection]');
    if (control) { pause(); selectConnection(control); }
  });
  document.addEventListener('click', event => {
    const techTab = event.target.closest('.tech-tabs [role=tab]');
    if (techTab) { selectTechTab(techTab); return; }
    const connection = event.target.closest('button[data-connection]');
    if (connection) { pause(); selectConnection(connection); return; }

    const button = event.target.closest('[data-pilot]');
    if (button) { pause(); pilot.showModal(); return; }
    if (event.target.closest('#pilot .close, #dismiss')) { pilot.close(); return; }
    const action = event.target.closest('[data-slide]');
    if (action) { show(current + (action.dataset.slide === 'next' ? 1 : -1)); return; }
    if (event.target.closest('.play-toggle')) {
      playing = !playing;
      try { sessionStorage.setItem('wave22-slideshow', playing ? 'play' : 'pause'); } catch {}
      updateControls(); schedule(); return;
    }
    const link = event.target.closest('a');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const target = routes.indexOf(link.getAttribute('href'));
    if (target >= 0) { event.preventDefault(); clearTimeout(hoverTimer); show(target); }
  });
  document.addEventListener('pointerover', event => {
    const link = event.target.closest('header nav a, footer nav a');
    if (!finePointer.matches || !link || link.contains(event.relatedTarget)) return;
    clearTimeout(hoverTimer);
    const target = routes.indexOf(link.getAttribute('href'));
    if (target >= 0 && target !== current) hoverTimer = setTimeout(() => show(target, 'hover'), 450);
  });
  document.addEventListener('pointerout', event => {
    const link = event.target.closest('header nav a, footer nav a');
    if (link && !link.contains(event.relatedTarget)) clearTimeout(hoverTimer);
  });
  document.addEventListener('dblclick', event => {
    const link = event.target.closest('header nav a, footer nav a');
    if (link) { clearTimeout(hoverTimer); show(routes.indexOf(link.getAttribute('href'))); return; }
    if (main.contains(event.target) && !event.target.closest('a,button,input,textarea') && !String(getSelection()).trim()) show(current + 1);
  });
  document.addEventListener('keydown', event => {
    const techTab = event.target.closest('.tech-tabs [role=tab]');
    if (techTab && ['ArrowRight','ArrowLeft','Home','End'].includes(event.key)) {
      event.preventDefault();
      const tabs = [...techTab.parentElement.querySelectorAll('[role=tab]')];
      let index = tabs.indexOf(techTab);
      index = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      selectTechTab(tabs[index], true); return;
    }

    if (event.key === 'Tab') pause();
    if (event.key === 'Escape' && event.target.closest('button[data-connection]')) selectConnection(event.target.closest('button[data-connection]'), false);
    if (pilot.open || event.target.closest('input,textarea,select')) return;
    if (event.target.closest('.slideshow-controls') && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
      event.preventDefault(); show(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  main.addEventListener('pointerdown', event => {
    pause();
    if (event.pointerType === 'touch' && !event.target.closest('a,button')) touchStart = {x:event.clientX,y:event.clientY};
  });
  main.addEventListener('pointerup', event => {
    if (!touchStart) return;
    const dx = event.clientX - touchStart.x, dy = event.clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) > 75 && Math.abs(dy) < 40) show(current + (dx < 0 ? 1 : -1));
  });
  main.addEventListener('pointercancel', () => { touchStart = null; });
  pilot.addEventListener('click', event => {
    if (event.target !== pilot) return;
    const r = pilot.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) pilot.close();
  });
  window.addEventListener('popstate', () => show(Math.max(0,routes.indexOf(location.pathname.split('/').pop() || 'index.html')), 'history'));
  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', () => { if (reduced.matches) pause(); });
  desktop.addEventListener('change', () => { if (!desktop.matches) pause(); });
  updateControls(); schedule();
})();
