/**
 * Authentication module - Handles secure form submission and authentication state
 */
(function() {
    'use strict';

    // Cache DOM elements
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('rememberMe');

    // Demo credentials (in real app, this would be server-side validation)
    const DEMO_USER = {
        email: 'demo@example.com',
        // In a real app, this would be a hashed password stored securely server-side
        password: 'Password123!'
    };

    // CSRF Token generation - simulated for client-side demo
    let csrfToken = generateCSRFToken();

    /**
     * Generate a random CSRF token
     * @returns {string} - A random token for CSRF protection
     */
    function generateCSRFToken() {
        // In a real application, this would come from the server
        return Array.from(window.crypto.getRandomValues(new Uint8Array(16)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    /**
     * Store authentication state in localStorage
     * @param {string} token - Authentication token
     * @param {boolean} remember - Whether to persist the session
     */
    function setAuthState(token, remember) {
        // Store authentication token securely
        // In production, use HttpOnly cookies instead of localStorage
        if (remember) {
            localStorage.setItem('authToken', token);
            localStorage.setItem('authExpiry', Date.now() + (7 * 24 * 60 * 60 * 1000)); // 1 week expiry
        } else {
            // Session storage for non-remember-me
            sessionStorage.setItem('authToken', token);
        }
    }

    /**
     * Clear authentication state
     */
    function clearAuthState() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authExpiry');
        sessionStorage.removeItem('authToken');
    }

    /**
     * Check if user is authenticated
     * @returns {boolean} - Whether the user is authenticated
     */
    function isAuthenticated() {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const expiry = localStorage.getItem('authExpiry');

        if (!token) return false;

        // Check expiry for persistent sessions
        if (expiry && Date.now() > parseInt(expiry, 10)) {
            clearAuthState();
            return false;
        }

        return true;
    }

    /**
     * Redirect to dashboard if authenticated
     */
    function redirectIfAuthenticated() {
        if (isAuthenticated()) {
            window.location.href = 'dashboard.html';
        }
    }

    /**
     * Handle form submission
     * @param {Event} e - Form submission event
     */
    async function handleSubmit(e) {
        e.preventDefault();

        // Perform form validation
        if (!window.formValidator || !window.formValidator.validateForm()) {
            window.feedbackManager.showMessage('Please correct errors before submitting', 'error');
            return;
        }

        // Show loading state
        loginButton.classList.add('loading');

        try {
            // Simulate network delay for demonstration
            await simulateNetworkDelay();

            // Get form values
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const rememberMe = rememberMeCheckbox.checked;

            // Authenticate user (demo implementation - in real app, this would be a server call)
            const authResult = authenticateUser(email, password);

            if (authResult.success) {
                // Store authentication state
                setAuthState(authResult.token, rememberMe);

                // Show success message
                window.feedbackManager.showMessage('Login successful! Redirecting...', 'success');

                // Redirect after a short delay
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                // Show error message
                window.feedbackManager.showMessage(authResult.message, 'error');

                // Reset the form for security after failed login
                passwordInput.value = '';
                passwordInput.focus();
            }
        } catch (error) {
            console.error('Authentication error:', error);
            window.feedbackManager.showMessage('An unexpected error occurred. Please try again later.', 'error');
        } finally {
            // Hide loading state
            loginButton.classList.remove('loading');
        }
    }

    /**
     * Simulate a network delay (for demonstration purposes)
     * @returns {Promise} - Resolves after a short delay
     */
    function simulateNetworkDelay() {
        return new Promise(resolve => setTimeout(resolve, 800));
    }

    /**
     * Authenticate user with demo credentials
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Object} - Authentication result
     */
    function authenticateUser(email, password) {
        // Demo implementation - in real app, this would be a server API call
        if (email === DEMO_USER.email && password === DEMO_USER.password) {
            return {
                success: true,
                token: `demo_token_${Date.now()}_${csrfToken}`,
                message: 'Authentication successful'
            };
        }

        return {
            success: false,
            message: 'Invalid email or password. Try again or click "Forgot Password" to reset it.'
        };
    }

    /**
     * Initialize authentication module
     */
    function init() {
        // Check if already authenticated
        redirectIfAuthenticated();

        // Add form submission handler
        if (loginForm) {
            loginForm.addEventListener('submit', handleSubmit);
        }

        // CSRF protection - Add token to forms
        if (loginForm) {
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = 'csrf_token';
            csrfInput.value = csrfToken;
            loginForm.appendChild(csrfInput);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose public API
    window.authManager = {
        isAuthenticated,
        clearAuthState,
        csrfToken
    };
})();
