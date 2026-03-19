/**
 * Authentication module
 * Handles login form submission and authentication logic
 */
document.addEventListener('DOMContentLoaded', () => {
    // Mock credentials for testing
    const VALID_CREDENTIALS = {
        email: 'user@example.com',
        password: 'password123'
    };

    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('loginButton');

    /**
     * Check if user is already logged in
     * Redirect to dashboard if authentication token exists
     */
    function checkAuthState() {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            // In a real app, we would validate the token here
            window.location.href = 'dashboard.html'; // Redirect to dashboard
        }
    }

    // Check auth state on page load
    checkAuthState();

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
                        token: 'mock-jwt-token-xyz'
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
     * Save authentication data to localStorage
     * @param {Object} authData - Authentication data including token
     */
    function saveAuthData(authData) {
        localStorage.setItem('authToken', authData.token);
        localStorage.setItem('user', JSON.stringify(authData.user));
        localStorage.setItem('loginTime', new Date().toISOString());
    }

    /**
     * Handle form submission
     * @param {Event} event - Form submission event
     */
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Get form values
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

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
            }
        } else {
            // Show validation errors
            validateEmailUI(email);
            validatePasswordUI(password);

            // Show general error message
            showErrorFeedback('Please correct the errors and try again');
        }
    });
});
