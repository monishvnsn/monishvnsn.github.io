(function () {
  var d = document;
  var root = d.documentElement;
  var motion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function reduced() {
    return root.dataset.reduce === "true" || motion.matches;
  }

  try {
    var themeBtn = d.querySelector(".theme");
    if (themeBtn) {
      themeBtn.setAttribute("aria-pressed", root.dataset.theme === "dark" ? "true" : "false");
      themeBtn.addEventListener("click", function () {
        var next = root.dataset.theme === "dark" ? "light" : "dark";
        root.dataset.theme = next;
        themeBtn.setAttribute("aria-pressed", next === "dark" ? "true" : "false");
        try { localStorage.setItem("theme", next); } catch (e) {}
      });
    }
  } catch (e) {}

  try {
    var header = d.querySelector(".site-header");
    var progress = d.querySelector(".progress");
    var ticking = false;
    function onScroll() {
      var y = window.scrollY;
      var max = root.scrollHeight - window.innerHeight;
      if (header) header.classList.toggle("scrolled", y > 8);
      if (progress) progress.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    }, { passive: true });
    onScroll();
  } catch (e) {}

  try {
    var reveal = d.querySelectorAll(".rv");
    function showInView(el) {
      var rect = el.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) el.classList.add("in");
    }
    if (reduced() || !("IntersectionObserver" in window)) {
      reveal.forEach(function (el) { el.classList.add("in"); });
    } else {
      reveal.forEach(showInView);
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var cl = entry.target.classList;
          if (entry.isIntersecting) {
            cl.remove("out");
            cl.add("in");
          } else if (cl.contains("in")) {
            cl.remove("in");
            cl.add("out");
          }
        });
      }, { rootMargin: "0px 0px -6% 0px", threshold: 0 });
      reveal.forEach(function (el) { io.observe(el); });
    }
  } catch (e) {}

  try {
    var sections = d.querySelectorAll("main section[id]");
    var spy = {};
    d.querySelectorAll('nav a[href^="/#"]').forEach(function (a) {
      spy[a.getAttribute("href").slice(2)] = a;
    });
    if (sections.length && ("IntersectionObserver" in window)) {
      var so = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var link = spy[entry.target.id];
          if (!link || !entry.isIntersecting) return;
          Object.keys(spy).forEach(function (key) { spy[key].classList.remove("active"); });
          link.classList.add("active");
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      sections.forEach(function (section) { so.observe(section); });
    }
  } catch (e) {}

  try {
    var rot = d.querySelector(".rot");
    var text = rot && rot.querySelector(".rot-text");
    var phrases = rot ? Array.prototype.map.call(rot.querySelectorAll(".rot-phrase"), function (node) {
      return node.textContent;
    }) : [];
    var pauseBtn = d.querySelector(".rot-ctrl");
    var timer = 0;
    var index = 0;
    var count = phrases.length ? phrases[0].length : 0;
    var mode = "hold";
    var paused = false;

    function stop() {
      if (timer) {
        clearTimeout(timer);
        timer = 0;
      }
    }

    function show(value) {
      if (text) text.textContent = value;
    }

    function step() {
      if (reduced() || paused || !text || !phrases.length) return;
      var phrase = phrases[index];
      if (mode === "hold") {
        mode = "delete";
        count = phrase.length;
        show(phrase);
        timer = setTimeout(step, 34);
        return;
      }
      if (mode === "delete") {
        count = Math.max(0, count - 1);
        show(phrase.slice(0, count));
        if (count === 0) {
          index = (index + 1) % phrases.length;
          mode = "type";
          timer = setTimeout(step, 320);
        } else {
          timer = setTimeout(step, 34);
        }
        return;
      }
      phrase = phrases[index];
      count = Math.min(phrase.length, count + 1);
      show(phrase.slice(0, count));
      if (count >= phrase.length) {
        mode = "hold";
        timer = setTimeout(step, 1800);
      } else {
        timer = setTimeout(step, 62);
      }
    }

    function arm() {
      stop();
      if (reduced() || paused || !text || !phrases.length) return;
      mode = "hold";
      count = phrases[index].length;
      show(phrases[index]);
      timer = setTimeout(step, 1800);
    }

    if (pauseBtn && phrases.length) {
      pauseBtn.addEventListener("click", function () {
        paused = !paused;
        pauseBtn.setAttribute("aria-pressed", paused ? "true" : "false");
        pauseBtn.textContent = paused ? "Resume" : "Pause";
        pauseBtn.setAttribute("aria-label", paused ? "Resume rotating phrases" : "Pause rotating phrases");
        if (paused) {
          stop();
          show(phrases[index]);
          if (rot) rot.classList.add("is-paused");
        } else if (rot) {
          rot.classList.remove("is-paused");
          arm();
        }
      });
    }

    if (motion.addEventListener) {
      motion.addEventListener("change", function () {
        if (motion.matches) {
          root.dataset.reduce = "true";
          stop();
          paused = false;
          if (rot) rot.classList.remove("is-paused");
        } else {
          delete root.dataset.reduce;
          paused = false;
          if (pauseBtn) {
            pauseBtn.setAttribute("aria-pressed", "false");
            pauseBtn.textContent = "Pause";
            pauseBtn.setAttribute("aria-label", "Pause rotating phrases");
          }
          if (rot) rot.classList.remove("is-paused");
          index = 0;
          count = phrases.length ? phrases[0].length : 0;
          arm();
        }
      });
    }

    d.addEventListener("visibilitychange", function () {
      if (reduced()) return;
      if (d.hidden) {
        stop();
        return;
      }
      if (!paused) arm();
    });

    if (!reduced()) arm();
  } catch (e) {}

  try {
    var embedBtn = d.getElementById("load-embeds");
    if (embedBtn) {
      embedBtn.addEventListener("click", function () {
        var note = d.getElementById("embed-status");
        if (d.getElementById("twitter-wjs")) return;
        var script = d.createElement("script");
        script.id = "twitter-wjs";
        script.async = true;
        script.src = "https://platform.twitter.com/widgets.js";
        script.onload = function () {
          if (note) note.textContent = "Embedded posts were requested from X. If a post does not appear, use the link in that quote.";
        };
        script.onerror = function () {
          if (note) note.textContent = "Embedded posts could not be loaded. The text and links above still open each post on X.";
          embedBtn.disabled = false;
          embedBtn.textContent = "Load embedded posts";
        };
        d.body.appendChild(script);
        embedBtn.disabled = true;
        embedBtn.textContent = "Loading embeds…";
        if (note) note.textContent = "Loading embedded posts from X. The quotes above stay if an embed does not appear.";
      });
    }
  } catch (e) {}
})();
