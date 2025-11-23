// MediaVPN Dashboard Controller
// v3.0 - Fix Mobile Copy & UUID Logic

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // 1. Setup Tombol
    setupEventListeners();
    
    // 2. Load Data Awal (Visual Saja)
    loadDummyData();
    
    console.log("✅ System Ready: Mobile Optimized");
}

function setupEventListeners() {
    // Tombol Generate
    const generateBtn = document.getElementById('generateLink');
    if(generateBtn) generateBtn.addEventListener('click', generateConfig);

    // Tombol Copy (Menggunakan Modern API untuk Android/iOS)
    const copyBtn = document.getElementById('copySubscriptionLink');
    if(copyBtn) copyBtn.addEventListener('click', copyToClipboard);

    // Tombol Refresh
    const refreshBtn = document.getElementById('refreshProxies');
    if(refreshBtn) refreshBtn.addEventListener('click', function() {
        showLoading(true);
        setTimeout(() => {
            loadDummyData(); // Refresh tabel
            showLoading(false);
            showToast('Nodes Refreshed Successfully', 'success');
        }, 800);
    });

    // Navigasi Bottom Bar (Mobile) & Desktop
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Reset semua class active
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Set active ke yang diklik
            link.classList.add('active');
            
            // Tampilkan Section yang sesuai
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if(targetSection) {
                targetSection.classList.add('active');
                window.scrollTo(0,0); // Scroll ke atas saat pindah menu
            }
        });
    });
}

// --- LOGIKA GENERATOR VPN (INTI) ---

function generateConfig() {
    const hostInput = document.getElementById('serverHost');
    const formatSelect = document.getElementById('formatSelect');
    
    // Validasi Input
    if(!hostInput.value) {
        showToast("Harap isi Domain/Bug Host!", "error");
        return;
    }

    showLoading(true);

    // Simulasi delay agar terlihat "mikir"
    setTimeout(() => {
        const domain = hostInput.value;
        const format = formatSelect.value;
        const port = 443;
        const name = "MediaVPN-" + Math.floor(Math.random() * 1000);
        
        // PENTING: Ganti UUID ini dengan UUID ASLI Server Vless Anda jika ingin connect!
        // Jika dibiarkan randomUUID(), config hanya valid secara format tapi ditolak server.
        // Contoh UUID asli: const uuid = "550e8400-e29b-41d4-a716-446655440000";
        const uuid = self.crypto.randomUUID(); 

        let configResult = "";

        try {
            if (format === 'vmess') {
                configResult = createVmess(domain, port, uuid, name);
            } else if (format === 'vless') {
                configResult = createVless(domain, port, uuid, name);
            } else if (format === 'trojan') {
                configResult = createTrojan(domain, port, uuid, name);
            } else if (format === 'clash') {
                configResult = createClash(domain, port, uuid, name);
            }

            // Tampilkan Hasil
            const resultArea = document.getElementById('generatedLink');
            const inputResult = document.getElementById('subscriptionLink');
            
            inputResult.value = configResult;
            resultArea.style.display = 'block';
            
            // Auto scroll ke hasil di HP
            resultArea.scrollIntoView({behavior: "smooth"});
            
            showToast(`Sukses: ${format.toUpperCase()} Created`, 'success');

        } catch (e) {
            console.error(e);
            showToast("Gagal membuat config", "error");
        } finally {
            showLoading(false);
        }
    }, 600);
}

// --- FORMATTERS (PROTOCOL STANDARD) ---

function createVmess(host, port, uuid, name) {
    const vmessObj = {
        v: "2", ps: name, add: host, port: port, id: uuid,
        aid: "0", scy: "auto", net: "ws", type: "none",
        host: host, path: "/vmess", tls: "tls", sni: host
    };
    return "vmess://" + btoa(JSON.stringify(vmessObj));
}

function createVless(host, port, uuid, name) {
    return `vless://${uuid}@${host}:${port}?encryption=none&security=tls&sni=${host}&type=ws&host=${host}&path=%2Fvless#${encodeURIComponent(name)}`;
}

function createTrojan(host, port, uuid, name) {
    return `trojan://${uuid}@${host}:${port}?security=tls&sni=${host}&type=ws&host=${host}&path=%2Ftrojan#${encodeURIComponent(name)}`;
}

function createClash(host, port, uuid, name) {
    return `proxies:
  - name: ${name}
    type: vmess
    server: ${host}
    port: ${port}
    uuid: ${uuid}
    alterId: 0
    cipher: auto
    tls: true
    servername: ${host}
    network: ws
    ws-opts:
      path: /vmess
      headers:
        Host: ${host}`;
}

