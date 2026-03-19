/**
 * Authentication functionality for login page
 */

/**
 * Simulates authentication with the server
 * @param {string} username - User provided username/email
 * @param {string} password - User provided password
 */
function authenticateUser(username, password) {
    // Get elements
    const loginButton = document.getElementById('loginButton');
    const formFeedback = document.getElementById('formFeedback');

    // Show loading state
    loginButton.classList.add('loading');
    formFeedback.className = 'form-feedback';
    formFeedback.style.display = 'none';

    // Mock credentials for testing
    const validUsername = "user@example.com";
    const validPassword = "Password123!";

    // Simulate server request with delay
    setTimeout(() => {
        if (username === validUsername && password === validPassword) {
            // Successful login
            handleSuccessfulLogin(username);
        } else {
            // Failed login
            handleFailedLogin();
        }

        // Remove loading state
        loginButton.classList.remove('loading');
    }, 1500); // Simulate network delay
}

/**
 * Handles successful authentication
 * @param {string} username - Authenticated username
 */
function handleSuccessfulLogin(username) {
    const formFeedback = document.getElementById('formFeedback');

    // Set auth status in localStorage
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('username', username);

    // Add CSRF token simulation
    const csrfToken = generateCSRFToken();
    localStorage.setItem('csrfToken', csrfToken);

    // Show success message
    formFeedback.className = 'form-feedback success';
    formFeedback.textContent = 'Login successful! Redirecting...';
    formFeedback.style.display = 'block';

    // Redirect after a brief delay
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

/**
 * Handles failed authentication
 */
function handleFailedLogin() {
    const formFeedback = document.getElementById('formFeedback');

    // Show error message
    formFeedback.className = 'form-feedback error';
    formFeedback.textContent = 'Invalid username or password. Please try again.';
    formFeedback.style.display = 'block';

    // Focus on password field
    document.getElementById('password').focus();

    // Add a little shake animation to the form for visual feedback
    const loginForm = document.getElementById('loginForm');
    loginForm.classList.add('shake');
    setTimeout(() => {
        loginForm.classList.remove('shake');
    }, 500);
}

/**
 * Generates a random token to simulate CSRF protection
 * @return {string} - Random token
 */
function generateCSRFToken() {
    return Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
}

/**
 * Check if user is already authenticated on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    if (isAuthenticated && window.location.pathname.includes('index.html')) {
        // If already authenticated and on login page, redirect to dashboard
        window.location.href = 'dashboard.html';
    }
});
