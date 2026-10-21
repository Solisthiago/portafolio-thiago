/* Firma de la portada: "la firma que cruza el titular".
   La usa direccion-de-arte.html y la usará el sitio. */
(() => {
  'use strict';
  const d = document;
  const html = d.documentElement;
  const $ = (s, c = d) => c.querySelector(s);
  const $$ = (s, c = d) => [...c.querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const safe = (fn) => { try { return fn(); } catch (e) { console.warn('[thiago]', e); } };

  // Movimiento de la marca: preciso, editorial y con calle
  const M = { ease: 'power4.out', easeIO: 'power3.inOut', pop: 'back.out(1.4)', dur: 1.05, stagger: 0.075, dist: 48, lerp: 0.085 };

  // Selector de acento (prueba de color)
  safe(() => {
    const hexes = { violeta: '#6A2CF5', lavanda: '#8C6FE6', verde: '#043222' };
    const pintar = (a) => {
      html.dataset.acento = a;
      $$('[data-acento-btn]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.acentoBtn === a)));
      const hx = $('[data-acc-hex]'); if (hx) hx.textContent = hexes[a];
      try { localStorage.setItem('acento', a); } catch (e) { /* sin almacenamiento */ }
    };
    $$('[data-acento-btn]').forEach((b) => b.addEventListener('click', () => pintar(b.dataset.acentoBtn)));
    pintar(html.dataset.acento || 'violeta');
  });

  // Selector de fondo (nombre gigante o marco)
  const pintarFondo = (f) => {
    html.dataset.fondo = f;
    $$('[data-fondo-btn]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.fondoBtn === f)));
    try { localStorage.setItem('fondo', f); } catch (e) { /* sin almacenamiento */ }
  };
  safe(() => pintarFondo(html.dataset.fondo || 'nombre'));

  if (!hasGSAP) {
    $$('[data-fondo-btn]').forEach((b) => b.addEventListener('click', () => pintarFondo(b.dataset.fondoBtn))); html.classList.remove('js'); const r = $('[data-ver-de-nuevo]'); if (r) r.hidden = true; return; }
  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);
  ScrollTrigger.config({ ignoreMobileResize: true });

  // Scroll suave
  let lenis = null;
  if (!RM && window.Lenis && M.lerp) {
    lenis = new Lenis({ lerp: M.lerp, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // El rombo se desprende de la S y aterriza en el botón principal
  const viajeRombo = () => {
    const tl = gsap.timeline();
    const viajero = $('.rombo-viajero');
    const s = $$('[data-rombo-origen]').find((e) => e.getBoundingClientRect().width > 0);
    const destino = $('[data-boton-rombo]');
    const portada = $('[data-portada]');
    if (!viajero || !s || !destino || !portada) return tl;
    const p = portada.getBoundingClientRect();
    const a = s.getBoundingClientRect();
    const b = destino.getBoundingClientRect();
    const x1 = a.left + a.width * 0.5 - p.left, y1 = a.top + a.height * 0.5 - p.top;
    const x2 = b.left + b.width / 2 - p.left, y2 = b.top + b.height / 2 - p.top;
    gsap.set(viajero, { left: x2 - 5.5, top: y2 - 5.5, x: x1 - x2, y: y1 - y2, autoAlpha: 0, scale: 1.6 });
    gsap.set(destino, { autoAlpha: 0 });
    tl.to(viajero, { autoAlpha: 1, scale: 1.6, duration: 0.2 })
      .to(viajero, { x: 0, duration: 0.85, ease: 'power2.inOut' }, '>')
      .to(viajero, { y: 0, duration: 0.85, ease: 'power3.in' }, '<')
      .to(viajero, { scale: 1, rotate: 225, duration: 0.85, ease: 'power2.inOut' }, '<')
      .set(destino, { autoAlpha: 1 })
      .set(viajero, { autoAlpha: 0 })
      .fromTo($('[data-boton]'), { scale: 1 }, { scale: 1.06, duration: 0.14, yoyo: true, repeat: 1, ease: 'power2.out' });
    return tl;
  };

  // Línea de tiempo completa de la portada
  window.firmaPortada = () => {
    const piezas = $$('[data-portada] [data-pieza], .nav[data-pieza]');
    gsap.set(piezas, { visibility: 'visible' });
    const lineas = $$('.titular .l-in');
    gsap.set(lineas, { yPercent: 118, y: 0 });
    const tl = gsap.timeline({ defaults: { ease: M.ease } });
    const marco = html.dataset.fondo === 'marco';
    if (marco) {
      tl.fromTo('[data-marco]', { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: M.easeIO }, 0)
        .fromTo('.marco__barra > *', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.08 }, 0.5);
    } else {
      tl.fromTo('[data-afiche]', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.8, ease: M.easeIO }, 0)
        .fromTo('[data-nombre] span', { yPercent: 105 }, { yPercent: 0, duration: 0.9, stagger: 0.06, ease: 'power3.out' }, 0.3)
        .fromTo('[data-piso]', { autoAlpha: 0, y: -20 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.75);
    }
    tl
      .fromTo('[data-hero-img]', { yPercent: 16, scale: 1.08, autoAlpha: 0 }, { yPercent: 0, scale: 1, autoAlpha: 1, duration: M.dur * 1.3 }, 0.45)
      .fromTo('.nav[data-pieza]', { y: -24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: M.dur }, 0.3)
      .to(lineas, { yPercent: 0, duration: M.dur, stagger: M.stagger * 1.6 }, 0.55)
      .fromTo('[data-script]', { clipPath: 'inset(-40% 100% -60% -20%)' }, { clipPath: 'inset(-40% -20% -60% -20%)', duration: 1.0, ease: 'power2.inOut' }, 1.15)
      .fromTo(['[data-portada] .ceja', '[data-portada] .micro'], { y: M.dist * 0.4, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: M.dur, stagger: 0.5 }, 0.5)
      .fromTo(['[data-portada] .lead', '[data-portada] .acciones'], { y: M.dist * 0.6, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: M.dur, stagger: M.stagger }, 1.0)
      .fromTo('[data-iso]', { scale: 0, rotate: -30, autoAlpha: 0 }, { scale: 1, rotate: 0, autoAlpha: 1, duration: 0.8, ease: M.pop }, 1.45)
      .fromTo('.disciplinas', { y: M.dist, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: M.dur }, 1.3)
      .add(viajeRombo(), 1.5);
    // un toque en la portada la adelanta
    const portada = $('[data-portada]');
    const adelantar = () => { if (tl.progress() < 1) tl.timeScale(4); };
    portada && portada.addEventListener('pointerdown', adelantar, { once: true });
    return tl;
  };

  // Hoja de muestra: arranque, "Ver de nuevo" y menos movimiento
  safe(() => {
    const repetir = $('[data-ver-de-nuevo]');
    const aviso = $('[data-aviso-rm]');
    if (RM) {
      if (aviso) aviso.hidden = false;
      $$('[data-fondo-btn]').forEach((b) => b.addEventListener('click', () => pintarFondo(b.dataset.fondoBtn)));
      if (repetir) repetir.addEventListener('click', () => {
        gsap.fromTo('[data-portada] [data-pieza], [data-portada] .titular', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, stagger: 0.12, ease: 'none' });
      });
      return;
    }
    let tl = null;
    Promise.race([d.fonts ? d.fonts.ready : Promise.resolve(), new Promise((r) => setTimeout(r, 1200))])
      .then(() => { tl = window.firmaPortada(); splitReveals(); ScrollTrigger.refresh(); });
    $$('[data-fondo-btn]').forEach((b) => b.addEventListener('click', () => {
      pintarFondo(b.dataset.fondoBtn);
      if (tl) { tl.progress(1).kill(); }
      gsap.set('[data-portada] *', { clearProps: 'clipPath' });
      tl = window.firmaPortada();
    }));
    if (repetir) repetir.addEventListener('click', () => {
      if (!tl) return;
      if (lenis) lenis.scrollTo(0, { duration: 0.8 }); else window.scrollTo({ top: 0 });
      setTimeout(() => { tl.timeScale(1).restart(); }, 450);
    });
  });

  // Títulos por líneas y revelados
  function splitReveals() {
    safe(() => {
      if (window.SplitText) {
        $$('[data-split]').forEach((el) => {
          SplitText.create(el, {
            type: 'lines', mask: 'lines', linesClass: 'linea', autoSplit: true,
            onSplit: (self) => gsap.from(self.lines, { yPercent: 125, duration: M.dur, stagger: M.stagger, ease: M.ease, scrollTrigger: { trigger: el, start: 'top 88%', once: true } }),
          });
        });
      }
      gsap.set('[data-reveal]', { y: M.dist, opacity: 0 });
      ScrollTrigger.batch('[data-reveal]', {
        start: 'top 92%', once: true,
        onEnter: (b) => gsap.to(b, { y: 0, opacity: 1, duration: M.dur, ease: M.ease, stagger: M.stagger, overwrite: true }),
      });
    });
  }

  // "Ver cómo se mueve" de los elementos
  safe(() => {
    $$('[data-ver-mov]').forEach((b) => b.addEventListener('click', () => {
      if (RM) return;
      if (b.dataset.verMov === 'nombre') gsap.fromTo('[data-mov-nombre] i', { yPercent: 105 }, { yPercent: 0, duration: 0.9, stagger: 0.06, ease: 'power3.out' });
      if (b.dataset.verMov === 'iso') gsap.fromTo('[data-mov-iso]', { scale: 0, rotate: -30 }, { scale: 1, rotate: 0, duration: 0.8, ease: M.pop });
    }));
  });
})();
