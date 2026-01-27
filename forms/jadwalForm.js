export const render = () => `
    <div class="form-card">
        <h3>Tambah Jadwal Acara</h3>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">Masukkan detail acara sesuai dengan skema data website.</p>
        
        <form id="jadwal-form">
            <div class="form-group">
                <label>Tanggal Acara (Contoh: 1 PEBRUARI)</label>
                <input type="text" class="form-control" name="date" placeholder="Contoh: 1 PEBRUARI" required>
            </div>

            <div class="form-group">
                <label>Nama / Judul Acara</label>
                <input type="text" class="form-control" name="title" placeholder="Contoh: PANGANGGOAN 14 NA RUAH" required>
            </div>
            
            <div class="form-group">
                <label>Keterangan / Deskripsi</label>
                <textarea class="form-control" name="description" placeholder="Contoh: Opat belasna merupakan kegiatan yang dilakukan sebulan sekali." style="min-height: 100px;" required></textarea>
            </div>
            
            <button type="submit" class="btn-primary">Simpan Jadwal</button>
        </form>
    </div>
`;

export const init = () => {
    const form = document.getElementById('jadwal-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        console.log('Jadwal Data Collected:', data);
        alert('Jadwal berhasil disimpan! Data telah dicetak ke console (F12).');
        form.reset();
    });
};
