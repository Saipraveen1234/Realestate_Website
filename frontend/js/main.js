// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
});

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

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

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
