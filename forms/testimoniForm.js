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
                <input type="file" class="form-control" name="avatar" accept="image/*">
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
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Testimoni berhasil disimpan! (Simulated)');
        form.reset();
    });
};
