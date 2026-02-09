import Router from './router.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Session Check
    const token = localStorage.getItem('paseto_token');
    const savedUser = localStorage.getItem('admin_user');

    if (!token || !savedUser) {
        window.location.href = 'login.html';
        return;
    }

    const userData = JSON.parse(savedUser);
    const contentArea = document.getElementById('content-area');
    const pageTitle = document.getElementById('current-page-title');
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggle-sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    // Update Profile UI
    document.getElementById('user-name').innerText = userData.email;
    document.getElementById('user-avatar').innerText = userData.email.charAt(0).toUpperCase();

    // Initialize Router
    const router = new Router(contentArea, pageTitle);

    // Sidebar navigation
    document.querySelectorAll('.sidebar-nav li').forEach(li => {
        li.addEventListener('click', () => {
            // Mobile: close sidebar on selection
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
            }
        });
    });

    // Mobile Toggle
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    });

    // Close on overlay click
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            localStorage.removeItem('admin_user');
            localStorage.removeItem('paseto_token');
            location.reload();
        }
    });

    // Load initial route or hash change
    const handleRoute = () => {
        let hash = window.location.hash.slice(1) || 'blog';

        // RBAC: Restrict Kelola Admin
        const userRole = (userData.role || '').toUpperCase();
        if (hash === 'admin' && userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
            console.warn('Unauthorized access to admin menu');
            hash = 'blog';
            window.location.hash = '#blog';
        }

        router.loadRoute(hash);

        // Update active class in sidebar
        document.querySelectorAll('.sidebar-nav li').forEach(li => {
            li.classList.toggle('active', li.dataset.page === hash);

            // Hide admin menu for non-admins
            const userRole = (userData.role || '').toUpperCase();
            if (li.dataset.page === 'admin' && userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
                li.style.display = 'none';
            }
        });
    };

    window.addEventListener('hashchange', handleRoute);
    handleRoute();
});
