export const render = () => `
    <div class="form-card">
        <h3>Tambah Blog Baru</h3>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">Silahkan isi formulir di bawah ini untuk menambahkan artikel blog baru.</p>
        
        <form id="blog-form">
            <div class="form-group">
                <label>Judul Blog</label>
                <input type="text" class="form-control" name="title" placeholder="Masukkan judul artikel" required>
            </div>
            
            <div class="form-group">
                <label>Kategori</label>
                <select class="form-control" name="category">
                    <option value="budaya">Budaya</option>
                    <option value="tradisi">Tradisi</option>
                    <option value="wisata">Wisata</option>
                    <option value="berita">Berita</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Gambar Utama</label>
                <input type="file" class="form-control" name="image" accept="image/*">
            </div>
            
            <div class="form-group">
                <label>Konten Blog</label>
                <textarea class="form-control" name="content" placeholder="Tuliskan isi blog Anda di sini..." required></textarea>
            </div>
            
            <button type="submit" class="btn-primary">Publikasikan Blog</button>
        </form>
    </div>
`;

export const init = () => {
    const form = document.getElementById('blog-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Blog berhasil disimpan! (Simulated)');
        form.reset();
    });
};
