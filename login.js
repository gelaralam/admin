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

window.handleCredentialResponse = (response) => {
    const userData = parseJwt(response.credential);
    if (userData) {
        console.log('User signed in:', userData);
        localStorage.setItem('admin_user', JSON.stringify(userData));
        window.location.href = 'index.html'; // Redirect to dashboard
    }
};

window.onload = function () {
    // Check if already logged in
    if (localStorage.getItem('admin_user')) {
        window.location.href = 'index.html';
        return;
    }

    google.accounts.id.initialize({
        client_id: '712946684527-tt76rf23aa7esbc7ivvpuia7skv3kdra.apps.googleusercontent.com',
        callback: window.handleCredentialResponse
    });

    google.accounts.id.renderButton(
        document.getElementById("google-login-btn"),
        { theme: "filled_blue", size: "large", text: "continue_with" }
    );
};
