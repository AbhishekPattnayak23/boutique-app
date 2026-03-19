/**
 * Feedback module for user notifications
 * Implements throttling for failed login attempts to prevent brute force attacks
 */
(function() {
    // Check for required dependencies before executing
    if (!document || !window) {
        console.error('Required DOM APIs are not available');
        return;
    }

    // Throttling configuration
    const MAX_FAILED_ATTEMPTS = 5;  // Maximum allowed failed attempts
    const LOCKOUT_DURATION = 30;    // Lockout duration in seconds
    const ATTEMPT_RESET_TIME = 60 * 60 * 1000;  // Reset failed attempts after 1 hour

    // Storage keys
    const FAILED_ATTEMPTS_KEY = 'failedLoginAttempts';
    const FIRST_ATTEMPT_TIME_KEY = 'firstFailedAttemptTime';
    const LOCKOUT_TIME_KEY = 'accountLockoutTime';

    /**
     * Get the number of failed login attempts
     * @returns {number} - Number of failed attempts
     */
    function getFailedAttempts() {
        try {
            const attempts = parseInt(sessionStorage.getItem(FAILED_ATTEMPTS_KEY) || '0', 10);
            const firstAttemptTime = parseInt(sessionStorage.getItem(FIRST_ATTEMPT_TIME_KEY) || '0', 10);

            // Reset if first attempt was more than ATTEMPT_RESET_TIME ago
            if (firstAttemptTime && (Date.now() - firstAttemptTime > ATTEMPT_RESET_TIME)) {
                resetFailedAttempts();
                return 0;
            }

            return attempts;
        } catch (error) {
            console.error('Failed to get attempt count:', error);
            return 0;
        }
    }

    /**
     * Record a failed login attempt
     */
    function recordFailedAttempt() {
        try {
            const attempts = getFailedAttempts() + 1;
            sessionStorage.setItem(FAILED_ATTEMPTS_KEY, attempts.toString());

            // Record the time of the first attempt
            if (attempts === 1) {
                sessionStorage.setItem(FIRST_ATTEMPT_TIME_KEY, Date.now().toString());
            }

            // Check if we need to lock the account
            if (attempts >= MAX_FAILED_ATTEMPTS) {
                lockAccount();
            }
        } catch (error) {
            console.error('Failed to record attempt:', error);
        }
    }

    /**
     * Reset failed attempts counter
     */
    function resetFailedAttempts() {
        try {
            sessionStorage.removeItem(FAILED_ATTEMPTS_KEY);
            sessionStorage.removeItem(FIRST_ATTEMPT_TIME_KEY);
        } catch (error) {
            console.error('Failed to reset attempts:', error);
        }
    }

    /**
     * Lock the account for LOCKOUT_DURATION seconds
     */
    function lockAccount() {
        try {
            const lockoutUntil = Date.now() + (LOCKOUT_DURATION * 1000);
            sessionStorage.setItem(LOCKOUT_TIME_KEY, lockoutUntil.toString());
        } catch (error) {
            console.error('Failed to lock account:', error);
        }
    }

    /**
     * Check if account is currently locked
     * @returns {boolean} - Whether account is locked
     */
    function isAccountLocked() {
        try {
            const lockoutTime = parseInt(sessionStorage.getItem(LOCKOUT_TIME_KEY) || '0', 10);
            return lockoutTime > Date.now();
        } catch (error) {
            console.error('Failed to check lock status:', error);
            return false;
        }
    }

    /**
     * Get remaining lockout time in seconds
     * @returns {number} - Remaining time in seconds
     */
    function getRemainingLockoutTime() {
        try {
            const lockoutTime = parseInt(sessionStorage.getItem(LOCKOUT_TIME_KEY) || '0', 10);
            const remainingMs = Math.max(0, lockoutTime - Date.now());
            return Math.ceil(remainingMs / 1000);
        } catch (error) {
            console.error('Failed to get lockout time:', error);
            return 0;
        }
    }

    /**
     * Show feedback to the user
     * @param {string} message - Feedback message
     * @param {boolean} isSuccess - Whether it's a success message
     */
    function showFeedback(message, isSuccess) {
        try {
            const feedbackElement = document.getElementById('loginFeedback');
            if (feedbackElement) {
                feedbackElement.textContent = message;
                feedbackElement.className = `login-feedback ${isSuccess ? 'success' : 'error'}`;
                feedbackElement.style.display = 'block';
            }
        } catch (error) {
            console.error('Failed to show feedback:', error);
        }
    }

    /**
     * Process login result with throttling for failed attempts
     * @param {boolean} success - Whether the login was successful
     * @param {string} message - Feedback message
     * @returns {boolean} - Whether to proceed with login
     */
    function processLoginResult(success, message) {
        try {
            // Check if account is locked
            if (isAccountLocked()) {
                const remainingTime = getRemainingLockoutTime();
                showFeedback(
                    `Too many failed attempts. Please try again in ${remainingTime} seconds.`,
                    false
                );
                return false;
            }

            // Process based on success/failure
            if (success) {
                // Reset failed attempts on successful login
                resetFailedAttempts();
                showFeedback(message, true);
                return true;
            } else {
                // Record failed attempt
                recordFailedAttempt();

                // Get remaining attempts
                const attempts = getFailedAttempts();
                const remainingAttempts = MAX_FAILED_ATTEMPTS - attempts;

                if (remainingAttempts > 0) {
                    showFeedback(
                        `${message}. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining before temporary lockout.`,
                        false
                    );
                } else {
                    showFeedback(
                        `Too many failed attempts. Please try again in ${LOCKOUT_DURATION} seconds.`,
                        false
                    );
                }
                return false;
            }
        } catch (error) {
            console.error('Failed to process login result:', error);
            showFeedback('An error occurred processing your login', false);
            return false;
        }
    }

    /**
     * Initialize the feedback system
     */
    function init() {
        try {
            // Setup form submission to use our feedback system
            const loginForm = document.getElementById('loginForm');

            if (loginForm) {
                // We'll let auth.js handle the actual form submission
                console.info('Feedback system initialized');
            }
        } catch (error) {
            console.error('Feedback initialization failed:', error);
        }
    }

    // Initialize feedback system when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose public methods
    window.feedbackManager = {
        processLoginResult,
        showFeedback,
        isAccountLocked,
        getRemainingLockoutTime
    };
})();
