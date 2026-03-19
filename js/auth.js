/**
 * Authentication module for login form
 * Handles form submission and mock authentication logic
 */

// Mock user credentials for testing
const mockCredentials = {
    username: "user@example.com",
    password: "password123"
};

// Cache DOM elements
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('login-button');
const rememberMeCheckbox = document.getElementById('remember-me');

/**
 * Initialize authentication module
 */
function initAuth() {
    // Add form submit event listener
    loginForm.addEventListener('submit', handleLoginSubmit);

    // Check for existing auth session
    checkAuthSession();
}

/**
 * Handle form submission event
 * @param {Event} event - The form submit event
 */
function handleLoginSubmit(event) {
    event.preventDefault();

    // Validate form before processing
    if (!window.validateForm()) {
        return;
    }

    // Get form values
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const rememberMe = rememberMeCheckbox.checked;

    // Set button to loading state
    setLoadingState(true);

    // Simulate network delay for mock authentication
    setTimeout(() => {
        processLogin(username, password, rememberMe);
    }, 1500);
}

/**
 * Process login with mock authentication
 * @param {string} username - The entered username/email
 * @param {string} password - The entered password
 * @param {boolean} rememberMe - Whether to remember the session
 */
function processLogin(username, password, rememberMe) {
    // Check against mock credentials
    if (username === mockCredentials.username && password === mockCredentials.password) {
        // Successful login
        const authData = {
            username: username,
            isAuthenticated: true,
            timestamp: new Date().getTime(),
            // Session expiry: 1 hour for normal, 30 days for "remember me"
            expiresAt: new Date().getTime() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000)
        };

        // Store authentication data
        localStorage.setItem('authData', JSON.stringify(authData));

        // Show success message
        window.showSuccessMessage("Login successful! Redirecting...");

        // Simulate redirect after successful login
        setTimeout(() => {
            // In a real app, this would redirect to the dashboard or homepage
            window.location.href = "#dashboard"; // Mock redirect
            // For demo purposes, just reset the form
            resetForm();
        }, 2000);
    } else {
        // Failed login
        window.showErrorMessage("Invalid username or password. Please try again.");
        setLoadingState(false);
    }
}

/**
 * Check for existing authentication session
 */
function checkAuthSession() {
    const authData = localStorage.getItem('authData');

    if (authData) {
        const parsedAuthData = JSON.parse(authData);
        const currentTime = new Date().getTime();

        // Check if session is still valid
        if (parsedAuthData.isAuthenticated && parsedAuthData.expiresAt > currentTime) {
            // In a real app, this would redirect to the dashboard or homepage
            // For demo purposes, pre-fill the username
            usernameInput.value = parsedAuthData.username;
            window.showSuccessMessage("Welcome back! Please enter your password.");
        } else {
            // Expired session
            localStorage.removeItem('authData');
        }
    }
}

/**
 * Set loading state for login button
 * @param {boolean} isLoading - Whether the form is in loading state
 */
function setLoadingState(isLoading) {
    if (isLoading) {
        loginButton.classList.add('loading');
        loginButton.disabled = true;

        // Add loading spinner and change text
        const buttonText = loginButton.textContent;
        loginButton.innerHTML = `
            <span class="loading-indicator"></span>
            <span class="loading-text">Signing in...</span>
            <span class="button-text">${buttonText}</span>
        `;
    } else {
        loginButton.classList.remove('loading');
        loginButton.disabled = false;
        loginButton.innerHTML = 'Sign In';

        // Re-evaluate form validity to update button state
        if (window.validateForm()) {
            loginButton.disabled = false;
        }
    }
}

/**
 * Reset the form after successful login
 */
function resetForm() {
    loginForm.reset();
    setLoadingState(false);

    // Remove validation classes
    usernameInput.classList.remove('success', 'error');
    passwordInput.classList.remove('success', 'error');
}

/**
 * Logout function (for demo purposes)
 */
function logout() {
    localStorage.removeItem('authData');
    resetForm();
    window.showSuccessMessage("You have been logged out successfully.");
}

// Initialize authentication module when DOM is loaded
document.addEventListener('DOMContentLoaded', initAuth);

// Expose logout function globally (for demo purposes)
window.logout = logout;
