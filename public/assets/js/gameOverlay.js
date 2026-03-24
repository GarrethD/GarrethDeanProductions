document.addEventListener("DOMContentLoaded", function() {
    const games = {
        "cloaked-protocol": {
            title: "CLOAKED PROTOCOL",
            release: "TBA",
            genre: "Stealth / Espionage Thriller",
            description: "Cloaked Protocol is a stealth action thriller set in a retro-futuristic world. Players take on the role of a skilled operative to complete missions and uncover secrets.",
            bg: "assets/images/CloakedprotocolPromoImage2.png",
            fog: "assets/videos/fog.webm",
            platforms: [
                { name: "PS5", class: "platform-badge platform-ps" },
                { name: "Xbox Series", class: "platform-badge platform-xbox" },
                { name: "PC", class: "platform-badge platform-pc" }
            ],
            trailer: "<iframe width='100%' height='245' src='https://www.youtube.com/embed/lg1WJigjm7M' frameborder='0' allowfullscreen></iframe>",
            steam: "https://store.steampowered.com/app/2738700/Cloaked_Protocol_Stealth_Action_Thriller/"
        },
        "project-augment": {
            title: "PROJECT AUGMENT - A Cloaked Protocol experience",
            release: "TBA",
            genre: "Arcade Action wave shooter",
            description: "Project Augment is a arcade action style wave shooter set in the same universe as Cloaked Protocol.",
            bg: "assets/images/ProjectAugment_NoTitle.jpg",
            fog: "assets/videos/hellsmoke.webm",
            platforms: [
                { name: "PS5", class: "platform-badge platform-ps" },
                { name: "Xbox Series", class: "platform-badge platform-xbox" },
                { name: "PC", class: "platform-badge platform-pc" }
            ],
            trailer: "<iframe width='100%' height='245' src='https://www.youtube.com/embed/lg1WJigjm7M' frameborder='0' allowfullscreen></iframe>",
            steam: "https://store.steampowered.com/app/2738700/Cloaked_Protocol_Stealth_Action_Thriller/"
        }
    };

    const overlay = document.getElementById('game-fullscreen-overlay');
    const bg = overlay.querySelector('.game-bg');
    const title = document.getElementById('game-title');
    const platforms = document.getElementById('game-platforms');
    const release = document.getElementById('game-release');
    const genre = document.getElementById('game-genre');
    const description = document.getElementById('game-desc');
    const trailer = document.getElementById('game-trailer');
    const steam = document.getElementById('game-steam');
    const closeBtn = overlay.querySelector('.close-overlay');
    const slices = document.querySelectorAll('.game-slice');
    const sliceContainer = document.querySelector('.game-slice-container');
    const fogVideo = document.getElementById('smoke-fog-video');

    slices.forEach(function(slice){
        slice.addEventListener('click', function(e){
            e.preventDefault();
            const gameKey = this.dataset.game;
            if (!gameKey || !games[gameKey]) return;
            const game = games[gameKey];

            // Show overlay, hide selection grid
            overlay.classList.add('visible');
            sliceContainer.style.display = 'none';
            bg.style.backgroundImage = `url('${game.bg}')`;

            // Fill details
            title.textContent = game.title;
            release.textContent = game.release;
            genre.textContent = game.genre;
            description.textContent = game.description;
            platforms.innerHTML = (game.platforms || []).map(p =>
                `<span class="${p.class}">${p.name}</span>`
            ).join(' ');
            trailer.innerHTML = game.trailer;
            steam.href = game.steam;

            // Set fog video per game, always update and play
            fogVideo.pause();
            fogVideo.src = game.fog;
            fogVideo.currentTime = 0;
            fogVideo.playbackRate = 0.68; // Slow fog effect, tweak as you want
            fogVideo.load();
            fogVideo.play().catch(()=>{});

            document.body.style.overflow = 'hidden';
        });
    });

    closeBtn.addEventListener('click', function() {
        overlay.classList.remove('visible');
        sliceContainer.style.display = 'flex';
        document.body.style.overflow = '';
        bg.style.backgroundImage = '';
        trailer.innerHTML = '';
        fogVideo.pause();
        fogVideo.removeAttribute('src');
        fogVideo.load();
    });
});
