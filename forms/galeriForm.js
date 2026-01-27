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
                <input type="file" class="form-control" name="media_file" accept="image/*,video/*" required>
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
