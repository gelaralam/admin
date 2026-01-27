import Router from './router.js';

document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const pageTitle = document.getElementById('current-page-title');
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggle-sidebar');
    
    // Initialize Router
    const router = new Router(contentArea, pageTitle);

    // Sidebar navigation
    document.querySelectorAll('.sidebar-nav li').forEach(li => {
        li.addEventListener('click', () => {
            // Mobile: close sidebar on selection
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });

    // Mobile Toggle
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Logout simulation
    document.getElementById('logout-btn').addEventListener('click', () => {
        if(confirm('Apakah Anda yakin ingin keluar?')) {
            alert('Berhasil keluar!');
        }
    });

    // Load initial route or hash change
    const handleRoute = () => {
        const hash = window.location.hash.slice(1) || 'blog';
        router.loadRoute(hash);
        
        // Update active class in sidebar
        document.querySelectorAll('.sidebar-nav li').forEach(li => {
            li.classList.toggle('active', li.dataset.page === hash);
        });
    };

    window.addEventListener('hashchange', handleRoute);
    handleRoute();
});