// --- FITUR UTAMA: COPY PASTE (FIX ANDROID) ---

async function copyToClipboard() {
    const copyText = document.getElementById("subscriptionLink");
    
    // Cara Modern (Bekerja di Android 10+ dan iOS)
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(copyText.value);
            showToast("Config disalin ke clipboard!", "success");
            return;
        } catch (err) {
            console.error('Async copy failed', err);
        }
    } 
    
    // Fallback Cara Lama (Jika cara modern gagal)
    copyText.select();
    copyText.setSelectionRange(0, 99999); // Untuk Mobile
    try {
        document.execCommand('copy');
        showToast("Config disalin!", "success");
    } catch (err) {
        showToast("Gagal menyalin otomatis", "error");
    }
}

// --- UI HELPERS ---

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if(overlay) overlay.style.display = show ? 'flex' : 'none';
}

function showToast(message, type) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    
    // Style toast dinamis
    toast.style.cssText = `
        background: ${type === 'success' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)'};
        color: white;
        padding: 12px 20px;
        margin-top: 10px;
        border-radius: 12px;
        font-weight: 500;
        font-size: 0.9rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        backdrop-filter: blur(5px);
        animation: slideIn 0.3s ease;
    `;
    
    toast.innerText = message;
    container.appendChild(toast);
    
    // Hapus toast setelah 3 detik
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- DUMMY DATA (VISUALISASI) ---

function loadDummyData() {
    // Update Angka Dashboard
    const stats = { total: 15, active: 12, country: 5, user: 840 };
    animateCount('totalProxies', stats.total);
    animateCount('activeProxies', stats.active);
    animateCount('countriesCount', stats.country);
    animateCount('connectedUsers', stats.user);
    
    // Update Tabel
    const tbody = document.getElementById('proxiesTableBody');
    if(tbody) {
        tbody.innerHTML = '';
        const dummyNodes = [
            {c: 'ID', ip: '103.152.11.xx', p: 443, type: 'vmess', s: 'online', lat: 24},
            {c: 'SG', ip: '167.71.22.xx', p: 443, type: 'vless', s: 'online', lat: 15},
            {c: 'US', ip: '104.21.33.xx', p: 80, type: 'trojan', s: 'online', lat: 120},
        ];
        
        dummyNodes.forEach(d => {
            // Menggunakan data-label agar Responsif di HP (Card View)
            tbody.innerHTML += `
                <tr>
                    <td data-label="Country"><span class="flag" style="background:rgba(255,255,255,0.1); padding:2px 8px; border-radius:4px;">${d.c}</span></td>
                    <td data-label="Host/IP" style="font-family:monospace; color:#00f2ff;">${d.ip}</td>
                    <td data-label="Port">${d.p}</td>
                    <td data-label="Protocol"><span style="color:#00ff9d; font-size:0.8rem; border:1px solid #00ff9d; padding:2px 6px; border-radius:4px;">${d.type.toUpperCase()}</span></td>
                    <td data-label="Status"><span style="color:#00ff9d;">● ${d.s}</span></td>
                    <td data-label="Ping">${d.lat}ms</td>
                    <td data-label="Action">
                        <button class="btn btn-secondary" style="padding:5px 10px;" onclick="showToast('Detail Node Copied', 'success')">
                            <i class="fas fa-copy"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    }
    
    // Inisialisasi Grafik (Jika Chart.js ada)
    if(typeof Chart !== 'undefined') initCharts();
}

function animateCount(id, target) {
    const el = document.getElementById(id);
    if(el) el.innerText = target; // Versi simpel
}

function initCharts() {
    const ctx1 = document.getElementById('countryChart');
    const ctx2 = document.getElementById('statusChart');
    
    if(ctx1 && !window.chart1) {
        window.chart1 = new Chart(ctx1, {
            type: 'doughnut',
            data: {
                labels: ['ID', 'SG', 'US'],
                datasets: [{ data: [50, 30, 20], backgroundColor: ['#00f2ff', '#7000ff', '#00ff9d'], borderWidth:0 }]
            },
            options: { responsive: true, plugins: { legend: { display: false } } }
        });
    }
    
    if(ctx2 && !window.chart2) {
        window.chart2 = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: ['Online', 'Offline'],
                datasets: [{ label:'Nodes', data: [12, 3], backgroundColor: ['#00ff9d', '#ff0055'], borderRadius: 5 }]
            },
            options: { responsive: true, scales: { y: { display: false }, x: { grid: { display: false } } }, plugins: { legend: { display: false } } }
        });
    }
}
