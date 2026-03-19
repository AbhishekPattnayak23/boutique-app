/**
 * User Feedback Module
 * Provides visual feedback for form interactions
 */

// Feedback display configuration
const feedbackConfig = {
  displayTime: 5000, // Default display time in ms
  position: 'top-right' // Default position
};

// Feedback controller
class FeedbackManager {
  constructor(config = {}) {
    this.config = { ...feedbackConfig, ...config };
    this.container = this.createFeedbackContainer();
  }

  // Create feedback container
  createFeedbackContainer() {
    const container = document.createElement('div');
    container.className = 'feedback-container';
    container.style.position = 'fixed';
    container.style.zIndex = '1000';

    // Position based on config
    switch (this.config.position) {
      case 'top-right':
        container.style.top = '20px';
        container.style.right = '20px';
        break;
      case 'top-left':
        container.style.top = '20px';
        container.style.left = '20px';
        break;
      case 'bottom-right':
        container.style.bottom = '20px';
        container.style.right = '20px';
        break;
      case 'bottom-left':
        container.style.bottom = '20px';
        container.style.left = '20px';
        break;
      default:
        container.style.top = '20px';
        container.style.right = '20px';
    }

    document.body.appendChild(container);
    return container;
  }

  // Show a feedback message
  show(message, type = 'info', duration = this.config.displayTime) {
    const feedback = document.createElement('div');
    feedback.className = `feedback feedback-${type}`;
    feedback.innerHTML = `<p>${message}</p>`;

    // Style the feedback element
    feedback.style.padding = '12px 20px';
    feedback.style.margin = '10px 0';
    feedback.style.borderRadius = '4px';
    feedback.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    feedback.style.opacity = '0';
    feedback.style.transition = 'opacity 0.3s ease';

    // Type-specific styling
    switch (type) {
      case 'success':
        feedback.style.backgroundColor = '#f0fff4';
        feedback.style.color = '#257942';
        feedback.style.border = '1px solid #48c774';
        break;
      case 'error':
        feedback.style.backgroundColor = '#fff5f7';
        feedback.style.color = '#cd0930';
        feedback.style.border = '1px solid #ff3860';
        break;
      case 'warning':
        feedback.style.backgroundColor = '#fffbeb';
        feedback.style.color = '#947600';
        feedback.style.border = '1px solid #ffdd57';
        break;
      default:
        feedback.style.backgroundColor = '#f6f9fe';
        feedback.style.color = '#2160c4';
        feedback.style.border = '1px solid #3273dc';
    }

    // Add to container and animate in
    this.container.appendChild(feedback);
    setTimeout(() => {
      feedback.style.opacity = '1';
    }, 10);

    // Remove after duration
    setTimeout(() => {
      feedback.style.opacity = '0';
      setTimeout(() => {
        if (feedback.parentNode) {
          this.container.removeChild(feedback);
        }
      }, 300);
    }, duration);

    return feedback;
  }

  // Show success feedback
  success(message, duration) {
    return this.show(message, 'success', duration);
  }

  // Show error feedback
  error(message, duration) {
    return this.show(message, 'error', duration);
  }

  // Show warning feedback
  warning(message, duration) {
    return this.show(message, 'warning', duration);
  }

  // Show info feedback
  info(message, duration) {
    return this.show(message, 'info', duration);
  }
}

// Initialize feedback manager when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  try {
    window.feedbackManager = new FeedbackManager();
    console.log('Feedback manager initialized successfully');
  } catch (error) {
    console.error('Failed to initialize feedback manager:', error);
  }
});

// Export the FeedbackManager class
window.FeedbackManager = FeedbackManager;
