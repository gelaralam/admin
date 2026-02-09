import { api } from '../api.js';

export const render = () => `
    <div class="form-card">
        <div class="card-header">
            <h3>🔧 Diagnostic Tool</h3>
            <p style="margin: 0.5rem 0 0 0; color: var(--text-secondary); font-size: 0.9rem;">
                Gunakan tool ini untuk mengidentifikasi masalah koneksi dengan backend
            </p>
        </div>

        <div class="view-container">
            <div style="display: grid; gap: 1.5rem;">
                <!-- Connection Status -->
                <div class="diagnostic-section">
                    <h4>📡 Status Koneksi Backend</h4>
                    <div id="connection-status" class="status-box">
                        <p>Klik tombol di bawah untuk test koneksi</p>
                    </div>
                    <button id="btn-test-connection" class="btn-primary" style="margin-top: 1rem;">
                        <i class="fas fa-sync-alt"></i> Test Koneksi
                    </button>
                </div>

                <!-- Token Status -->
                <div class="diagnostic-section">
                    <h4>🔑 Status Authentication Token</h4>
                    <div id="token-status" class="status-box">
                        <p>Checking...</p>
                    </div>
                </div>

                <!-- API Endpoints -->
                <div class="diagnostic-section">
                    <h4>🌐 Test API Endpoints</h4>
                    <div id="endpoints-status" class="status-box">
                        <p>Klik "Test Semua Endpoint" untuk memeriksa</p>
                    </div>
                    <button id="btn-test-endpoints" class="btn-secondary" style="margin-top: 1rem;">
                        <i class="fas fa-list"></i> Test Semua Endpoint
                    </button>
                </div>

                <!-- System Info -->
                <div class="diagnostic-section">
                    <h4>ℹ️ System Information</h4>
                    <div id="system-info" class="status-box">
                        <table style="width: 100%; font-size: 0.9rem;">
                            <tr>
                                <td style="padding: 0.5rem 0;"><strong>API Base URL:</strong></td>
                                <td style="padding: 0.5rem 0;"><code>https://data.gelaralam.id</code></td>
                            </tr>
                            <tr>
                                <td style="padding: 0.5rem 0;"><strong>Browser:</strong></td>
                                <td style="padding: 0.5rem 0;" id="browser-info"></td>
                            </tr>
                            <tr>
                                <td style="padding: 0.5rem 0;"><strong>Current Email:</strong></td>
                                <td style="padding: 0.5rem 0;" id="user-email-info"></td>
                            </tr>
                            <tr>
                                <td style="padding: 0.5rem 0;"><strong>Current Role:</strong></td>
                                <td style="padding: 0.5rem 0;" id="user-role-info"></td>
                            </tr>
                            <tr>
                                <td style="padding: 0.5rem 0;"><strong>Online Status:</strong></td>
                                <td style="padding: 0.5rem 0;" id="online-status"></td>
                            </tr>
                        </table>
                    </div>
                </div>

                <!-- Console Log -->
                <div class="diagnostic-section">
                    <h4>📋 Console Log</h4>
                    <div id="console-log" class="status-box" style="max-height: 300px; overflow-y: auto; font-family: monospace; font-size: 0.85rem; background: #1a1a1a; color: #00ff00; padding: 1rem;">
                        <p style="color: #888;">Logs will appear here...</p>
                    </div>
                    <button id="btn-clear-log" class="btn-secondary" style="margin-top: 0.5rem;">
                        <i class="fas fa-trash"></i> Clear Log
                    </button>
                </div>
            </div>
        </div>
    </div>
`;

