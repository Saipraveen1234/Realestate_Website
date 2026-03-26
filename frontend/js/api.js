// API Configuration
const API_BASE_URL = '/api';

// Fetch all projects
async function fetchProjects() {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`);
    if (!response.ok) throw new Error('Failed to fetch projects');
    const projects = await response.json();
    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

// Fetch all testimonials
async function fetchTestimonials() {
  try {
    const response = await fetch(`${API_BASE_URL}/testimonials`);
    if (!response.ok) throw new Error('Failed to fetch testimonials');
    const testimonials = await response.json();
    return testimonials;
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

// Fetch hero slides
async function fetchHeroSlides() {
  try {
    const response = await fetch(`${API_BASE_URL}/hero`);
    if (!response.ok) throw new Error('Failed to fetch hero slides');
    const slides = await response.json();
    return slides;
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    return [];
  }
}

// Fetch company stats
async function fetchCompanyStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return await response.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    return { yearsOfExperience: 0, happyClients: 0, plotsSold: 0 };
  }
}

// Render project card
function renderProjectCard(project) {
  const statusBadge = project.status === 'upcoming'
    ? '<span class="project-badge badge-launching">Launching Soon</span>'
    : project.status === 'completed'
      ? '<span class="project-badge badge-completed">Completed</span>'
      : '';

  const brochureBtn = project.brochure
    ? `<a href="${project.brochure}" target="_blank" class="card-action-btn border border-white/60 text-white hover:bg-white hover:text-dark-charcoal">
        <i class="fas fa-file-pdf mr-1.5"></i>Brochure
      </a>`
    : '';

  return `
    <div class="project-card-overlay group" data-aos="fade-up">
      <div class="relative overflow-hidden" style="aspect-ratio: 4/3;">
        <img src="${project.image || 'assets/images/project-placeholder.jpg'}"
             alt="${project.name}"
             loading="lazy"
             class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
        ${statusBadge}
        <div class="absolute inset-0 bg-dark-charcoal/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">
          <div class="text-white">
            <p class="text-primary-orange text-[10px] uppercase tracking-[0.25em] mb-2">${project.location}</p>
            <h3 class="font-heading text-2xl font-bold mb-3">${project.name}</h3>
            <div class="flex flex-wrap gap-x-3 gap-y-1 text-white/60 text-xs uppercase tracking-wider mb-5">
              <span>${project.size}</span>
              <span>·</span>
              <span>${project.price}</span>
              <span>·</span>
              <span>${project.facing} Facing</span>
            </div>
            <div class="flex gap-3">
              ${brochureBtn}
              <a href="tel:+919999999999" class="card-action-btn bg-primary-orange text-white hover:bg-white hover:text-dark-charcoal">
                <i class="fas fa-phone mr-1.5"></i>Contact
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="pt-4 pb-2 flex justify-between items-start gap-4">
        <div>
          <h3 class="font-heading text-lg font-bold text-dark-charcoal leading-tight">${project.name}</h3>
          <p class="text-primary-orange text-xs font-medium tracking-wide uppercase mt-1">${project.location}</p>
        </div>
        <div class="text-right text-xs text-gray-400 uppercase tracking-wide flex-shrink-0 mt-0.5">
          <p>${project.size}</p>
          <p class="text-dark-charcoal font-semibold mt-0.5">${project.price}</p>
        </div>
      </div>
    </div>
  `;
}

// Render testimonial card
function renderTestimonialCard(testimonial) {
  const stars = '★'.repeat(testimonial.rating || 5);

  return `
    <div class="swiper-slide">
      <div class="testimonial-card">
        <span class="quote-bg">"</span>
        <img src="${testimonial.photo || 'assets/images/avatar-placeholder.jpg'}" alt="${testimonial.name}" loading="lazy">
        <h4 class="font-heading text-lg font-bold text-dark-charcoal mb-1">${testimonial.name}</h4>
        <div class="stars text-lg mb-4">${stars}</div>
        <p class="text-gray-500 text-sm leading-relaxed italic">"${testimonial.testimonial}"</p>
      </div>
    </div>
  `;
}

// Load and display projects
async function loadProjects() {
  const projects = await fetchProjects();

  const ongoingProjects = projects.filter(p => p.status === 'ongoing');
  const upcomingProjects = projects.filter(p => p.status === 'upcoming');
  const completedProjects = projects.filter(p => p.status === 'completed');

  // Render ongoing projects
  const ongoingGrid = document.getElementById('ongoing-projects-grid');
  if (ongoingProjects.length > 0) {
    ongoingGrid.innerHTML = ongoingProjects.map(renderProjectCard).join('');
  } else {
    ongoingGrid.innerHTML = '<div class="col-span-full text-center py-12"><p class="text-gray-500">No ongoing projects at the moment.</p></div>';
  }

  // Render upcoming projects
  const upcomingGrid = document.getElementById('upcoming-projects-grid');
  if (upcomingProjects.length > 0) {
    upcomingGrid.innerHTML = upcomingProjects.map(renderProjectCard).join('');
  } else {
    upcomingGrid.innerHTML = '<div class="col-span-full text-center py-12"><p class="text-gray-500">No upcoming projects at the moment.</p></div>';
  }

  // Render completed projects
  const completedGrid = document.getElementById('completed-projects-grid');
  if (completedProjects.length > 0) {
    completedGrid.innerHTML = completedProjects.map(renderProjectCard).join('');
  } else {
    completedGrid.innerHTML = '<div class="col-span-full text-center py-12"><p class="text-gray-500">No completed projects to display.</p></div>';
  }

  // Refresh AOS animations
  AOS.refresh();
}

// Render hero slide
function renderHeroSlide(slide) {
  return `
    <div class="swiper-slide h-full flex items-end pb-28 md:pb-36 px-8 md:px-20 lg:px-28 relative">
        <div class="absolute inset-0 z-10" style="background: linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.2) 100%);"></div>
        <img src="${slide.image}" class="absolute inset-0 w-full h-full object-cover z-0" alt="${slide.title}" loading="lazy">
        <div class="relative z-20 text-white max-w-3xl">
            <p class="font-body tracking-[0.35em] uppercase text-xs text-white/50 mb-6" data-aos="fade-down">Soudha Projects</p>
            <h1 class="font-heading text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.05] tracking-tight" data-aos="fade-up">
                ${slide.title}
            </h1>
            <div class="flex items-center gap-8 mb-10" data-aos="fade-up" data-aos-delay="150">
                <div class="h-px w-16 bg-white/30 flex-shrink-0"></div>
                <p class="text-sm text-white/65 font-light">${slide.subtitle}</p>
            </div>
            <div data-aos="fade-up" data-aos-delay="300">
                <a href="#ongoing-projects" class="hero-cta">Explore Projects</a>
            </div>
        </div>
    </div>
  `;
}

// Load and display hero slides
async function loadHeroSlides() {
  const slides = await fetchHeroSlides();

  if (slides.length > 0) {
    const wrapper = document.getElementById('hero-swiper-wrapper');
    if (wrapper) {
      wrapper.innerHTML = slides.map(renderHeroSlide).join('');

      // Re-initialize Swiper after content update
      if (window.heroSwiper) {
        window.heroSwiper.destroy(true, true);
      }
      initHeroSwiper();
    }
  }
  // If no slides, fallback content remains
}

// Initialize hero swiper
function initHeroSwiper() {
  window.heroSwiper = new Swiper('.hero-swiper', {
    loop: true,
    effect: 'fade',
    speed: 1000,
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
  });
}

// Load company stats
async function loadCompanyStats() {
  const stats = await fetchCompanyStats();

  const expEl = document.getElementById('stat-experience');
  const clientEl = document.getElementById('stat-clients');
  const plotsEl = document.getElementById('stat-plots');

  if (expEl) {
    expEl.setAttribute('data-target', stats.yearsOfExperience || 0);
    expEl.innerText = '0'; // Reset to 0 to let animation run if needed
  }
  if (clientEl) {
    clientEl.setAttribute('data-target', stats.happyClients || 0);
    clientEl.innerText = '0';
  }
  if (plotsEl) {
    plotsEl.setAttribute('data-target', stats.plotsSold || 0);
    plotsEl.innerText = '0';
  }
}

// Load and display testimonials
async function loadTestimonials() {
  const testimonials = await fetchTestimonials();

  const container = document.getElementById('testimonials-container');
  if (testimonials.length > 0) {
    container.innerHTML = testimonials.map(renderTestimonialCard).join('');
  } else {
    container.innerHTML = `
      <div class="swiper-slide">
        <div class="text-center py-12">
          <p class="text-gray-500">No testimonials yet.</p>
        </div>
      </div>
    `;
  }

  // Reinitialize testimonials swiper
  initTestimonialsSwiper();
}

// Initialize testimonials swiper
function initTestimonialsSwiper() {
  new Swiper('.testimonials-swiper', {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 30,
    autoplay: {
      delay: 4000,
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
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
    },
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadHeroSlides();
  loadCompanyStats();
  loadProjects();
  loadTestimonials();
});
