import { api } from '../api.js';

export const render = () => `
    <div class="form-card">
        <div class="card-header">
            <h3>Manajemen Jadwal / Timeline</h3>
            <div class="header-actions">
                <button id="btn-list-view" class="btn-secondary active">Daftar Jadwal</button>
                <button id="btn-add-view" class="btn-primary">Tambah Baru</button>
            </div>
        </div>

        <div id="item-list-container" class="view-container">
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Tanggal</th>
                            <th>Nama Acara</th>
                            <th>Keterangan</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="item-table-body"></tbody>
                </table>
            </div>
        </div>

        <div id="item-form-container" class="view-container" style="display: none;">
            <form id="item-form">
                <input type="hidden" name="id" id="item-id">
                <div class="form-group">
                    <label>Tanggal Acara (Contoh: 15 Januari 2026)</label>
                    <input type="text" class="form-control" name="date" required>
                </div>
                
                <div class="form-group">
                    <label>Nama / Judul Acara</label>
                    <input type="text" class="form-control" name="title" required>
                </div>
                
                <div class="form-group">
                    <label>Keterangan / Deskripsi</label>
                    <textarea class="form-control" name="description" style="min-height: 100px;" required></textarea>
                </div>
                
                <div class="form-actions">
                    <button type="button" id="btn-cancel" class="btn-secondary">Batal</button>
                    <button type="submit" class="btn-primary" id="btn-submit">Simpan Jadwal</button>
                </div>
            </form>
        </div>
    </div>
`;

export const init = async () => {
    const listView = document.getElementById('item-list-container');
    const formView = document.getElementById('item-form-container');
    const tableBody = document.getElementById('item-table-body');
    const form = document.getElementById('item-form');
    const btnList = document.getElementById('btn-list-view');
    const btnAdd = document.getElementById('btn-add-view');

    const loadData = async () => {
        try {
            const data = await api.getTimelines();
            tableBody.innerHTML = data.map(item => `
                <tr>
                    <td class="semi-bold">${item.date}</td>
                    <td>${item.title}</td>
                    <td class="text-truncate">${item.description}</td>
                    <td>
                        <div class="action-btns">
                            <button class="btn-icon edit-btn" data-id="${item.id}"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon delete-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `).join('');

            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', () => editItem(data.find(i => i.id === btn.dataset.id)));
            });
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', () => deleteItem(btn.dataset.id));
            });
        } catch (error) {
            console.error('Failed to load timelines:', error);
            console.error('Error message:', error.message);
            tableBody.innerHTML = `<tr><td colspan="4" class="text-center" style="color: var(--danger-color);">Gagal memuat data: ${error.message}</td></tr>`;
        }
    };

    const editItem = (item) => {
        form.reset();
        document.getElementById('item-id').value = item.id;
        form.querySelector('[name="date"]').value = item.date;
        form.querySelector('[name="title"]').value = item.title;
        form.querySelector('[name="description"]').value = item.description;
        showView('form');
    };

    const deleteItem = async (id) => {
        if (confirm('Hapus jadwal ini?')) {
            await api.deleteTimeline(id);
            loadData();
        }
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());
        const id = data.id; delete data.id;
        if (id) await api.updateTimeline(id, data);
        else await api.createTimeline(data);
        showView('list'); loadData();
    });

    const showView = (v) => {
        listView.style.display = v === 'list' ? 'block' : 'none';
        formView.style.display = v === 'form' ? 'block' : 'none';
        btnList.classList.toggle('active', v === 'list');
        btnAdd.classList.toggle('active', v === 'form');
    };

    btnList.addEventListener('click', () => showView('list'));
    btnAdd.addEventListener('click', () => { form.reset(); showView('form'); });
    document.getElementById('btn-cancel').addEventListener('click', () => showView('list'));

    loadData();
};
