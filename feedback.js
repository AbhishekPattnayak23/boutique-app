/**
 * Visual Feedback Module
 * Provides visual feedback for login attempts
 */

/**
 * FeedbackManager - Handles UI feedback for authentication processes
 */
class FeedbackManager {
    constructor(feedbackElementId = 'login-feedback') {
        this.feedbackElement = document.getElementById(feedbackElementId);
        if (!this.feedbackElement) {
            console.error(`Feedback element with ID "${feedbackElementId}" not found!`);
        }

        // Bind login form submission
        this.bindLoginForm();

        // Initialize logging
        this.logEvent('Feedback system initialized');
    }

    /**
     * Display a success message to the user
     * @param {string} message - The success message to display
     */
    showSuccess(message) {
        if (!this.feedbackElement) return;

        this.feedbackElement.className = 'feedback-container feedback-success';
        this.feedbackElement.textContent = message;
        this.logEvent(`Success: ${message}`);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideMessage();
        }, 5000);
    }

    /**
     * Display an error message to the user
     * @param {string} message - The error message to display
     */
    showError(message) {
        if (!this.feedbackElement) return;

        this.feedbackElement.className = 'feedback-container feedback-error';
        this.feedbackElement.textContent = message;
        this.logEvent(`Error: ${message}`);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideMessage();
        }, 5000);
    }

    /**
     * Display a loading message during async operations
     * @param {string} message - The loading message to display
     */
    showLoading(message = 'Processing your request...') {
        if (!this.feedbackElement) return;

        this.feedbackElement.className = 'feedback-container feedback-loading';
        this.feedbackElement.textContent = message;
        this.logEvent('Loading state activated');
    }

    /**
     * Hide the current feedback message
     */
    hideMessage() {
        if (!this.feedbackElement) return;

        this.feedbackElement.className = 'feedback-container';
        this.feedbackElement.textContent = '';
    }

    /**
     * Bind the login form submission to handle feedback
     */
    bindLoginForm() {
        const loginForm = document.getElementById('loginForm');

        if (!loginForm) {
            console.error('Login form not found!');
            return;
        }

        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Get form values
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;

            // Validate input client-side first
            if (!validateLoginForm(username, password)) {
                return;
            }

            // Show loading state
            this.showLoading('Authenticating...');

            try {
                // Attempt to authenticate user
                const result = await authenticateUser(username, password);

                // Handle authentication result
                if (result.success) {
                    this.showSuccess(result.message || 'Login successful!');

                    // Simulate redirect after successful login
                    setTimeout(() => {
                        this.showLoading('Redirecting to dashboard...');
                        // In a real app, this would redirect to another page
                    }, 1000);
                } else {
                    this.showError(result.message || 'Login failed.');
                }
            } catch (error) {
                // Handle authentication errors
                this.showError(error.message || 'An unexpected error occurred.');
                console.error('Authentication error:', error);
            }
        });
    }

    /**
     * Log events for debugging
     * @param {string} message - The message to log
     */
    logEvent(message) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${message}`);
    }
}

// Initialize feedback manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.feedbackManager = new FeedbackManager();
});
