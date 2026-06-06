/**
 * Bottom navigation controller
 * Handles smooth navigation bar animation and active state management
 */

document.addEventListener('DOMContentLoaded', function () {
  const bottomNav = document.querySelector('.bottom-nav');
  const navBgPath = document.getElementById('navBgPath');
  const navClipPath = document.getElementById('navClipPath');
  const navDot = document.getElementById('navDot');
  const navList = document.querySelectorAll('.bottom-nav li');

  let currentIndex = 0;

  /**
   * Generate SVG path for bottom navigation with custom notch
   * Creates smooth curves for the active tab indicator
   * @param {number} width - Width of the navigation bar
   * @param {number} index - Active tab index (0-2)
   * @returns {string} SVG path string
   */
  function getNavPath(width, index) {
    const HEIGHT = 65; // Height of navigation bar
    const RADIUS = 25; // Corner radius
    const NOTCH_WIDTH = 60; // Width of the notch
    const NOTCH_DEPTH = 15; // Depth of the notch

    // Calculate center position of active tab
    const centerX = (width / 3) * index + width / 6;
    const notchStart = centerX - NOTCH_WIDTH / 2;
    const notchEnd = centerX + NOTCH_WIDTH / 2;

    // Build SVG path with smooth curves
    return `M ${RADIUS},${HEIGHT} 
            A ${RADIUS},${RADIUS} 0 0,1 0,${HEIGHT - RADIUS} 
            L 0,${RADIUS} 
            A ${RADIUS},${RADIUS} 0 0,1 ${RADIUS},0 
            L ${notchStart},0 
            C ${notchStart + 12},0 ${centerX - 10},${NOTCH_DEPTH} ${centerX},${NOTCH_DEPTH} 
            C ${centerX + 10},${NOTCH_DEPTH} ${notchEnd - 12},0 ${notchEnd},0 
            L ${width - RADIUS},0 
            A ${RADIUS},${RADIUS} 0 0,1 ${width},${RADIUS} 
            L ${width},${HEIGHT - RADIUS} 
            A ${RADIUS},${RADIUS} 0 0,1 ${width - RADIUS},${HEIGHT} 
            Z`;
  }

  /**
   * Update navigation visual state
   * Updates SVG path and dot position based on current active tab
   */
  function updateNavigation() {
    const width = bottomNav.clientWidth;
    const path = getNavPath(width, currentIndex);

    navBgPath.setAttribute('d', path);
    navClipPath.setAttribute('d', path);

    // Update dot position
    const dotX = (width / 3) * currentIndex + width / 6;
    navDot.style.transform = `translateX(${dotX - 5}px)`;
  }

  /**
   * Handle tab click
   * Updates active state and navigation visuals
   */
  function handleTabClick(e) {
    e.preventDefault();

    // Remove active class from all items
    navList.forEach((item) => item.classList.remove('active'));

    // Add active class to clicked item
    this.classList.add('active');

    // Update current index
    currentIndex = parseInt(this.getAttribute('data-index'));

    // Update navigation visuals
    updateNavigation();
  }

  // Attach click handlers to all navigation items
  navList.forEach((item) => {
    item.addEventListener('click', handleTabClick);
  });

  // Initial navigation setup
  updateNavigation();

  // Handle window resize to update navigation width
  window.addEventListener('resize', updateNavigation);
});
