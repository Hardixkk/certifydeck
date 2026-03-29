'use strict';

// ── Global State ─────────────────────────────────────────────
let allCourses      = [];
let filteredCourses = [];
let selectedAmount  = 49;

const CAT_EMOJI = {
  'IT':            '💻',
  'Data & AI':     '🤖',
  'Cybersecurity': '🔐',
  'Cloud':         '☁️',
  'Business':      '📈',
  'Programming':   '⌨️',
  'Govt Skills':   '🏛️',
  'Design':        '🎨',
};

const LEVEL_CLASS = {
  'Beginner':     'level-beginner',
  'Intermediate': 'level-intermediate',
  'Advanced':     'level-advanced',
};

// ════════════════════════════════════════════════════════════
// LOAD COURSES FROM API
// ════════════════════════════════════════════════════════════
async function loadAllCourses() {
  try {
    // Try API first (when npm start is running)
    const response = await fetch('/api/courses');
    const data = await response.json();
    allCourses = data.courses;
    filteredCourses = allCourses;
  } catch (err) {
    // Fallback — read courses.json directly (for Live Server)
    try {
      const response = await fetch('courses.json');
      allCourses = await response.json();
      filteredCourses = allCourses;
    } catch (err2) {
      allCourses = [];
      filteredCourses = [];
    }
  }
}

// ════════════════════════════════════════════════════════════
// PAGE ROUTING
// ════════════════════════════════════════════════════════════
function showPage(page) {
  document.getElementById('page-home').classList.toggle('hidden', page !== 'home');
  document.getElementById('page-courses').classList.toggle('hidden', page !== 'courses');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (page === 'courses') {
    renderCoursesPage();
  }
}

function setActive(el) {
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('navLinks').classList.remove('open');
}

// ════════════════════════════════════════════════════════════
// BUILD A SINGLE COURSE CARD
// ════════════════════════════════════════════════════════════
function buildCourseCard(course) {
  const card = document.createElement('div');
  card.className = 'course-card';

  const emoji      = CAT_EMOJI[course.category] || '📚';
  const levelClass = LEVEL_CLASS[course.level]   || 'level-beginner';

  card.innerHTML = `
    <div class="card-header">
      <span class="card-platform-badge">${course.platform}</span>
      ${course.trending ? '<span class="card-trending">🔥 Trending</span>' : ''}
    </div>
    <div class="card-body">
      <div class="card-category">${emoji} ${course.category}</div>
      <h3 class="card-title">${course.title}</h3>
      <p class="card-desc">${course.description}</p>
      <div class="card-meta">
        <span class="${levelClass}">${course.level}</span>
        <span class="card-meta-item">⏱ ${course.duration}</span>
      </div>
    </div>
    <div class="card-footer">
      <span class="card-badge-pill">
        ${course.badge ? '🏅 Certificate' : '📄 Completion'}
      </span>
      <a href="${course.link}" target="_blank" rel="noopener noreferrer" class="btn-apply">
        Apply Now
      </a>
    </div>
  `;
  return card;
}

// ════════════════════════════════════════════════════════════
// HOMEPAGE — TRENDING SECTION
// ════════════════════════════════════════════════════════════
function renderTrending() {
  const grid = document.getElementById('trendingGrid');
  if (!grid) return;

  grid.innerHTML = '';
  const trending = allCourses.filter(c => c.trending).slice(0, 8);

  if (trending.length === 0) {
    grid.innerHTML = '<p style="color:#64748b">No trending courses found.</p>';
    return;
  }

  trending.forEach(course => {
    grid.appendChild(buildCourseCard(course));
  });
}

// ════════════════════════════════════════════════════════════
// HOMEPAGE — CATEGORY COUNTERS
// ════════════════════════════════════════════════════════════
function populateCategoryCounters() {
  document.querySelectorAll('.cat-count[data-cat]').forEach(el => {
    const cat   = el.dataset.cat;
    const count = allCourses.filter(c => c.category === cat).length;
    el.textContent = count + ' courses';
  });
}

