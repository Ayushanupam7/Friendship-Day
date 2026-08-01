// ==========================================
// AUDIO SYSTEM & CONTROLS
// ==========================================
const music = document.getElementById('bg-music');
const audioBtn = document.getElementById('audio-control-btn');
const musicWave = document.getElementById('music-wave');

// Set volume to a gentle background level
if (music) music.volume = 0.4;

function toggleMusic() {
  if (!music) return;

  if (music.paused) {
    music.play().then(() => {
      audioBtn.classList.add('playing');
    }).catch(e => console.log("Audio play error:", e));
  } else {
    music.pause();
    audioBtn.classList.remove('playing');
  }
}

audioBtn.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevent trigger from slide navigation
  toggleMusic();
});

// Autoplay trigger on first click anywhere on the page
function initAudioOnInteraction() {
  if (music && music.paused) {
    music.play().then(() => {
      audioBtn.classList.add('playing');
      removeInteractionListeners();
    }).catch(err => {
      console.log("Autoplay block, waiting for further action.", err);
    });
  }
}

function removeInteractionListeners() {
  window.removeEventListener('click', initAudioOnInteraction);
  window.removeEventListener('touchstart', initAudioOnInteraction);
}

window.addEventListener('click', initAudioOnInteraction);
window.addEventListener('touchstart', initAudioOnInteraction);

// ==========================================
// NAVIGATION & SLIDE TRANSITIONS
// ==========================================
let currentSlide = 1;

function goToSlide(slideNum) {
  const currentActive = document.querySelector('.slide.active');
  const targetSlide = document.getElementById(`slide-${slideNum}`);

  if (!targetSlide) return;

  // Remove active state
  if (currentActive) {
    currentActive.classList.remove('active');
  }

  // Show target slide
  targetSlide.classList.add('active');
  currentSlide = slideNum;

  // Handle slide-specific triggers
  if (slideNum === 4) {
    // HAPPY FRIENDSHIP DAY confetti celebration!
    triggerConfetti(150);
  }

  // Slide 9 is now static (inputs removed)
}

// ==========================================
// INTERACTIVE ACTIONS & ANIMATIONS
// ==========================================

// Slide 5: Envelope Tap
const envelopeTrigger = document.getElementById('envelope-trigger');
if (envelopeTrigger) {
  envelopeTrigger.addEventListener('click', () => {
    envelopeTrigger.classList.add('open');
    setTimeout(() => {
      goToSlide(6);
    }, 1100);
  });
}

// Slide 8: Gift Box Tap
const giftboxTrigger = document.getElementById('giftbox-trigger');
if (giftboxTrigger) {
  giftboxTrigger.addEventListener('click', () => {
    giftboxTrigger.classList.add('open-anim');
    triggerConfetti(200); // Big explosion
    setTimeout(() => {
      goToSlide(9);
    }, 800);
  });
}

// Polaroid editing disabled (file input removed)

// ==========================================
// CANVAS CONFETTI SYSTEM
// ==========================================
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationId = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class ConfettiParticle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * -canvas.height;
    this.size = Math.random() * 8 + 6;
    this.color = ['#e55b5b', '#f7a4a4', '#ffd480', '#85e3b2', '#85cdfd', '#d3b5e5'][Math.floor(Math.random() * 6)];
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 + 2.5;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 4 - 2;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.rotation += this.rotationSpeed;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation * Math.PI / 180);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }
}

