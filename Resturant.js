function initHeroCarousel() {
  const queue = document.querySelectorAll('.queue img');
  const right = document.querySelector('.right');
  if (!queue.length || !right) return;

  let index = 0;
  const visibleTime = 2500;

  const slideDuration = 1000;
    const fadeDuration = 1000;
  const track = document.querySelector(".track");
const slides = document.querySelectorAll('.track > div'); // all boxes
const totalSlides = 2;
let isDragging = false;
let startX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID;
let autoSlideInterval;

// calculate width including margin
function getSlideWidth() {
  const style = getComputedStyle(slides[0]);
  return slides[0].offsetWidth + parseInt(style.marginRight);
}

// --- Go to exact slide ---
function goToSlide(slideIndex) {
  index = Math.max(0, Math.min(slideIndex, totalSlides - 1)); // clamp
  const slideWidth = getSlideWidth();
  currentTranslate = -index * slideWidth;
  prevTranslate = currentTranslate;
  track.style.transition = 'transform 0.5s ease';
  track.style.transform = `translateX(${currentTranslate}px)`;
  setTimeout(() => track.style.transition = '', 500);
}

// --- Auto-slide ---
function autoSlide() {
  goToSlide((index + 1) % totalSlides);
}

function startAutoSlide() {
  autoSlideInterval = setInterval(autoSlide, 10000);
}

function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

startAutoSlide();

// --- Drag / swipe ---
track.addEventListener("mousedown", dragStart);
track.addEventListener("touchstart", dragStart);
track.addEventListener("mousemove", dragMove);
track.addEventListener("touchmove", dragMove);
track.addEventListener("mouseup", dragEnd);
track.addEventListener("touchend", dragEnd);
track.addEventListener("mouseleave", dragEnd);

function dragStart(e) {
  isDragging = true;
  startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  stopAutoSlide();
  animationID = requestAnimationFrame(animation);
}

function dragMove(e) {
  if (!isDragging) return;
  const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  const diff = currentX - startX;
  currentTranslate = prevTranslate + diff;
}

function dragEnd() {
  cancelAnimationFrame(animationID);
  if (!isDragging) return;
  isDragging = false;

  const slideWidth = getSlideWidth();
  index = Math.round(-currentTranslate / slideWidth); // snap to nearest
  goToSlide(index);
  startAutoSlide();
}

function animation() {
  track.style.transform = `translateX(${currentTranslate}px)`;
  if (isDragging) requestAnimationFrame(animation);
}



  function showNextHero() {
  const queueContainer = document.querySelector('.queue');
  const firstImg = queueContainer.querySelector('img:first-child'); // current first
  const imgWidth = firstImg.offsetWidth + 10;

  // Slide the queue
  queueContainer.style.transition = `transform ${slideDuration / 1000}s ease`;
  queueContainer.style.transform = `translateX(-${imgWidth}px)`;

  setTimeout(() => {
    // Move first image to end
    queueContainer.appendChild(firstImg);
    queueContainer.style.transition = 'none';
    queueContainer.style.transform = 'translateX(0)';
    void queueContainer.offsetWidth; // force reflow
    queueContainer.style.transition = `transform ${slideDuration / 1000}s ease`;

    // Update the hero image AFTER queue has moved
    right.innerHTML = '';
    const heroImg = firstImg.cloneNode();
    heroImg.style.width = '300px';
    heroImg.style.position = 'absolute';
    heroImg.style.opacity = '0';
    heroImg.style.transform = 'scale(0.5)';
    heroImg.style.transition = `all ${fadeDuration / 1000}s ease`;
    right.appendChild(heroImg);

    setTimeout(() => {
      heroImg.style.opacity = '1';
      heroImg.style.transform = 'scale(1.05)';
    }, 50);

    setTimeout(() => {
      heroImg.style.opacity = '0';
      heroImg.style.transform = 'scale(0.5)';
    }, visibleTime);

  }, slideDuration);

// Update the hero image to match the new first image
const right = document.querySelector('.right');
right.innerHTML = '';
right.appendChild(firstImg.cloneNode());


    index = (index + 1) % queue.length;
  }

  showNextHero();
  setInterval(showNextHero, visibleTime + fadeDuration + slideDuration);
}



document.addEventListener("DOMContentLoaded", () => {
  const content = document.getElementById("content");
  const navItems = document.querySelectorAll(".nav-bar ul li a");

  async function loadPage(page) {
    try {
      const response = await fetch(`pages/${page}`);
      if (!response.ok) throw new Error("Page not found: " + page);
      const data = await response.text();
      content.innerHTML = data;

     
      if (page === "home.html") initHeroCarousel();
    } catch (err) {
      console.error(err);
    }
  }


  const savedPage = localStorage.getItem("currentPage");
  loadPage(savedPage ? savedPage : "home.html");


  navItems.forEach(item => {
    item.addEventListener("click", e => {
      e.preventDefault();
      const page = item.getAttribute("data-page");
      loadPage(page);
      localStorage.setItem("currentPage", page);
    });
  });
});
