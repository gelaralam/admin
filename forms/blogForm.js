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
                    <select class="form-control" name="category">
                        <option value="EKONOMI">EKONOMI</option>
                        <option value="BUDAYA">BUDAYA</option>
                        <option value="TRADISI">TRADISI</option>
                        <option value="BERITA">BERITA</option>
                    </select>
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
                <label>Gambar (Path)</label>
                <input type="text" class="form-control" name="image" placeholder="assets/blog/blog-1.jpg" required>
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
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

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
