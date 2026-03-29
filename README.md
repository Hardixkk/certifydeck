# 🎓 CertifyDeck — Learn. Certify. Grow.

> A modern, free platform for students to discover industry-recognized certifications from Cisco, Google, Microsoft, Deloitte Forage, Infosys, and 10+ more platforms.

---

## 📁 Project Structure

```
certifydeck/
├── public/
│   ├── index.html      ← Complete website (Home + Courses pages)
│   ├── style.css       ← All styles (responsive, dark theme)
│   └── script.js       ← Routing, filtering, API calls, animations
├── courses.json        ← 50 real free certification courses
├── server.js           ← Express backend with REST API
├── package.json        ← Node.js config
└── README.md           ← This file
```

---

## ⚡ Quick Start (VS Code)

### Step 1 — Open Project in VS Code
```bash
# Open the certifydeck folder in VS Code
code certifydeck
```

### Step 2 — Install Node.js (if not already)
Download from: https://nodejs.org (choose LTS version)

Verify installation:
```bash
node -v    # Should show v16+ or higher
npm -v     # Should show 8+
```

### Step 3 — Install Dependencies
Open Terminal in VS Code (`Ctrl + \``) and run:
```bash
npm install
```
This installs Express.js (the only dependency).

### Step 4 — Run the Server
```bash
npm start
```
You'll see:
```
🚲 CertifyDeck is running!
   → Local:   http://localhost:3000
```

### Step 5 — Open in Browser
Visit: **http://localhost:3000**

---

## 🌐 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/courses` | All courses |
| GET | `/api/courses?category=Cloud` | Filter by category |
| GET | `/api/courses?search=cisco` | Search courses |
| GET | `/api/courses?trending=true` | Trending courses only |
| GET | `/api/courses?featured=true` | Featured courses |
| GET | `/api/courses/:id` | Single course by ID |
| GET | `/api/categories` | All unique categories |
| GET | `/api/stats` | Platform statistics |

---

## 🎨 Features

- **Homepage** — Hero with animated stats, trending courses, categories, platform showcase, How It Works, Donate section
- **Courses Page** — Full searchable, filterable grid with 50+ courses
- **Search** — Real-time client-side search with debouncing
- **Filters** — By category, level, badge/cert, trending
- **Sort** — Recommended / Trending First / A→Z / Beginner First
- **Donate Section** — UPI ID, mock QR code, amount selector
- **Responsive** — Works on mobile, tablet, and desktop
- **Animations** — Floating cards, scroll reveal, counter animations, shimmer skeletons

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js + Express |
| Database | JSON file (courses.json) |
| Fonts | Syne (display) + DM Sans (body) via Google Fonts |

---

## 📚 Platforms Included (50 Courses)

| Platform | Courses |
|----------|---------|
| Cisco Networking Academy | 5 |
| Google (Digital Garage + Cloud + Coursera) | 8 |
| Microsoft Learn | 5 |
| Deloitte Forage | 3 |
| Infosys Springboard | 3 |
| Amazon AWS | 3 |
| IBM | 2 |
| Harvard edX | 1 |
| EC-Council CodeRed | 3 |
| Meta (Coursera) | 1 |
| TCS iON | 1 |
| NPTEL | 2 |
| JPMorgan Forage | 1 |
| Accenture Forage | 1 |
| Salesforce Forage | 1 |
| Others | 6 |

---

## 🧪 Optional: Auto-Restart on Changes

Install nodemon for development:
```bash
npm install -g nodemon
npm run dev
```

---

*Made with ❤️ for students. Keep learning, keep growing.*
