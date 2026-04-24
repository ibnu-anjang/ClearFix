// State Management
let currentUser = null;

// DOM Elements
const screens = {
    login: document.getElementById('login-screen'),
    main: document.getElementById('main-screen'),
    modal: document.getElementById('form-modal'),
    userModal: document.getElementById('user-modal'),
    proofModal: document.getElementById('proof-modal')
};

const views = {
    staff: document.getElementById('staff-view'),
    admin: document.getElementById('admin-view'),
    frontliner: document.getElementById('frontliner-view')
};

const elements = {
    loginNama: document.getElementById('login-nama'),
    btnLogin: document.getElementById('btn-login'),
    loginError: document.getElementById('login-error'),
    displayNama: document.getElementById('display-nama'),
    btnLogout: document.getElementById('btn-logout'),
    feedContainer: document.getElementById('feed-container'),
    loading: document.getElementById('loading'),
    btnShowForm: document.getElementById('btn-show-form'),
    btnCancel: document.getElementById('btn-cancel'),
    reportForm: document.getElementById('report-form'),
    formMsg: document.getElementById('form-msg'),
    
    // Admin Elements
    userList: document.getElementById('user-list'),
    btnAddUser: document.getElementById('btn-add-user'),
    userForm: document.getElementById('user-form'),
    userModalCancel: document.getElementById('btn-user-cancel'),
    
    // Frontliner Elements
    taskList: document.getElementById('task-list'),
    proofForm: document.getElementById('proof-form'),
    proofCancel: document.getElementById('btn-proof-cancel'),
    proofMsg: document.getElementById('proof-msg')
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('clearfix_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        setupDashboard();
    }
});

// Layout Manager
function setupDashboard() {
    elements.displayNama.textContent = `${currentUser.nama} (${currentUser.role})`;
    showScreen('main');
    
    // Hide all views
    Object.values(views).forEach(v => v.classList.remove('active'));
    
    // Show correct view based on role
    if (currentUser.role === 'admin') {
        views.admin.classList.add('active');
        loadUsers();
    } else if (currentUser.role === 'frontliner') {
        views.frontliner.classList.add('active');
        loadTasks();
    } else {
        views.staff.classList.add('active');
        loadFeed();
    }
}

function showScreen(screen) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screen].classList.add('active');
}

// LOGIC: AUTH
elements.btnLogin.addEventListener('click', async () => {
    const nama = elements.loginNama.value.trim();
    if (!nama) return;

    elements.btnLogin.disabled = true;
    elements.loginError.textContent = "";

    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nama })
        });

        if (!response.ok) throw new Error("Nama tidak ditemukan di database");

        currentUser = await response.json();
        localStorage.setItem('clearfix_user', JSON.stringify(currentUser));
        setupDashboard();
    } catch (error) {
        elements.loginError.textContent = error.message;
    } finally {
        elements.btnLogin.disabled = false;
    }
});

elements.btnLogout.addEventListener('click', () => {
    localStorage.removeItem('clearfix_user');
    currentUser = null;
    showScreen('login');
});

// LOGIC: STAFF (REPORTS)
elements.btnShowForm.addEventListener('click', () => { screens.modal.classList.add('active'); });
elements.btnCancel.addEventListener('click', () => { screens.modal.classList.remove('active'); elements.reportForm.reset(); });

async function loadFeed() {
    elements.loading.style.display = 'block';
    elements.feedContainer.innerHTML = '';
    try {
        const res = await fetch(`${CONFIG.API_BASE_URL}/api/reports/`);
        const reports = await res.json();
        reports.forEach(r => renderCard(r, elements.feedContainer));
    } finally { elements.loading.style.display = 'none'; }
}

function renderCard(report, container, isTask = false) {
    const card = document.createElement('div');
    card.className = 'report-card';
    const time = new Date(report.created_at).toLocaleString();
    const image = report.foto_masalah_url ? `<img src="${report.foto_masalah_url}" class="img-preview" alt="Bukti">` : '';
    const proof = report.foto_bukti_url ? `<img src="${report.foto_bukti_url}" class="img-preview img-task" alt="Bukti Selesai">` : '';
    
    card.innerHTML = `
        <div class="report-header">
            <span class="tag tag-${report.tag_kategori.toLowerCase()}">${report.tag_kategori}</span>
            <span class="status">${report.status} • ${time}</span>
        </div>
        <h4>${report.judul}</h4>
        <p>${report.deskripsi || ''}</p>
        ${image} ${proof}
        ${isTask && report.status === 'Pending' ? `<button onclick="openProofModal('${report.id}')" class="btn-task">Tandai Selesai</button>` : ''}
    `;
    container.appendChild(card);
}

