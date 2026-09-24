(() => {
  const root = document.querySelector('[data-dl-engine]');
  if (!root) return;
  const svgs = [...root.querySelectorAll('svg.dl-anim')];
  const words = [...root.querySelectorAll('.dl-w')];
  const button = root.querySelector('.dl-toggle');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const he = document.documentElement.lang === 'he';
  let userPaused = false;
  let inView = false;
  let reducedFrame = false;
  function sync() {
    const paused = userPaused || reduce.matches || !inView || document.hidden;
    root.dataset.motion = paused ? 'paused' : 'playing';
    root.dataset.reduced = String(reduce.matches);
    svgs.forEach(svg => {
      if (reduce.matches) { svg.pauseAnimations(); svg.setCurrentTime(8.5); }
      else if (paused) svg.pauseAnimations();
      else svg.unpauseAnimations();
    });
    if (reducedFrame && !reduce.matches) {
      svgs.forEach(svg => svg.setCurrentTime(0));
      words.forEach(word => word.getAnimations().forEach(animation => { animation.currentTime = 0; }));
    }
    reducedFrame = reduce.matches;
    button.disabled = reduce.matches;
    button.setAttribute('aria-pressed', String(userPaused || reduce.matches));
    button.textContent = reduce.matches ? (he ? 'תנועה מופחתת' : 'Reduced motion') : userPaused ? (he ? 'הפעלת האנימציה' : 'Play animation') : (he ? 'עצירת האנימציה' : 'Pause animation');
  }
  svgs.forEach(svg => { svg.pauseAnimations(); svg.setCurrentTime(0); });
  button.addEventListener('click', () => { userPaused = !userPaused; sync(); });
  reduce.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  new IntersectionObserver(entries => { inView = entries[0].isIntersecting; sync(); }, {threshold: 0}).observe(root);
  sync();
})();
