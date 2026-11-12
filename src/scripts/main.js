/* Interacciones globales: menú, desplegable, apariciones, acordeones y carrusel. */

const desktop = window.matchMedia('(min-width: 1024px)');

function initNav() {
  const toggle = document.querySelector('[data-nav-toggle]');
  const menu = document.querySelector('[data-nav-menu]');
  const header = document.querySelector('[data-header]');
  if (!toggle || !menu) return;

  const setMenu = (open) => {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.classList.toggle('menu-open', open);
  };

  toggle.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  desktop.addEventListener('change', () => setMenu(false));

  const dropdown = document.querySelector('[data-dropdown]');
  const dropdownToggle = document.querySelector('[data-dropdown-toggle]');
  const setDropdown = (open) => {
    dropdown?.classList.toggle('is-open', open);
    dropdownToggle?.setAttribute('aria-expanded', String(open));
  };

  dropdownToggle?.addEventListener('click', (event) => {
    event.stopPropagation();
    setDropdown(!dropdown.classList.contains('is-open'));
  });
  dropdown?.addEventListener('mouseenter', () => desktop.matches && setDropdown(true));
  dropdown?.addEventListener('mouseleave', () => desktop.matches && setDropdown(false));
  dropdown?.addEventListener('focusout', (event) => {
    if (desktop.matches && !dropdown.contains(event.relatedTarget)) setDropdown(false);
  });

  document.addEventListener('click', (event) => {
    if (desktop.matches && dropdown && !dropdown.contains(event.target)) setDropdown(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (dropdown?.classList.contains('is-open')) {
      setDropdown(false);
      dropdownToggle?.focus();
    } else if (menu.classList.contains('is-open')) {
      setMenu(false);
      toggle.focus();
    }
  });

  const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  items.forEach((el) => observer.observe(el));
}

function initAccordions() {
  document.querySelectorAll('[data-accordion]').forEach((accordion) => {
    const triggers = accordion.querySelectorAll('[data-accordion-trigger]');
    const setItem = (trigger, open) => {
      trigger.setAttribute('aria-expanded', String(open));
      trigger.closest('[data-accordion-item]').classList.toggle('is-open', open);
    };
    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const willOpen = trigger.getAttribute('aria-expanded') !== 'true';
        triggers.forEach((other) => setItem(other, false));
        setItem(trigger, willOpen);
      });
    });
  });
}

function initCarousels() {
  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const track = carousel.querySelector('[data-carousel-track]');
    const slides = [...track.children];
    const prev = carousel.querySelector('[data-carousel-prev]');
    const next = carousel.querySelector('[data-carousel-next]');
    const dots = [...carousel.querySelectorAll('[data-carousel-dot]')];

    const left = (slide) => slide.offsetLeft - slides[0].offsetLeft;
    const maxScroll = () => track.scrollWidth - track.clientWidth;
    /* Con varias tarjetas visibles, las últimas no llegan al borde: esta es la última parada real. */
    const lastStop = () => {
      const index = slides.findIndex((slide) => left(slide) >= maxScroll() - 4);
      return index === -1 ? slides.length - 1 : index;
    };
    const goTo = (index) => track.scrollTo({ left: left(slides[index]) });

    const activeIndex = () => {
      const last = lastStop();
      if (track.scrollLeft >= maxScroll() - 4) return last;
      return slides.slice(0, last + 1).reduce(
        (best, slide, i) =>
          Math.abs(left(slide) - track.scrollLeft) < Math.abs(left(slides[best]) - track.scrollLeft) ? i : best,
        0,
      );
    };

    const update = () => {
      const active = activeIndex();
      const last = lastStop();
      prev.disabled = active === 0;
      next.disabled = active === last;
      dots.forEach((dot, i) => {
        dot.hidden = i > last;
        if (i === active) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
    };

    prev.addEventListener('click', () => goTo(Math.max(activeIndex() - 1, 0)));
    next.addEventListener('click', () => goTo(Math.min(activeIndex() + 1, lastStop())));
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

    let frame;
    track.addEventListener('scroll', () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  });
}

initNav();
initReveal();
initAccordions();
initCarousels();
