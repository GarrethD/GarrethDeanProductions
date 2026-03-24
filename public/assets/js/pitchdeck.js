document.addEventListener("DOMContentLoaded", function() {
    // Only URLs now, PINs are external!
    const pitchdecks = {
        "cloaked-protocol": {
            url: "https://docs.google.com/presentation/d/1MnIX0eXao2DxOZBCdRarTBcgUimfUF_sUT1aHetxK5E/embed?start=false&loop=false&delayms=3000"
        },
        "project-augment": {
            url: "https://docs.google.com/presentation/d/1VVHQz0mTAdRhNMddJfYpDFbqKEm5YTUo3waJYx9sdQ0/embed?start=false&loop=false&delayms=3000"
        }
    };

    const overlay = document.getElementById('pitchdeck-overlay');
    const iframeContainer = overlay.querySelector('.pitchdeck-iframe-container');
    const closeBtn = document.getElementById('close-pitchdeck');

    // PIN modal
    const pinModal = document.getElementById('pin-modal');
    const pinInput = document.getElementById('pin-input');
    const pinError = document.getElementById('pin-error');
    const pinSubmit = document.getElementById('pin-submit');

    // Per-session in-memory unlock (object)
    const unlocked = {};

    // Pending gameKey to unlock
    let pendingGameKey = null;

    // Panel/button click
    document.querySelectorAll('.game-panel, .view-pitch-btn').forEach(function(element) {
        element.addEventListener('click', function(e) {
            if (e.target.closest('.close-overlay')) return;
            e.preventDefault();
            const panel = this.closest('.game-panel');
            if (!panel) return;
            const gameKey = panel.getAttribute('data-game');
            if (!pitchdecks[gameKey]) return;
            if (!unlocked[gameKey]) {
                // Show PIN modal for this game
                pinModal.classList.add('active');
                pinInput.value = '';
                pinInput.focus();
                pinError.textContent = '';
                pendingGameKey = gameKey;
            } else {
                // Already unlocked
                showOverlay(gameKey);
            }
        });
    });

    // PIN submit logic
    pinSubmit.addEventListener('click', tryPin);
    pinInput.addEventListener('keydown', function(e){
        if(e.key === 'Enter') tryPin();
    });

    function tryPin() {
        if (!pendingGameKey) return;
        const entered = pinInput.value.trim();
        // Get pin from window.pitchdeckPins
        const correct = window.pitchdeckPins?.[pendingGameKey] || "";
        if (entered === correct) {
            unlocked[pendingGameKey] = true;
            pinModal.classList.remove('active');
            showOverlay(pendingGameKey);
        } else {
            pinError.textContent = "Incorrect code. Try again.";
            pinInput.value = '';
            pinInput.focus();
        }
    }

    // Show overlay for a specific game
    function showOverlay(gameKey) {
        iframeContainer.innerHTML = '';
        const iframe = document.createElement('iframe');
        iframe.src = pitchdecks[gameKey].url;
        iframe.allowFullscreen = true;
        iframe.loading = "lazy";
        iframeContainer.appendChild(iframe);
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
// PIN modal close logic
    const closePinBtn = document.getElementById('close-pin-modal');
    closePinBtn.addEventListener('click', function() {
        pinModal.classList.remove('active');
        pinInput.value = '';
        pinError.textContent = '';
        pendingGameKey = null;
    });

// When pitchdeck overlay closes, reset PIN input
    closeBtn.addEventListener('click', function() {
        overlay.classList.remove('active');
        iframeContainer.innerHTML = '';
        document.body.style.overflow = '';
        // Reset PIN entry for safety
        pinModal.classList.remove('active');
        pinInput.value = '';
        pinError.textContent = '';
        if (pendingGameKey) unlocked[pendingGameKey] = false; // <<--- Add this line
        pendingGameKey = null;
    });


    // Close overlay logic
    closeBtn.addEventListener('click', function() {
        overlay.classList.remove('active');
        iframeContainer.innerHTML = '';
        document.body.style.overflow = '';
    });

    // Click outside modal to close
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeBtn.click();
    });

    // Escape closes modals
    document.addEventListener('keydown', function(e) {
        if (e.key === "Escape") {
            if (overlay.classList.contains('active')) closeBtn.click();
            if (pinModal.classList.contains('active')) pinModal.classList.remove('active');
        }
    });
});
