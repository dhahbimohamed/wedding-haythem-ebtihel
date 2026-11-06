/* ═══════════════════════════════════════════════
   Haythem & Ebtihel — page script
   ═══════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─────────── 1) Gate — wedding envelope ─────────── */
  var gate    = document.getElementById('gate');
  var gateBtn = document.getElementById('gateBtn');
  var opened  = false;
  var started = false;

  function openGate() {
    if (opened || !gate) return;
    opened = true;
    gate.classList.add('is-open');
    document.body.classList.remove('is-locked');
    document.body.classList.add('is-entered');
    gate.setAttribute('aria-hidden', 'true');
    window.scrollTo(0, 0);
    setTimeout(function () { if (gate && gate.parentNode) gate.parentNode.removeChild(gate); }, 1100);
  }

  if (gateBtn) {
    gateBtn.addEventListener('click', function () {
      if (started || opened) return;
      started = true;

      if (reduced) { openGate(); return; }

      /* 1) flap opens, card slides out */
      gate.classList.add('is-opening');

      /* 2) zoom to fill the screen + white flash */
      setTimeout(function () { gate.classList.add('is-zoom'); }, 780);

      /* 3) white fades, hero appears */
      setTimeout(openGate, 1450);
    });
  }

  /* ─────────── 2) Countdown ─────────── */
  /* ✏️ WEDDING day & time: Saturday 26 December 2026, 20:00
     (henna night is 23 Dec — the countdown follows the wedding) */
  var TARGET = new Date(2026, 11, 26, 20, 0, 0);

  var flips = {};
  document.querySelectorAll('.flip').forEach(function (el) {
    flips[el.dataset.unit] = {
      wrap: el,
      num:  el.querySelector('.flip__num'),
      last: null
    };
  });
  var doneMsg = document.getElementById('countDone');

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function setValue(part, value) {
    if (!part || part.last === value) return;
    if (reduced || part.last === null) {   /* first paint: no animation */
      part.num.textContent = value;
      part.last = value;
      return;
    }
    part.wrap.classList.add('is-flip');
    setTimeout(function () { part.num.textContent = value; }, 200);
    setTimeout(function () { part.wrap.classList.remove('is-flip'); }, 500);
    part.last = value;
  }

  function tick() {
    var diff = TARGET - new Date();

    if (diff <= 0) {
      setValue(flips.days, '00');
      setValue(flips.hours, '00');
      setValue(flips.minutes, '00');
      setValue(flips.seconds, '00');
      if (doneMsg) doneMsg.hidden = false;
      return;
    }

    var s = Math.floor(diff / 1000);
    setValue(flips.days,    pad(Math.floor(s / 86400)));
    setValue(flips.hours,   pad(Math.floor(s % 86400 / 3600)));
    setValue(flips.minutes, pad(Math.floor(s % 3600 / 60)));
    setValue(flips.seconds, pad(s % 60));
  }

  tick();
  setInterval(tick, 1000);

  /* ─────────── 3) Scroll reveals ─────────── */
  var revealEls = document.querySelectorAll('.reveal');

  if (reduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    revealEls.forEach(function (el) { io.observe(el); });
  }
})();
