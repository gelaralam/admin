import { api } from '../api.js';

export const render = () => `
    <div class="form-card">
        <div class="card-header">
            <h3>Manajemen Blog</h3>
            <div class="header-actions">
                <button id="btn-list-view" class="btn-secondary active">Daftar Blog</button>
                <button id="btn-add-view" class="btn-primary">Tambah Baru</button>
            </div>
        </div>

        <div id="blog-list-container" class="view-container">
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Gambar</th>
                            <th>Judul</th>
                            <th>Kategori</th>
                            <th>Tanggal</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="blog-table-body"></tbody>
                </table>
            </div>
        </div>

        <div id="blog-form-container" class="view-container" style="display: none;">
            <form id="blog-form">
                <input type="hidden" name="id" id="blog-id">
                <div class="row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label>Judul Blog</label>
                        <input type="text" class="form-control" name="title" placeholder="Contoh: Bantuan Modal Usaha..." required>
                    </div>
                    
                    <div class="form-group">
                        <label>Kategori</label>
                        <div style="display: flex; gap: 0.5rem;">
                            <select class="form-control" name="category" id="category-select" style="flex: 1;">
                                <option value="EKONOMI">EKONOMI</option>
                                <option value="BUDAYA">BUDAYA</option>
                                <option value="TRADISI">TRADISI</option>
                                <option value="BERITA">BERITA</option>
                                <option value="custom">+ Tambah Baru</option>
                            </select>
                            <input type="text" id="custom-category" class="form-control" placeholder="Kategori Baru" style="display: none; flex: 1;">
                        </div>
                    </div>
                </div>

                <div class="row" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label>Tanggal</label>
                        <input type="number" class="form-control" name="day" placeholder="15" min="1" max="31" required>
                    </div>
                    <div class="form-group">
                        <label>Bulan</label>
                        <input type="text" class="form-control" name="month" placeholder="Januari" required>
                    </div>
                    <div class="form-group">
                        <label>Tahun</label>
                        <input type="number" class="form-control" name="year" placeholder="2026" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Gambar Blog</label>
                    <div class="image-upload-wrapper" style="border: 2px dashed var(--border-color); border-radius: 12px; padding: 1.5rem; text-align: center; cursor: pointer; transition: all 0.3s; position: relative;">
                        <input type="file" id="image-input" accept="image/*" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer;">
                        <input type="hidden" name="image" id="image-path-hidden">
                        <div id="image-preview-container" style="display: none; margin-bottom: 1rem;">
                            <img id="image-preview" src="#" alt="Preview" style="max-width: 100%; max-height: 200px; border-radius: 8px;">
                        </div>
                        <div id="image-upload-placeholder">
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
                    <label>Deskripsi Singkat (Snippet)</label>
                    <textarea class="form-control" name="description" placeholder="Ringkasan singkat untuk kartu blog..." style="min-height: 80px;" required></textarea>
                </div>
                
                <div class="form-group">
                    <label>Konten Lengkap</label>
                    <textarea class="form-control" name="content" placeholder="Ketik isi blog di sini..." style="min-height: 200px;" required></textarea>
                </div>
                
                <div class="form-actions">
                    <button type="button" id="btn-cancel-form" class="btn-secondary">Batal</button>
                    <button type="submit" class="btn-primary" id="btn-submit-form">Publikasikan Blog</button>
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
    const listView = document.getElementById('blog-list-container');
    const formView = document.getElementById('blog-form-container');
    const tableBody = document.getElementById('blog-table-body');
    const form = document.getElementById('blog-form');
    const btnList = document.getElementById('btn-list-view');
    const btnAdd = document.getElementById('btn-add-view');
    const btnCancel = document.getElementById('btn-cancel-form');
    const categorySelect = document.getElementById('category-select');
    const customCategoryInput = document.getElementById('custom-category');
    const imageInput = document.getElementById('image-input');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const imagePlaceholder = document.getElementById('image-upload-placeholder');
    const imagePathHidden = document.getElementById('image-path-hidden');

    const loadData = async () => {
        try {
            const data = await api.getBlogs();
            tableBody.innerHTML = data.map(item => {
                return `
                <tr>
                    <td><img src="${getImageUrl(item.image)}" class="image-preview-sm" onerror="this.src='../assets/logo.png'"></td>
                    <td class="semi-bold">${item.title}</td>
                    <td><span class="badge">${item.category}</span></td>
                    <td>${item.day} ${item.month} ${item.year}</td>
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
            console.error('Failed to load blogs:', error);
            console.error('Error message:', error.message);
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center" style="color: var(--danger-color);">Gagal memuat data: ${error.message}</td></tr>`;
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
        document.getElementById('blog-id').value = item.id;
        form.querySelector('[name="title"]').value = item.title;
        form.querySelector('[name="description"]').value = item.description;
        form.querySelector('[name="content"]').value = item.content.replace(/<p>/g, '').replace(/<\/p>/g, '\n');
        form.querySelector('[name="day"]').value = item.day;
        form.querySelector('[name="month"]').value = item.month;
        form.querySelector('[name="year"]').value = item.year;
        form.querySelector('[name="video_url"]').value = item.video_url || '';

        categorySelect.value = ['EKONOMI', 'BUDAYA', 'TRADISI', 'BERITA'].includes(item.category) ? item.category : 'custom';
        if (categorySelect.value === 'custom') {
            customCategoryInput.style.display = 'block';
            customCategoryInput.value = item.category;
        }

        imagePathHidden.value = item.image;
        imagePreview.src = getImageUrl(item.image);
        imagePreview.onerror = () => { imagePreview.src = '../assets/logo.png'; };
        imagePreviewContainer.style.display = 'block';
        imagePlaceholder.style.display = 'none';

        document.getElementById('btn-submit-form').innerText = 'Update Blog';
        showView('form');
    };

    const deleteItem = async (id) => {
        if (confirm('Yakin ingin menghapus blog ini?')) {
            try {
                await api.deleteBlog(id);
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
                imagePlaceholder.innerHTML = '<i class="fas fa-spinner fa-spin"></i><p>Uploading...</p>';
                const result = await api.uploadImage(file);
                imagePathHidden.value = result.url;
                imagePreview.src = result.url;
                imagePreviewContainer.style.display = 'block';
                imagePlaceholder.style.display = 'none';
            } catch (error) {
                alert('Gagal upload: ' + error.message);
                imagePlaceholder.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><p>Klik untuk upload</p>';
            }
        }
    });

    categorySelect.addEventListener('change', (e) => {
        customCategoryInput.style.display = e.target.value === 'custom' ? 'block' : 'none';
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const id = data.id;
        delete data.id;

        if (data.category === 'custom') data.category = customCategoryInput.value.toUpperCase();

        data.content = data.content.split('\n').filter(l => l.trim()).map(l => `<p>${l.trim()}</p>`).join('\n');
        data.day = parseInt(data.day);
        data.year = parseInt(data.year);

        try {
            if (id) await api.updateBlog(id, data);
            else await api.createBlog(data);
            showView('list');
            loadData();
        } catch (error) {
            alert('Gagal menyimpan: ' + error.message);
        }
    });

    btnList.addEventListener('click', () => showView('list'));
    btnAdd.addEventListener('click', () => {
        form.reset();
        document.getElementById('blog-id').value = '';
        document.getElementById('btn-submit-form').innerText = 'Publikasikan Blog';
        imagePreviewContainer.style.display = 'none';
        imagePlaceholder.style.display = 'block';
        showView('form');
    });
    btnCancel.addEventListener('click', () => showView('list'));

    loadData();
};
