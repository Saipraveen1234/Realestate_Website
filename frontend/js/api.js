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
  const statusText = project.status === 'upcoming'
    ? 'Launching Soon'
    : project.status === 'completed'
      ? 'Completed'
      : 'Ongoing';

  const brochureBtn = project.brochure
    ? `<a href="${project.brochure}" target="_blank" aria-label="Download brochure"
          class="card-icon-btn">
          <i class="fas fa-file-pdf"></i>
       </a>`
    : '';

  return `
    <div class="project-card-overlay" data-aos="fade-up">
      <!-- Image wrap -->
      <div class="card-image-wrap">
        <a href="project-detail.html?id=${project._id}" aria-label="View ${project.name} details" class="absolute inset-0 z-10"></a>
        <img src="${project.image || 'assets/images/project-placeholder.jpg'}"
             alt="${project.name}" loading="lazy">
        <span class="project-badge badge-${project.status}">${statusText}</span>
        <span class="card-price-tag">${project.price}</span>
      </div>

      <!-- Info block: always visible, no hover-only content -->
      <div class="card-info">
        <a href="project-detail.html?id=${project._id}" class="block">
          <h3 class="font-heading text-lg font-normal text-dark-charcoal leading-tight mb-1.5">${project.name}</h3>
          <p class="text-gray-400 text-xs flex items-center gap-1.5 mb-4">
            <i class="fas fa-map-marker-alt text-primary-orange text-[10px]"></i>${project.location}
          </p>
        </a>

        <div class="card-meta-row">
          <div>
            <p class="card-meta-label">Size</p>
            <p class="card-meta-value">${project.size}</p>
          </div>
          <div>
            <p class="card-meta-label">Facing</p>
            <p class="card-meta-value">${project.facing}</p>
          </div>
        </div>

        <div class="card-actions">
          <a href="project-detail.html?id=${project._id}" class="card-btn-primary">
            View Details <i class="fas fa-arrow-right"></i>
          </a>
          <a href="tel:+919371561234" aria-label="Call to enquire" class="card-icon-btn">
            <i class="fas fa-phone"></i>
          </a>
          ${brochureBtn}
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
        <div class="relative z-10">
          <div class="stars mb-4">${stars}</div>
          <p class="text-gray-500 text-sm leading-relaxed mb-6 italic">
            "${testimonial.testimonial}"
          </p>
          <div class="flex items-center gap-3 border-t border-gray-100 pt-5">
            <img src="${testimonial.photo || 'assets/images/avatar-placeholder.jpg'}"
                 alt="${testimonial.name}" loading="lazy">
            <div>
              <h4 class="font-heading text-sm font-bold text-dark-charcoal leading-tight">${testimonial.name}</h4>
              <p class="text-gray-400 text-[10px] uppercase tracking-widest mt-0.5">Verified Client</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Empty-state placeholder card
function renderEmptyState(icon, message) {
  return `
    <div class="col-span-full empty-state-card" data-aos="fade-up">
      <div class="empty-state-icon"><i class="fas ${icon}"></i></div>
      <p class="text-gray-500 text-sm">${message}</p>
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
    ongoingGrid.innerHTML = renderEmptyState('fa-building', 'No ongoing projects at the moment. Check back soon.');
  }

  // Render upcoming projects
  const upcomingGrid = document.getElementById('upcoming-projects-grid');
  if (upcomingProjects.length > 0) {
    upcomingGrid.innerHTML = upcomingProjects.map(renderProjectCard).join('');
  } else {
    upcomingGrid.innerHTML = renderEmptyState('fa-calendar-alt', 'Be the first to know — upcoming projects launch soon.');
  }

  // Render completed projects
  const completedGrid = document.getElementById('completed-projects-grid');
  if (completedProjects.length > 0) {
    completedGrid.innerHTML = completedProjects.map(renderProjectCard).join('');
  } else {
    completedGrid.innerHTML = renderEmptyState('fa-flag-checkered', 'No completed projects to display yet.');
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

  // Hero quick-stats bar (static, no scroll-triggered animation)
  const heroExp = document.getElementById('hero-stat-experience');
  const heroClients = document.getElementById('hero-stat-clients');
  const heroPlots = document.getElementById('hero-stat-plots');
  if (heroExp) heroExp.innerText = stats.yearsOfExperience || 0;
  if (heroClients) heroClients.innerText = stats.happyClients || 0;
  if (heroPlots) heroPlots.innerText = stats.plotsSold || 0;
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
