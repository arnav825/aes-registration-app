# 🏫 AES Inter-School Competition Registration App

A mobile-friendly React web app for students across AES school branches to register for inter-school competitions.

---

## 🚀 Live Demo Setup

### 1. Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/aes-registration-app.git
cd aes-registration-app
npm install
```

### 2. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/) → Create a new project
2. Enable **Firestore Database** (start in test mode initially)
3. Go to **Project Settings → Your Apps → Add Web App**
4. Copy your config values

### 3. Environment Variables
```bash
cp .env.example .env
```
Fill in your Firebase values in `.env`:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### 4. Firestore Security Rules
In Firebase Console → Firestore → Rules, paste:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /registrations/{doc} {
      allow read, write: if true; // Tighten after testing
    }
  }
}
```

### 5. Run Locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

### 6. Build for Production
```bash
npm run build
```
Deploy the `dist/` folder to **GitHub Pages**, **Vercel**, or **Netlify**.

---

## 🌐 Deploy to GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Add homepage to package.json:
"homepage": "https://YOUR_USERNAME.github.io/aes-registration-app"

# Deploy
npm run deploy
```

---

## 📱 Features

### Student Flow
- ✅ Welcome screen with animated logo
- ✅ 7 competition categories with coloured cards
- ✅ Dynamic level selection per category
- ✅ Registration form with full validation
- ✅ Duplicate registration prevention
- ✅ Auto-generated Registration ID (e.g. `AES-MUS-001`)
- ✅ QR Code on success screen

### Admin Panel
- 🔐 Secure login (`admin` / `AES@975`)
- 📋 View all registrations
- 🔍 Search & filter (by name, event, branch, level)
- ✏️ Edit any registration
- 🗑️ Delete registrations
- 📊 Statistics dashboard (category & branch breakdown)
- ⬇️ Export to Excel (.xlsx)

---

## 🏆 Competition Categories

| Event | Levels |
|-------|--------|
| Debate | Senior (IX–XII), Junior (VI–VIII) |
| Music | L1 (III–V), L2 (VI–VIII), L3 (IX–X), L4 (XI–XII) |
| Recitation | L1 (I–III), L2 (IV–V), Special Telugu (III–V) |
| Drawing & Painting | L1 (I–III), L2 (IV–V), L3 (VI–VIII), L4 (IX–XII) |
| Essay Writing | L1 (VI–VIII), L2 (IX–XII), Special Telugu (VI–VIII) |
| Quiz | L1 (VI–VIII), L2 (IX–XII) |
| Dance | L1 (III–V), L2 (VI–VIII), L3 (IX–XII) |

---

## 🏫 School Branches
- AES Janakpuri
- AES RK Puram
- AES ITO
- AES Prasad Nagar
- AES Pushp Vihar

---

## 🛠 Tech Stack
- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Backend**: Firebase Firestore
- **QR Code**: qrcode.react
- **Export**: SheetJS (xlsx)

---

## 📁 Project Structure
```
src/
├── components/
│   └── Header.jsx
├── context/
│   └── RegistrationContext.jsx
├── data/
│   └── competitions.js       ← All categories, levels, branches
├── pages/
│   ├── Welcome.jsx
│   ├── CategorySelect.jsx
│   ├── LevelSelect.jsx
│   ├── RegistrationForm.jsx
│   ├── Success.jsx
│   ├── AdminLogin.jsx
│   └── AdminDashboard.jsx
├── firebase.js               ← All Firestore helpers
├── App.jsx
├── main.jsx
└── index.css
```

---

## 🔒 Admin Credentials
```
Username: admin
Password: AES@975
```
> Change these in `src/data/competitions.js` before going live.

---

## 📄 License
MIT — Free to use for AES Schools.
