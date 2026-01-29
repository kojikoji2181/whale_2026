document.addEventListener('DOMContentLoaded', () => {
    // Correct Password
    const PASSWORD = "くじら2026";

    // DOM Elements
    const loginBtn = document.getElementById('login-btn');
    const passwordInput = document.getElementById('password-input');
    const loginSection = document.getElementById('login-section');
    const videoSection = document.getElementById('video-section');
    const videoGrid = document.getElementById('video-grid');
    const errorMessage = document.getElementById('error-message');

    // Video Data
    const videos = [
        {
            id: 1,
            title: "オープニング",
            desc: "製作者：さやかちゃんママ",
            emoji: "🎬",
            theme: "crab",
            file: "videos/オープニング.mp4"
        },
        {
            id: 2,
            title: "かに組～いるか組",
            desc: "製作者：さやかちゃんママ",
            emoji: "🐦",
            theme: "seagull",
            file: "videos/かに組～いるか組.mp4"
        },
        {
            id: 3,
            title: "エンドロール",
            desc: "製作者：さやかちゃんママ",
            emoji: "✨",
            theme: "dolphin",
            file: "videos/エンドロール.mp4"
        }
    ];

    // BGM Control
    const bgm = document.getElementById('bgm');


    function toggleBgm(e) {
        // 入力フォームやボタンクリック時はBGM操作を無視する
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.closest('a')) {
            return;
        }

        if (bgm) {
            if (bgm.paused) {
                bgm.volume = 0.5;
                bgm.play().catch(e => console.log("BGM play failed", e));
            } else {
                bgm.pause();
            }
        }
    }

    // Stop BGM with fade out
    function stopBgm() {
        // ログイン後は必ずイベントリスナーを削除して、再度の再生を防ぐ
        document.removeEventListener('click', toggleBgm);

        if (bgm && !bgm.paused) {
            const fadeOut = setInterval(() => {
                if (bgm.volume > 0.05) {
                    bgm.volume -= 0.05;
                } else {
                    bgm.pause();
                    bgm.volume = 0.5; // Reset for next time
                    clearInterval(fadeOut);
                }
            }, 100);
        }
    }

    // Toggle play/pause on user interaction
    document.addEventListener('click', toggleBgm);

    // Login Function
    function checkLogin() {
        const input = passwordInput.value.trim();

        if (input === PASSWORD) {
            // Success
            handleLoginSuccess();
            stopBgm(); // Stop music when entering the main site
        } else {
            // Error
            showError();
        }
    }

    function handleLoginSuccess() {
        // Hide error if shown
        errorMessage.classList.add('hidden');

        // Render Videos
        renderVideos();

        // Animation: Fade out login, fade in videos
        loginSection.style.opacity = '0';
        loginSection.style.transform = 'translateY(-20px)';

        setTimeout(() => {
            loginSection.classList.add('hidden');
            videoSection.classList.remove('hidden');

            // Trigger reflow/animation for video section content
            // (CSS animations handle the fade-in of children)
        }, 300);
    }

    function showError() {
        errorMessage.classList.remove('hidden');
        passwordInput.classList.add('error-shake');

        // Remove shake class after animation
        setTimeout(() => {
            passwordInput.classList.remove('error-shake');
        }, 500);
    }

    // Render Video Cards
    function renderVideos() {
        videoGrid.innerHTML = '';

        videos.forEach((video, index) => {
            const card = document.createElement('div');
            card.className = `video-card animate-up delay-${(index % 3) + 1}`;
            card.style.animationDelay = `${index * 0.1}s`; // Staggered delay

            card.innerHTML = `
                <div class="video-header">
                    <div class="video-info">
                        <h3>${video.title}</h3>
                        <p>${video.desc}</p>
                    </div>
                </div>
                <div class="video-wrapper">
                    <video controls poster="images/poster_placeholder.png" preload="metadata">
                        <source src="${video.file}" type="video/mp4">
                        お使いのブラウザは動画タグに対応していません。
                    </video>
                </div>
                <div class="video-actions">
                    <a href="${video.file}" download class="btn btn-download">
                        📥 思い出を保存する
                    </a>
                </div>
            `;

            videoGrid.appendChild(card);
        });
    }

    // Event Listeners
    loginBtn.addEventListener('click', checkLogin);

    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkLogin();
        }
    });
});
