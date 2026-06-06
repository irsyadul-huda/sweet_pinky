/**
 * Shared utility functions
 * Used across multiple pages
 */

/**
 * Smooth page transition when navigating to another page
 * @param {string} url - Target URL to navigate to
 */
function navigateWithTransition(url) {
  document.body.classList.remove('page-visible');
  document.body.style.opacity = '0';
  document.body.style.transform = 'scale(0.95)';
  
  setTimeout(() => {
    window.location.href = url;
  }, 300);
}

/**
 * Initialize page visibility when DOM loads
 */
function initPageTransition() {
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.body.classList.add('page-visible');
    }, 50);
  });
  
  // Handle browser back/forward
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      document.body.classList.add('page-visible');
    }
  });
}

/**
 * Prevent page scrolling and zoom gestures
 * Maintains functionality for input/textarea elements
 */
function preventScrollAndZoom() {
  document.addEventListener(
    'touchmove',
    function (e) {
      if (
        e.target.tagName !== 'INPUT' &&
        e.target.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
  });
}

/**
 * Create floating sakura animation elements
 * Adds a single sakura element with random properties
 */
function getSakuraSVG() {
  const color1 = getComputedStyle(document.documentElement).getPropertyValue('--sakura-color-1').trim();
  const color2 = getComputedStyle(document.documentElement).getPropertyValue('--sakura-color-2').trim();
  
  // Encode the colors for data URL
  const encodedColor1 = encodeURIComponent(color1);
  const encodedColor2 = encodeURIComponent(color2);
  
  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='${encodedColor1}' stop-opacity='0.8'/%3E%3Cstop offset='100%25' stop-color='${encodedColor2}' stop-opacity='0.2'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath fill='url(%23grad)' d='M50 15 C70 35, 75 60, 50 85 C25 60, 30 35, 50 15 Z'/%3E%3C/svg%3E")`;
}


function createSakura() {
  const container = document.getElementById('sakuraContainer');
  if (!container) return;

  const sakura = document.createElement('div');
  sakura.classList.add('sakura');

  // Set background image with current colors
  sakura.style.backgroundImage = getSakuraSVG();

  // Random horizontal position
  sakura.style.left = Math.random() * 100 + '%';

  // Random size between 15px and 30px
  const size = Math.random() * 15 + 15;
  sakura.style.width = size + 'px';
  sakura.style.height = size + 'px';

  // Random animation duration between 6s and 12s
  sakura.style.animationDuration = Math.random() * 6 + 6 + 's';

  // Random initial rotation
  const initialRotation = Math.random() * 360;
  sakura.style.transform = `rotate(${initialRotation}deg)`;

  container.appendChild(sakura);

  // Remove element after animation completes
  setTimeout(() => {
    sakura.remove();
  }, 12000);
}

/**
 * Initialize sakura animation loop
 * Creates new sakura elements at regular intervals
 */
function initializeSakuraAnimation() {
  setInterval(createSakura, 300);
}

/**
 * Update copyright year dynamically
 * Finds all elements with 'current-year' class and updates with current year
 */
function updateCopyrightYear() {
  document.querySelectorAll('.current-year').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

/**
 * Fade in audio with smooth volume transition
 * @param {HTMLAudioElement} audio - Audio element to fade in
 * @param {number} duration - Duration of fade in (milliseconds)
 * @param {number} maxVolume - Target maximum volume (0-1)
 */
function fadeInAudio(audio, duration, maxVolume) {
  let currentTime = 0;
  const increment = maxVolume / (duration / 50);

  const interval = setInterval(() => {
    currentTime += 50;
    if (audio.volume < maxVolume) {
      audio.volume = Math.min(audio.volume + increment, maxVolume);
    } else {
      clearInterval(interval);
    }
  }, 50);
}

/**
 * Fade out audio with smooth volume transition
 * @param {HTMLAudioElement} audio - Audio element to fade out
 * @param {duration} duration - Duration of fade out (milliseconds)
 * @param {function} callback - Function to call when fade out completes
 */
function fadeOutAudio(audio, duration, callback) {
  const startVolume = audio.volume;
  const decrement = startVolume / (duration / 50);

  const interval = setInterval(() => {
    if (audio.volume > 0) {
      audio.volume = Math.max(audio.volume - decrement, 0);
    } else {
      clearInterval(interval);
      if (callback) callback();
    }
  }, 50);
}

/**
 * Get user name from localStorage
 * @returns {string} User name or empty string if not set
 */
function getUserName() {
  return localStorage.getItem('userName') || '';
}

/**
 * Save user name to localStorage
 * @param {string} name - User name to save
 */
function saveUserName(name) {
  localStorage.setItem('userName', name);
}

// Export functions for use in other modules (if using ES6 modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    preventScrollAndZoom,
    createSakura,
    initializeSakuraAnimation,
    updateCopyrightYear,
    fadeInAudio,
    fadeOutAudio,
    getUserName,
    saveUserName,
  };
}
