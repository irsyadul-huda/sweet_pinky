/**
 * beranda.html page logic
 * Handles home page music player and navigation
 */

document.addEventListener('DOMContentLoaded', function () {
  // Initialize shared utilities
  preventScrollAndZoom();
  initializeSakuraAnimation();
  updateCopyrightYear();
  initPageTransition();

  // Initialize time-based greeting
  updateGreeting();

  // Initialize clock and date
  updateDateTime();
  setInterval(updateDateTime, 1000);

  // Initialize clock/date click interaction
  const datetimeContainer = document.querySelector('.datetime-container');
  if (datetimeContainer) {
    datetimeContainer.addEventListener('click', showGreetingWithHearts);
  }

  // Initialize music player
  initializeMusicPlayer();

  // Initialize bear tap interaction
  initBearInteraction();

  // Initialize night rest message (only between 01:00 - 04:00)
  initNightRestMessage();

  // Initialize wakeup Peachy popup bubble
  initWakeupBubble();

  // Optional: Update greeting every minute
  setInterval(updateGreeting, 60000);
});

/**
 * Update greeting based on current time
 * Shows different greeting and icon based on time of day
 */
function updateGreeting() {
  const hour = new Date().getHours();
  const weatherIcon = document.getElementById('weatherIcon');
  const weatherText = document.getElementById('weatherText');
  const userGreeting = document.getElementById('userGreeting');

  let greeting = '';
  let icon = '';

  if (hour < 5) {
    greeting = 'Tengah Malam';
    icon = '🌙';
  } else if (hour < 11) {
    greeting = 'Selamat Pagi';
    icon = '🌅';
  } else if (hour < 15) {
    greeting = 'Selamat Siang';
    icon = '☀️';
  } else if (hour < 19) {
    greeting = 'Selamat Sore';
    icon = '🌅';
  } else {
    greeting = 'Selamat Malam';
    icon = '🌙';
  }

  if (weatherIcon) weatherIcon.textContent = icon;
  if (weatherText) weatherText.textContent = greeting;

  const userName = getUserName();
  if (userGreeting && userName) {
    userGreeting.innerHTML = `Hai, <strong>${escapeHtml(userName)}</strong>`;
  }
}

/**
 * Initialize side music player controls
 */
