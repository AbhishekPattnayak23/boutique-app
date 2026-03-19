/**
 * Authentication module for secure login processing
 * Implements secure token storage and CSRF protection
 */
(function() {
    // Check for required dependencies before executing
    if (!document || !window) {
        console.error('Required DOM APIs are not available');
        return;
    }

    // Authentication token storage keys
    const AUTH_TOKEN_KEY = 'authToken';
    const AUTH_EXPIRY_KEY = 'authExpiry';
    const USER_KEY = 'user';

    // CSRF token length
    const CSRF_TOKEN_LENGTH = 32;

    // Mock credentials for testing
    const VALID_CREDENTIALS = {
        email: 'user@example.com',
        password: 'SecureP@ss123'
    };

    /**
     * Generate a random CSRF token to protect against CSRF attacks
     * @param {number} length - Length of the token
     * @returns {string} - Random token
     */
    function generateCSRFToken(length = CSRF_TOKEN_LENGTH) {
        try {
            const array = new Uint8Array(length);
            window.crypto.getRandomValues(array);
            return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
        } catch (error) {
            console.error('Failed to generate CSRF token:', error);
            // Fallback method for older browsers
            let token = '';
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for (let i = 0; i < length; i++) {
                token += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return token;
        }
    }

    /**
     * Securely store authentication token
     * Using a cookie-like approach without actually exposing tokens to JavaScript
     * @param {string} token - Auth token to store
     * @param {number} expiryMinutes - Token expiry time in minutes
     */
    function storeAuthToken(token, expiryMinutes = 30) {
        try {
            // Calculate expiry time
            const expiryTime = new Date();
            expiryTime.setMinutes(expiryTime.getMinutes() + expiryMinutes);

            // In a real app, this would set a httpOnly cookie via the server
            // For this demo, we'll simulate secure storage

            // Store expiry separately for validation
            sessionStorage.setItem(AUTH_EXPIRY_KEY, expiryTime.getTime());

            // Store a reference that the user is authenticated, but not the actual token
            // The actual token would be stored in a httpOnly cookie by the server
            sessionStorage.setItem(AUTH_TOKEN_KEY, 'authenticated-reference');

            console.info('Authentication token stored securely');
        } catch (error) {
            console.error('Failed to store authentication token:', error);
            throw new Error('Authentication storage failed');
        }
    }

    /**
     * Save authentication data to localStorage
     * @param {Object} authData - Authentication data including token
     */
    function saveAuthData(authData) {
        storeAuthToken(authData.token, 30);
        localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
        localStorage.setItem('loginTime', new Date().toISOString());
    }

    /**
     * Check if user is authenticated
     * @returns {boolean} - Authentication status
     */
    function isAuthenticated() {
        try {
            // Get expiry time
            const expiry = sessionStorage.getItem(AUTH_EXPIRY_KEY);
            if (!expiry) return false;

            // Check if token is expired
            if (Date.now() > parseInt(expiry, 10)) {
                // Clear expired token
                sessionStorage.removeItem(AUTH_TOKEN_KEY);
                sessionStorage.removeItem(AUTH_EXPIRY_KEY);
                return false;
            }

            // Check if auth reference exists
            return sessionStorage.getItem(AUTH_TOKEN_KEY) === 'authenticated-reference';
        } catch (error) {
            console.error('Authentication check failed:', error);
            return false;
        }
    }

    /**
     * Check if user is already logged in
     * Redirect to dashboard if authentication token exists
     */
    function checkAuthState() {
        if (isAuthenticated()) {
            // In a real app, we would validate the token here
            window.location.href = 'dashboard.html'; // Redirect to dashboard
        }
    }

    /**
     * Logout functionality - clear secure tokens
     */
    function logout() {
        try {
            sessionStorage.removeItem(AUTH_TOKEN_KEY);
            sessionStorage.removeItem(AUTH_EXPIRY_KEY);
            localStorage.removeItem(USER_KEY);
            localStorage.removeItem('loginTime');
            console.info('User logged out successfully');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    /**
     * Authenticate user with provided credentials
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise} - Authentication result promise
     */
    function authenticate(email, password) {
        // Simulating an API request with a promise
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                if (email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.password) {
                    resolve({
                        success: true,
                        user: {
                            email,
                            name: 'Test User',
                            id: 'user123'
                        },
                        token: generateCSRFToken(48)
                    });
                } else {
                    reject({
                        success: false,
                        error: 'Invalid email or password'
                    });
                }
            }, 1000); // 1 second delay to simulate network request
        });
    }

    /**
     * Display feedback to the user
     * @param {string} message - Feedback message
     * @param {boolean} success - Whether it's a success message
     */
    function showFeedback(message, success) {
        try {
            const feedbackElement = document.getElementById('loginFeedback');
            if (feedbackElement) {
                feedbackElement.textContent = message;
                feedbackElement.className = 'login-feedback ' + (success ? 'success' : 'error');
            } else {
                console.error('Feedback element not found');
            }
        } catch (error) {
            console.error('Failed to show feedback:', error);
        }
    }

    function showSuccessFeedback(message) {
        showFeedback(message, true);
    }

    function showErrorFeedback(message) {
        showFeedback(message, false);
    }

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} - Validation result
     */
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate password requirements
     * @param {string} password - Password to validate
     * @returns {boolean} - Validation result
     */
    function validatePassword(password) {
        return password && password.length >= 8;
    }

    /**
     * Update UI based on email validation
     * @param {string} email - Email to validate
     */
    function validateEmailUI(email) {
        const isValid = validateEmail(email);
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.classList.toggle('invalid', !isValid);
        }
    }

    /**
     * Update UI based on password validation
     * @param {string} password - Password to validate
     */
    function validatePasswordUI(password) {
        const isValid = validatePassword(password);
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.classList.toggle('invalid', !isValid);
        }
    }

    /**
     * Initialize the auth system
     */
    function init() {
        try {
            // Check auth state on page load
            checkAuthState();
            
            // Get references to form elements
            const loginForm = document.getElementById('loginForm');
            const csrfTokenInput = document.getElementById('csrfToken');
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const loginButton = document.getElementById('loginButton');

            // Generate and set CSRF token on page load
            if (csrfTokenInput) {
                csrfTokenInput.value = generateCSRFToken();
            } else {
                console.error('CSRF token input not found');
            }

            // Handle form submission
            if (loginForm) {
                loginForm.addEventListener('submit', async function(event) {
                    event.preventDefault();

                    // Get form data
                    const email = emailInput.value.trim();
                    const password = passwordInput.value.trim();
                    
                    // Get CSRF token if available
                    const csrfToken = csrfTokenInput ? csrfTokenInput.value : null;

                    // Validate CSRF token if it exists
                    if (csrfTokenInput && (!csrfToken || csrfToken.length !== CSRF_TOKEN_LENGTH)) {
                        showErrorFeedback('Security token missing or invalid');
                        return;
                    }

                    // Validate form fields
                    const isEmailValid = validateEmail(email);
                    const isPasswordValid = validatePassword(password);

                    // Only proceed if both fields are valid
                    if (isEmailValid && isPasswordValid) {
                        // Disable button and show loading state
                        loginButton.disabled = true;
                        loginButton.textContent = 'Logging in...';

                        try {
                            // Attempt authentication
                            const authResult = await authenticate(email, password);

                            // Save auth data on success
                            saveAuthData(authResult);

                            // Show success message
                            showSuccessFeedback('Login successful! Redirecting...');

                            // Redirect to dashboard after short delay
                            setTimeout(() => {
                                window.location.href = 'dashboard.html';
                            }, 1500);
                        } catch (error) {
                            // Show error message
                            showErrorFeedback(error.error || 'Authentication failed');

                            // Reset form for another attempt
                            loginButton.disabled = false;
                            loginButton.textContent = 'Login';
                            
                            // Refresh CSRF token after failed submission
                            if (csrfTokenInput) {
                                csrfTokenInput.value = generateCSRFToken();
                            }
                        }
                    } else {
                        // Show validation errors
                        validateEmailUI(email);
                        validatePasswordUI(password);

                        // Show general error message
                        showErrorFeedback('Please correct the errors and try again');
                    }
                });
            } else {
                console.error('Login form not found');
            }
        } catch (error) {
            console.error('Auth initialization failed:', error);
        }
    }

    // Initialize the auth system when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose public methods
    window.authManager = {
        isAuthenticated,
        logout
    };
})();
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
