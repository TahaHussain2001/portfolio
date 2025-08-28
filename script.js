document.addEventListener('DOMContentLoaded', () => {
    const bodyPage = (document.body && document.body.dataset.page) || (document.documentElement && document.documentElement.dataset.page) || '';
    const loginForm = document.getElementById('loginForm');
    const logoutButton = document.getElementById('logoutButton');
    const loginErrorMessage = document.getElementById('loginErrorMessage');
    const passwordInput = document.getElementById('passwordInput');
    const togglePasswordVisibility = document.getElementById('togglePasswordVisibility');
  
    // ---- Hardcoded credentials (kept exactly as requested) ----
    const correctUsername = 'tahah2269@gmail.com';
    const correctPassword = 'Taha2001';
  
    // ---- Auth routing guards ----
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
  
    // If on portfolio page but not logged in → redirect to login
    if (bodyPage === 'portfolio' && !isLoggedIn) {
      window.location.href = 'index.html';
      return;
    }
    // If on login page but logged in → go to portfolio
    if (bodyPage === 'login' && isLoggedIn) {
      window.location.href = 'portfolio.html';
      return;
    }
  
    // ---- Login submit ----
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const usernameInput = document.getElementById('usernameInput').value.trim();
        const passInput = passwordInput ? passwordInput.value : '';
  
        if (usernameInput === correctUsername && passInput === correctPassword) {
          localStorage.setItem('loggedIn', 'true');
          window.location.href = 'portfolio.html';
        } else {
          if (loginErrorMessage) loginErrorMessage.textContent = 'Invalid username or password.';
        }
      });
    }
  
    // ---- Logout ----
    if (logoutButton) {
      logoutButton.addEventListener('click', () => {
        localStorage.removeItem('loggedIn');
        window.location.href = 'index.html';
      });
    }
  
    // ---- Toggle password visibility (no external icon lib) ----
    if (togglePasswordVisibility && passwordInput) {
      togglePasswordVisibility.addEventListener('click', function () {
        const visible = passwordInput.getAttribute('type') === 'text';
        passwordInput.setAttribute('type', visible ? 'password' : 'text');
        this.setAttribute('aria-pressed', String(!visible));
      });
    }
  
    // ---- UI niceties for portfolio ----
    const progressEl = document.getElementById('scrollProgress');
    const toTopBtn = document.getElementById('toTop');
    const headerEl = document.querySelector('header.site');
  
    function onScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (progressEl) progressEl.style.width = progress + '%';
      if (toTopBtn) toTopBtn.classList.toggle('show', scrollTop > 400);
      if (headerEl) headerEl.classList.toggle('shrink', scrollTop > 10);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  
    if (toTopBtn) {
      toTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
  
    // Reveal on scroll
    const reveals = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach(el => io.observe(el));
  
    // Scroll spy
    const sections = Array.from(document.querySelectorAll('main section[id]'));
    const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
    function setActiveLink() {
      let current = sections[0]?.id;
      for (const sec of sections) {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 180) { current = sec.id; break; }
      }
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${current}`));
    }
    window.addEventListener('scroll', setActiveLink, { passive: true });
    window.addEventListener('resize', setActiveLink);
    setActiveLink();
  
    // Smooth nav scroll
    navLinks.forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const id = a.getAttribute('href');
        const el = document.querySelector(id);
        if (!el) return;
        window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' });
        history.replaceState(null, '', id);
      });
    });
  
    // Mobile menu
    const nav = document.getElementById('nav');
    const menuBtn = document.getElementById('menuBtn');
    if (menuBtn && nav) menuBtn.addEventListener('click', () => nav.classList.toggle('open'));
  
    // Footer year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  
    // 3D tilt on cards
    const tilts = document.querySelectorAll('.tilt');
    tilts.forEach(card => {
      let rAF = null;
      let bounds = null;
      function update(e) {
        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top;
        const rx = ((y / bounds.height) - 0.5) * -8;
        const ry = ((x / bounds.width) - 0.5) * 8;
        card.style.setProperty('--rx', rx + 'deg');
        card.style.setProperty('--ry', ry + 'deg');
        card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
      }
      function onMove(e) {
        if (!bounds) bounds = card.getBoundingClientRect();
        if (rAF) cancelAnimationFrame(rAF);
        rAF = requestAnimationFrame(() => update(e));
      }
      function reset() {
        card.style.transform = '';
        bounds = null;
      }
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', reset);
    });
  });
  