// ════════════════════════════════════════════════════════════
// HOMEPAGE — PLATFORM COUNTERS
// ════════════════════════════════════════════════════════════
function populatePlatformCounters() {
  document.querySelectorAll('.platform-count[data-platform]').forEach(el => {
    const kw    = el.dataset.platform.toLowerCase();
    const count = allCourses.filter(c => c.platform.toLowerCase().includes(kw)).length;
    el.textContent = count + ' courses';
  });
}

// ════════════════════════════════════════════════════════════
// HOMEPAGE — ANIMATED STAT COUNTERS
// ════════════════════════════════════════════════════════════
function animateStats() {
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    let current  = 0;
    const step   = Math.ceil(target / 40);
    const timer  = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current + (el.dataset.target === '100' ? '%' : '+');
      if (current >= target) clearInterval(timer);
    }, 30);
  });
}

// ════════════════════════════════════════════════════════════
// COURSES PAGE — FULL RENDER
// ════════════════════════════════════════════════════════════
function renderCoursesPage() {
  buildCategoryFilters();
  renderCoursesGrid(allCourses);
  updateCount(allCourses.length);
}

function buildCategoryFilters() {
  const container = document.getElementById('categoryFilters');
  if (!container || container.dataset.built) return;
  container.dataset.built = 'true';

  // Update "All" count
  const allCount = container.querySelector('.filter-count');
  if (allCount) allCount.textContent = allCourses.length;

  const categories = [...new Set(allCourses.map(c => c.category))].sort();
  categories.forEach(cat => {
    const count = allCourses.filter(c => c.category === cat).length;
    const label = document.createElement('label');
    label.className = 'filter-option';
    label.innerHTML = `
      <input type="radio" name="catFilter" value="${cat}" onchange="applyFilters()"/>
      <span>${CAT_EMOJI[cat] || '📚'} ${cat}</span>
      <span class="filter-count">${count}</span>
    `;
    container.appendChild(label);
  });
}

function renderCoursesGrid(courses) {
  const grid      = document.getElementById('coursesGrid');
  const noResults = document.getElementById('noResults');
  if (!grid) return;

  grid.innerHTML = '';

  if (courses.length === 0) {
    noResults.classList.remove('hidden');
    return;
  }
  noResults.classList.add('hidden');

  courses.forEach((course, i) => {
    const card = buildCourseCard(course);
    card.style.animationDelay = Math.min(i, 12) * 0.05 + 's';
    grid.appendChild(card);
  });
}

function updateCount(n) {
  const el = document.getElementById('resultsCount');
  if (el) el.textContent = 'Showing ' + n + ' courses';
}

// ════════════════════════════════════════════════════════════
// FILTERING & SEARCH
// ════════════════════════════════════════════════════════════
function applyFilters() {
  const catEl    = document.querySelector('input[name="catFilter"]:checked');
  const category = catEl ? catEl.value : 'All';

  const levels = [...document.querySelectorAll('.filter-options input[type="checkbox"]')]
    .filter(i => i.checked && ['Beginner','Intermediate','Advanced'].includes(i.value))
    .map(i => i.value);

  const onlyBadge    = document.getElementById('filterBadge')?.checked;
  const onlyTrending = document.getElementById('filterTrending')?.checked;
  const search       = (document.getElementById('searchInput')?.value || '').trim().toLowerCase();
  const sort         = document.getElementById('sortSelect')?.value || 'default';

  let results = [...allCourses];

  if (category !== 'All')  results = results.filter(c => c.category === category);
  if (levels.length)        results = results.filter(c => levels.includes(c.level));
  if (onlyBadge)            results = results.filter(c => c.badge);
  if (onlyTrending)         results = results.filter(c => c.trending);
  if (search) {
    results = results.filter(c =>
      c.title.toLowerCase().includes(search)       ||
      c.platform.toLowerCase().includes(search)    ||
      c.description.toLowerCase().includes(search) ||
      c.category.toLowerCase().includes(search)
    );
  }

  if (sort === 'trending') results.sort((a,b) => (b.trending?1:0)-(a.trending?1:0));
  else if (sort === 'az')  results.sort((a,b) => a.title.localeCompare(b.title));
  else if (sort === 'level') {
    const o = {Beginner:0,Intermediate:1,Advanced:2};
    results.sort((a,b) => (o[a.level]||0)-(o[b.level]||0));
  }

  renderCoursesGrid(results);
  updateCount(results.length);
}

