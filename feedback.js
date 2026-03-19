/**
 * Feedback Module
 * Handles displaying notification messages to users
 */

/**
 * Display feedback message to the user
 * @param {string} type - Type of message (success, error, info, warning)
 * @param {string} message - The message to display
 * @param {number} duration - How long to show the message (ms), default 5000ms
 */
function displayFeedback(type, message, duration = 5000) {
  // Validate inputs
  if (!type || !message) {
    console.error('Feedback requires both type and message');
    return;
  }

  // Validate type
  const validTypes = ['success', 'error', 'info', 'warning'];
  if (!validTypes.includes(type)) {
    console.error(`Invalid feedback type: ${type}. Must be one of: ${validTypes.join(', ')}`);
    type = 'info'; // Default to info
  }

  // Log to console for debugging
  console.log(`FEEDBACK [${type}]: ${message}`);

  // Get or create feedback container
  let feedbackContainer = document.getElementById('feedback-container');
  if (!feedbackContainer) {
    feedbackContainer = document.createElement('div');
    feedbackContainer.id = 'feedback-container';
    document.body.appendChild(feedbackContainer);
  }

  // Create feedback message element
  const feedbackElement = document.createElement('div');
  feedbackElement.className = `feedback-message ${type}`;

  // Add icon based on type
  const iconMap = {
    success: '',
    error: '',
    info: '',
    warning: ''
  };

  // Create content
  feedbackElement.innerHTML = `
    <span class="feedback-icon">${iconMap[type] || ''}</span>
    <span class="feedback-text">${escapeHtml(message)}</span>
    <button class="feedback-close">&times;</button>
  `;

  // Add to container
  feedbackContainer.appendChild(feedbackElement);

  // Add close button functionality
  const closeButton = feedbackElement.querySelector('.feedback-close');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      removeFeedback(feedbackElement);
    });
  }

  // Auto-remove after duration
  if (duration > 0) {
    setTimeout(() => {
      removeFeedback(feedbackElement);
    }, duration);
  }

  // Animate in
  setTimeout(() => {
    feedbackElement.classList.add('visible');
  }, 10);
}

/**
 * Remove feedback element with animation
 * @param {HTMLElement} element - The feedback element to remove
 */
function removeFeedback(element) {
  if (!element) return;

  element.classList.remove('visible');

  // Wait for transition to complete before removing
  setTimeout(() => {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }, 300);
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
  if (!text) return '';

  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, m => map[m]);
}

// Expose API
window.displayFeedback = displayFeedback;
