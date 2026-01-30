import { api } from '../api.js';

export const render = () => `
    <div class="form-card">
        <div class="card-header">
            <h3>Manajemen Testimoni</h3>
            <div class="header-actions">
                <button id="btn-list-view" class="btn-secondary active">Daftar Testimoni</button>
                <button id="btn-add-view" class="btn-primary">Tambah Baru</button>
            </div>
        </div>

        <div id="item-list-container" class="view-container">
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Foto</th>
                            <th>Nama</th>
                            <th>Asal</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="item-table-body"></tbody>
                </table>
            </div>
        </div>

        <div id="item-form-container" class="view-container" style="display: none;">
            <form id="item-form">
                <input type="hidden" name="id" id="item-id">
                <div class="form-group">
                    <label>Nama Lengkap</label>
                    <input type="text" class="form-control" name="name" required>
                </div>
                
                <div class="form-group">
                    <label>Asal Kota / Lembaga</label>
                    <input type="text" class="form-control" name="origin" placeholder="Contoh: Jakarta" required>
                </div>

                <div class="form-group">
                    <label>Pekerjaan / Role (Optional)</label>
                    <input type="text" class="form-control" name="role" placeholder="Contoh: Wisatawan" value="Pengunjung">
                </div>

                <div class="form-group">
                    <label>Rating (1-5)</label>
                    <input type="number" class="form-control" name="stars" min="1" max="5" value="5" required>
                </div>
                
                <div class="form-group">
                    <label>Foto Profil</label>
                    <div class="image-upload-wrapper" style="border: 2px dashed var(--border-color); border-radius: 12px; padding: 1rem; text-align: center; cursor: pointer; position: relative;">
                        <input type="file" id="image-input" accept="image/*" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer;">
                        <input type="hidden" name="photo" id="image-path">
                        <div id="preview-container" style="display: none; margin-bottom: 0.5rem;">
                            <img id="preview-img" src="#" alt="Preview" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;">
                        </div>
                        <div id="placeholder">
                            <i class="fas fa-user-circle" style="font-size: 1.5rem; color: var(--primary-color);"></i>
                            <p>Pilih Foto Profil</p>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label>Isi Testimoni</label>
                    <textarea class="form-control" name="content" required></textarea>
                </div>

                <div class="form-group" style="display: flex; align-items: center; gap: 10px; margin: 1rem 0;">
                    <input type="checkbox" id="item-approved" name="approved" style="width: 20px; height: 20px; cursor: pointer;">
                    <label for="item-approved" style="margin-bottom: 0; cursor: pointer;">Status Approval (Tampil di Website)</label>
                </div>

                <div class="form-actions">
                    <button type="button" id="btn-cancel" class="btn-secondary">Batal</button>
                    <button type="submit" class="btn-primary" id="btn-submit">Simpan Testimoni</button>
                </div>
            </form>
        </div>
    </div>
`;

export const init = async () => {
    const listView = document.getElementById('item-list-container');
    const formView = document.getElementById('item-form-container');
    const tableBody = document.getElementById('item-table-body');
    const form = document.getElementById('item-form');
    const btnList = document.getElementById('btn-list-view');
    const btnAdd = document.getElementById('btn-add-view');
    const imageInput = document.getElementById('image-input');
    const imagePath = document.getElementById('image-path');
    const previewContainer = document.getElementById('preview-container');
    const previewImg = document.getElementById('preview-img');
    const placeholder = document.getElementById('placeholder');

    const loadData = async () => {
        try {
            const data = await api.getTestimonials();
            if (!data || data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="4" class="text-center">Belum ada testimoni.</td></tr>';
                return;
            }
            tableBody.innerHTML = data.map(item => {
                const imageUrl = item.photo.startsWith('http') ? item.photo : `../${item.photo}`;
                const statusBadge = item.approved
                    ? '<span style="background: #e6f7ed; color: #15803d; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem;">Disetujui</span>'
                    : '<span style="background: #fef2f2; color: #b91c1c; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem;">Tertunda</span>';
                return `
                <tr>
                    <td><img src="${imageUrl}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;"></td>
                    <td class="semi-bold">${item.name}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <div class="action-btns">
                            <button class="btn-icon edit-btn" data-id="${item.id}"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon delete-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
                `;
            }).join('');

            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', () => editItem(data.find(i => i.id === btn.dataset.id)));
            });
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', () => deleteItem(btn.dataset.id));
            });
        } catch (error) {
            console.error('Failed to load testimonials:', error);
            console.error('Error message:', error.message);
            tableBody.innerHTML = `<tr><td colspan="4" class="text-center" style="color: var(--danger-color);">Gagal memuat data: ${error.message}</td></tr>`;
        }
    };

    const editItem = (item) => {
        form.reset();
        document.getElementById('item-id').value = item.id;
        form.querySelector('[name="name"]').value = item.name;
        form.querySelector('[name="origin"]').value = item.origin;
        form.querySelector('[name="role"]').value = item.role;
        form.querySelector('[name="stars"]').value = item.stars;
        form.querySelector('[name="content"]').value = item.content;
        form.querySelector('[name="approved"]').checked = item.approved;
        imagePath.value = item.photo;
        previewImg.src = item.photo.startsWith('http') ? item.photo : `../${item.photo}`;
        previewContainer.style.display = 'block';
        placeholder.style.display = 'none';
        showView('form');
    };

    const deleteItem = async (id) => {
        if (confirm('Hapus testimoni ini?')) {
            await api.deleteTestimonial(id);
            loadData();
        }
    };

    imageInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const res = await api.uploadImage(file);
                imagePath.value = res.url;
                previewImg.src = res.url;
                previewContainer.style.display = 'block';
                placeholder.style.display = 'none';
            } catch (err) { alert('Upload gagal'); }
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());
        data.stars = parseInt(data.stars);
        data.approved = form.querySelector('[name="approved"]').checked;
        const id = data.id; delete data.id;
        if (id) await api.updateTestimonial(id, data);
        else await api.createTestimonial(data);
        showView('list'); loadData();
    });

    const showView = (v) => {
        listView.style.display = v === 'list' ? 'block' : 'none';
        formView.style.display = v === 'form' ? 'block' : 'none';
        btnList.classList.toggle('active', v === 'list');
        btnAdd.classList.toggle('active', v === 'form');
    };

    btnList.addEventListener('click', () => showView('list'));
    btnAdd.addEventListener('click', () => { form.reset(); showView('form'); });
    document.getElementById('btn-cancel').addEventListener('click', () => showView('list'));

    loadData();
};
