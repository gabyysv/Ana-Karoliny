/* --- Fundo de Corações Gerenciável --- */
const bgContainer = document.getElementById('floating-hearts-bg');
const heartSymbols = ['❤️', '💖', '💕'];

function createFloatingHeart(instant = false) {
    let heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.innerText = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDuration = `${5 + Math.random() * 6}s`;
    heart.style.animationDelay = instant ? `0s` : `${Math.random() * 5}s`;
    heart.style.fontSize = `${16 + Math.random() * 22}px`;
    
    heart.addEventListener('animationend', () => {
        heart.remove();
        if(clicks >= maxClicks) createFloatingHeart(false); 
    });

    bgContainer.appendChild(heart);
}

function generateBaseHearts(amount) {
    bgContainer.innerHTML = ''; 
    for (let i = 0; i < amount; i++) {
        createFloatingHeart(false);
    }
}
generateBaseHearts(20);

/* --- Juntar Coração e Explosão --- */
let clicks = 0;
const maxClicks = 5;
const btnHeal = document.getElementById('btn-heal');
const heartLeft = document.getElementById('heart-left');
const heartRight = document.getElementById('heart-right');
const heartWrapper = document.getElementById('heart-wrapper');

const startState = { left: { x: -35, y: -15, rot: -15 }, right: { x: 35, y: 15, rot: 15 } };

function updateHeartPosition() {
    const ease = 1 - (clicks / maxClicks); 
    heartLeft.style.transform = `translate(${startState.left.x * ease}px, ${startState.left.y * ease}px) rotate(${startState.left.rot * ease}deg)`;
    heartRight.style.transform = `translate(${startState.right.x * ease}px, ${startState.right.y * ease}px) rotate(${startState.right.rot * ease}deg)`;
}
updateHeartPosition();

btnHeal.addEventListener('click', () => {
    if (clicks < maxClicks) {
        clicks++;
        updateHeartPosition();
        
        for(let i = 0; i < 12; i++){
            createFloatingHeart(true);
        }
        
        if (clicks === maxClicks) {
            btnHeal.textContent = "Coração inteiro! ❤️";
            btnHeal.style.pointerEvents = 'none';
            btnHeal.style.opacity = '0';
            
            heartWrapper.classList.add('glow');

            setTimeout(() => {
                document.getElementById('screen-1').className = 'screen hidden';
                document.getElementById('screen-2').className = 'screen active';
                generateBaseHearts(15); 
            }, 1700); 
        }
    }
});

/* --- Áudio, Disco e Barra de Progresso --- */
const btnPlay = document.getElementById('btn-play');
const photoDisc = document.getElementById('photo-disc');
const discContainer = document.getElementById('photo-disc-container');
const audio = document.getElementById('bg-music');

const progressContainer = document.getElementById('progress-container');
const progressFill = document.getElementById('progress-fill');
const currentTimeDisplay = document.getElementById('current-time');
const totalTimeDisplay = document.getElementById('total-time');

let isPlaying = false;
let noteInterval = null;

// Formata os segundos para o formato "0:00"
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// Atualiza a duração total quando a música carrega
audio.addEventListener('loadedmetadata', () => {
    totalTimeDisplay.textContent = formatTime(audio.duration);
});

// Atualiza a barra e o tempo atual enquanto toca
audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const percent = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = `${percent}%`;
    currentTimeDisplay.textContent = formatTime(audio.currentTime);
});

// Permite clicar na barra de progresso para avançar a música
progressContainer.addEventListener('click', (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    
    if(duration) {
        audio.currentTime = (clickX / width) * duration;
    }
});

function spawnMusicNoteBalloon() {
    const notes = ['🎵', '🎶', '♪', '💖', '♩', '💗'];
    const note = document.createElement('div');
    note.classList.add('music-note');
    note.innerText = notes[Math.floor(Math.random() * notes.length)];

    const sway = -60 + Math.random() * 120;
    const rot = -30 + Math.random() * 60;
    note.style.setProperty('--sway', `${sway}px`);
    note.style.setProperty('--rot', `${rot}deg`);
    note.style.animationDuration = `${2.5 + Math.random()}s`;

    discContainer.appendChild(note);
    setTimeout(() => { note.remove(); }, 3500);
}

btnPlay.addEventListener('click', () => {
    if (isPlaying) {
        photoDisc.classList.remove('playing');
        btnPlay.textContent = '▶';
        btnPlay.classList.remove('is-playing');
        clearInterval(noteInterval);
        try { audio.pause(); } catch(e) {}
    } else {
        photoDisc.classList.add('playing');
        btnPlay.textContent = '⏸';
        btnPlay.classList.add('is-playing');
        noteInterval = setInterval(spawnMusicNoteBalloon, 450);
        
        // Pega a duração caso o 'loadedmetadata' não tenha disparado no mobile
        if(audio.duration) totalTimeDisplay.textContent = formatTime(audio.duration);
        
        audio.play().catch(() => console.log("Simulando áudio (Navegador pode bloquear auto-play)"));
    }
    isPlaying = !isPlaying;
});

/* --- CONTROLE DO ENVELOPE --- */
const triggerLetter = document.getElementById('trigger-letter');
const letterModal = document.getElementById('letter-modal');
const envelopeWrapper = document.getElementById('envelope-wrapper');
const envelope = document.getElementById('envelope');
const closeLetter = document.getElementById('close-letter');

triggerLetter.addEventListener('click', () => { letterModal.classList.add('active'); });

function openEnvelopeSequence() {
    if(envelopeWrapper.classList.contains('flap-open')) return;
    envelopeWrapper.classList.add('shift-down');
    envelopeWrapper.classList.add('flap-open');
    setTimeout(() => { envelopeWrapper.classList.add('paper-open'); }, 450); 
}

envelope.addEventListener('click', () => {
    if (envelopeWrapper.classList.contains('paper-open')) return;
    openEnvelopeSequence();
});

closeLetter.addEventListener('click', (e) => {
    e.stopPropagation(); 
    envelopeWrapper.classList.remove('paper-open');
    setTimeout(() => {
        envelopeWrapper.classList.remove('flap-open');
        envelopeWrapper.classList.remove('shift-down');
    }, 600);
    setTimeout(() => { letterModal.classList.remove('active'); }, 1150);
});