function initializeMusicPlayer() {
  const bgMusic = document.getElementById('bgMusic');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const prevTrackBtn = document.getElementById('prevTrackBtn');
  const nextTrackBtn = document.getElementById('nextTrackBtn');
  const trackTitleEl = document.getElementById('audioTrackTitle');
  const volumeSlider = document.getElementById('volumeSlider');
  const volumeValue = document.getElementById('volumeValue');
  const muteBtn = document.getElementById('muteBtn');
  const audioEqualizer = document.getElementById('audioEqualizer');
  const sidePlayer = document.getElementById('sidePlayer');
  const sidePlayerToggle = document.getElementById('sidePlayerToggle');
  const volumeSliderContainer = volumeSlider
    ? volumeSlider.closest('.audio-volume-slider')
    : null;

  const playlist = [
    'bg_music/Nadhif-Basalamah-bergema-sampai-selamanya.mp3',
    'bg_music/ANDMESH  - ANUGERAH TERINDAH.mp3',
    'bg_music/Fiersa Besari - Pelukku untuk Pelikmu.mp3',
    'bg_music/Good Morning Everyone - Tunggu Aku.mp3',
    'bg_music/nadhif basalamah - penjaga hati.mp3'
  ];
  let currentTrackIndex = 0;
  let volumeBeforeMute = 70;
  let isMuted = false;

  if (!bgMusic) return;

  function updateTrackTitleUI(src) {
    if (!trackTitleEl) return;
    const filename = src.split('/').pop().replace('.mp3', '');
    const cleanTitle = filename.replace(/\s+/g, ' ').replace(/-/g, ' - ').trim();
    trackTitleEl.textContent = cleanTitle;
    trackTitleEl.title = cleanTitle;
  }

  function setPlayingState(isPlaying) {
    if (playPauseBtn) {
      playPauseBtn.classList.toggle('is-playing', isPlaying);
      playPauseBtn.setAttribute(
        'aria-label',
        isPlaying ? 'Jeda musik' : 'Putar musik'
      );
    }

    if (audioEqualizer) {
      audioEqualizer.classList.toggle('is-playing', isPlaying);
    }
  }

  function getVolumeLevel(value) {
    if (value <= 0) return 'mute';
    if (value < 35) return 'low';
    if (value < 70) return 'mid';
    return 'high';
  }

  function updateVolumeUI(value) {
    const clampedValue = Math.max(0, Math.min(100, Number(value)));

    if (volumeSlider) {
      volumeSlider.value = clampedValue;
      volumeSlider.setAttribute('aria-valuenow', String(clampedValue));
    }

    if (volumeValue) {
      volumeValue.textContent = `${clampedValue}%`;
    }

    if (volumeSliderContainer) {
      volumeSliderContainer.style.setProperty(
        '--volume-percent',
        `${clampedValue}%`
      );
    }

    if (muteBtn) {
      const level = isMuted ? 'mute' : getVolumeLevel(clampedValue);
      muteBtn.dataset.level = level;
      muteBtn.classList.toggle('is-muted', isMuted || clampedValue === 0);
      muteBtn.setAttribute(
        'aria-label',
        isMuted || clampedValue === 0 ? 'Nyalakan suara' : 'Bisukan suara'
      );
    }
  }

  function applyVolume(value) {
    const clampedValue = Math.max(0, Math.min(100, Number(value)));
    bgMusic.volume = clampedValue / 100;
    updateVolumeUI(clampedValue);
  }

  function playNextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    changeTrack(currentTrackIndex);
  }

  function playPrevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    changeTrack(currentTrackIndex);
  }

  function changeTrack(index) {
    bgMusic.src = playlist[index];
    updateTrackTitleUI(playlist[index]);
    bgMusic.play().catch(error => console.warn('Play audio track failed:', error));
  }

  // Set initial track source and title
  bgMusic.src = playlist[currentTrackIndex];
  updateTrackTitleUI(playlist[currentTrackIndex]);

  if (volumeSlider) {
    applyVolume(volumeSlider.value);
  }

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', function () {
      if (bgMusic.paused) {
        bgMusic.play().catch((error) => {
          console.warn('Audio play failed:', error);
        });
      } else {
        bgMusic.pause();
      }
    });

    bgMusic.addEventListener('play', () => setPlayingState(true));
    bgMusic.addEventListener('pause', () => setPlayingState(false));
  }

  if (prevTrackBtn) {
    prevTrackBtn.addEventListener('click', playPrevTrack);
  }

  if (nextTrackBtn) {
    nextTrackBtn.addEventListener('click', playNextTrack);
  }

  bgMusic.addEventListener('ended', playNextTrack);

  if (volumeSlider) {
    volumeSlider.addEventListener('input', function () {
      const nextValue = Number(this.value);
      isMuted = nextValue === 0;
      if (nextValue > 0) {
        volumeBeforeMute = nextValue;
      }
      applyVolume(nextValue);
    });
  }

  if (muteBtn && volumeSlider) {
    muteBtn.addEventListener('click', function () {
      if (isMuted || Number(volumeSlider.value) === 0) {
        isMuted = false;
        applyVolume(volumeBeforeMute || 70);
      } else {
        volumeBeforeMute = Number(volumeSlider.value) || 70;
        isMuted = true;
        applyVolume(0);
      }
    });
  }

  if (sidePlayerToggle) {
    sidePlayerToggle.addEventListener('click', function () {
      sidePlayer.classList.toggle('open');
    });
  }

  bgMusic.volume = 0.3;
  updateVolumeUI(30);
  if (volumeSlider) {
    volumeSlider.value = 30;
  }

  bgMusic.play().catch((error) => {
    console.warn('Audio autoplay prevented:', error);
  });
}

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
  return text.replace(/[&<>"]/g, (m) => map[m]);
}

// Variable to track the last minute for the heart shatter animation
let lastMinute = null;

/**
 * Update Indonesian Date & Time Realtime
 */
function updateDateTime() {
  const now = new Date();
  const timeEl = document.getElementById('currentTime');
  const dateEl = document.getElementById('currentDate');

  if (timeEl) {
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timeEl.textContent = `${hours}:${minutes}`;

    // Detect minute change and trigger heart explosion
    const currentMinute = now.getMinutes();
    if (lastMinute !== null && currentMinute !== lastMinute) {
      triggerHeartExplosion();
    }
    lastMinute = currentMinute;
  }

  if (dateEl) {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const dayName = days[now.getDay()];
    const day = now.getDate();
    const monthName = months[now.getMonth()];
    const year = now.getFullYear();
    dateEl.textContent = `${dayName}, ${day} ${monthName} ${year}`;
  }
}

/**
 * Trigger the love explosion/shatter effect on the seconds heart
 */
function triggerHeartExplosion() {
  const heartEl = document.getElementById('heartSeconds');
  if (!heartEl) return;

  // Add the CSS explode class
  heartEl.classList.remove('explode');
  void heartEl.offsetWidth; // Trigger reflow
  heartEl.classList.add('explode');

  // Remove the explode class after the animation completes so it returns to beating
  setTimeout(() => {
    heartEl.classList.remove('explode');
  }, 1200);

  // Spawn small heart particles
  spawnExplosionParticles(heartEl);
}

/**
 * Spawn small scattering heart particles starting from the main seconds heart position
 * @param {HTMLElement} heartEl - The main seconds heart element
 */
function spawnExplosionParticles(heartEl) {
  const container = document.querySelector('.app-container') || document.body;
  if (!container) return;

  const rect = heartEl.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  // Center coordinates of the main heart relative to the container
  const centerX = (rect.left + rect.width / 2) - containerRect.left;
  const centerY = (rect.top + rect.height / 2) - containerRect.top;

  // Configuration for explosion particles
  const particleCount = 18;
  const colors = ['#ff1493', '#ff69b4', '#ffb6c1', '#ff3366', '#e0115f', '#ff4500'];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'explosion-heart';

    // Randomize colors for a rich palette
    const color = colors[Math.floor(Math.random() * colors.length)];
    particle.innerHTML = `
      <svg viewBox="0 0 24 24" fill="${color}" width="10" height="10">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    `;

    // Set initial position at the center of the seconds heart
    particle.style.left = `${centerX}px`;
    particle.style.top = `${centerY}px`;

    // Radial dispersion math: spread particles in a 360-degree circle
    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 90; // random travel distance (40px to 130px)
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    // Randomize scaling, rotation, and gravity/fall offset
    const scaleStart = 0.8 + Math.random() * 0.7; // start size
    const scaleEnd = 0.15 + Math.random() * 0.25;  // end size before fading out
    const rotStart = Math.random() * 360;         // start rotation
    const rotEnd = rotStart + (Math.random() - 0.5) * 200; // end rotation
    const gravity = 20 + Math.random() * 40;      // downward curve pull

    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--ty', `${ty}px`);
    particle.style.setProperty('--scale-start', scaleStart);
    particle.style.setProperty('--scale-end', scaleEnd);
    particle.style.setProperty('--rot-start', `${rotStart}deg`);
    particle.style.setProperty('--rot-end', `${rotEnd}deg`);
    particle.style.setProperty('--gravity', `${gravity}px`);

    container.appendChild(particle);

    // Clean up particle element after animation completes (1.2s)
    setTimeout(() => {
      particle.remove();
    }, 1200);
  }
}

