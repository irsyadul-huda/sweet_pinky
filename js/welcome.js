/**
 * welcome.html page logic
 * Handles welcome page animations and auto-redirect
 */

document.addEventListener('DOMContentLoaded', function () {
  // Initialize shared utilities
  preventScrollAndZoom();
  initializeSakuraAnimation();
  updateCopyrightYear();
  initPageTransition();

  // Get page elements
  const welcomeText = document.getElementById('welcomeText');
  const welcomeMusic = document.getElementById('welcomeMusic');

  // Get username from localStorage
  const userName = getUserName();

  if (!userName) {
    // Redirect to input page if no username
    navigateWithTransition('input_nama.html');
    return;
  }

  // Set welcome greeting with user's name
  welcomeText.innerHTML = `Selamat Datang <strong>${escapeHtml(userName)}</strong>`;

  // Quotes array
  const quotes = [
    'Aku kira kagum itu hanya singgah, ternyata ia memilih tinggal. Sejak mengenalmu, bahkan malam pun jadi lebih ramah dan angin sering membawa namamu pulang ke pikiranku.',
  ];

  // Display quotes
  const quotesElement = document.getElementById('quotes');
  quotes.forEach((quote) => {
    const p = document.createElement('p');
    p.textContent = quote;
    p.style.marginBottom = '8px';
    quotesElement.appendChild(p);
  });

  // Initialize music
  welcomeMusic.volume = 0;

  // Start music fade in
  welcomeMusic.play().catch((error) => {
    console.warn('Audio autoplay prevented:', error);
  });

  fadeInAudio(welcomeMusic, 3000, 0.7);

  // Auto-redirect after 18 seconds
  const REDIRECT_DELAY = 18000; // 18 seconds

  setTimeout(() => {
    fadeOutAudio(welcomeMusic, 2000, () => {
      navigateWithTransition('beranda.html');
    });
  }, REDIRECT_DELAY);
});

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
