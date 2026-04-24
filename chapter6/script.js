// Slide navigation logic
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

document.getElementById('totalSlides').textContent = totalSlides;
updateNav();

function changeSlide(direction) {
  const newSlide = currentSlide + direction;
  if (newSlide < 0 || newSlide >= totalSlides) return;
  goToSlide(newSlide);
}

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  
  if (index > currentSlide) {
    slides[currentSlide].classList.add('prev');
  }

  setTimeout(() => {
    slides.forEach(s => s.classList.remove('prev'));
  }, 600);

  currentSlide = index;
  slides[currentSlide].classList.add('active');
  updateNav();
  animateSlideElements();
}

function updateNav() {
  document.getElementById('currentSlide').textContent = currentSlide + 1;
  document.getElementById('prevBtn').disabled = currentSlide === 0;
  document.getElementById('nextBtn').disabled = currentSlide === totalSlides - 1;
  document.getElementById('progressFill').style.width =
    ((currentSlide + 1) / totalSlides * 100) + '%';
}

function animateSlideElements() {
  const active = slides[currentSlide];
  const els = active.querySelectorAll(
    '.overview-card, .reason-item, .solution-card, .case-card, .conclusion-item, .condition, .flow-item'
  );
  els.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    setTimeout(() => {
      el.style.transition = 'all 0.5s cubic-bezier(0.4,0,0.2,1)';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 100 + i * 80);
  });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
    e.preventDefault();
    changeSlide(1);
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    changeSlide(-1);
  } else if (e.key === 'Home') {
    e.preventDefault();
    goToSlide(0);
  } else if (e.key === 'End') {
    e.preventDefault();
    goToSlide(totalSlides - 1);
  } else if (e.key === 'f' || e.key === 'F') {
    toggleFullscreen();
  }
});

// Touch / swipe support
let touchStartX = 0;
let touchStartY = 0;
document.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});
document.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
    changeSlide(dx < 0 ? 1 : -1);
  }
});

// Fullscreen
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

// Initial animation
animateSlideElements();