// LOGIC: ADMIN (USER CRUD)
async function loadUsers() {
    elements.userList.innerHTML = 'Memuat user...';
    try {
        const res = await fetch(`${CONFIG.API_BASE_URL}/api/users/`);
        const users = await res.json();
        elements.userList.innerHTML = '';
        users.forEach(u => {
            const div = document.createElement('div');
            div.className = 'user-card';
            div.innerHTML = `
                <div class="user-detail">
                    <h5>${u.nama}</h5>
                    <span>${u.role}</span>
                </div>
                <div class="user-actions">
                    <button onclick="editUser('${u.id}', '${u.nama}', '${u.role}', '${u.telegram_id || ''}')" class="btn-small btn-edit">Edit</button>
                    <button onclick="deleteUser('${u.id}')" class="btn-small btn-delete">Hapus</button>
                </div>
            `;
            elements.userList.appendChild(div);
        });
    } catch (e) { elements.userList.innerHTML = 'Error memuat user'; }
}

elements.btnAddUser.addEventListener('click', () => {
    document.getElementById('user-id').value = '';
    elements.userForm.reset();
    document.getElementById('user-modal-title').textContent = "Tambah User Baru";
    screens.userModal.classList.add('active');
});

elements.userModalCancel.addEventListener('click', () => screens.userModal.classList.remove('active'));

elements.userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('user-id').value;
    const data = {
        nama: document.getElementById('user-nama').value,
        role: document.getElementById('user-role').value,
        telegram_id: document.getElementById('user-telegram').value || null
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${CONFIG.API_BASE_URL}/api/users/${id}` : `${CONFIG.API_BASE_URL}/api/users/`;

    await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    
    screens.userModal.classList.remove('active');
    loadUsers();
});

window.editUser = (id, nama, role, telegram) => {
    document.getElementById('user-id').value = id;
    document.getElementById('user-nama').value = nama;
    document.getElementById('user-role').value = role;
    document.getElementById('user-telegram').value = telegram;
    document.getElementById('user-modal-title').textContent = "Edit User";
    screens.userModal.classList.add('active');
};

window.deleteUser = async (id) => {
    if (confirm('Hapus user ini?')) {
        await fetch(`${CONFIG.API_BASE_URL}/api/users/${id}`, { method: 'DELETE' });
        loadUsers();
    }
};

// LOGIC: FRONTLINER (TASKS)
async function loadTasks() {
    elements.taskList.innerHTML = '';
    const res = await fetch(`${CONFIG.API_BASE_URL}/api/reports/`);
    const reports = await res.json();
    reports.forEach(r => renderCard(r, elements.taskList, true));
}

window.openProofModal = (reportId) => {
    document.getElementById('proof-report-id').value = reportId;
    screens.proofModal.classList.add('active');
};

elements.proofCancel.addEventListener('click', () => screens.proofModal.classList.remove('active'));

elements.proofForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const reportId = document.getElementById('proof-report-id').value;
    const file = document.getElementById('proof-foto').files[0];
    
    elements.proofMsg.textContent = "Mengunggah bukti...";
    
    // 1. Upload Proof Image
    const fileName = `proof_${Date.now()}_${file.name}`;
    await fetch(`${CONFIG.SUPABASE_URL}/storage/v1/object/reports_bucket/${fileName}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`, 'apikey': CONFIG.SUPABASE_ANON_KEY, 'Content-Type': file.type },
        body: file
    });
    
    const proofUrl = `${CONFIG.SUPABASE_URL}/storage/v1/object/public/reports_bucket/${fileName}`;
    
    // 2. Patch Report
    await fetch(`${CONFIG.API_BASE_URL}/api/reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Selesai', foto_bukti_url: proofUrl })
    });
    
    screens.proofModal.classList.remove('active');
    loadTasks();
});

// STAFF CREATE REPORT (Existing logic adapted)
elements.reportForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('form-foto');
    let fotoUrl = null;

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const fileName = `problem_${Date.now()}_${file.name}`;
        await fetch(`${CONFIG.SUPABASE_URL}/storage/v1/object/reports_bucket/${fileName}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`, 'apikey': CONFIG.SUPABASE_ANON_KEY, 'Content-Type': file.type },
            body: file
        });
        fotoUrl = `${CONFIG.SUPABASE_URL}/storage/v1/object/public/reports_bucket/${fileName}`;
    }

    await fetch(`${CONFIG.API_BASE_URL}/api/reports/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: currentUser.id,
            judul: document.getElementById('form-judul').value,
            deskripsi: document.getElementById('form-deskripsi').value,
            tag_kategori: document.getElementById('form-kategori').value,
            foto_masalah_url: fotoUrl
        })
    });
    
    screens.modal.classList.remove('active');
    loadFeed();
});
