// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
});

// Preloader — animates a percentage counter while waiting for dynamic content
// (api.js) and the window to fully load (fonts, images, scripts), then swipes
// up to reveal the page. A safety timeout prevents it from hanging forever.
(function () {
    const preloader = document.getElementById('preloader');
    const fill = document.getElementById('preloader-progress-fill');
    const percentEl = document.getElementById('preloader-percent');
    if (!preloader) return;

    // Ease progress toward 90% while we wait — never touches 100% on its own,
    // so the bar always looks "in progress" until real content is ready.
    let displayed = 0;
    let target = 12;
    let rafId;

    function tick() {
        displayed += (target - displayed) * 0.08;
        const shown = Math.min(90, Math.round(displayed));
        if (fill) fill.style.width = shown + '%';
        if (percentEl) percentEl.textContent = shown;
        rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
    setTimeout(() => { target = 45; }, 200);
    setTimeout(() => { target = 75; }, 700);

    const windowLoaded = new Promise((resolve) => {
        if (document.readyState === 'complete') resolve();
        else window.addEventListener('load', resolve);
    });
    const safetyTimeout = new Promise((resolve) => setTimeout(resolve, 5000));
    const contentReady = window.contentReady || Promise.resolve();

    Promise.race([
        Promise.all([windowLoaded, contentReady]),
        safetyTimeout
    ]).then(() => {
        cancelAnimationFrame(rafId);
        if (fill) fill.style.width = '100%';
        if (percentEl) percentEl.textContent = '100';

        setTimeout(() => {
            preloader.classList.add('preloader-hidden');
            setTimeout(() => preloader.remove(), 900);
        }, 350);
    });
})();

// Initialize Hero Swiper
// Note: This is now handled in api.js after fetching dynamic slides
/* 
const heroSwiper = new Swiper('.hero-swiper', {
    loop: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    effect: 'fade',
    fadeEffect: {
        crossFade: true
    },
});
*/

// Navbar Scroll Effect + Logo Swap
const navbar = document.getElementById('navbar');
const logoWhite = document.getElementById('logo-white');
const logoDark  = document.getElementById('logo-dark');

function updateNavbar() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
        // Swap to dark logo (readable on white navbar)
        if (logoWhite) logoWhite.classList.add('hidden');
        if (logoDark)  logoDark.classList.remove('hidden');
    } else {
        navbar.classList.remove('scrolled');
        // Swap to white logo (readable on dark hero)
        if (logoWhite) logoWhite.classList.remove('hidden');
        if (logoDark)  logoDark.classList.add('hidden');
    }
}

window.addEventListener('scroll', updateNavbar);
updateNavbar(); // Run once on load to set initial state

// Mobile Menu Toggle
// Side Menu Logic
const menuBtn = document.getElementById('menu-btn');
const closeMenuBtn = document.getElementById('close-menu-btn');
const sideMenu = document.getElementById('side-menu');
const menuOverlay = document.getElementById('menu-overlay');

function openMenu() {
    sideMenu.classList.remove('translate-x-full');
    menuOverlay.classList.remove('hidden');
    // slight delay for opacity transition to work after removing hidden
    setTimeout(() => {
        menuOverlay.classList.remove('opacity-0');
    }, 10);
}

function closeMenu() {
    sideMenu.classList.add('translate-x-full');
    menuOverlay.classList.add('opacity-0');
    setTimeout(() => {
        menuOverlay.classList.add('hidden');
    }, 300); // match transition duration
}

if (menuBtn) menuBtn.addEventListener('click', openMenu);
if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

// Close menu when clicking a link
document.querySelectorAll('#side-menu a').forEach(link => {
    link.addEventListener('click', () => {
        closeMenu();
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Counter Animation
function animateCounter(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Trigger counter animation when in viewport
const observerOptions = {
    threshold: 0.5,
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.counter');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target, 2000);
            });
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const counterSection = document.querySelector('.counter-section');
if (counterSection) {
    observer.observe(counterSection);
}

// Back to Top Button
const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Log page load
console.log('Real Estate Website Loaded Successfully!');