let searchTimer;
function handleSearch() {
  const val      = document.getElementById('searchInput').value;
  const clearBtn = document.getElementById('searchClear');
  if (clearBtn) clearBtn.style.display = val ? 'block' : 'none';
  clearTimeout(searchTimer);
  searchTimer = setTimeout(applyFilters, 250);
}

function clearSearch() {
  const input    = document.getElementById('searchInput');
  const clearBtn = document.getElementById('searchClear');
  if (input)    input.value = '';
  if (clearBtn) clearBtn.style.display = 'none';
  applyFilters();
}

function clearFilters() {
  const allRadio = document.querySelector('input[name="catFilter"][value="All"]');
  if (allRadio) allRadio.checked = true;
  document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(cb => cb.checked = false);
  const sortSel = document.getElementById('sortSelect');
  if (sortSel) sortSel.value = 'default';
  clearSearch();
}

// ════════════════════════════════════════════════════════════
// NAVIGATION HELPERS
// ════════════════════════════════════════════════════════════
function filterAndGoTo(category) {
  showPage('courses');
  setTimeout(() => {
    const radio = document.querySelector(`input[name="catFilter"][value="${category}"]`);
    if (radio) { radio.checked = true; applyFilters(); }
  }, 150);
}

function filterByPlatform(keyword) {
  showPage('courses');
  setTimeout(() => {
    const input = document.getElementById('searchInput');
    if (input) { input.value = keyword; handleSearch(); }
  }, 150);
}

function scrollTo(selector) {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ════════════════════════════════════════════════════════════
// DONATE
// ════════════════════════════════════════════════════════════
function selectAmount(btn, amount) {
  selectedAmount = amount;
  document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  const donateBtn = document.getElementById('donateBtn');
  if (donateBtn) donateBtn.textContent = 'Donate ₹' + amount + ' →';
}

function handleDonate() {
  showToast('💙 Thank you! UPI: certifydeck@upi  |  Amount: ₹' + selectedAmount);
}

function copyUPI() {
  navigator.clipboard.writeText('certifydeck@upi')
    .then(() => showToast('✅ UPI ID copied!'))
    .catch(() => showToast('UPI ID: certifydeck@upi'));
}

// ════════════════════════════════════════════════════════════
// NAVBAR
// ════════════════════════════════════════════════════════════
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}

function toggleFilters() {
  document.getElementById('filtersPanel').classList.toggle('open');
}

window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
});

// ════════════════════════════════════════════════════════════
// TOAST
// ════════════════════════════════════════════════════════════
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}

// ════════════════════════════════════════════════════════════
// QR PATTERN
// ════════════════════════════════════════════════════════════
function generateQRPattern() {
  const grid = document.getElementById('qrGrid');
  if (!grid) return;
  grid.innerHTML = '';
  for (let i = 0; i < 100; i++) {
    const cell = document.createElement('div');
    cell.className = 'qr-cell';
    cell.style.background = Math.random() > 0.45 ? '#0f172a' : 'transparent';
    grid.appendChild(cell);
  }
}

// ════════════════════════════════════════════════════════════
// SCROLL REVEAL
// ════════════════════════════════════════════════════════════
function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity    = '1';
        entry.target.style.transform  = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.cat-card, .platform-card, .step-card').forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

// ════════════════════════════════════════════════════════════
// INIT — runs when page loads
// ════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', async () => {
  await loadAllCourses();       // fetch all 50 courses first
  renderTrending();             // show trending on homepage
  populateCategoryCounters();   // update category counts
  populatePlatformCounters();   // update platform counts
  animateStats();               // animate hero numbers
  generateQRPattern();          // draw QR mock
  initScrollReveal();           // scroll animations

  // Mark popular donate button
  const popular = document.querySelector('.amount-popular');
  if (popular) popular.classList.add('selected');
});