/**
 * Initialize interaction when tapping the cute bear
 */
function initBearInteraction() {
  const bearBg = document.getElementById('bearBg');
  const bearBubble = document.getElementById('bearBubble');
  const bubbleText = document.getElementById('bubbleText');
  let bubbleTimeout = null;
  let tapCount = 0;
  
  // Sleep state variables
  let isSleeping = false;
  let inactivityTimer = null;
  let zzzInterval = null;

  if (!bearBg || !bearBubble || !bubbleText) return;

  // Function to reset the inactivity timer
  function resetInactivityTimer() {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(goToSleep, 40000); // 40 seconds
  }

  // Transition to sleep state
  function goToSleep() {
    isSleeping = true;
    bearBg.classList.add('sleeping');
    
    // Hide bubble during sleep state
    bearBubble.classList.remove('show');
    if (bubbleTimeout) clearTimeout(bubbleTimeout);

    // Start Zzz particles
    startZzzEffect();
  }

  // Start spawning floating Zzz text elements
  function startZzzEffect() {
    if (zzzInterval) clearInterval(zzzInterval);

    function spawnZ() {
      if (!isSleeping) return;
      const container = document.querySelector('.app-container') || document.body;
      if (!container) return;

      const z = document.createElement('div');
      z.className = 'zzz-particle';
      
      const zText = ['Z', 'zZ', 'Zzz'][Math.floor(Math.random() * 3)];
      z.textContent = zText;

      const rect = bearBg.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      // Position directly above the bear's head
      const relativeX = (rect.left + rect.width * 0.48) - containerRect.left;
      const relativeY = (rect.top - 15) - containerRect.top;

      z.style.left = `${relativeX}px`;
      z.style.top = `${relativeY}px`;

      const size = 12 + Math.random() * 12;
      z.style.fontSize = `${size}px`;

      container.appendChild(z);

      setTimeout(() => {
        z.remove();
      }, 3200);
    }

    spawnZ();
    zzzInterval = setInterval(spawnZ, 1500);
  }

  // Wake up from sleep state
  function wakeUp() {
    isSleeping = false;
    bearBg.classList.remove('sleeping');
    
    // Stop Zzz particles
    if (zzzInterval) {
      clearInterval(zzzInterval);
      zzzInterval = null;
    }
    document.querySelectorAll('.zzz-particle').forEach(el => el.remove());
  }

  // Initialize inactivity timer
  resetInactivityTimer();

  bearBg.addEventListener('click', function (e) {
    let message = '';
    let shouldAdvanceSequence = true;

    // If sleeping, wake up first
    if (isSleeping) {
      wakeUp();
      message = 'maaf aku tertidur';
      shouldAdvanceSequence = false;
    }
    
    // Reset inactivity timer on any tap
    resetInactivityTimer();

    // Add bounce animation to the bear
    bearBg.classList.remove('bounce');
    void bearBg.offsetWidth; // Trigger reflow to restart animation
    bearBg.classList.add('bounce');

    // Remove bounce class after animation ends
    setTimeout(() => {
      bearBg.classList.remove('bounce');
    }, 600);

    // If it was not sleeping, use the normal tapping sequence
    if (shouldAdvanceSequence) {
      const userName = getUserName() || 'Kamu';
      const escapedName = escapeHtml(userName);
      
      const tapIndex = tapCount % 3;
      if (tapIndex === 0) {
        message = `hai... <strong>${escapedName}</strong>`;
      } else if (tapIndex === 1) {
        message = `apa kabar kamu... <strong>${escapedName}</strong>`;
      } else {
        message = `hai aku Peachy...`;
      }
      
      // Increment counter
      tapCount++;
    }

    bubbleText.innerHTML = message;

    // Show bubble
    bearBubble.classList.add('show');

    // Get click coordinates (or center of bubble if tapped directly)
    const rect = bearBg.getBoundingClientRect();
    const x = e.clientX || (rect.left + rect.width / 2);
    const y = e.clientY || (rect.top + rect.height / 3);

    // Spawn floating love heart particles
    spawnBearHearts(x, y);

    // Clear previous timeout if user clicks repeatedly
    if (bubbleTimeout) {
      clearTimeout(bubbleTimeout);
    }

    // Hide bubble after 3.5 seconds
    bubbleTimeout = setTimeout(() => {
      bearBubble.classList.remove('show');
    }, 3500);
  });
}

