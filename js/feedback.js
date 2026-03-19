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
