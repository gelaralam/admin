import Router from './router.js';

// Helper to decode JWT
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const pageTitle = document.getElementById('current-page-title');
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggle-sidebar');
    const container = document.getElementById('app-container');
    const loginOverlay = document.getElementById('login-overlay');

    // Google Sign-In Callback
    window.handleCredentialResponse = (response) => {
        const userData = parseJwt(response.credential);
        if (userData) {
            console.log('User signed in:', userData);

            // Update Profile UI
            document.getElementById('user-name').innerText = userData.name;
            document.getElementById('user-avatar').innerHTML = `<img src="${userData.picture}" alt="${userData.name}">`;

            // Show Dashboard
            loginOverlay.style.display = 'none';
            container.style.display = 'flex';

            // Save state (optional)
            localStorage.setItem('admin_user', JSON.stringify(userData));
        }
    };

    // Initialize Google Sign-In
    google.accounts.id.initialize({
        client_id: '712946684527-tt76rf23aa7esbc7ivvpuia7skv3kdra.apps.googleusercontent.com',
        callback: window.handleCredentialResponse
    });

    google.accounts.id.renderButton(
        document.getElementById("google-login-btn"),
        { theme: "filled_blue", size: "large", text: "continue_with" }
    );

    // Check existing session
    const savedUser = localStorage.getItem('admin_user');
    if (savedUser) {
        const userData = JSON.parse(savedUser);
        document.getElementById('user-name').innerText = userData.name;
        document.getElementById('user-avatar').innerHTML = `<img src="${userData.picture}" alt="${userData.name}">`;
        loginOverlay.style.display = 'none';
        container.style.display = 'flex';
    }

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
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            localStorage.removeItem('admin_user');
            location.reload();
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
