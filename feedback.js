/**
 * User Feedback Module
 * Provides visual feedback for form interactions
 */

// Self-invoking function to avoid polluting global namespace
(function() {
  // Configuration
  const config = {
    animationDuration: 300, // ms
    notificationTimeout: 5000 // ms
  };

  // Notification types
  const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
    WARNING: 'warning'
  };

  // Create notification container if it doesn't exist
  function ensureNotificationContainer() {
    let container = document.querySelector('.notification-container');

    if (!container) {
      container = document.createElement('div');
      container.className = 'notification-container';
      document.body.appendChild(container);

      // Add styles dynamically
      const style = document.createElement('style');
      style.textContent = `
        .notification-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999;
          width: 300px;
        }

        .notification {
          padding: 15px;
          margin-bottom: 15px;
          border-radius: 4px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          font-size: 14px;
          opacity: 0;
          transform: translateX(50px);
          transition: all ${config.animationDuration}ms ease;
        }

        .notification.visible {
          opacity: 1;
          transform: translateX(0);
        }

        .notification.success {
          background-color: #d4edda;
          border-left: 4px solid #28a745;
          color: #155724;
        }

        .notification.error {
          background-color: #f8d7da;
          border-left: 4px solid #dc3545;
          color: #721c24;
        }

        .notification.info {
          background-color: #d1ecf1;
          border-left: 4px solid #17a2b8;
          color: #0c5460;
        }

        .notification.warning {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          color: #856404;
        }

        .notification-close {
          float: right;
          cursor: pointer;
          font-weight: bold;
        }
      `;
      document.head.appendChild(style);
    }

    return container;
  }

  // Create and show a notification
  function showNotification(message, type = NOTIFICATION_TYPES.INFO) {
    const container = ensureNotificationContainer();

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <span class="notification-close">&times;</span>
      ${message}
    `;

    // Add to container
    container.appendChild(notification);

    // Add close event
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      closeNotification(notification);
    });

    // Show with animation
    setTimeout(() => {
      notification.classList.add('visible');
    }, 10);

    // Auto-close after timeout
    setTimeout(() => {
      closeNotification(notification);
    }, config.notificationTimeout);

    return notification;
  }

  // Close a notification
  function closeNotification(notification) {
    notification.classList.remove('visible');

    setTimeout(() => {
      notification.remove();
    }, config.animationDuration);
  }

  // Public API
  window.Feedback = {
    showSuccess: (message) => showNotification(message, NOTIFICATION_TYPES.SUCCESS),
    showError: (message) => showNotification(message, NOTIFICATION_TYPES.ERROR),
    showInfo: (message) => showNotification(message, NOTIFICATION_TYPES.INFO),
    showWarning: (message) => showNotification(message, NOTIFICATION_TYPES.WARNING)
  };
})();
