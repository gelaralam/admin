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
                <select class="form-control" name="category">
                    <option value="ritual">Ritual Adat</option>
                    <option value="arsitektur">Arsitektur</option>
                    <option value="kegiatan">Kegiatan Warga</option>
                    <option value="alam">Pemandangan Alam</option>
                </select>
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
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Media berhasil diupload ke galeri! (Simulated)');
        form.reset();
    });
};
