export const render = () => `
    <div class="form-card">
        <h3>Tambah Blog Baru</h3>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">Silahkan isi formulir di bawah ini untuk menambahkan artikel blog baru sesuai dengan skema data website.</p>
        
        <form id="blog-form">
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
                    <input type="file" class="form-control" name="image_file" id="image-input" accept="image/*" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer;">
                    <div id="image-preview-container" style="display: none; margin-bottom: 1rem;">
                        <img id="image-preview" src="#" alt="Preview" style="max-width: 100%; max-height: 200px; border-radius: 8px;">
                    </div>
                    <div id="image-upload-placeholder">
                        <i class="fas fa-cloud-upload-alt" style="font-size: 2rem; color: var(--primary-color); margin-bottom: 0.5rem; display: block;"></i>
                        <p style="margin: 0; color: var(--text-secondary);">Klik atau seret gambar ke sini</p>
                        <p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 5px;">Format: JPG, PNG, WEBP (Maks 2MB)</p>
                    </div>
                </div>
                <input type="hidden" name="image" id="image-path-hidden" value="assets/blog/default.jpg">
            </div>

            <div class="form-group">
                <label>Deskripsi Singkat (Snippet)</label>
                <textarea class="form-control" name="description" placeholder="Ringkasan singkat untuk kartu blog..." style="min-height: 80px;" required></textarea>
            </div>
            
            <div class="form-group">
                <label>Konten Lengkap</label>
                <textarea class="form-control" name="content" placeholder="Ketik isi blog di sini..." style="min-height: 200px;" required></textarea>
            </div>
            
            <button type="submit" class="btn-primary">Publikasikan Blog</button>
        </form>
    </div>
`;

export const init = () => {
    const form = document.getElementById('blog-form');
    const categorySelect = document.getElementById('category-select');
    const customCategoryInput = document.getElementById('custom-category');
    const imageInput = document.getElementById('image-input');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const imagePlaceholder = document.getElementById('image-upload-placeholder');
    const imagePathHidden = document.getElementById('image-path-hidden');

    // Handle image preview
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                imagePreview.src = event.target.result;
                imagePreviewContainer.style.display = 'block';
                imagePlaceholder.style.display = 'none';
                // Simulate path for demonstration
                imagePathHidden.value = `assets/blog/${file.name}`;
            };
            reader.readAsDataURL(file);
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
            data.category = customCategoryInput.value.toUpperCase();
        }

        // Automate <p> tags for content
        if (data.content) {
            data.content = data.content
                .split('\n')
                .filter(line => line.trim() !== '')
                .map(line => `<p>${line.trim()}</p>`)
                .join('\n');
        }

        console.log('Blog Data Collected (Processed):', data);
        alert('Blog berhasil disimpan! Konten telah otomatis diubah menjadi HTML Paragraf. Lihat Console (F12).');
        form.reset();
    });
};
