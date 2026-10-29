/* kidus.me — small progressive enhancements. Every page works without this file. */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  /* ---- storage helpers (private mode / blocked storage safe) ---- */
  function load(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function save(key, val) { try { localStorage.setItem(key, val); } catch (e) { /* ignore */ } }

  /* ---- theme toggle ---- */
  var toggle = document.querySelector('[data-theme-toggle]');
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    if (toggle) toggle.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'dark' ? '#0B0F17' : '#FFFFFF');
  }
  setTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(next);
      save('theme', next);
    });
  }

  /* ---- nav: shadow on scroll + mobile menu ---- */
  var nav = document.querySelector('.nav');
  function onScroll() { if (nav) nav.classList.toggle('scrolled', window.scrollY > 16); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var menuBtn = document.querySelector('[data-menu-toggle]');
  var links = document.getElementById('nav-links');
  function closeMenu() {
    if (!links) return;
    links.classList.remove('open');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
  }
  if (menuBtn && links) {
    menuBtn.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---- local time in Seattle ---- */
  var clock = document.querySelector('[data-local-time]');
  if (clock && window.Intl) {
    var fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', minute: '2-digit' });
    var tick = function () { clock.textContent = 'Seattle · ' + fmt.format(new Date()) + ' PT'; };
    tick();
    setInterval(tick, 30000);
  }

  /* ---- footer year ---- */
  var yr = document.querySelector('[data-year]');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- scroll reveal ---- */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduce) {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---- active nav link (scroll spy) ---- */
  var spyLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  if (spyLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    spyLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        spyLinks.forEach(function (a) { a.classList.remove('active'); });
        var a = byId[en.target.id];
        if (a) a.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) spy.observe(s);
    });
  }

  /* ---- art gallery: renders only when assets/art/manifest.json has items ---- */
  var gallery = document.getElementById('gallery');
  if (gallery && window.fetch) {
    fetch(gallery.getAttribute('data-src'), { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : { items: [] }; })
      .then(function (data) {
        var items = (data && Array.isArray(data.items)) ? data.items.filter(function (i) { return i && i.src; }) : [];
        if (!items.length) return;
        buildGallery(items);
        gallery.hidden = false;
      })
      .catch(function () { /* no manifest yet — gallery stays hidden */ });
  }

  function buildGallery(items) {
    var grid = gallery.querySelector('.art-grid');
    var filters = gallery.querySelector('.filters');
    var dialog = document.getElementById('lightbox');
    var cats = [];
    items.forEach(function (i) { if (i.category && cats.indexOf(i.category) < 0) cats.push(i.category); });

    function render(cat) {
      grid.textContent = '';
      items.filter(function (i) { return !cat || i.category === cat; }).forEach(function (i) {
        var fig = document.createElement('figure');
        fig.className = 'art';
        fig.tabIndex = 0;
        var img = document.createElement('img');
        img.src = i.thumb || i.src;
        img.alt = i.alt || i.title || 'Artwork by Kidus Sendeke';
        img.loading = 'lazy';
        img.decoding = 'async';
        var cap = document.createElement('figcaption');
        var t = document.createElement('div');
        t.textContent = i.title || '';
        var m = document.createElement('span');
        m.textContent = [i.medium, i.year].filter(Boolean).join(' · ');
        cap.appendChild(t);
        cap.appendChild(m);
        fig.appendChild(img);
        fig.appendChild(cap);
        var open = function () {
          if (!dialog || !dialog.showModal) { window.open(i.src, '_blank', 'noopener'); return; }
          dialog.querySelector('img').src = i.src;
          dialog.querySelector('img').alt = img.alt;
          dialog.querySelector('p').textContent = [i.title, i.medium, i.year].filter(Boolean).join(' · ');
          dialog.showModal();
        };
        fig.addEventListener('click', open);
        fig.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
        grid.appendChild(fig);
      });
    }

    if (cats.length > 1) {
      ['All'].concat(cats).forEach(function (c, idx) {
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = c;
        b.setAttribute('aria-pressed', idx === 0 ? 'true' : 'false');
        b.addEventListener('click', function () {
          filters.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
          b.setAttribute('aria-pressed', 'true');
          render(idx === 0 ? null : c);
        });
        filters.appendChild(b);
      });
    } else {
      filters.remove();
    }

    if (dialog) dialog.addEventListener('click', function () { dialog.close(); });
    render(null);
  }
})();
