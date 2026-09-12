/* ---------- Navbar glider ---------- */
(function () {
  const group  = document.getElementById('pillLinks');
  const glider = document.getElementById('pillGlider');
  if (!group || !glider) return;

  const links  = group.querySelectorAll('a');
  let active   = group.querySelector('a.is-active') || links[0];
  let raf = null;

  function moveTo(el) {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const base = group.getBoundingClientRect();
      glider.style.width     = rect.width + 'px';
      glider.style.transform = 'translateX(' + (rect.left - base.left) + 'px)';
    });
  }

  function reset() { moveTo(active); }

  links.forEach(a => {
    a.addEventListener('mouseenter', () => moveTo(a));
    a.addEventListener('focus',      () => moveTo(a));
    a.addEventListener('click', e => {
      e.preventDefault();
      links.forEach(x => x.classList.remove('is-active'));
      a.classList.add('is-active');
      active = a;
    });
  });

  group.addEventListener('mouseleave', reset);
  group.addEventListener('focusout', e => {
    if (!group.contains(e.relatedTarget)) reset();
  });

  let resizeT = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(reset, 120);
  }, { passive: true });
  window.addEventListener('load', reset);
  requestAnimationFrame(reset);
  setTimeout(reset, 250);
})();

/* ---------- Pause decorative animations while off-screen (perf) ---------- */
(function () {
  const targets = document.querySelectorAll('.svc, .tm-marquee');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
    });
  }, { rootMargin: '80px 0px' });

  targets.forEach(el => io.observe(el));
})();

/* ---------- Hero slider · fully automatic ---------- */
(function () {
  const textSlider = document.getElementById('textSlider');
  const artSlider  = document.getElementById('artSlider');
  if (!textSlider || !artSlider) return;

  const total    = textSlider.querySelectorAll('.text-slide').length;
  const INTERVAL = 4000;
  const OUT_MS   = 500;
  const GAP_MS   = 250;

  let current   = 0;
  let timer     = null;
  let animating = false;

  function getText(i) { return textSlider.querySelector('.text-slide[data-slide="' + i + '"]'); }
  function getArt(i)  { return artSlider.querySelector('.art-slide[data-slide="' + i + '"]'); }

  function goTo(index) {
    if (animating || index === current || index < 0 || index >= total) return;
    animating = true;

    const curText = getText(current);
    const curArt  = getArt(current);
    const nxtText = getText(index);
    const nxtArt  = getArt(index);

    curText.classList.remove('is-active');
    curText.classList.add('is-leaving');
    curArt.classList.remove('is-active');
    curArt.classList.add('is-leaving');

    setTimeout(() => {
      curText.classList.remove('is-leaving');
      curArt.classList.remove('is-leaving');

      nxtText.classList.add('is-active');
      nxtArt.classList.add('is-active');

      current = index;

      setTimeout(() => { animating = false; }, OUT_MS + GAP_MS);
    }, OUT_MS);
  }

  function next() { goTo((current + 1) % total); }

  function start() {
    stop();
    timer = setInterval(next, INTERVAL);
  }
  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  start();
})();

/* ---------- Scroll reveal · different animation per section ---------- */
(function () {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  // Stagger siblings inside a group (cards, tiles) via --stagger index
  document.querySelectorAll('[data-reveal-group]').forEach(group => {
    let i = 0;
    Array.from(group.children).forEach(child => {
      if (child.classList.contains('reveal')) {
        child.style.setProperty('--stagger', i);
        i++;
      }
    });
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('is-inview'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-inview');
        io.unobserve(entry.target); // animate in once
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });

  // Anything already on/near screen at load (or captured by a full-page
  // screenshot tool that renders past the fold instantly) should just be
  // shown immediately instead of sitting mid-animation.
  items.forEach(el => {
    const r = el.getBoundingClientRect();
    const inViewNow = r.top < window.innerHeight && r.bottom > 0;
    if (inViewNow) {
      el.classList.add('is-inview');
    } else {
      io.observe(el);
    }
  });
})();

/* ---------- Service cards · cursor-follow glow ---------- */
(function () {
  document.querySelectorAll('.svc__card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
    });
  });
})();

    fetch("navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar").innerHTML = data;
        });