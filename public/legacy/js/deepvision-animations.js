/**
 * DeepVision – Advanced Animations JS
 * Creative interactive motion layer
 */

(function () {
  'use strict';

  /* ── 1. Scroll progress bar ─────────────────────────────────────── */
  var progressBar = document.createElement('div');
  progressBar.id = 'dv-progress-bar';
  document.body.prepend(progressBar);

  function updateProgressBar() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }

  /* ── 2. Scroll-to-top button ────────────────────────────────────── */
  var scrollTopBtn = document.createElement('button');
  scrollTopBtn.id = 'dv-scroll-top';
  scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
  scrollTopBtn.innerHTML = [
    '<svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>'
  ].join('');
  document.body.appendChild(scrollTopBtn);

  scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── 3. Intersection Observer – generic scroll reveals ─────────── */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('dv-in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });


  /* ── 4. Tech cards staggered observer (hover lift only — visibility handled by CSS/ftco-animate) ── */
  // Cards are always visible; no opacity:0 guard needed.

  /* ── 5. Heading underline trigger ──────────────────────────────── */
  var headingObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('dv-in-view');
        headingObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  /* ── 6. Particle canvas for hero ───────────────────────────────── */
  function initParticles() {
    var hero = document.querySelector('.hero-wrap');
    if (!hero) return;

    var canvas = document.createElement('canvas');
    canvas.id = 'dv-particles';
    hero.insertBefore(canvas, hero.firstChild);

    var ctx = canvas.getContext('2d');
    var particles = [];
    var PARTICLE_COUNT = 55;

    function resize() {
      canvas.width  = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Build particles
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        r:  Math.random() * 2.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.15,
        color: Math.random() > 0.5 ? '65,155,189' : '255,255,255'
      });
    }

    var mouse = { x: -1000, y: -1000 };
    hero.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    hero.addEventListener('mouseleave', function () {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    function drawLine(a, b) {
      var dx = a.x - b.x, dy = a.y - b.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(65,155,189,' + (1 - dist / 130) * 0.18 + ')';
        ctx.lineWidth = 0.8;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(function (p, i) {
        // Mouse repel
        var mdx = p.x - mouse.x, mdy = p.y - mouse.y;
        var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 100) {
          p.vx += (mdx / mdist) * 0.08;
          p.vy += (mdy / mdist) * 0.08;
        }

        // Speed cap
        var speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 1.2) { p.vx *= 0.95; p.vy *= 0.95; }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.color + ',' + p.alpha + ')';
        ctx.fill();

        // Connect nearby particles
        for (var j = i + 1; j < particles.length; j++) {
          drawLine(p, particles[j]);
        }
      });
    }
    animate();
  }

  /* ── 7. Typed text effect for hero h1 ──────────────────────────── */
  function initTypedHero() {
    var h1 = document.querySelector('.hero-wrap h1');
    if (!h1) return;

    var words = [
      'faster, smarter wound care',
      'real-time tissue analysis',
      'AI-powered clinical insight',
      'hyperspectral diagnostics'
    ];
    var currentWord = 0;

    // Split h1 into prefix + typed part
    var prefix = 'Hyperspectral imaging + AI for ';
    h1.innerHTML = prefix + '<span id="dv-typed"></span><span class="dv-typed-cursor"></span>';
    var typedEl = document.getElementById('dv-typed');

    function typeWord(word, cb) {
      var i = 0;
      typedEl.textContent = '';
      var t = setInterval(function () {
        typedEl.textContent += word[i];
        i++;
        if (i >= word.length) { clearInterval(t); setTimeout(cb, 1800); }
      }, 55);
    }

    function eraseWord(cb) {
      var t = setInterval(function () {
        var txt = typedEl.textContent;
        if (!txt.length) { clearInterval(t); cb(); return; }
        typedEl.textContent = txt.slice(0, -1);
      }, 30);
    }

    function cycle() {
      typeWord(words[currentWord], function () {
        eraseWord(function () {
          currentWord = (currentWord + 1) % words.length;
          cycle();
        });
      });
    }

    // Start after hero animation settles
    setTimeout(cycle, 1400);
  }

  /* ── 8. Magnetic hover effect on department cards ───────────────── */
  function initMagnetic() {
    document.querySelectorAll('.department-wrap').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top  + rect.height / 2;
        var dx = (e.clientX - cx) * 0.12;
        var dy = (e.clientY - cy) * 0.12;
        card.style.transform = 'translateY(-6px) translate(' + dx + 'px,' + dy + 'px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* ── 9. Contact box tilt effect ────────────────────────────────── */
  function initTilt() {
    document.querySelectorAll('.contact-section .box').forEach(function (box) {
      box.addEventListener('mousemove', function (e) {
        var rect = box.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width  - 0.5;
        var y = (e.clientY - rect.top)  / rect.height - 0.5;
        box.style.transform = 'translateY(-6px) rotateX(' + (-y * 10) + 'deg) rotateY(' + (x * 10) + 'deg)';
        box.style.transition = 'transform .1s ease';
      });
      box.addEventListener('mouseleave', function () {
        box.style.transform = '';
        box.style.transition = 'transform .4s cubic-bezier(.4,0,.2,1)';
      });
    });
  }

  /* ── 10. Navbar active section highlight ───────────────────────── */
  function initNavHighlight() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('#ftco-navbar .nav-link');

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navLinks.forEach(function (link) {
            var href = link.getAttribute('href');
            link.closest('.nav-item').classList.toggle(
              'active',
              href === '#' + id
            );
          });
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(function (s) { io.observe(s); });
  }

  /* ── 11. Counter section observer with pop ──────────────────────── */
  function initCounterObserver() {
    var blocks = document.querySelectorAll('.ftco-counter .block-18');
    var blockObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('dv-in-view');
          setTimeout(function () {
            entry.target.classList.add('dv-counted');
          }, 7200); // after jQuery counter finishes
          blockObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    blocks.forEach(function (b) { blockObs.observe(b); });
  }

  /* ── 12. Smooth section number badge on cards ───────────────────── */
  function addCardIndices() {
    document.querySelectorAll('.department-wrap').forEach(function (card, i) {
      card.dataset.index = String(i + 1).padStart(2, '0');
    });
  }

  /* ── 13. Footer text reveal ─────────────────────────────────────── */
  function initFooterReveal() {
    var footerCols = document.querySelectorAll('.ftco-footer .col-md');
    footerCols.forEach(function (col, i) {
      col.classList.add('dv-reveal');
      col.classList.add('dv-delay-' + (i + 1));
      revealObserver.observe(col);
    });
  }

  /* ── 14. Staff card stagger ─────────────────────────────────────── */
  function initStaffReveal() {
    document.querySelectorAll('.staff').forEach(function (el, i) {
      el.classList.add('dv-reveal-scale');
      el.classList.add('dv-delay-' + (i + 1));
      revealObserver.observe(el);
    });
  }

  /* ── 15. Scroll event hub ───────────────────────────────────────── */
  function onScroll() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    updateProgressBar();
    if (scrollTop > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }

  /* ── 16. About section reveals ─────────────────────────────────── */
  function initAboutReveal() {
    var aboutSection = document.querySelector('#about-section');
    if (!aboutSection) return;

    // Image
    var img = aboutSection.querySelector('.img');
    if (img) { img.classList.add('dv-reveal-left'); revealObserver.observe(img); }

    // Text block
    var textBlock = aboutSection.querySelector('.heading-section');
    if (textBlock) { textBlock.classList.add('dv-reveal-right'); revealObserver.observe(textBlock); }

    // Heading underline
    headingObserver.observe(aboutSection);
  }

  /* ── 17. Intro banner reveal ─────────────────────────────────────── */
  function initIntroReveal() {
    var intro = document.querySelector('.ftco-intro');
    if (!intro) return;
    intro.querySelector('h2') && revealObserver.observe(intro.querySelector('h2'));
    intro.querySelector('p')  && revealObserver.observe(intro.querySelector('p'));
  }

  /* ── 18. Init everything ────────────────────────────────────────── */
  function init() {

    /* ── CRITICAL: Force all ftco-animate elements visible immediately.
       style.css hides them (opacity:0; visibility:hidden) and relies on
       jQuery Waypoints to reveal them. In the Next.js dangerouslySetInnerHTML
       context Waypoints offsets are often wrong, leaving cards invisible.
       We unhide everything right away and let CSS handle the entrance. ── */
    document.querySelectorAll('.ftco-animate').forEach(function (el) {
      el.style.opacity    = '1';
      el.style.visibility = 'visible';
    });
    /* Also fire Waypoints refresh if jQuery is available */
    if (window.jQuery && window.jQuery.fn.waypoint) {
      setTimeout(function () {
        try { window.jQuery.waypoints('refresh'); } catch(e) {}
      }, 300);
    }

    initParticles();
    initTypedHero();
    initMagnetic();
    initTilt();
    initNavHighlight();
    initCounterObserver();
    addCardIndices();
    initFooterReveal();
    initStaffReveal();
    initAboutReveal();
    initIntroReveal();


    // Observe headings globally
    document.querySelectorAll('.heading-section').forEach(function (el) {
      headingObserver.observe(el);
    });

    // Contact boxes reveal
    document.querySelectorAll('.contact-section .box').forEach(function (box, i) {
      box.classList.add('dv-reveal');
      box.classList.add('dv-delay-' + (i + 1));
      revealObserver.observe(box);
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial call
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

