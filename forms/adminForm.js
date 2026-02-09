import { api } from '../api.js';

export const render = () => `
    <div class="form-card">
        <div class="card-header">
            <h3>Manajemen Akses Admin</h3>
            <div class="header-actions">
                <button id="btn-list-view" class="btn-secondary active">Daftar Whitelist</button>
                <button id="btn-add-view" class="btn-primary">Tambah Admin</button>
            </div>
        </div>

        <div id="admin-list-container" class="view-container">
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Nama</th>
                            <th>Telepon</th>
                            <th>Role</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="admin-table-body"></tbody>
                </table>
            </div>
        </div>

        <div id="admin-form-container" class="view-container" style="display: none;">
            <form id="admin-form">
                <div class="form-group">
                    <label>Email Admin (Wajib)</label>
                    <input type="email" class="form-control" name="email" placeholder="contoh@gmail.com" required>
                    <small style="color: var(--text-secondary); margin-top: 0.25rem; display: block;">
                        * Pastikan email ini adalah email Google yang digunakan untuk login.
                    </small>
                </div>
                
                <div class="row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label>Nama (Opsional)</label>
                        <input type="text" class="form-control" name="name" placeholder="Nama Lengkap">
                    </div>
                    <div class="form-group">
                        <label>Nomor Telepon (Opsional)</label>
                        <input type="text" class="form-control" name="phone_number" placeholder="0812...">
                    </div>
                </div>

                <div class="form-group">
                    <label>Role / Jabatan</label>
                    <select class="form-control" name="role">
                        <option value="ADMIN">ADMIN</option>
                        <option value="SUPER_ADMIN">SUPER ADMIN</option>
                        <option value="EDITOR">EDITOR</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Catatan (Opsional)</label>
                    <textarea class="form-control" name="notes" placeholder="Catatan tambahan..." style="min-height: 80px;"></textarea>
                </div>
                
                <div class="form-actions">
                    <button type="button" id="btn-cancel-form" class="btn-secondary">Batal</button>
                    <button type="submit" class="btn-primary" id="btn-submit-form">Tambah ke Whitelist</button>
                </div>
            </form>
        </div>
    </div>
`;

export const init = async () => {
    const listView = document.getElementById('admin-list-container');
    const formView = document.getElementById('admin-form-container');
    const tableBody = document.getElementById('admin-table-body');
    const form = document.getElementById('admin-form');
    const btnList = document.getElementById('btn-list-view');
    const btnAdd = document.getElementById('btn-add-view');
    const btnCancel = document.getElementById('btn-cancel-form');

    const loadData = async () => {
        try {
            const response = await api.getAdmins();
            const data = response.admins || [];

            if (data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Belum ada email admin terdaftar.</td></tr>';
                return;
            }

            tableBody.innerHTML = data.map(item => `
                <tr>
                    <td data-label="Email" class="semi-bold"><span class="cell-value">${item.email}</span></td>
                    <td data-label="Nama"><span class="cell-value">${item.name || '-'}</span></td>
                    <td data-label="Telepon"><span class="cell-value">${item.phone_number || '-'}</span></td>
                    <td data-label="Role"><span class="cell-value"><span class="badge ${item.role === 'SUPER_ADMIN' ? 'badge-primary' : ''}">${item.role}</span></span></td>
                    <td data-label="Aksi">
                        <div class="action-btns">
                            <button class="btn-icon delete-btn" data-id="${item.id}" title="Hapus dari Whitelist">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');

            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', () => deleteItem(btn.dataset.id));
            });
        } catch (error) {
            console.error('Failed to load admins:', error);
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center" style="color: var(--danger-color);">Gagal memuat data: ${error.message}</td></tr>`;
        }
    };

    const showView = (view) => {
        listView.style.display = view === 'list' ? 'block' : 'none';
        formView.style.display = view === 'form' ? 'block' : 'none';
        btnList.classList.toggle('active', view === 'list');
        btnAdd.classList.toggle('active', view === 'form');
    };

    const deleteItem = async (id) => {
        if (confirm('Yakin ingin menghapus email ini dari daftar whitelist? Admin ini tidak akan bisa login lagi.')) {
            try {
                await api.deleteAdmin(id);
                loadData();
            } catch (error) {
                alert('Gagal menghapus: ' + error.message);
            }
        }
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            await api.createAdmin(data);
            form.reset();
            showView('list');
            loadData();
        } catch (error) {
            alert('Gagal menambahkan: ' + error.message);
        }
    });

    btnList.addEventListener('click', () => showView('list'));
    btnAdd.addEventListener('click', () => {
        form.reset();
        showView('form');
    });
    btnCancel.addEventListener('click', () => showView('list'));

    loadData();
};