/**
 * Spawn small floating heart particles around a point
 * @param {number} startX - X coordinate
 * @param {number} startY - Y coordinate
 */
function spawnBearHearts(startX, startY) {
  // We want to append to .app-container or body.
  // Using .app-container keeps it scoped correctly inside the viewport simulator
  const container = document.querySelector('.app-container') || document.body;
  if (!container) return;

  const rect = container.getBoundingClientRect();
  const relativeX = startX - rect.left;
  const relativeY = startY - rect.top;

  for (let i = 0; i < 18; i++) {
    const heart = document.createElement('div');
    heart.className = 'bear-heart';
    
    // SVG markup for beautiful heart path
    heart.innerHTML = `
      <svg viewBox="0 0 24 24" fill="#ff1493" width="14" height="14">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    `;

    // Position initial element
    heart.style.left = `${relativeX}px`;
    heart.style.top = `${relativeY}px`;

    // Gentle and soft travel offset (tx, ty) and rotation, scaling
    const tx = (Math.random() - 0.5) * 220;
    const ty = -60 - Math.random() * 150; // Smooth upward drift
    const scale = 0.4 + Math.random() * 0.7;
    const rot = (Math.random() - 0.5) * 100;

    heart.style.setProperty('--tx', `${tx}px`);
    heart.style.setProperty('--ty', `${ty}px`);
    heart.style.setProperty('--scale', scale);
    heart.style.setProperty('--rot', `${rot}deg`);

    container.appendChild(heart);

    // Clean up DOM after animation completes (1.4s)
    setTimeout(() => {
      heart.remove();
    }, 1400);
  }
}

