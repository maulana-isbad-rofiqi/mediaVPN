# 🚀 Panduan Deployment MediaVPN

## 📋 Ringkasan Aplikasi

Aplikasi MediaVPN terdiri dari dua bagian:
1. **Frontend Dashboard** - Interface web untuk manajemen proxy
2. **Cloudflare Worker Backend** - API serverless untuk proxy management

---

## 🎯 Opsi Deployment Frontend (Dashboard)

### Opsi 1: Netlify (Paling Mudah) ⚡

1. **Buka [netlify.com](https://netlify.com)**
2. **Login/Register dengan GitHub**
3. **Drag & Drop Deployment:**
   - Zip folder utama (`index.html`, `styles.css`, `script.js`)
   - Atau connect dengan GitHub repository
4. **Instant deployment** dengan URL otomatis

**Kelebihan:**
- ✅ Deploy instan
- ✅ HTTPS gratis
- ✅ Custom domain tersedia
- ✅ Gratis untuk proyek personal

---

### Opsi 2: Vercel (Recommended) 🚀

1. **Buka [vercel.com](https://vercel.com)**
2. **Login dengan GitHub**
3. **Import project dari GitHub**
4. **Deploy otomatis**

**Kelebihan:**
- ✅ Performance tinggi
- ✅ Global CDN
- ✅ Preview deployments
- ✅ Gratis untuk personal

---

### Opsi 3: GitHub Pages (Gratis Selamanya) 📦

1. **Upload code ke GitHub repository**
2. **Go to repository Settings > Pages**
3. **Select source: GitHub Actions**
4. **Create action workflow:**

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

---

## ☁️ Opsi Deployment Backend (Cloudflare Worker)

### Opsi 1: Instant Deployment (Paling Mudah) 🎯

**Gunakan tombol deploy instan:**

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/FoolVPN-ID/Nautica)

**Langkah-langkah:**
1. **Klik tombol di atas**
2. **Login ke Cloudflare**
3. **Set nama worker Anda**
4. **Deploy otomatis**

---

### Opsi 2: Manual Deployment 🔧

1. **Buka [dash.cloudflare.com](https://dash.cloudflare.com)**
2. **Login ke akun Cloudflare**
3. **Pilih "Workers & Pages"**
4. **Klik "Create application"**
5. **Pilih "Create Worker"**
6. **Copy kode dari `Nautica/_worker.js`**
7. **Paste ke editor Cloudflare**
8. **Klik "Save and Deploy"**

---

### Opsi 3: Local Deployment (CLI) 💻

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login ke Cloudflare
wrangler login

# Deploy
cd Nautica
wrangler deploy
```

---

## 🔧 Konfigurasi Environment Variables

Untuk Cloudflare Worker, set variabel environment:

1. **Di dashboard Cloudflare Worker**
2. **Tab "Variables"**
3. **Tambahkan:**

```
PROXY_BANK_URL = "https://raw.githubusercontent.com/dickymuliafiqri/Nautica/refs/heads/main/proxyList.txt"
REVERSE_PROXY_TARGET = "https://example.com"
rootDomain = "yourdomain.com"
serviceName = "nautica"
```

---

## 🌐 Custom Domain Setup

### Frontend (Netlify/Vercel)
1. **Beli domain** dari registrar
2. **Di platform hosting** (Netlify/Vercel)
3. **Tambahkan custom domain**
4. **Update DNS records**

### Backend (Cloudflare Worker)
1. **Sudah include dalam setup Cloudflare**
2. **URL otomatis:** `https://your-worker-name.your-subdomain.workers.dev`
3. **Custom domain:** Setup di tab "Custom Domains"

---

## 📱 Konfigurasi Frontend ke Backend

Setelah deploy backend, update konfigurasi frontend:

1. **Buka `script.js`**
2. **Cari section server configuration**
3. **Update server URL:**

```javascript
const config = {
    server: 'https://your-worker-name.your-subdomain.workers.dev',
    port: 443,
    maxConnections: 1000
};
```

---

## ✅ Checklist Deployment

### Frontend:
- [ ] Deploy ke Netlify/Vercel
- [ ] Test aplikasi di browser
- [ ] Setup custom domain (opsional)

### Backend:
- [ ] Deploy Cloudflare Worker
- [ ] Test API endpoints
- [ ] Setup environment variables
- [ ] Test subscription generation

### Integration:
- [ ] Update frontend config
- [ ] Test full integration
- [ ] Deploy frontend updates

---

## 🆘 Troubleshooting

### Frontend Issues:
- **404 errors:** Pastikan file structure benar
- **CORS errors:** Backend harus allow CORS
- **Loading issues:** Check semua dependency loaded

### Backend Issues:
- **Worker not responding:** Check logs di Cloudflare
- **API errors:** Validate environment variables
- **Domain issues:** Check DNS dan subdomain setup

---

## 📞 Support

Jika ada masalah:
1. **Check logs** di platform hosting
2. **Test API** dengan Postman/curl
3. **Validate configuration**
4. **Kontak support** platform yang digunakan

---

**🎉 Selamat! Aplikasi MediaVPN Anda sudah siap digunakan!**