/* ==========================================================================
   Modern Freelance Portfolio - JavaScript
   Full-site Bilingual (EN/AR) + Theme Toggle + Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // -------------------------------------------------------------------------
  // 01. Sticky Header + Scroll Spy
  // -------------------------------------------------------------------------
  const header     = document.getElementById('header');
  const navLinks   = document.querySelectorAll('.nav-link');
  const sections   = document.querySelectorAll('section');
  const backToTop  = document.getElementById('back-to-top-btn');

  window.addEventListener('scroll', () => {
    // Sticky style
    header.classList.toggle('scrolled', window.scrollY > 50);

    // Back-to-top visibility
    backToTop.classList.toggle('visible', window.scrollY > 300);

    // Scroll-spy active nav link
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 130) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });

    // Animate stat counters once visible
    if (!statsAnimated) {
      const about = document.getElementById('about');
      if (about && about.getBoundingClientRect().top < window.innerHeight * 0.85) {
        animateCounters();
        statsAnimated = true;
      }
    }
  });

  // Smooth-scroll nav links
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      document.getElementById('nav-menu').classList.remove('active');
    });
  });

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Mobile menu toggle
  document.getElementById('mobile-menu-btn').addEventListener('click', () => {
    document.getElementById('nav-menu').classList.toggle('active');
  });

  // -------------------------------------------------------------------------
  // 02. Dark / Light Theme Toggle
  // -------------------------------------------------------------------------
  const html         = document.documentElement;
  const themeBtn     = document.getElementById('theme-toggle-btn');

  const savedTheme   = localStorage.getItem('portfolio-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeBtn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    themeBtn.querySelector('i').className = theme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }

  // -------------------------------------------------------------------------
  // 03. Full-Site Bilingual Language System (EN ↔ AR)
  // -------------------------------------------------------------------------
  let currentLang = localStorage.getItem('portfolio-lang') || 'en';
  applyLanguage(currentLang, false); // apply on load without animation

  // Global navbar AR/EN button
  document.getElementById('global-lang-btn').addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    localStorage.setItem('portfolio-lang', currentLang);
    applyLanguage(currentLang, true);
  });

  // USP section inner language buttons (keep in sync with global)
  document.getElementById('usp-btn-en').addEventListener('click', () => {
    if (currentLang !== 'en') { currentLang = 'en'; localStorage.setItem('portfolio-lang', 'en'); applyLanguage('en', true); }
  });
  document.getElementById('usp-btn-ar').addEventListener('click', () => {
    if (currentLang !== 'ar') { currentLang = 'ar'; localStorage.setItem('portfolio-lang', 'ar'); applyLanguage('ar', true); }
  });

  function applyLanguage(lang, animate) {
    const isAr = lang === 'ar';

    /* --- document-level direction --- */
    html.setAttribute('lang', isAr ? 'ar' : 'en');
    html.setAttribute('dir',  isAr ? 'rtl' : 'ltr');
    document.body.style.fontFamily = isAr
      ? "'Tajawal', 'Plus Jakarta Sans', sans-serif"
      : "'Plus Jakarta Sans', system-ui, sans-serif";

    /* --- navbar lang button label --- */
    document.getElementById('global-lang-btn').querySelector('span').textContent = isAr ? 'EN' : 'AR';

    /* --- USP inner tabs --- */
    document.getElementById('usp-content-en').style.display = isAr ? 'none' : 'block';
    document.getElementById('usp-content-ar').style.display = isAr ? 'block' : 'none';
    document.getElementById('usp-btn-en').classList.toggle('active', !isAr);
    document.getElementById('usp-btn-ar').classList.toggle('active',  isAr);

    /* --- Translate every [data-en] / [data-ar] element --- */
    document.querySelectorAll('[data-en]').forEach(el => {
      const text = isAr ? el.getAttribute('data-ar') : el.getAttribute('data-en');
      if (text !== null) el.textContent = text;
    });

    /* --- Form placeholders --- */
    document.querySelectorAll('[data-placeholder-en]').forEach(el => {
      el.placeholder = isAr
        ? el.getAttribute('data-placeholder-ar')
        : el.getAttribute('data-placeholder-en');
    });

    /* --- Select <option> text --- */
    document.querySelectorAll('option[data-en]').forEach(opt => {
      opt.textContent = isAr ? opt.getAttribute('data-ar') : opt.getAttribute('data-en');
    });

    /* --- Animate section if requested --- */
    if (animate) {
      document.body.style.transition = 'opacity 0.2s ease';
      document.body.style.opacity    = '0';
      setTimeout(() => { document.body.style.opacity = '1'; }, 80);
    }
  }

  // -------------------------------------------------------------------------
  // 04. Project Filter
  // -------------------------------------------------------------------------
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        const show = cat === 'all' || card.getAttribute('data-category') === cat;
        card.style.opacity   = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.display = show ? 'flex' : 'none';
          if (show) requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.35s, transform 0.35s';
            card.style.opacity    = '1';
            card.style.transform  = 'translateY(0)';
          });
        }, 150);
      });
    });
  });

  // -------------------------------------------------------------------------
  // 05. Case Study Modal
  // -------------------------------------------------------------------------
  const modal      = document.getElementById('project-modal');
  const modalBody  = document.getElementById('modal-body-content');
  const modalClose = document.getElementById('modal-close-btn');

  const caseData = {
    1: {
      en: {
        cat: 'E-Commerce Optimization',
        title: 'AURA Luxury Fashion Storefront',
        challenge: 'The client faced high bounce rates (65%) and slow checkout times on mobile devices, resulting in lost sales.',
        solution: 'Engineered a lightweight HTML/CSS storefront with instant product search, progressive image loading, and an optimized mobile cart drawer.',
        results: ['+140% Increase in Mobile Conversion Rate', '98/100 Google Lighthouse Score', 'Load time reduced from 4.2s to 0.9s'],
        stack: ['HTML5', 'CSS Custom Properties', 'JavaScript ES6', 'Flexbox / Grid'],
      },
      ar: {
        cat: 'تحسين التجارة الإلكترونية',
        title: 'متجر أزياء AURA الفاخر',
        challenge: 'عانى العميل من معدلات ارتداد عالية (65%) وبطء في إتمام الشراء على الجوّال، مما أدى إلى ضياع مبيعات.',
        solution: 'طوّرتُ واجهة ويب خفيفة الوزن بـ HTML/CSS مع بحث فوري عن المنتجات، تحميل تدريجي للصور، وسلة تسوق جوّال محسّنة.',
        results: ['+140% زيادة في معدل التحويل عبر الجوّال', 'درجة Google Lighthouse: 98/100', 'انخفاض وقت التحميل من 4.2 ث إلى 0.9 ث'],
        stack: ['HTML5', 'CSS Custom Properties', 'JavaScript ES6', 'Flexbox / Grid'],
      },
    },
    2: {
      en: {
        cat: 'SaaS Web Application',
        title: 'Pulse SaaS Analytics Suite',
        challenge: 'Complex analytics data was overwhelming users, causing churn during trial onboarding.',
        solution: 'Created an intuitive glassmorphic dashboard UI with modular widgets and dark theme, prioritizing key metrics visibility.',
        results: ['45% Reduction in User Churn Rate', 'Sub-second (0.8s) widget rendering', 'Best B2B Dashboard UI Design 2024'],
        stack: ['JavaScript DOM API', 'CSS Glassmorphism', 'Responsive Layouts'],
      },
      ar: {
        cat: 'تطبيق ويب SaaS',
        title: 'لوحة تحليلات Pulse SaaS',
        challenge: 'كانت بيانات التحليلات المعقدة تُرهق المستخدمين وتتسبب في تركهم للخدمة خلال فترة التجربة.',
        solution: 'أنشأتُ واجهة لوحة تحكم زجاجية بأدوات قابلة للتعديل ووضع داكن، مع إبراز المقاييس الأهم.',
        results: ['انخفاض معدل الترك بنسبة 45%', 'تحميل الأدوات في أقل من 0.8 ثانية', 'أفضل تصميم لوحة B2B لعام 2024'],
        stack: ['JavaScript DOM API', 'CSS Glassmorphism', 'Responsive Layouts'],
      },
    },
    3: {
      en: {
        cat: 'Agency & Branding',
        title: 'Neon Creative Agency Web Experience',
        challenge: 'The agency needed a show-stopping digital presence to attract high-ticket international clients.',
        solution: 'Designed a dark futuristic web portal with custom scroll micro-animations, vibrant gradient typography, and seamless video embeds.',
        results: ['3x Increase in High-Ticket Inquiries', 'Featured on WebDesignInspiration 2024', '100% Mobile Accessibility Compliance'],
        stack: ['HTML5 / CSS Animations', 'JavaScript Micro-animations', 'SEO Strategy'],
      },
      ar: {
        cat: 'وكالة وهوية بصرية',
        title: 'تجربة ويب وكالة Neon الإبداعية',
        challenge: 'احتاجت الوكالة إلى حضور رقمي لافت لاستقطاب العملاء الدوليين ذوي الميزانيات العالية.',
        solution: 'صمّمتُ بوابة ويب مستقبلية داكنة مع حركات تمرير مخصصة، طباعة متدرجة نابضة، وتضمين سلس للفيديو.',
        results: ['3x زيادة في الاستفسارات رفيعة المستوى', 'مميّز على WebDesignInspiration 2024', 'امتثال 100% لمتطلبات إمكانية الوصول عبر الجوّال'],
        stack: ['HTML5 / CSS Animations', 'JavaScript Micro-animations', 'SEO Strategy'],
      },
    },
  };

  document.querySelectorAll('.view-case-study').forEach(btn => {
    btn.addEventListener('click', () => {
      const id   = btn.getAttribute('data-project');
      const data = caseData[id][currentLang] || caseData[id]['en'];
      const isAr = currentLang === 'ar';

      modalBody.innerHTML = `
        <div dir="${isAr ? 'rtl' : 'ltr'}" style="font-family: ${isAr ? "'Tajawal', sans-serif" : "'Plus Jakarta Sans', sans-serif"}">
          <div style="font-size:.85rem;font-weight:600;color:var(--accent-secondary);text-transform:uppercase;margin-bottom:.5rem">${data.cat}</div>
          <h2 style="font-family:'Outfit',sans-serif;font-size:2rem;font-weight:700;margin-bottom:1.25rem">${data.title}</h2>
          <img src="assets/images/project${id}.jpg" alt="${data.title}" style="width:100%;border-radius:12px;margin-bottom:1.5rem;max-height:320px;object-fit:cover">
          <h4 style="color:var(--accent-primary);margin-bottom:.5rem">${isAr ? 'التحدي:' : 'The Challenge:'}</h4>
          <p style="color:var(--text-secondary);margin-bottom:1.25rem">${data.challenge}</p>
          <h4 style="color:var(--accent-primary);margin-bottom:.5rem">${isAr ? 'الحل:' : 'The Solution:'}</h4>
          <p style="color:var(--text-secondary);margin-bottom:1.25rem">${data.solution}</p>
          <h4 style="color:var(--accent-emerald);margin-bottom:.5rem">${isAr ? 'النتائج والأثر:' : 'Key Results & Impact:'}</h4>
          <ul style="margin-bottom:1.5rem;padding-${isAr ? 'right' : 'left'}:1.25rem;color:var(--text-primary)">
            ${data.results.map(r => `<li style="margin-bottom:.35rem">✓ ${r}</li>`).join('')}
          </ul>
          <div style="display:flex;gap:.5rem;flex-wrap:wrap">
            ${data.stack.map(s => `<span class="tech-badge">${s}</span>`).join('')}
          </div>
        </div>`;
      modal.classList.add('active');
    });
  });

  modalClose.addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('active'); });

  // -------------------------------------------------------------------------
  // 06. Contact Form Handling
  // -------------------------------------------------------------------------
  document.getElementById('contact-form').addEventListener('submit', e => {
    e.preventDefault();
    const name    = document.getElementById('form-name').value.trim();
    const email   = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();
    if (!name || !email || !message) return;

    const submitBtn  = document.getElementById('submit-btn');
    const span       = submitBtn.querySelector('span');
    const isAr       = currentLang === 'ar';

    span.textContent       = isAr ? 'تم الإرسال بنجاح! ✓' : 'Sent Successfully! ✓';
    submitBtn.style.background = 'var(--accent-emerald)';
    document.getElementById('contact-form').reset();

    setTimeout(() => {
      span.textContent       = isAr ? 'إرسال الرسالة' : 'Send Message';
      span.setAttribute('data-en', 'Send Message');
      span.setAttribute('data-ar', 'إرسال الرسالة');
      submitBtn.style.background = '';
    }, 4000);
  });

  // -------------------------------------------------------------------------
  // 07. Animated Stats Counter
  // -------------------------------------------------------------------------
  let statsAnimated = false;

  function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(el => {
      const target = parseInt(el.getAttribute('data-target'));
      const suffix = el.textContent.includes('%') ? '%' : '+';
      let count    = 0;
      const speed  = Math.ceil(target / 40);
      const timer  = setInterval(() => {
        count += speed;
        if (count >= target) { el.textContent = target + suffix; clearInterval(timer); }
        else el.textContent = count + suffix;
      }, 40);
    });
  }

});