/**
 * Night rest message — displayed between 01:00 and 04:00
 * Shows "ini jam istirahat, silahkan tidur" for 8 seconds,
 * then transitions to "sweet dream 💕" for the remaining time.
 * Total visible duration: 40 seconds, then hides for 20 seconds and repeats.
 */
function initNightRestMessage() {
  const toast = document.getElementById('nightToast');
  const toastText = document.getElementById('nightToastText');

  if (!toast || !toastText) return;

  function isNightHour() {
    const hour = new Date().getHours();
    return hour >= 1 && hour < 4;
  }

  function showNightCycle() {
    if (!isNightHour()) {
      // Check again in 1 minute
      setTimeout(showNightCycle, 60000);
      return;
    }

    // ── Phase 1: show first message ──────────────────────────
    toastText.style.opacity = '1';
    toastText.innerHTML = 'ini jam istirahat, silahkan tidur 🌙';
    toast.classList.add('show');

    // After 8 s fade out text and swap to second message
    setTimeout(() => {
      // Fade out text only
      toastText.classList.add('fade-out');

      setTimeout(() => {
        // ── Phase 2: second message ───────────────────────────
        toastText.innerHTML = 'sweet dream 💕';
        toastText.classList.remove('fade-out');

        // After remaining 32 s (40 - 8), hide entire toast
        setTimeout(() => {
          toast.classList.remove('show');

          // Hidden gap: 20 s before next cycle
          setTimeout(() => {
            if (isNightHour()) {
              showNightCycle();
            } else {
              // Outside night hours — check again in 1 min
              setTimeout(showNightCycle, 60000);
            }
          }, 20000);
        }, 32000);
      }, 500); // wait for text fade transition (0.5s)
    }, 8000);
  }

  // Kick off only if we are in night hours right now,
  // otherwise poll every minute until we enter the window.
  if (isNightHour()) {
    showNightCycle();
  } else {
    // Check every minute
    const nightCheckInterval = setInterval(() => {
      if (isNightHour()) {
        clearInterval(nightCheckInterval);
        showNightCycle();
      }
    }, 60000);
  }
}

/**
 * Show hello message and burst floating hearts
 */
let isGreetingActive = false;

