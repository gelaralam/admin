import { api } from '../api.js';

export const render = () => `
    <div class="form-card">
        <div class="card-header">
            <h3>Manajemen Budaya</h3>
            <div class="header-actions">
                <button id="btn-list-view" class="btn-secondary active">Daftar Budaya</button>
                <button id="btn-add-view" class="btn-primary">Tambah Baru</button>
            </div>
        </div>

        <div id="budaya-list-container" class="view-container">
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Gambar</th>
                            <th>Judul</th>
                            <th>Deskripsi</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="budaya-table-body">
                        <!-- Data will be loaded here -->
                    </tbody>
                </table>
            </div>
        </div>

        <div id="budaya-form-container" class="view-container" style="display: none;">
            <form id="budaya-form">
                <input type="hidden" name="id" id="budaya-id">
                <div class="form-group">
                    <label>Judul Budaya / Ritual</label>
                    <input type="text" class="form-control" name="title" placeholder="Contoh: Ngaseuk" required>
                </div>
                
                <div class="form-group">
                    <label>Gambar</label>
                    <div class="image-upload-wrapper" style="border: 2px dashed var(--border-color); border-radius: 12px; padding: 1.5rem; text-align: center; cursor: pointer; transition: all 0.3s; position: relative;">
                        <input type="file" id="budaya-image-input" accept="image/*" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer;">
                        <input type="hidden" name="image" id="budaya-image-path">
                        <div id="budaya-preview-container" style="display: none; margin-bottom: 1rem;">
                            <img id="budaya-preview" src="#" alt="Preview" style="max-width: 100%; max-height: 200px; border-radius: 8px;">
                        </div>
                        <div id="budaya-upload-placeholder">
                            <i class="fas fa-cloud-upload-alt" style="font-size: 2rem; color: var(--primary-color); margin-bottom: 0.5rem; display: block;"></i>
                            <p style="margin: 0; color: var(--text-secondary);">Klik atau seret gambar ke sini</p>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label>Link Video YouTube (Opsional)</label>
                    <input type="url" class="form-control" name="video_url" placeholder="Contoh: https://www.youtube.com/watch?v=...">
                </div>

                <div class="form-group">
                    <label>Deskripsi Ritual</label>
                    <textarea class="form-control" name="description" placeholder="Ceritakan tentang ritual ini..." style="min-height: 120px;" required></textarea>
                </div>
                
                <div class="form-actions">
                    <button type="button" id="btn-cancel-form" class="btn-secondary">Batal</button>
                    <button type="submit" class="btn-primary" id="btn-submit-form">Simpan Budaya</button>
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
    const listView = document.getElementById('budaya-list-container');
    const formView = document.getElementById('budaya-form-container');
    const tableBody = document.getElementById('budaya-table-body');
    const form = document.getElementById('budaya-form');
    const btnList = document.getElementById('btn-list-view');
    const btnAdd = document.getElementById('btn-add-view');
    const btnCancel = document.getElementById('btn-cancel-form');
    const imageInput = document.getElementById('budaya-image-input');
    const imagePath = document.getElementById('budaya-image-path');
    const previewContainer = document.getElementById('budaya-preview-container');
    const preview = document.getElementById('budaya-preview');
    const placeholder = document.getElementById('budaya-upload-placeholder');

    const loadData = async () => {
        try {
            const data = await api.getBudayas();
            tableBody.innerHTML = data.map(item => {
                return `
                <tr>
                    <td><img src="${getImageUrl(item.image)}" style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px;" onerror="this.src='../assets/logo.png'"></td>
                    <td class="semi-bold">${item.title}</td>
                    <td class="text-truncate">${item.description}</td>
                    <td>
                        <div class="action-btns">
                            <button class="btn-icon edit-btn" data-id="${item.id}" title="Edit"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon delete-btn" data-id="${item.id}" title="Hapus"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
                `;
            }).join('');

            // Attach listeners to dynamically created buttons
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', () => editItem(data.find(i => i.id === btn.dataset.id)));
            });
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', () => deleteItem(btn.dataset.id));
            });
        } catch (error) {
            console.error('Failed to load budaya:', error);
            console.error('Error message:', error.message);
            tableBody.innerHTML = `<tr><td colspan="4" class="text-center" style="color: var(--danger-color);">Gagal memuat data: ${error.message}</td></tr>`;
        }
    };

    const showView = (view) => {
        listView.style.display = view === 'list' ? 'block' : 'none';
        formView.style.display = view === 'form' ? 'block' : 'none';
        btnList.classList.toggle('active', view === 'list');
        btnAdd.classList.toggle('active', view === 'form');
    };

    const editItem = (item) => {
        form.reset();
        document.getElementById('budaya-id').value = item.id;
        form.querySelector('[name="title"]').value = item.title;
        form.querySelector('[name="description"]').value = item.description;
        form.querySelector('[name="video_url"]').value = item.video_url || '';
        imagePath.value = item.image;
        preview.src = getImageUrl(item.image);
        preview.onerror = () => { preview.src = '../assets/logo.png'; };
        previewContainer.style.display = 'block';
        placeholder.style.display = 'none';

        document.getElementById('btn-submit-form').innerText = 'Update Budaya';
        showView('form');
    };

    const deleteItem = async (id) => {
        if (confirm('Yakin ingin menghapus budaya ini?')) {
            try {
                await api.deleteBudaya(id);
                loadData();
            } catch (error) {
                alert('Gagal menghapus: ' + error.message);
            }
        }
    };

    imageInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                placeholder.innerHTML = '<i class="fas fa-spinner fa-spin"></i><p>Uploading...</p>';
                const result = await api.uploadImage(file);
                imagePath.value = result.url;
                preview.src = result.url;
                previewContainer.style.display = 'block';
                placeholder.style.display = 'none';
            } catch (error) {
                alert('Gagal upload: ' + error.message);
                placeholder.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><p>Klik untuk upload</p>';
            }
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const id = data.id;
        delete data.id;

        try {
            if (id) {
                await api.updateBudaya(id, data);
            } else {
                await api.createBudaya(data);
            }
            showView('list');
            loadData();
        } catch (error) {
            alert('Gagal menyimpan: ' + error.message);
        }
    });

    btnList.addEventListener('click', () => showView('list'));
    btnAdd.addEventListener('click', () => {
        form.reset();
        document.getElementById('budaya-id').value = '';
        document.getElementById('btn-submit-form').innerText = 'Simpan Budaya';
        previewContainer.style.display = 'none';
        placeholder.style.display = 'block';
        showView('form');
    });
    btnCancel.addEventListener('click', () => showView('list'));

    loadData();
};
