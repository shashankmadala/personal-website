/* ============================================================
   shashankmadala.com
   One small script: theme, typewriter, live terminal, reveals,
   count-ups, statement scrub, work tabs, carousel + lightbox,
   filters, timeline fill. No dependencies.
   ============================================================ */
(function () {
  "use strict";

  var docEl = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---------- theme ---------- */
  (function theme() {
    var btn = $("#themeBtn");
    if (!btn) return;
    var meta = $('meta[name="theme-color"]');

    function apply(mode) {
      docEl.setAttribute("data-theme", mode);
      if (meta) meta.setAttribute("content", mode === "light" ? "#f4f5f8" : "#0e1014");
      btn.setAttribute("aria-pressed", mode === "light" ? "true" : "false");
      btn.setAttribute("aria-label", mode === "light" ? "Dark theme" : "Light theme");
    }
    apply(docEl.getAttribute("data-theme") === "light" ? "light" : "dark");

    btn.addEventListener("click", function () {
      var next = docEl.getAttribute("data-theme") === "light" ? "dark" : "light";
      apply(next);
      try { localStorage.setItem("sm-theme", next); } catch (e) {}
    });
  })();

  /* ---------- nav + scroll progress ---------- */
  (function chrome() {
    var nav = $("#nav");
    var bar = $("#progress");
    var ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY || 0;
        if (nav) nav.classList.toggle("scrolled", y > 8);
        if (bar) {
          var max = docEl.scrollHeight - window.innerHeight;
          bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";
        }
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  })();

  /* ---------- reveals ----------
     Everything that crosses the threshold in the same frame is treated as
     one group and cascades, so a row of tiles arrives as a wave instead of
     all at once. Elements with an explicit d1/d2/d3 keep their own delay. */
  (function reveals() {
    var items = $$(".reveal");
    if (!items.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var STEP = 0.07, MAX = 0.42;
    var io = new IntersectionObserver(function (entries) {
      var arrived = entries.filter(function (en) { return en.isIntersecting; });
      if (!arrived.length) return;
      arrived.sort(function (a, b) {
        return a.boundingClientRect.top - b.boundingClientRect.top ||
               a.boundingClientRect.left - b.boundingClientRect.left;
      });
      arrived.forEach(function (en, i) {
        var el = en.target;
        if (!/\bd[123]\b/.test(el.className)) {
          el.style.setProperty("--reveal-delay", Math.min(i * STEP, MAX).toFixed(2) + "s");
        }
        el.classList.add("in");
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    items.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- re-run a short entry animation on a set of elements ---------- */
  function playRows(els) {
    if (reduceMotion) return;
    els.forEach(function (el, i) {
      el.classList.remove("anim-row");
      void el.offsetWidth; /* restart the animation */
      el.style.animationDelay = Math.min(i * 0.022, 0.2).toFixed(3) + "s";
      el.classList.add("anim-row");
    });
  }

  /* ---------- hero typewriter: the name first, then the role loop ---------- */
  (function typewriter() {
    var out = $("#typeRole");
    var name = $("#heroName");
    var nameCaret = $("#nameCaret");
    if (!out) return;
    var roles = [
      "I build AI that reads emotion.",
      "I research autism at Yale.",
      "I represented Team USA.",
      "I teach ML to 15,000+ students.",
      "I run a 50-chapter nonprofit."
    ];
    if (reduceMotion) { out.textContent = roles[0]; return; }

    var ri = 0, ci = 0, deleting = false;
    function roleTick() {
      var word = roles[ri];
      if (!deleting) {
        ci++;
        out.textContent = word.slice(0, ci);
        if (ci === word.length) { deleting = true; setTimeout(roleTick, 1900); return; }
        setTimeout(roleTick, 42 + Math.random() * 48);
      } else {
        ci--;
        out.textContent = word.slice(0, ci);
        if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; setTimeout(roleTick, 320); return; }
        setTimeout(roleTick, 22);
      }
    }

    if (!name || !nameCaret) { setTimeout(roleTick, 500); return; }
    var full = name.textContent;
    name.textContent = "";
    nameCaret.hidden = false;
    var ni = 0;
    (function nameTick() {
      ni++;
      name.textContent = full.slice(0, ni);
      if (ni < full.length) { setTimeout(nameTick, 52 + Math.random() * 46); }
      else {
        setTimeout(function () {
          nameCaret.hidden = true;
          roleTick();
        }, 420);
      }
    })();
  })();

  /* ---------- hero tile background ---------- */
  (function tiles() {
    var canvas = $("#tileCanvas");
    var hero = $("#hero");
    if (!canvas || !hero || !canvas.getContext) return;
    var ctx = canvas.getContext("2d");

    var CELL = 46, GAP = 5, R = 6;
    var cols = 0, rows = 0, dpr = 1;
    var mx = -9999, my = -9999;
    var twinkles = [];
    var blue = { r: 74, g: 141, b: 255 };
    var running = false, rafId = null;

    function readBlue() {
      var v = getComputedStyle(docEl).getPropertyValue("--blue").trim();
      var m = /^#([0-9a-f]{6})$/i.exec(v);
      if (m) {
        blue = {
          r: parseInt(m[1].slice(0, 2), 16),
          g: parseInt(m[1].slice(2, 4), 16),
          b: parseInt(m[1].slice(4, 6), 16)
        };
      }
    }

    function resize() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      var w = hero.clientWidth, h = hero.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      cols = Math.ceil(w / (CELL + GAP));
      rows = Math.ceil(h / (CELL + GAP));
      twinkles = [];
      var n = Math.round(cols * rows * 0.05);
      for (var i = 0; i < n; i++) {
        twinkles.push({
          c: Math.floor(Math.random() * cols),
          r: Math.floor(Math.random() * rows),
          p: Math.random() * Math.PI * 2,
          s: 0.4 + Math.random() * 0.8
        });
      }
      if (reduceMotion) draw(0); /* static frame */
    }

    function draw(t) {
      var w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      var step = (CELL + GAP) * dpr;
      var size = CELL * dpr;
      var rad = R * dpr;
      var glow = {};
      if (!reduceMotion) {
        for (var i = 0; i < twinkles.length; i++) {
          var tw = twinkles[i];
          glow[tw.r * 4096 + tw.c] = 0.05 * (0.5 + 0.5 * Math.sin(t * 0.0006 * tw.s + tw.p));
        }
      }
      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          var x = c * step, y = r * step;
          var a = 0.022;
          var g = glow[r * 4096 + c];
          if (g) a += g;
          var dx = (x + size / 2) / dpr - mx, dy = (y + size / 2) / dpr - my;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < 220) a += 0.16 * (1 - d / 220);
          ctx.fillStyle = "rgba(" + blue.r + "," + blue.g + "," + blue.b + "," + a.toFixed(3) + ")";
          if (ctx.roundRect) {
            ctx.beginPath();
            ctx.roundRect(x, y, size, size, rad);
            ctx.fill();
          } else {
            ctx.fillRect(x, y, size, size);
          }
        }
      }
    }

    function loop(t) {
      draw(t);
      rafId = requestAnimationFrame(loop);
    }
    function start() {
      if (running || reduceMotion) return;
      running = true;
      rafId = requestAnimationFrame(loop);
    }
    function stop() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
    }

    hero.addEventListener("mousemove", function (e) {
      var rect = hero.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    });
    hero.addEventListener("mouseleave", function () { mx = -9999; my = -9999; });

    new MutationObserver(function () {
      readBlue();
      if (reduceMotion) draw(0);
    }).observe(docEl, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("resize", resize);

    if ("IntersectionObserver" in window && !reduceMotion) {
      new IntersectionObserver(function (entries) {
        entries[0].isIntersecting ? start() : stop();
      }, { threshold: 0 }).observe(hero);
    } else {
      start();
    }

    readBlue();
    resize();
  })();

  /* ---------- live terminal ---------- */
  (function terminal() {
    var body = $("#termBody");
    if (!body) return;

    /* each entry: the typed command, then instant output lines */
    var script = [
      { cmd: "whoami", out: [
        'shashank madala <i class="t-key">&middot;</i> student, builder, researcher',
        'robbinsville, nj <i class="t-key">&middot;</i> class of 2027'
      ]},
      { cmd: "ls ~/building", out: [
        '<i class="t-key">kora/</i>  <i class="t-key">lumin-ai/</i>  <i class="t-key">safestrides/</i>  <i class="t-key">yale-research/</i>  <i class="t-key">frc-2590/</i>'
      ]},
      { cmd: "cat focus.txt", out: [
        'AI that helps people understand each other.'
      ]},
      { cmd: "./status --live", out: [
        'research @ yale child study center <i class="t-ok">[ACTIVE]</i>',
        'team usa &middot; econ olympiad 2026 <i class="t-key">[6TH OF 52]</i>',
        'lumin ai &middot; 50+ chapters <i class="t-key">[15,000+ STUDENTS]</i>',
        'kora &middot; 25 therapy centers <i class="t-key">[700+ USERS]</i>',
        'fbla &middot; chapter president <i class="t-key">[2X STATE TECH COMMITTEE]</i>'
      ]}
    ];

    var PROMPT = '<span class="t-prompt">$</span> ';

    if (reduceMotion) {
      var dump = "";
      script.forEach(function (s) {
        dump += PROMPT + '<span class="t-cmd">' + s.cmd + "</span>\n" + s.out.join("\n") + "\n";
      });
      body.innerHTML = dump;
      return;
    }

    var si = 0;
    var history = "";

    function write(html) {
      body.innerHTML = html;
      body.scrollTop = body.scrollHeight; /* keep the latest line in view */
    }

    function typeCommand(cmd, done) {
      var i = 0;
      (function step() {
        i++;
        write(history + PROMPT + '<span class="t-cmd">' + cmd.slice(0, i) + "</span>" + '<span class="caret"></span>');
        if (i < cmd.length) { setTimeout(step, 34 + Math.random() * 46); }
        else { setTimeout(done, 260); }
      })();
    }

    function run() {
      var s = script[si];
      typeCommand(s.cmd, function () {
        history += PROMPT + '<span class="t-cmd">' + s.cmd + "</span>\n" + s.out.join("\n") + "\n";
        /* keep the backlog bounded */
        var lines = history.split("\n");
        if (lines.length > 30) history = lines.slice(lines.length - 30).join("\n");
        write(history + PROMPT + '<span class="caret"></span>');
        si = (si + 1) % script.length;
        setTimeout(run, 2400);
      });
    }
    setTimeout(run, 900);
  })();

  /* ---------- count-up stats ---------- */
  (function counters() {
    var nums = $$("[data-count]");
    if (!nums.length) return;

    function fmt(n) { return Math.round(n).toLocaleString("en-US"); }

    function animate(el) {
      var target = parseFloat(el.getAttribute("data-count"));
      if (reduceMotion) { el.textContent = fmt(target); return; }
      var t0 = null, dur = 1400;
      function frame(t) {
        if (!t0) t0 = t;
        var p = Math.min(1, (t - t0) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(target * eased);
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    if (!("IntersectionObserver" in window)) { nums.forEach(animate); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animate(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    nums.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- statement scrub ---------- */
  (function statement() {
    var section = $("#statement");
    var text = $("#statementText");
    if (!section || !text) return;

    var raw = text.textContent.trim().split(/\s+/);
    text.innerHTML = raw.map(function (w) {
      var key = /understand|emotional|anxiety|free/i.test(w);
      return '<span class="w' + (key ? " key" : "") + '">' + w + "</span>";
    }).join(" ");
    var words = $$(".w", text);

    if (reduceMotion) { words.forEach(function (w) { w.classList.add("lit"); }); return; }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var rect = section.getBoundingClientRect();
        var total = rect.height - window.innerHeight;
        var p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1;
        var lit = Math.round(p * words.length);
        words.forEach(function (w, i) { w.classList.toggle("lit", i < lit); });
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  })();

  /* ---------- work tabs ---------- */
  (function work() {
    var list = $("#wkTabs");
    var thumb = $("#wkThumb");
    if (!list) return;
    var tabs = $$(".wk-tab", list);
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute("aria-controls")); });

    function moveThumb(tab) {
      if (!thumb) return;
      thumb.style.transform = "translateY(" + tab.offsetTop + "px)";
      thumb.style.height = tab.offsetHeight + "px";
      thumb.classList.add("ready");
    }

    function select(i, focus) {
      tabs.forEach(function (t, j) {
        var on = i === j;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        if (panels[j]) panels[j].hidden = !on;
      });
      var p = panels[i];
      if (p && !reduceMotion) {
        p.classList.remove("enter");
        void p.offsetWidth; /* restart the entry animation */
        p.classList.add("enter");
      }
      moveThumb(tabs[i]);
      if (focus) tabs[i].focus();
    }

    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(i, false); });
      t.addEventListener("keydown", function (e) {
        var n = null;
        if (e.key === "ArrowDown" || e.key === "ArrowRight") n = (i + 1) % tabs.length;
        if (e.key === "ArrowUp" || e.key === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
        if (e.key === "Home") n = 0;
        if (e.key === "End") n = tabs.length - 1;
        if (n !== null) { e.preventDefault(); select(n, true); }
      });
    });

    window.addEventListener("resize", function () {
      var i = tabs.findIndex(function (t) { return t.getAttribute("aria-selected") === "true"; });
      if (i >= 0) moveThumb(tabs[i]);
    });
    select(0, false);
  })();

  /* ---------- carousels (classroom photos + recognition documents) ---------- */
  var lightbox = (function () {
    var lb = $("#lb"), lbImg = $("#lbImg"), lbCap = $("#lbCap");
    var lbClose = $("#lbClose"), lbPrev = $("#lbPrev"), lbNext = $("#lbNext");
    if (!lb || !lbImg) return null;
    var slides = [], lbIndex = 0, lastFocus = null;

    function show(i) {
      lbIndex = (i + slides.length) % slides.length;
      var img = $("img", slides[lbIndex]);
      var cap = $(".cr-cap", slides[lbIndex]);
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = cap ? cap.textContent.replace(/^(\d+)/, "$1 · ") : "";
    }
    function open(list, i) {
      slides = list;
      lastFocus = document.activeElement;
      show(i);
      lb.hidden = false;
      document.body.style.overflow = "hidden";
      lbClose.focus();
    }
    function hide() {
      lb.hidden = true;
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    }

    lbClose.addEventListener("click", hide);
    if (lbPrev) lbPrev.addEventListener("click", function () { show(lbIndex - 1); });
    if (lbNext) lbNext.addEventListener("click", function () { show(lbIndex + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) hide(); });
    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") hide();
      if (e.key === "ArrowLeft") show(lbIndex - 1);
      if (e.key === "ArrowRight") show(lbIndex + 1);
    });
    return { open: open };
  })();

  function setupCarousel(ids) {
    var track = $(ids.track);
    if (!track) return;
    var slides = $$(".cr-slide", track);
    var dots = ids.dots ? $$(".cr-dot", $(ids.dots)) : [];
    var count = $(ids.count);
    var current = 0;

    function pad(n) { return (n < 9 ? "0" : "") + (n + 1); }

    function setCurrent(i) {
      if (i === current) return;
      current = i;
      dots.forEach(function (d, j) {
        if (i === j) d.setAttribute("aria-current", "true");
        else d.removeAttribute("aria-current");
      });
      if (count) count.innerHTML = "<b>" + pad(i) + "</b> / " + pad(slides.length - 1);
    }

    function goTo(i) {
      i = Math.max(0, Math.min(slides.length - 1, i));
      var s = slides[i];
      track.scrollTo({
        left: s.offsetLeft - (track.clientWidth - s.clientWidth) / 2,
        behavior: reduceMotion ? "auto" : "smooth"
      });
      setCurrent(i);
    }

    var prev = $(ids.prev), next = $(ids.next);
    if (prev) prev.addEventListener("click", function () { goTo(current - 1); });
    if (next) next.addEventListener("click", function () { goTo(current + 1); });
    dots.forEach(function (d) {
      d.addEventListener("click", function () { goTo(parseInt(d.getAttribute("data-i"), 10)); });
    });

    var scrollT = null;
    track.addEventListener("scroll", function () {
      if (scrollT) clearTimeout(scrollT);
      scrollT = setTimeout(function () {
        var mid = track.scrollLeft + track.clientWidth / 2;
        var best = 0, bestD = Infinity;
        slides.forEach(function (s, i) {
          var d = Math.abs(s.offsetLeft + s.clientWidth / 2 - mid);
          if (d < bestD) { bestD = d; best = i; }
        });
        setCurrent(best);
      }, 90);
    }, { passive: true });

    slides.forEach(function (s, i) {
      var hit = $(".cr-hit", s);
      if (hit && lightbox) hit.addEventListener("click", function () { lightbox.open(slides, i); });
    });
  }

  setupCarousel({ track: "#crTrack", prev: "#crPrev", next: "#crNext", dots: "#crDots", count: "#crCount" });
  setupCarousel({ track: "#rcrTrack", prev: "#rcrPrev", next: "#rcrNext", dots: "#rcrDots", count: "#rcrCount" });

  /* ---------- contact: copy the address ---------- */
  (function copyEmail() {
    var btn = $("#ctCopy");
    var addr = $("#ctAddr");
    if (!btn || !addr) return;
    var t = null;
    btn.addEventListener("click", function () {
      var text = addr.textContent.trim();
      function done(label) {
        btn.textContent = label;
        if (t) clearTimeout(t);
        t = setTimeout(function () { btn.textContent = "COPY"; }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done("COPIED"); }, function () { done("FAILED"); });
      } else {
        var r = document.createRange();
        r.selectNodeContents(addr);
        var sel = window.getSelection();
        sel.removeAllRanges(); sel.addRange(r);
        done(document.execCommand("copy") ? "COPIED" : "SELECT");
        sel.removeAllRanges();
      }
    });
  })();

  /* ---------- honors filter ---------- */
  (function honors() {
    var chips = $$(".fchip[data-hb]");
    if (!chips.length) return;
    var cells = $$(".hn-cell");
    var tally = $("#hbTally");

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var key = chip.getAttribute("data-hb");
        chips.forEach(function (c) { c.setAttribute("aria-checked", c === chip ? "true" : "false"); });
        var shown = 0, visible = [];
        cells.forEach(function (cell) {
          var hit = key === "all" || cell.getAttribute("data-hb") === key;
          cell.classList.toggle("is-hidden", !hit);
          if (hit) { shown++; visible.push(cell); }
        });
        playRows(visible);
        if (tally) {
          tally.textContent = key === "all"
            ? "11 HONORS · 3 INTL · 6 NATL · 2 STATE"
            : shown + (shown === 1 ? " HONOR · " : " HONORS · ") + key;
        }
      });
    });
  })();

  /* ---------- press filter ---------- */
  (function press() {
    var chips = $$(".fchip[data-pf]");
    if (!chips.length) return;
    var cells = $$(".press-cell");
    var countEl = $("#pressCount");
    var empty = $("#pressEmpty");

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var key = chip.getAttribute("data-pf");
        chips.forEach(function (c) { c.setAttribute("aria-checked", c === chip ? "true" : "false"); });
        var shown = 0, visible = [];
        cells.forEach(function (cell) {
          var tags = (cell.getAttribute("data-pf") || "").split(/\s+/);
          var hit = key === "all" || tags.indexOf(key) !== -1;
          cell.classList.toggle("is-hidden", !hit);
          if (hit) { shown++; visible.push(cell); }
        });
        playRows(visible);
        if (countEl) countEl.textContent = shown + (shown === 1 ? " PIECE" : " PIECES") + " OF COVERAGE";
        if (empty) empty.hidden = shown !== 0;
      });
    });
  })();

  /* ---------- timeline fill ---------- */
  (function timeline() {
    var wrap = $("#tlWrap");
    var fill = $("#tlFill");
    if (!wrap || !fill) return;
    var items = $$(".tl-item", wrap);

    if (reduceMotion) {
      fill.style.transform = "scaleY(1)";
      items.forEach(function (it) { it.classList.add("lit"); });
      return;
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var rect = wrap.getBoundingClientRect();
        var anchor = window.innerHeight * 0.72;
        var p = Math.min(1, Math.max(0, (anchor - rect.top) / rect.height));
        fill.style.transform = "scaleY(" + p + ")";
        items.forEach(function (it) {
          it.classList.toggle("lit", it.getBoundingClientRect().top < anchor);
        });
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  })();

})();
