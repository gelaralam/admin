export const render = () => `
    <div class="form-card">
        <h3>Tambah Jadwal Acara</h3>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">Masukkan detail acara atau kegiatan mendatang.</p>
        
        <form id="jadwal-form">
            <div class="form-group">
                <label>Nama Acara</label>
                <input type="text" class="form-control" name="event_name" placeholder="Contoh: Upacara Adat Ngaseuk" required>
            </div>
            
            <div class="form-group">
                <label>Tanggal Pelaksanaan</label>
                <input type="date" class="form-control" name="date" required>
            </div>
            
            <div class="form-group">
                <label>Lokasi</label>
                <input type="text" class="form-control" name="location" placeholder="Lokasi kegiatan" required>
            </div>
            
            <div class="form-group">
                <label>Keterangan Tambahan</label>
                <textarea class="form-control" name="description" placeholder="Deskripsi singkat mengenai acara..."></textarea>
            </div>
            
            <button type="submit" class="btn-primary">Simpan Jadwal</button>
        </form>
    </div>
`;

export const init = () => {
    const form = document.getElementById('jadwal-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Jadwal berhasil disimpan! (Simulated)');
        form.reset();
    });
};