export const init = async () => {
    const connectionStatus = document.getElementById('connection-status');
    const tokenStatus = document.getElementById('token-status');
    const endpointsStatus = document.getElementById('endpoints-status');
    const consoleLog = document.getElementById('console-log');
    const browserInfo = document.getElementById('browser-info');
    const onlineStatus = document.getElementById('online-status');

    // Helper function to log to console
    const log = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        const color = type === 'error' ? '#ff4444' : type === 'success' ? '#00ff00' : '#00aaff';
        const icon = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
        consoleLog.innerHTML += `<div style="color: ${color}; margin-bottom: 0.5rem;">[${timestamp}] ${icon} ${message}</div>`;
        consoleLog.scrollTop = consoleLog.scrollHeight;
    };

    // Initialize system info
    browserInfo.textContent = navigator.userAgent.split(' ').slice(-2).join(' ');

    const savedUser = localStorage.getItem('admin_user');
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            document.getElementById('user-email-info').textContent = user.email || 'N/A';
            document.getElementById('user-role-info').innerHTML = `<span class="badge ${user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' ? 'badge-primary' : ''}">${user.role || 'N/A'}</span>`;
        } catch (e) {
            document.getElementById('user-email-info').textContent = 'Error parsing user';
        }
    }

    onlineStatus.innerHTML = navigator.onLine
        ? '<span style="color: var(--success-color);">✅ Online</span>'
        : '<span style="color: var(--danger-color);">❌ Offline</span>';

    // Check token status
    const checkTokenStatus = () => {
        const token = api.getToken();
        const savedUser = localStorage.getItem('admin_user');

        if (!token) {
            tokenStatus.innerHTML = `
                <div style="color: var(--danger-color);">
                    <i class="fas fa-times-circle"></i> <strong>Token tidak ditemukan</strong>
                    <p style="margin-top: 0.5rem; font-size: 0.9rem;">Silakan login ulang</p>
                </div>
            `;
            log('Token tidak ditemukan di localStorage', 'error');
            return false;
        }

        try {
            const user = JSON.parse(savedUser);
            tokenStatus.innerHTML = `
                <div style="color: var(--success-color);">
                    <i class="fas fa-check-circle"></i> <strong>Token ditemukan</strong>
                    <p style="margin-top: 0.5rem; font-size: 0.9rem;">
                        User: ${user.email}<br>
                        Token length: ${token.length} characters
                    </p>
                </div>
            `;
            log(`Token ditemukan untuk user: ${user.email}`, 'success');
            return true;
        } catch (e) {
            tokenStatus.innerHTML = `
                <div style="color: var(--warning-color);">
                    <i class="fas fa-exclamation-triangle"></i> <strong>Token ada tapi user data corrupt</strong>
                </div>
            `;
            log('Error parsing user data: ' + e.message, 'error');
            return false;
        }
    };

    // Test connection
    document.getElementById('btn-test-connection').addEventListener('click', async () => {
        connectionStatus.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> Testing connection...</p>';
        log('Memulai test koneksi ke backend...');

        try {
            const response = await fetch('https://data.gelaralam.id/api/blog/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${api.getToken()}`
                }
            });

            if (response.ok) {
                connectionStatus.innerHTML = `
                    <div style="color: var(--success-color);">
                        <i class="fas fa-check-circle"></i> <strong>Koneksi Berhasil!</strong>
                        <p style="margin-top: 0.5rem; font-size: 0.9rem;">
                            Status: ${response.status} ${response.statusText}<br>
                            Backend server berjalan dengan baik
                        </p>
                    </div>
                `;
                log(`Koneksi berhasil! Status: ${response.status}`, 'success');
            } else {
                const errorText = await response.text();
                connectionStatus.innerHTML = `
                    <div style="color: var(--danger-color);">
                        <i class="fas fa-times-circle"></i> <strong>Koneksi Gagal</strong>
                        <p style="margin-top: 0.5rem; font-size: 0.9rem;">
                            Status: ${response.status} ${response.statusText}<br>
                            Error: ${errorText}
                        </p>
                    </div>
                `;
                log(`Koneksi gagal! Status: ${response.status}, Error: ${errorText}`, 'error');
            }
        } catch (error) {
            connectionStatus.innerHTML = `
                <div style="color: var(--danger-color);">
                    <i class="fas fa-times-circle"></i> <strong>Error Koneksi</strong>
                    <p style="margin-top: 0.5rem; font-size: 0.9rem;">
                        ${error.message}<br>
                        <small>Kemungkinan: Backend tidak running, CORS issue, atau network problem</small>
                    </p>
                </div>
            `;
            log(`Error koneksi: ${error.message}`, 'error');
        }
    });

    // Test all endpoints
    document.getElementById('btn-test-endpoints').addEventListener('click', async () => {
        endpointsStatus.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> Testing endpoints...</p>';
        log('Memulai test semua endpoint...');

        const endpoints = [
            { name: 'Blog', method: 'getBlogs' },
            { name: 'Budaya', method: 'getBudayas' },
            { name: 'Gallery', method: 'getGallery' },
            { name: 'Testimonial', method: 'getTestimonials' },
            { name: 'Timeline', method: 'getTimelines' }
        ];

        let results = '<table style="width: 100%; font-size: 0.9rem;">';
        results += '<tr><th style="text-align: left; padding: 0.5rem;">Endpoint</th><th style="text-align: left; padding: 0.5rem;">Status</th><th style="text-align: left; padding: 0.5rem;">Data Count</th></tr>';

        for (const endpoint of endpoints) {
            try {
                const data = await api[endpoint.method]();
                const count = Array.isArray(data) ? data.length : 'N/A';
                results += `<tr>
                    <td style="padding: 0.5rem;">${endpoint.name}</td>
                    <td style="padding: 0.5rem; color: var(--success-color);">✅ OK</td>
                    <td style="padding: 0.5rem;">${count} items</td>
                </tr>`;
                log(`${endpoint.name}: OK (${count} items)`, 'success');
            } catch (error) {
                results += `<tr>
                    <td style="padding: 0.5rem;">${endpoint.name}</td>
                    <td style="padding: 0.5rem; color: var(--danger-color);">❌ FAIL</td>
                    <td style="padding: 0.5rem; font-size: 0.8rem;">${error.message}</td>
                </tr>`;
                log(`${endpoint.name}: FAIL - ${error.message}`, 'error');
            }
        }

        results += '</table>';
        endpointsStatus.innerHTML = results;
    });

    // Clear log
    document.getElementById('btn-clear-log').addEventListener('click', () => {
        consoleLog.innerHTML = '<p style="color: #888;">Logs cleared...</p>';
    });

    // Initial checks
    checkTokenStatus();
    log('Diagnostic tool initialized', 'success');
};