function showGreetingWithHearts(e) {
  if (isGreetingActive) return;
  isGreetingActive = true;

  const dateEl = document.getElementById('currentDate');
  if (!dateEl) {
    isGreetingActive = false;
    return;
  }

  const userName = getUserName() || 'Manis';
  
  // Get positions relative to app-container
  const container = document.querySelector('.app-container');
  if (container) {
    const containerRect = container.getBoundingClientRect();
    const clickX = e.clientX - containerRect.left;
    const clickY = e.clientY - containerRect.top;
    
    // Spawn 10 little floating hearts
    const heartCount = 10;
    for (let i = 0; i < heartCount; i++) {
      const heart = document.createElement('div');
      heart.className = 'click-heart';
      heart.innerHTML = `<svg viewBox="0 0 24 24" fill="%23ff1493" width="12" height="12" style="fill: #ff1493;"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
      
      heart.style.left = `${clickX}px`;
      heart.style.top = `${clickY}px`;
      
      const tx = (Math.random() - 0.5) * 80;
      const ty = -(Math.random() * 60 + 20);
      const scale = Math.random() * 0.4 + 0.6;
      const rot = Math.random() * 60 - 30;
      const delay = Math.random() * 0.1;
      
      heart.style.setProperty('--tx', `${tx}px`);
      heart.style.setProperty('--ty', `${ty}px`);
      heart.style.setProperty('--scale', scale);
      heart.style.setProperty('--rot', `${rot}deg`);
      heart.style.animationDelay = `${delay}s`;
      
      container.appendChild(heart);
      
      setTimeout(() => {
        heart.remove();
      }, 800);
    }
  }

  // Fade out date, change to greeting, fade back in
  dateEl.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
  dateEl.style.opacity = '0';
  
  setTimeout(() => {
    dateEl.textContent = `hello.. ${userName}`;
    dateEl.style.color = '#ff1493';
    dateEl.style.opacity = '1';
    
    // Auto-revert back to original date after 3 seconds
    setTimeout(() => {
      dateEl.style.opacity = '0';
      setTimeout(() => {
        // This will update to correct date text and styling
        const timeEl = document.getElementById('currentTime');
        if (timeEl) {
          updateDateTime();
        }
        dateEl.style.color = '';
        dateEl.style.opacity = '0.65';
        isGreetingActive = false;
      }, 250);
    }, 3000);
  }, 250);
}

/**
 * Wake-up Peachy bubble — shown periodically with slide-in from top and
 * a typewriter-style text reveal. Repeats every 3 minutes.
 */
function initWakeupBubble() {
  const bubble    = document.getElementById('wakeupBubble');
  const bubbleText = document.getElementById('wakeupBubbleText');
  const bubbleIcon = bubble ? bubble.querySelector('.wakeup-bubble-icon') : null;
  if (!bubble || !bubbleText) return;

  const messages = [
    'bangunkan Peachy jika tertidur 🌸',
    'ketuk Peachy untuk menyapanya 💕',
    'hai, aku menunggumu di sini ✨',
  ];
  let msgIndex = 0;

  function showBubble() {
    const msg = messages[msgIndex % messages.length];
    msgIndex++;

    // Reset text and icon animation
    bubbleText.textContent = msg;
    bubbleText.classList.remove('reveal');

    // Reset icon animation so it replays
    if (bubbleIcon) {
      bubbleIcon.style.animation = 'none';
      void bubbleIcon.offsetWidth; // reflow
      bubbleIcon.style.animation = '';
      bubbleIcon.style.opacity = '0';
    }

    // Slide down from top
    bubble.classList.remove('hiding');
    bubble.classList.add('show');

    // Reveal text after bubble is visible
    setTimeout(() => {
      bubbleText.classList.add('reveal');
    }, 300);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      bubble.classList.add('hiding');
      bubble.classList.remove('show');
      bubbleText.classList.remove('reveal');
    }, 5000);
  }

  // Show once 2.5 seconds after page loads
  setTimeout(showBubble, 2500);

  // Then repeat every 3 minutes
  setInterval(showBubble, 3 * 60 * 1000);
}