function triggerConfetti(count) {
  // Cancel previous animation if running
  if (animationId) cancelAnimationFrame(animationId);

  resizeCanvas();
  particles = [];

  for (let i = 0; i < count; i++) {
    particles.push(new ConfettiParticle());
  }

  animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let activeParticles = false;

  particles.forEach(p => {
    if (p.y < canvas.height) {
      p.update();
      p.draw();
      activeParticles = true;
    }
  });

  if (activeParticles) {
    animationId = requestAnimationFrame(animateConfetti);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// ==========================================
// CERTIFICATE DOWNLOADER (HTML5 CANVAS)
// ==========================================
const downloadBtn = document.getElementById('btn-download-cert');
if (downloadBtn) {
  downloadBtn.addEventListener('click', () => {
    exportCertificate();
  });
}

function exportCertificate() {
  const recipientName = document.getElementById('cert-recipient').textContent.trim() || "My Best Friend";

  // Create virtual high-res canvas (ideal for sharp print/download)
  const certCanvas = document.createElement('canvas');
  certCanvas.width = 1200;
  certCanvas.height = 900;
  const cCtx = certCanvas.getContext('2d');

  // 1. Draw Cream Background Gradient
  const bgGrad = cCtx.createRadialGradient(600, 450, 50, 600, 450, 700);
  bgGrad.addColorStop(0, '#fffdfa');
  bgGrad.addColorStop(1, '#fffaf0');
  cCtx.fillStyle = bgGrad;
  cCtx.fillRect(0, 0, 1200, 900);

  // 2. Draw Borders
  cCtx.strokeStyle = '#e55b5b';

  // Outer Double Line
  cCtx.lineWidth = 8;
  cCtx.strokeRect(30, 30, 1140, 840);
  cCtx.lineWidth = 2;
  cCtx.strokeRect(45, 45, 1110, 810);

  // Thin inner border
  cCtx.strokeStyle = '#f7a4a4';
  cCtx.strokeRect(60, 60, 1080, 780);

  // Decorative corner details
  const corners = [
    { x: 60, y: 60 }, { x: 1140, y: 60 },
    { x: 60, y: 840 }, { x: 1140, y: 840 }
  ];
  cCtx.fillStyle = '#e55b5b';
  corners.forEach(c => {
    cCtx.beginPath();
    cCtx.arc(c.x, c.y, 10, 0, Math.PI * 2);
    cCtx.fill();
  });

  // 3. Draw Ribbon (Emoji or illustration helper)
  cCtx.font = '72px Arial';
  cCtx.textAlign = 'center';
  cCtx.textBaseline = 'middle';
  cCtx.fillText('🏆', 600, 160);

  // 4. Draw Titles & Header
  cCtx.fillStyle = '#e55b5b';
  cCtx.font = 'bold 38px "Fredoka", "Arial", sans-serif';
  cCtx.fillText('CERTIFICATE OF LIFETIME LISTENING', 600, 260);

  cCtx.fillStyle = '#666666';
  cCtx.font = 'italic 20px "Quicksand", "Arial", sans-serif';
  cCtx.fillText('THIS IS OFFICIALLY AWARDED TO', 600, 340);

  // 5. Draw Recipient Name
  cCtx.fillStyle = '#222222';
  cCtx.font = 'italic bold 72px "Caveat", "Georgia", cursive';
  cCtx.fillText(recipientName, 600, 440);

  // Underline dashed style
  cCtx.strokeStyle = '#f7a4a4';
  cCtx.lineWidth = 4;
  cCtx.beginPath();
  cCtx.moveTo(350, 490);
  cCtx.lineTo(850, 490);
  cCtx.stroke();

  // 6. Draw Description Text (wrapped)
  cCtx.fillStyle = '#555555';
  cCtx.font = '24px "Quicksand", "Arial", sans-serif';
  const descText = "For tolerating, sharing, and ranting without limits. I guarantee a listening ear, constant support, and unconditional validation forever.";
  wrapText(cCtx, descText, 600, 550, 800, 36);

  // 7. Draw Signatures
  // Left Signature
  cCtx.strokeStyle = '#cccccc';
  cCtx.lineWidth = 2;
  cCtx.beginPath();
  cCtx.moveTo(200, 750);
  cCtx.lineTo(450, 750);
  cCtx.stroke();

  const giverName = document.querySelector('.signature-line:first-child .signature-font')?.textContent.trim() || "Akash";
  cCtx.fillStyle = '#222222';
  cCtx.font = '40px "Sacramento", cursive';
  cCtx.fillText(giverName, 325, 715);

  cCtx.fillStyle = '#999999';
  cCtx.font = 'bold 14px "Quicksand", sans-serif';
  cCtx.fillText('GIVER OF CARE', 325, 780);

  // Right Signature
  cCtx.beginPath();
  cCtx.moveTo(750, 750);
  cCtx.lineTo(1000, 750);
  cCtx.stroke();

  cCtx.fillStyle = '#e55b5b';
  cCtx.font = '48px "Sacramento", cursive';
  cCtx.fillText('∞', 875, 715);

  cCtx.fillStyle = '#999999';
  cCtx.font = 'bold 14px "Quicksand", sans-serif';
  cCtx.fillText('VALIDITY DURATION', 875, 780);

  // Trigger PNG download
  const image = certCanvas.toDataURL("image/png");
  const link = document.createElement('a');
  link.download = `listening_certificate_${recipientName.toLowerCase().replace(/\s+/g, '_')}.png`;
  link.href = image;
  link.click();
}

// Canvas text wrapping helper
function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let lines = [];

  for (let n = 0; n < words.length; n++) {
    let testLine = line + words[n] + ' ';
    let metrics = context.measureText(testLine);
    let testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      lines.push(line);
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  lines.forEach((l, index) => {
    context.fillText(l.trim(), x, y + (index * lineHeight));
  });
}

// ==========================================
// RESET APPLICATION STATE
// ==========================================
function resetApp() {
  // Clear animations
  if (envelopeTrigger) envelopeTrigger.classList.remove('open');
  if (giftboxTrigger) giftboxTrigger.classList.remove('open-anim');

  // Go to Slide 1
  goToSlide(1);
}
