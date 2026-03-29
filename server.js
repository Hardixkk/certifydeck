const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// ── API: Get all courses ──────────────────────────────────────────────────────
app.get('/api/courses', (req, res) => {
  try {
    const courses = JSON.parse(fs.readFileSync(path.join(__dirname, 'courses.json'), 'utf8'));

    // Optional query filters
    const { category, search, featured, trending } = req.query;
    let filtered = courses;

    if (category && category !== 'All') {
      filtered = filtered.filter(c => c.category === category);
    }
    if (search) {
      const kw = search.toLowerCase();
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(kw) ||
        c.platform.toLowerCase().includes(kw) ||
        c.description.toLowerCase().includes(kw) ||
        c.category.toLowerCase().includes(kw)
      );
    }
    if (featured === 'true') {
      filtered = filtered.filter(c => c.featured);
    }
    if (trending === 'true') {
      filtered = filtered.filter(c => c.trending);
    }

    res.json({ success: true, count: filtered.length, courses: filtered });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load courses.' });
  }
});

// ── API: Get single course ────────────────────────────────────────────────────
app.get('/api/courses/:id', (req, res) => {
  try {
    const courses = JSON.parse(fs.readFileSync(path.join(__dirname, 'courses.json'), 'utf8'));
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });
    res.json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching course.' });
  }
});

// ── API: Get categories ───────────────────────────────────────────────────────
app.get('/api/categories', (req, res) => {
  try {
    const courses = JSON.parse(fs.readFileSync(path.join(__dirname, 'courses.json'), 'utf8'));
    const categories = [...new Set(courses.map(c => c.category))].sort();
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching categories.' });
  }
});

// ── API: Get stats ────────────────────────────────────────────────────────────
app.get('/api/stats', (req, res) => {
  try {
    const courses = JSON.parse(fs.readFileSync(path.join(__dirname, 'courses.json'), 'utf8'));
    const platforms = [...new Set(courses.map(c => c.platform))];
    const categories = [...new Set(courses.map(c => c.category))];
    res.json({
      success: true,
      stats: {
        totalCourses: courses.length,
        totalPlatforms: platforms.length,
        totalCategories: categories.length,
        freeCourses: courses.length
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching stats.' });
  }
});

// ── Fallback: serve index.html for any other route ────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚲 CertifyDeck is running!`);
  console.log(`   → Local:   http://localhost:${PORT}`);
  console.log(`   → Press Ctrl+C to stop\n`);
});
