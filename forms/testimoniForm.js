export const render = () => `
    <div class="form-card">
        <h3>Tambah Testimoni</h3>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">Masukan testimoni atau ulasan dari pengunjung.</p>
        
        <form id="testimoni-form">
            <div class="form-group">
                <label>Nama Lengkap</label>
                <input type="text" class="form-control" name="name" placeholder="Nama pengunjung" required>
            </div>
            
            <div class="form-group">
                <label>Pekerjaan / Jabatan</label>
                <input type="text" class="form-control" name="position" placeholder="Contoh: Wisatawan, Peneliti, Sekolah">
            </div>
            
            <div class="form-group">
                <label>Foto Profil</label>
                <div class="image-upload-wrapper" style="border: 2px dashed var(--border-color); border-radius: 12px; padding: 1rem; text-align: center; cursor: pointer; transition: all 0.3s; position: relative;">
                    <input type="file" class="form-control" name="avatar" id="testi-image-input" accept="image/*" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer;">
                    <div id="testi-preview-container" style="display: none; margin-bottom: 0.5rem;">
                        <img id="testi-preview" src="#" alt="Preview" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;">
                    </div>
                    <div id="testi-upload-placeholder">
                        <i class="fas fa-user-circle" style="font-size: 1.5rem; color: var(--primary-color); margin-bottom: 5px; display: block;"></i>
                        <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Pilih Foto (Maks 1MB)</p>
                    </div>
                </div>
            </div>
            
            <div class="form-group">
                <label>Isi Testimoni</label>
                <textarea class="form-control" name="testimony" placeholder="Apa kata mereka tentang Gelaralam?" required></textarea>
            </div>
            
            <button type="submit" class="btn-primary">Simpan Testimoni</button>
        </form>
    </div>
`;

export const init = () => {
    const form = document.getElementById('testimoni-form');
    const imageInput = document.getElementById('testi-image-input');
    const previewContainer = document.getElementById('testi-preview-container');
    const preview = document.getElementById('testi-preview');
    const placeholder = document.getElementById('testi-upload-placeholder');

    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                alert('Ukuran file terlalu besar! Maksimal 1MB.');
                imageInput.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                preview.src = event.target.result;
                previewContainer.style.display = 'block';
                placeholder.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Testimoni berhasil disimpan! (Simulated)');
        form.reset();
    });
};
