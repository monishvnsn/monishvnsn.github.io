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
        if (typeof applyTweetTheme === "function") applyTweetTheme();
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
    var focusTimer = 0;
    var focusIndex = 0;

    function settleFocus() {
      if (focusTimer) {
        clearTimeout(focusTimer);
        focusTimer = 0;
      }
      delete root.dataset.animate;
    }

    if (root.dataset.animate === "1" && text && phrases.length && !reduced()) {
      text.textContent = phrases[0];
      focusTimer = setTimeout(function step() {
        focusIndex += 1;
        if (reduced() || focusIndex >= phrases.length) {
          settleFocus();
          return;
        }
        text.textContent = phrases[focusIndex];
        focusTimer = setTimeout(step, 1000);
      }, 1000);
      d.addEventListener("visibilitychange", function () {
        if (d.hidden) settleFocus();
      });
      if (motion.addEventListener) {
        motion.addEventListener("change", function () {
          if (motion.matches) {
            root.dataset.reduce = "true";
            settleFocus();
          }
        });
      }
    } else {
      settleFocus();
    }
  } catch (e) {}

  function tweetTheme() {
    return root.dataset.theme === "dark" ? "dark" : "light";
  }

  function applyTweetTheme() {
    var theme = tweetTheme();
    Array.prototype.forEach.call(d.querySelectorAll("blockquote.twitter-tweet"), function (el) {
      el.setAttribute("data-theme", theme);
      el.setAttribute("data-dnt", "true");
    });
    Array.prototype.forEach.call(d.querySelectorAll(".twitter-tweet iframe, iframe.twitter-tweet"), function (frame) {
      try {
        var url = new URL(frame.src);
        if (url.searchParams.has("theme")) {
          url.searchParams.set("theme", theme);
          if (frame.src !== url.toString()) frame.src = url.toString();
        }
      } catch (err) {}
    });
  }

  try {
    applyTweetTheme();
    if (d.querySelector("blockquote.twitter-tweet") && !d.getElementById("twitter-wjs")) {
      var tweetScript = d.createElement("script");
      tweetScript.id = "twitter-wjs";
      tweetScript.async = true;
      tweetScript.charset = "utf-8";
      tweetScript.src = "https://platform.twitter.com/widgets.js";
      tweetScript.onerror = function () {
        var note = d.getElementById("embed-status");
        if (note) note.textContent = "X previews could not be loaded. Each post is still linked above.";
      };
      d.body.appendChild(tweetScript);
    }
  } catch (e) {}

  try {
    var calSlot = d.getElementById("cal-embed");
    var calStatus = d.getElementById("cal-status");
    function verifiedCalPath(value) {
      var raw = (value || "").trim();
      if (!raw) return "";
      var url;
      try { url = new URL(raw, "https://cal.com"); } catch (err) { return ""; }
      if (url.protocol !== "https:") return "";
      if (url.hostname !== "cal.com" && url.hostname !== "www.cal.com") return "";
      var parts = url.pathname.split("/").filter(Boolean);
      if (parts.length < 2) return "";
      if (!/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(parts[0]) || !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(parts[1])) return "";
      return parts[0] + "/" + parts[1];
    }
    var calPath = calSlot ? verifiedCalPath(calSlot.getAttribute("data-cal-link")) : "";
    if (calSlot && calPath && !window.Cal) {
      if (calStatus) calStatus.hidden = true;
      (function (C, A, L) {
        var p = function (a, ar) { a.q.push(ar); };
        var doc = C.document;
        C.Cal = C.Cal || function () {
          var cal = C.Cal;
          var ar = arguments;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            var script = doc.createElement("script");
            script.src = A;
            script.async = true;
            doc.head.appendChild(script);
            cal.loaded = true;
          }
          if (ar[0] === L) {
            var api = function () { p(api, arguments); };
            var namespace = ar[1];
            api.q = api.q || [];
            if (typeof namespace === "string") {
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ["initNamespace", namespace]);
            } else p(cal, ar);
            return;
          }
          p(cal, ar);
        };
      })(window, "https://app.cal.com/embed/embed.js", "init");
      window.Cal("init", "site", { origin: "https://cal.com" });
      window.Cal.ns.site("inline", {
        elementOrSelector: "#cal-embed",
        calLink: calPath
      });
    }
  } catch (e) {}
})();
