/**
 * input_nama.html page logic
 * Handles user name input form
 */

document.addEventListener('DOMContentLoaded', function () {
  // Initialize shared utilities
  preventScrollAndZoom();
  initializeSakuraAnimation();
  updateCopyrightYear();
  initPageTransition();

  // Get form elements
  const nameForm = document.getElementById('nameForm');
  const namaInput = document.getElementById('namaInput');

  // Handle form submission
  nameForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const nama = namaInput.value.trim();

    // Validate input
    if (!nama) {
      alert('Mohon masukkan nama Anda');
      return;
    }

    // Save name and redirect
    saveUserName(nama);
    navigateWithTransition('welcome.html');
  });

  // Optional: Auto-focus input on page load
  namaInput.focus();
});
