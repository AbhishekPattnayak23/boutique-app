/**
 * Feedback module for user notifications
 * Implements throttling for failed login attempts to prevent brute force attacks
 * Provides visual feedback for user actions
 */
(function() {
    // Check for required dependencies before executing
    if (!document || !window) {
        console.error('Required DOM APIs are not available');
        return;
    }

    // DOM element for feedback container
    const feedbackContainer = document.getElementById('feedbackContainer');

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
     * Display success feedback message
     * @param {string} message - Success message to display
     */
    function showSuccessFeedback(message) {
        // Clear any existing feedback
        feedbackContainer.classList.remove('error', 'success');

        // Create success message with icon
        feedbackContainer.innerHTML = `
            <img src="assets/images/icons/success.svg" alt="Success" class="feedback-icon">
            ${message}
        `;

        // Apply success styling
        feedbackContainer.classList.add('success');

        // Ensure the feedback is visible
        feedbackContainer.style.display = 'flex';

        // Scroll to top of container for visibility
        feedbackContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Display error feedback message
     * @param {string} message - Error message to display
     */
    function showErrorFeedback(message) {
        // Clear any existing feedback
        feedbackContainer.classList.remove('error', 'success');

        // Create error message with icon
        feedbackContainer.innerHTML = `
            <img src="assets/images/icons/error.svg" alt="Error" class="feedback-icon">
            ${message}
        `;

        // Apply error styling
        feedbackContainer.classList.add('error');

        // Ensure the feedback is visible
        feedbackContainer.style.display = 'flex';

        // Add subtle shake animation for emphasis
        feedbackContainer.animate(
            [
                { transform: 'translateX(-5px)' },
                { transform: 'translateX(5px)' },
                { transform: 'translateX(-5px)' },
                { transform: 'translateX(0)' }
            ],
            {
                duration: 300,
                iterations: 1
            }
        );

        // Scroll to top of container for visibility
        feedbackContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Show feedback to the user
     * @param {string} message - Feedback message
     * @param {boolean} isSuccess - Whether it's a success message
     */
    function showFeedback(message, isSuccess) {
        try {
            if (isSuccess) {
                showSuccessFeedback(message);
            } else {
                showErrorFeedback(message);
            }
            
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
     * Clear all feedback messages
     */
    function clearFeedback() {
        feedbackContainer.innerHTML = '';
        feedbackContainer.classList.remove('error', 'success');
        feedbackContainer.style.display = 'none';
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
            
            // Add clear feedback on input focus
            const formInputs = document.querySelectorAll('input');

            formInputs.forEach(input => {
                input.addEventListener('focus', () => {
                    // Only clear feedback if it's an error
                    if (feedbackContainer.classList.contains('error')) {
                        clearFeedback();
                    }
                });
            });
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
        showSuccessFeedback,
        showErrorFeedback,
        clearFeedback,
        isAccountLocked,
        getRemainingLockoutTime
    };
})();
/**
 * Feedback module - Non-blocking user feedback system
 */
(function() {
    'use strict';

    // Cache DOM elements
    const notificationArea = document.getElementById('notificationArea');

    // Configuration
    const DEFAULT_DURATION = 5000; // 5 seconds
    const MAX_NOTIFICATIONS = 3; // Maximum number of visible notifications

    // Track active notifications
    let activeNotifications = [];

    /**
     * Create and display a notification message
     * @param {string} message - The message to display
     * @param {string} type - The type of notification ('success', 'error', etc)
     * @param {number} [duration] - How long to display the notification (ms)
     */
    function showMessage(message, type = 'success', duration = DEFAULT_DURATION) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.setAttribute('role', 'alert');

        // Create notification content
        const iconName = type === 'success' ? 'success' : 'error';
        notification.innerHTML = `
            <img src="assets/images/icons/${iconName}.svg" alt="${type} icon" class="notification-icon">
            <div class="notification-message">${message}</div>
        `;

        // Manage notification limit
        if (activeNotifications.length >= MAX_NOTIFICATIONS) {
            const oldestNotification = activeNotifications.shift();
            removeNotification(oldestNotification);
        }

        // Add to DOM
        notificationArea.appendChild(notification);
        activeNotifications.push(notification);

        // Trigger animation (in next frame to ensure transition works)
        requestAnimationFrame(() => {
            notification.classList.add('visible');
        });

        // Set up auto-dismiss
        const dismissTimeout = setTimeout(() => {
            removeNotification(notification);
        }, duration);

        // Allow manual dismissal
        notification.addEventListener('click', () => {
            clearTimeout(dismissTimeout);
            removeNotification(notification);
        });

        // Accessibility: pause timeout on hover or focus
        notification.addEventListener('mouseenter', () => {
            clearTimeout(dismissTimeout);
        });

        notification.addEventListener('mouseleave', () => {
            const newTimeout = setTimeout(() => {
                removeNotification(notification);
            }, duration);

            // Update the timeout reference
            notification._dismissTimeout = newTimeout;
        });

        return notification;
    }

    /**
     * Remove a notification with animation
     * @param {HTMLElement} notification - The notification element to remove
     */
    function removeNotification(notification) {
        if (!notification || !notification.parentNode) return;

        // Clear any existing timeout
        if (notification._dismissTimeout) {
            clearTimeout(notification._dismissTimeout);
        }

        // Start exit animation
        notification.classList.remove('visible');

        // Remove after animation completes
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }

            // Remove from active notifications array
            const index = activeNotifications.indexOf(notification);
            if (index !== -1) {
                activeNotifications.splice(index, 1);
            }
        }, 300); // Match transition duration in CSS
    }

    /**
     * Clear all notifications
     */
    function clearAllNotifications() {
        // Create a copy of the array to avoid modification during iteration
        const notifications = [...activeNotifications];
        notifications.forEach(notification => {
            removeNotification(notification);
        });

        // Clear the array
        activeNotifications = [];
    }

    /**
     * Initialize feedback system
     */
    function init() {
        // Ensure notification area exists
        if (!notificationArea) {
            console.error('Notification area not found in DOM');
            return;
        }

        // Set ARIA attributes for accessibility
        notificationArea.setAttribute('aria-live', 'polite');
        notificationArea.setAttribute('role', 'region');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose public API
    window.feedbackManager = {
        showMessage,
        clearAllNotifications
    };
})();
