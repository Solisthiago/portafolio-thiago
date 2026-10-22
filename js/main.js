/* Portafolio de Santiago Solís: comportamiento y movimiento.
   Todo el contenido funciona sin este archivo; aquí solo se suma movimiento y comodidad. */
(() => {
  'use strict';

  // ===== 1. Ayudantes, banderas y movimiento de la marca =====
  const d = document;
  const html = d.documentElement;
  const $ = (s, c = d) => c.querySelector(s);
  const $$ = (s, c = d) => [...c.querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const safe = (fn) => { try { return fn(); } catch (e) { console.warn('[thiago]', e); } };

  // Preciso, editorial y con calle
  const M = { ease: 'power4.out', easeIO: 'power3.inOut', pop: 'back.out(1.4)', dur: 1.05, stagger: 0.075, dist: 48, lerp: 0.085 };

  if (!hasGSAP) html.classList.remove('js');
  else {
    gsap.registerPlugin(ScrollTrigger);
    if (window.SplitText) gsap.registerPlugin(SplitText);
    ScrollTrigger.config({ ignoreMobileResize: true });
  }

  // ===== 2. Scroll suave y anclas =====
  let lenis = null;
  if (hasGSAP && !RM && window.Lenis && M.lerp) {
    lenis = new Lenis({ lerp: M.lerp, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const altoNav = () => ($('[data-nav]') ? $('[data-nav]').offsetHeight : 0);
  const irA = (el) => {
    const offset = -altoNav() - 8;
    if (lenis) lenis.scrollTo(el, { offset, duration: 1.4 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: RM ? 'auto' : 'smooth' });
  };

  // ===== 3. Lo que funciona siempre =====
  // Anclas internas; las tarjetas destacadas además abren su proyecto
  d.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const el = id && d.getElementById(id);
    if (!el) return;
    e.preventDefault();
    if (el.tagName === 'DETAILS') {
      const filtroTodo = $('[data-filtro="todo"]');
      if (el.hidden && filtroTodo) filtroTodo.click();
      el.open = true;
    }
    irA(el);
    history.replaceState(null, '', '#' + id);
  });

  // Si entran con #p-proyecto en la dirección, se abre
  safe(() => {
    const el = location.hash && d.getElementById(location.hash.slice(1));
    if (el && el.tagName === 'DETAILS') el.open = true;
  });

  // Menú que se marca al bajar
  safe(() => {
    const nav = $('[data-nav]');
    if (!nav) return;
    const marcar = () => nav.classList.toggle('is-pegada', window.scrollY > 20);
    window.addEventListener('scroll', marcar, { passive: true });
    marcar();
  });

  // Filtros del archivo
  safe(() => {
    const botones = $$('[data-filtro]');
    const filas = $$('[data-fila]');
    botones.forEach((b) => b.addEventListener('click', () => {
      const f = b.dataset.filtro;
      botones.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      filas.forEach((fila) => {
        const tags = fila.dataset.tags.split(' ');
        fila.hidden = !(f === 'todo' || tags.includes(f));
      });
      if (hasGSAP) {
        const visibles = filas.filter((x) => !x.hidden);
        if (!RM) gsap.fromTo(visibles, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: M.ease, overwrite: true });
        ScrollTrigger.refresh();
      }
    }));
  });

  // Al abrir un proyecto: entrada suave del contenido
  safe(() => {
    $$('[data-fila]').forEach((fila) => fila.addEventListener('toggle', () => {
      if (!fila.open || !hasGSAP) return;
      const cuerpo = $('.proy__cuerpo', fila);
      if (!RM) gsap.from(cuerpo.children, { y: 24, opacity: 0, duration: 0.7, stagger: 0.08, ease: M.ease, clearProps: 'all' });
      ScrollTrigger.refresh();
    }));
  });

  // Vista previa de la portada al pasar el mouse por el archivo (solo con mouse)
  safe(() => {
    const vista = $('[data-vista]');
    if (!FINE || !vista) return;
    const img = $('img', vista);
    const mover = hasGSAP && !RM
      ? { x: gsap.quickTo(vista, 'x', { duration: 0.5, ease: 'power3' }), y: gsap.quickTo(vista, 'y', { duration: 0.5, ease: 'power3' }) }
      : { x: (v) => { vista.style.translate = `${v}px ${vista._y || 0}px`; vista._x = v; }, y: (v) => { vista.style.translate = `${vista._x || 0}px ${v}px`; vista._y = v; } };
    $$('[data-fila]').forEach((fila) => {
      const sum = $('summary', fila);
      if (!fila.dataset.cover) return;
      sum.addEventListener('mouseenter', () => { if (fila.open) return; img.src = fila.dataset.cover; vista.classList.add('is-on'); });
      sum.addEventListener('mouseleave', () => vista.classList.remove('is-on'));
      sum.addEventListener('click', () => vista.classList.remove('is-on'));
    });
    window.addEventListener('mousemove', (e) => { mover.x(e.clientX + 24); mover.y(e.clientY - 110); }, { passive: true });
  });

  // Barra fija en celular: aparece al pasar la portada y se esconde en contacto
  safe(() => {
    const barra = $('[data-barra]');
    const portada = $('[data-portada]');
    const contacto = $('#contacto');
    if (!barra || !portada || !contacto || !('IntersectionObserver' in window)) return;
    let enPortada = true, enContacto = false;
    const pintar = () => barra.classList.toggle('is-on', !enPortada && !enContacto);
    new IntersectionObserver(([e]) => { enPortada = e.isIntersecting; pintar(); }, { threshold: 0.05 }).observe(portada);
    new IntersectionObserver(([e]) => { enContacto = e.isIntersecting; pintar(); }, { threshold: 0 }).observe(contacto);
  });

  // Videos cortos de las galerías: se repiten sin sonido solo mientras se ven
  safe(() => {
    const videos = $$('video[data-auto]');
    if (!videos.length) return;
    if (RM || !('IntersectionObserver' in window)) return;   // con menos movimiento quedan con sus controles
    const io = new IntersectionObserver((entradas) => entradas.forEach((e) => {
      const v = e.target;
      if (e.isIntersecting) { v.play().catch(() => {}); } else { v.pause(); }
    }), { threshold: 0.4 });
    videos.forEach((v) => { v.controls = false; v.preload = 'metadata'; io.observe(v); });
  });

  if (!hasGSAP) return;
  if (RM) return;   // con "Reducir movimiento" todo queda visible y quieto

  // ===== 5. Firma de la portada =====
  const viajeRombo = () => {
    const tl = gsap.timeline();
    const viajero = $('.rombo-viajero');
    const origen = $$('[data-rombo-origen]').find((e) => e.getBoundingClientRect().width > 0);
    const destino = $('[data-boton-rombo]');
    const portada = $('[data-portada]');
    if (!viajero || !origen || !destino || !portada) return tl;
    const p = portada.getBoundingClientRect();
    const a = origen.getBoundingClientRect();
    const b = destino.getBoundingClientRect();
    const x1 = a.left + a.width / 2 - p.left, y1 = a.top + a.height / 2 - p.top;
    const x2 = b.left + b.width / 2 - p.left, y2 = b.top + b.height / 2 - p.top;
    gsap.set(viajero, { left: x2 - 5.5, top: y2 - 5.5, x: x1 - x2, y: y1 - y2, autoAlpha: 0, scale: 1.6 });
    gsap.set(destino, { autoAlpha: 0 });
    tl.to(viajero, { autoAlpha: 1, duration: 0.2 })
      .to(viajero, { x: 0, duration: 0.85, ease: 'power2.inOut' }, '>')
      .to(viajero, { y: 0, duration: 0.85, ease: 'power3.in' }, '<')
      .to(viajero, { scale: 1, rotate: 225, duration: 0.85, ease: 'power2.inOut' }, '<')
      .set(destino, { autoAlpha: 1 })
      .set(viajero, { autoAlpha: 0 })
      .fromTo($('[data-boton]'), { scale: 1 }, { scale: 1.06, duration: 0.14, yoyo: true, repeat: 1, ease: 'power2.out' });
    return tl;
  };

  const firmaPortada = () => {
    gsap.set($$('[data-portada] [data-pieza], [data-nav][data-pieza]'), { visibility: 'visible' });
    const lineas = $$('.titular .l-in');
    gsap.set(lineas, { yPercent: 118, y: 0 });
    const tl = gsap.timeline({ defaults: { ease: M.ease } });
    tl.fromTo('[data-afiche]', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.8, ease: M.easeIO }, 0)
      .fromTo('[data-nombre] span', { yPercent: 105 }, { yPercent: 0, duration: 0.9, stagger: 0.06, ease: 'power3.out' }, 0.3)
      .fromTo('[data-piso]', { autoAlpha: 0, y: -20 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.75)
      .fromTo('[data-hero-img]', { yPercent: 12, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: M.dur * 1.2 }, 0.6)
      .fromTo('[data-nav]', { y: -24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: M.dur, clearProps: 'transform' }, 0.3)
      .to(lineas, { yPercent: 0, duration: M.dur, stagger: M.stagger * 1.6 }, 0.55)
      .fromTo('[data-script]', { clipPath: 'inset(-40% 100% -60% -20%)' }, { clipPath: 'inset(-40% -20% -60% -20%)', duration: 1.0, ease: 'power2.inOut' }, 1.15)
      .fromTo(['[data-portada] .ceja', '[data-portada] .micro'], { y: M.dist * 0.4, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: M.dur, stagger: 0.5 }, 0.5)
      .fromTo(['[data-portada] .lead', '[data-portada] .acciones'], { y: M.dist * 0.6, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: M.dur, stagger: M.stagger }, 1.0)
      .fromTo('[data-iso]', { scale: 0, rotate: -30, autoAlpha: 0 }, { scale: 1, rotate: 0, autoAlpha: 1, duration: 0.8, ease: M.pop }, 1.45)
      .fromTo('.disciplinas', { y: M.dist, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: M.dur }, 1.3)
      .add(viajeRombo(), 1.5);
    // Un toque la adelanta
    const portada = $('[data-portada]');
    if (portada) portada.addEventListener('pointerdown', () => { if (tl.progress() < 1) tl.timeScale(4); }, { once: true });
    return tl;
  };

  // ===== 6. Efectos con el scroll =====
  function efectosScroll() {
    // Títulos de sección por líneas
    if (window.SplitText) {
      $$('[data-split]').forEach((el) => {
        SplitText.create(el, {
          type: 'lines', mask: 'lines', linesClass: 'linea', autoSplit: true,
          onSplit: (self) => gsap.from(self.lines, { yPercent: 125, duration: M.dur, stagger: M.stagger, ease: M.ease, scrollTrigger: { trigger: el, start: 'top 88%', once: true } }),
        });
      });
    }

    // Revelados discretos
    gsap.set('[data-reveal]', { y: M.dist, opacity: 0 });
    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 90%', once: true,
      onEnter: (b) => gsap.to(b, { y: 0, opacity: 1, duration: M.dur, ease: M.ease, stagger: M.stagger, overwrite: true }),
    });

    // Trabajo seleccionado: la imagen se abre de abajo hacia arriba
    $$('[data-caso]').forEach((caso) => {
      const img = $('[data-caso-img]', caso);
      gsap.timeline({ scrollTrigger: { trigger: caso, start: 'top 88%', once: true } })
        .fromTo(img, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: M.dur * 1.1, ease: M.easeIO })
        .from($('img', img), { scale: 1.15, duration: M.dur * 1.4, ease: M.ease }, 0)
        .from($('.caso__cuerpo', caso).children, { y: 20, opacity: 0, duration: M.dur * 0.8, stagger: 0.05, ease: M.ease }, 0.3);
    });

    // Archivo: las filas entran en cascada
    gsap.set('[data-fila]', { opacity: 0, y: 24 });
    ScrollTrigger.batch('[data-fila]', {
      start: 'top 94%', once: true,
      onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 0.8, stagger: 0.06, ease: M.ease, overwrite: true }),
    });

    // Cómo trabajo: la línea avanza con el scroll
    const pasos = $('[data-pasos]');
    if (pasos) gsap.fromTo(pasos, { '--p': 0 }, { '--p': 1, ease: 'none', scrollTrigger: { trigger: pasos, start: 'top 75%', end: 'bottom 55%', scrub: true } });

    // Sobre mí: el isotipo se pega
    $$('[data-pop]').forEach((el) => gsap.fromTo(el, { scale: 0, rotate: -30 }, { scale: 1, rotate: 0, duration: 0.8, ease: M.pop, scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));

    // Cierre: la cursiva se escribe y THIAGO vuelve a salir del piso
    const sp = $('[data-script-pie]');
    if (sp) gsap.fromTo(sp, { clipPath: 'inset(-40% 100% -60% -20%)' }, { clipPath: 'inset(-40% -20% -60% -20%)', duration: 1.0, ease: 'power2.inOut', scrollTrigger: { trigger: sp, start: 'top 85%', once: true } });
    const fp = $('[data-firma-pie]');
    if (fp) gsap.from($$('span', fp), { yPercent: 105, duration: 0.9, stagger: 0.06, ease: 'power3.out', scrollTrigger: { trigger: fp, start: 'top 95%', once: true } });

    // Rescate: si algo ya está en pantalla y sigue escondido al detener el scroll, se muestra
    const pendientes = new Set($$('[data-reveal], [data-fila], [data-split], [data-caso]'));
    const escondido = (el) => {
      if (+getComputedStyle(el).opacity < 0.05) return true;
      const img = $('[data-caso-img]', el);
      if (img && /100%/.test(getComputedStyle(img).clipPath)) return true;
      const linea = $('.linea', el);
      return !!(linea && gsap.getProperty(linea, 'yPercent') > 50);
    };
    const revisar = () => pendientes.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight * 0.9) return;
      if (escondido(el)) {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.4, overwrite: 'auto' });
        gsap.to($$('.linea', el), { yPercent: 0, duration: 0.5, overwrite: 'auto' });
        gsap.to($$('[data-caso-img], [data-caso-img] img, .caso__cuerpo > *', el), { clipPath: 'inset(0% 0 0 0)', scale: 1, opacity: 1, y: 0, duration: 0.5, overwrite: 'auto' });
      }
      pendientes.delete(el);
    });
    let rv;
    const revisarLuego = () => { clearTimeout(rv); rv = setTimeout(revisar, 1600); };
    window.addEventListener('scroll', revisarLuego, { passive: true });
    revisarLuego();
  }

  // ===== 7. Arranque =====
  Promise.race([d.fonts ? d.fonts.ready : Promise.resolve(), new Promise((r) => setTimeout(r, 1200))])
    .then(() => {
      safe(firmaPortada);
      safe(efectosScroll);
      ScrollTrigger.refresh();
    });
  let rf;
  const refrescar = () => { clearTimeout(rf); rf = setTimeout(() => ScrollTrigger.refresh(), 150); };
  window.addEventListener('load', refrescar);
})();
