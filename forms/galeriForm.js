import { api } from '../api.js';

export const render = () => `
    <div class="form-card">
        <div class="card-header">
            <h3>Manajemen Galeri</h3>
            <div class="header-actions">
                <button id="btn-list-view" class="btn-secondary active">Daftar Foto</button>
                <button id="btn-add-view" class="btn-primary">Tambah Baru</button>
            </div>
        </div>

        <div id="item-list-container" class="view-container">
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Preview</th>
                            <th>Judul</th>
                            <th>Kategori</th>
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
                    <label>Judul Foto</label>
                    <input type="text" class="form-control" name="title" required>
                </div>
                
                <div class="form-group">
                    <label>Gambar</label>
                    <div class="image-upload-wrapper" style="border: 2px dashed var(--border-color); border-radius: 12px; padding: 1.5rem; text-align: center; cursor: pointer; position: relative;">
                        <input type="file" id="image-input" accept="image/*" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer;">
                        <input type="hidden" name="image" id="image-path">
                        <div id="preview-container" style="display: none; margin-bottom: 1rem;">
                            <img id="preview-img" src="#" alt="Preview" style="max-width: 100%; max-height: 200px; border-radius: 8px;">
                        </div>
                        <div id="placeholder">
                            <i class="fas fa-images" style="font-size: 2rem; color: var(--primary-color);"></i>
                            <p>Klik untuk upload foto</p>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label>Kategori</label>
                    <input type="text" class="form-control" name="category" placeholder="Contoh: Upacara Adat" required>
                </div>

                <div class="form-group">
                    <label>Link Video YouTube (Opsional)</label>
                    <input type="url" class="form-control" name="video_url" placeholder="Contoh: https://www.youtube.com/watch?v=...">
                </div>
                
                <div class="form-actions">
                    <button type="button" id="btn-cancel" class="btn-secondary">Batal</button>
                    <button type="submit" class="btn-primary" id="btn-submit">Simpan ke Galeri</button>
                </div>
            </form>
        </div>
    </div>
`;

const getImageUrl = (path) => {
    if (!path) return 'assets/logo.png';
    if (path.startsWith('http')) return path;
    return `../${path}`;
};

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
            const data = await api.getGallery();
            tableBody.innerHTML = data.map(item => {
                return `
                <tr>
                    <td data-label="Preview"><span class="cell-value"><img src="${getImageUrl(item.image)}" class="image-preview-sm" onerror="this.src='../assets/logo.png'"></span></td>
                    <td data-label="Judul" class="semi-bold"><span class="cell-value">${item.title}</span></td>
                    <td data-label="Kategori"><span class="cell-value">${item.category}</span></td>
                    <td data-label="Aksi">
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
            console.error('Failed to load gallery:', error);
            console.error('Error message:', error.message);
            tableBody.innerHTML = `<tr><td colspan="4" class="text-center" style="color: var(--danger-color);">Gagal memuat data: ${error.message}</td></tr>`;
        }
    };

    const editItem = (item) => {
        form.reset();
        document.getElementById('item-id').value = item.id;
        form.querySelector('[name="title"]').value = item.title;
        form.querySelector('[name="category"]').value = item.category;
        form.querySelector('[name="video_url"]').value = item.video_url || '';
        imagePath.value = item.image;
        previewImg.src = getImageUrl(item.image);
        previewImg.onerror = () => { previewImg.src = '../assets/logo.png'; };
        previewContainer.style.display = 'block';
        placeholder.style.display = 'none';
        showView('form');
    };

    const deleteItem = async (id) => {
        if (confirm('Hapus item ini?')) {
            await api.deleteGallery(id);
            loadData();
        }
    };

    imageInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            placeholder.innerHTML = 'Uploading...';
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
        const id = data.id; delete data.id;
        if (id) await api.updateGallery(id, data);
        else await api.createGallery(data);
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
