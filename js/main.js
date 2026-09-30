/* EsAn Yogalayam — site interactions (no dependencies) */
(function () {
  'use strict';

  var header = document.getElementById('site-header');
  var nav = document.getElementById('site-nav');
  var toggle = document.getElementById('nav-toggle');
  var yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Sticky header state ---------- */
  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });
  }

  /* ---------- Active section highlighting ---------- */
  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]')) : [];
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var activeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === id && !a.classList.contains('nav-cta'));
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    sections.forEach(function (s) { activeObserver.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Count-up stats ---------- */
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var counters = document.querySelectorAll('[data-count]');
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target) || reduceMotion) { el.textContent = String(target); return; }
    var start = null;
    var duration = 1400;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window && counters.length) {
    var countObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCount(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { countObserver.observe(c); });
  }


  /* ---------- Lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lightbox-img');
  var lbCap = document.getElementById('lightbox-caption');
  var photos = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
  var current = -1;
  var lastFocus = null;

  function showPhoto(i) {
    if (!photos.length) return;
    current = (i + photos.length) % photos.length;
    var el = photos[current];
    lbImg.src = el.currentSrc || el.src;
    lbImg.alt = el.alt || '';
    lbCap.textContent = el.alt || '';
  }
  function openLightbox(i) {
    lastFocus = document.activeElement;
    showPhoto(i);
    lightbox.hidden = false;
    document.body.classList.add('lightbox-open');
    document.getElementById('lightbox-close').focus();
  }
  function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove('lightbox-open');
    lbImg.src = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  if (lightbox && photos.length) {
    photos.forEach(function (el, i) {
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.addEventListener('click', function () { openLightbox(i); });
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); } });
    });
    document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
    document.getElementById('lightbox-prev').addEventListener('click', function () { showPhoto(current - 1); });
    document.getElementById('lightbox-next').addEventListener('click', function () { showPhoto(current + 1); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', function (e) {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') showPhoto(current - 1);
      else if (e.key === 'ArrowRight') showPhoto(current + 1);
    });
  }

  /* ---------- Contact form (client-side only) ----------
     There is no backend. The form validates and opens a pre-filled
     WhatsApp / mail link so the enquiry reaches the institution.
     CONTACT_PHONE is digits only, with country code. */
  var CONTACT_PHONE = '916374005905';
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      var batch = form.batch.value;
      var message = form.message.value.trim();

      var invalid = false;
      [form.name, form.phone].forEach(function (input) {
        var ok = input.value.trim().length > 1;
        input.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok) invalid = true;
      });
      if (invalid) {
        status.textContent = 'Please enter your name and phone number.';
        status.classList.add('is-error');
        return;
      }

      var text = 'Namaste, I would like to enquire about yoga classes at EsAn Yogalayam.\n' +
        'Name: ' + name + '\nPhone: ' + phone + '\nPreferred batch: ' + batch +
        (message ? '\nMessage: ' + message : '');
      var url = 'https://wa.me/' + CONTACT_PHONE + '?text=' + encodeURIComponent(text);

      status.classList.remove('is-error');
      status.textContent = 'Opening WhatsApp with your enquiry…';
      window.open(url, '_blank', 'noopener');
      form.reset();
    });
  }
})();
