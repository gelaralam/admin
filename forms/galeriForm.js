export const render = () => `
    <div class="form-card">
        <h3>Upload ke Galeri</h3>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">Tambahkan foto atau video baru ke koleksi galeri budaya.</p>
        
        <form id="galeri-form">
            <div class="form-group">
                <label>Judul Media</label>
                <input type="text" class="form-control" name="title" placeholder="Masukkan judul foto/video" required>
            </div>
            
            <div class="form-group">
                <label>Pilih File</label>
                <div class="image-upload-wrapper" style="border: 2px dashed var(--border-color); border-radius: 12px; padding: 1.5rem; text-align: center; cursor: pointer; transition: all 0.3s; position: relative;">
                    <input type="file" class="form-control" name="media_file" id="galeri-image-input" accept="image/*,video/*" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer;" required>
                    <div id="galeri-preview-container" style="display: none; margin-bottom: 1rem;">
                        <img id="galeri-preview" src="#" alt="Preview" style="max-width: 100%; max-height: 200px; border-radius: 8px;">
                    </div>
                    <div id="galeri-upload-placeholder">
                        <i class="fas fa-cloud-upload-alt" style="font-size: 2rem; color: var(--primary-color); margin-bottom: 0.5rem; display: block;"></i>
                        <p style="margin: 0; color: var(--text-secondary);">Klik atau seret file ke sini</p>
                        <p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 5px;">Format: JPG, PNG, MP4 (Maks 1MB)</p>
                    </div>
                </div>
            </div>
            
            <div class="form-group">
                <label>Kategori Galeri</label>
                <div style="display: flex; gap: 0.5rem;">
                    <select class="form-control" name="category" id="galeri-category-select" style="flex: 1;">
                        <option value="ritual">Ritual Adat</option>
                        <option value="arsitektur">Arsitektur</option>
                        <option value="kegiatan">Kegiatan Warga</option>
                        <option value="alam">Pemandangan Alam</option>
                        <option value="custom">+ Tambah Baru</option>
                    </select>
                    <input type="text" id="galeri-custom-category" class="form-control" placeholder="Kategori Baru" style="display: none; flex: 1;">
                </div>
            </div>
            
            <div class="form-group">
                <label>Deskripsi Singkat</label>
                <textarea class="form-control" name="description" placeholder="Ceritakan sedikit tentang media ini..."></textarea>
            </div>
            
            <button type="submit" class="btn-primary">Upload ke Galeri</button>
        </form>
    </div>
`;

export const init = () => {
    const form = document.getElementById('galeri-form');
    const categorySelect = document.getElementById('galeri-category-select');
    const customCategoryInput = document.getElementById('galeri-custom-category');
    const imageInput = document.getElementById('galeri-image-input');
    const previewContainer = document.getElementById('galeri-preview-container');
    const preview = document.getElementById('galeri-preview');
    const placeholder = document.getElementById('galeri-upload-placeholder');

    // Handle image preview & validation
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                alert('Ukuran file terlalu besar! Maksimal 1MB.');
                imageInput.value = '';
                return;
            }

            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    preview.src = event.target.result;
                    previewContainer.style.display = 'block';
                    placeholder.style.display = 'none';
                };
                reader.readAsDataURL(file);
            } else {
                // For video, just show placeholder or generic icon
                previewContainer.style.display = 'none';
                placeholder.style.display = 'block';
                placeholder.querySelector('p').innerText = `File terpilih: ${file.name}`;
            }
        }
    });

    // Toggle custom category input
    categorySelect.addEventListener('change', (e) => {
        if (e.target.value === 'custom') {
            customCategoryInput.style.display = 'block';
            customCategoryInput.required = true;
            customCategoryInput.focus();
        } else {
            customCategoryInput.style.display = 'none';
            customCategoryInput.required = false;
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Use custom category if provided
        if (data.category === 'custom') {
            data.category = customCategoryInput.value;
        }

        console.log('Galeri Data Collected:', data);
        alert('Media berhasil diupload ke galeri! (Simulated)');
        form.reset();
        customCategoryInput.style.display = 'none';
    });
};
