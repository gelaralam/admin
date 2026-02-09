export default class Router {
    constructor(container, titleElement) {
        this.container = container;
        this.titleElement = titleElement;
        this.cache = new Map();
    }

    async loadRoute(route) {
        this.container.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';

        try {
            let module;
            switch (route) {
                case 'blog':
                    module = await import('./forms/blogForm.js');
                    this.titleElement.innerText = 'Input BLOG';
                    break;
                case 'budaya':
                    module = await import('./forms/budayaForm.js');
                    this.titleElement.innerText = 'Input BUDAYA';
                    break;
                case 'jadwal':
                    module = await import('./forms/jadwalForm.js');
                    this.titleElement.innerText = 'Input JADWAL';
                    break;
                case 'galeri':
                    module = await import('./forms/galeriForm.js');
                    this.titleElement.innerText = 'Input GALERI';
                    break;
                case 'testimoni':
                    module = await import('./forms/testimoniForm.js');
                    this.titleElement.innerText = 'Input TESTIMONI';
                    break;
                case 'diagnostic':
                    module = await import('./forms/diagnosticForm.js');
                    this.titleElement.innerText = '🔧 Diagnostic Tool';
                    break;
                case 'admin':
                    const userData = JSON.parse(localStorage.getItem('admin_user') || '{}');
                    const userRole = (userData.role || '').toUpperCase();
                    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
                        throw new Error('Akses ditolak: Anda tidak memiliki wewenang.');
                    }
                    module = await import('./forms/adminForm.js');
                    this.titleElement.innerText = 'Kelola ADMIN';
                    break;
                default:
                    module = await import('./forms/blogForm.js');
                    this.titleElement.innerText = 'Input BLOG';
            }

            if (module && module.render) {
                this.container.innerHTML = module.render();
                if (module.init) module.init();
            }
        } catch (error) {
            console.error('Routing error:', error);
            this.container.innerHTML = `<div class="error-msg">Gagal memuat halaman: ${error.message}</div>`;
        }
    }
}
