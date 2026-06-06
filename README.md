# NAA Web App - Professional Project

Aplikasi web responsif dengan desain modern menggunakan glassmorphism dan animasi sakura.

## 📁 Struktur Proyek

```
naa_web/
├── index.html              # Landing page (redirect)
├── input_nama.html         # Halaman input nama pengguna
├── welcome.html            # Halaman sambutan
├── beranda.html            # Halaman utama dengan music player
├── server.js               # Node.js HTTP server
├── style.css               # Stylesheet profesional (CSS variables)
├── js/
│   ├── shared.js           # Fungsi utilitas bersama
│   ├── input_nama.js       # Logic halaman input nama
│   ├── welcome.js          # Logic halaman sambutan
│   ├── beranda.js          # Logic halaman utama
│   └── navigation.js       # Controller navigasi bottom
├── assets/
│   └── cute_boneka.png     # Gambar bear mascot
└── bg_music/
    ├── intro.mp3           # Musik intro welcome page
    └── Nadhif-Basalamah-*.mp3  # Musik background beranda
```

## 🚀 Cara Menjalankan

### Prerequisites
- Node.js (untuk menjalankan server)
- Browser modern (Chrome, Firefox, Safari, Edge)

### Installation & Run

```bash
# Masuk ke direktori proyek
cd naa_web

# Jalankan server
node server.js

# Buka browser
# Desktop: http://localhost:8000
# Mobile (same network): http://<your-ip>:8000
```

## 🎨 Fitur Utama

### 1. **Responsive Design**
- Mobile-first approach
- Works on all devices (smartphones, tablets, desktop)
- Special notch simulation untuk desktop

### 2. **Modern Styling**
- CSS Variables untuk maintainability
- Glassmorphism effects
- Smooth animations dan transitions
- Gradient backgrounds

### 3. **Interactive Elements**
- Music player dengan volume control
- Sakura falling animation
- Dynamic greeting berdasarkan waktu
- Smooth page transitions

### 4. **Performance**
- No framework dependencies (vanilla JavaScript)
- Lightweight dan fast loading
- Optimized animations
- Lazy loading untuk resources

## 📝 File Descriptions

### HTML Files
- **index.html**: Meta redirect to input_nama.html (fastest method)
- **input_nama.html**: Form untuk input nama pengguna
- **welcome.html**: Sambutan dengan animasi fade-in
- **beranda.html**: Home page dengan music player dan bottom navigation

### JavaScript (js/)
- **shared.js**: Utility functions (sakura, audio fade, localStorage)
- **input_nama.js**: Form validation & submission
- **welcome.js**: Welcome page animations & auto-redirect
- **beranda.js**: Music player & time-based greeting
- **navigation.js**: Bottom nav SVG path generation & tab switching

### Styling
- **style.css**: Comprehensive stylesheet dengan CSS variables

### Server
- **server.js**: Production-ready HTTP server dengan security headers

## 🔐 Security Features

### Server Security
- Directory traversal prevention
- Security headers (X-Content-Type-Options, X-Frame-Options, etc.)
- Proper MIME type handling
- Error handling & logging

### Client-Side
- XSS prevention (HTML escaping)
- Input validation
- Safe localStorage usage
- Touch event handling

## 🎯 CSS Variables

```css
:root {
  /* Colors */
  --primary-color: #ff1493;
  --primary-light: #ff69b4;
  
  /* Spacing */
  --spacing-lg: 20px;
  --spacing-xl: 30px;
  
  /* Transitions */
  --transition-md: 0.3s;
  --transition-slow: 0.4s;
}
```

Update variables di `:root` untuk mengubah theme keseluruhan aplikasi.

## 🎬 Page Flow

```
index.html → input_nama.html → welcome.html → beranda.html
   (meta redirect)  (form)      (27 sec timer)  (main app)
```

## 📱 Responsive Breakpoints

- **Desktop** (≥481px): Notch simulation, full layout
- **Mobile** (<480px): Full screen, optimized touch controls

## 🔧 Customization

### Mengubah Warna
Edit CSS variables di `style.css`:
```css
--primary-color: #your-color;
--primary-light: #your-light-color;
```

### Mengubah Musik
Ganti file di folder `bg_music/` dan update path di HTML:
```html
<source src="bg_music/your-file.mp3" type="audio/mpeg">
```

### Mengubah Mascot
Ganti `assets/cute_boneka.png` dengan gambar pilihan Anda

## 📊 Performance Metrics

- First Contentful Paint (FCP): < 1s
- Largest Contentful Paint (LCP): < 2s
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 2s

## 🐛 Troubleshooting

### Audio tidak memutar
- Browser mungkin memblokir autoplay
- Klik tombol play untuk memulai musik
- Check browser autoplay policy

### Notch tidak terlihat di mobile
- Notch hanya muncul di desktop (≥481px)
- Mobile menggunakan full screen layout

### Port sudah digunakan
```bash
# Gunakan port berbeda
PORT=3000 node server.js
```

## 📚 Best Practices

### Code Organization
- Separated concerns (HTML/CSS/JS)
- Reusable utility functions
- Clear commenting & documentation

### Performance
- Minimal HTTP requests
- CSS variables untuk consistency
- Efficient animations
- Proper error handling

### Maintainability
- Clear file structure
- Self-documenting code
- Consistent naming conventions
- Version control ready

## 🚢 Deployment

### Heroku
```bash
git init
git add .
git commit -m "Initial commit"
heroku create your-app-name
git push heroku main
```

### Azure App Service
```bash
az webapp up --name your-app-name
```

### Firebase Hosting
```bash
firebase deploy
```

## 📄 License

Private Project - All rights reserved

## 👨‍💻 Author

Philow - 2026

---

**Last Updated**: 2026-06-05
**Version**: 2.0 (Professional Refactor)
