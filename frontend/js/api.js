// API Configuration
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : '/api';

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

// Render project card
function renderProjectCard(project) {
  const statusBadge = project.status === 'upcoming' 
    ? '<span class="badge badge-launching">Launching Soon</span>' 
    : project.status === 'completed' 
    ? '<span class="badge badge-completed">Completed</span>' 
    : '';

  return `
    <div class="project-card" data-aos="fade-up">
      <div class="relative">
        ${statusBadge}
        <img src="${project.image || 'assets/images/project-placeholder.jpg'}" alt="${project.name}">
      </div>
      <div class="p-6">
        <h3 class="font-heading text-2xl font-bold text-primary-orange mb-4">${project.name}</h3>
        <div class="space-y-2 text-gray-700 mb-6">
          <p><i class="fas fa-ruler-combined text-primary-orange mr-2"></i><strong>Size:</strong> ${project.size}</p>
          <p><i class="fas fa-map-marker-alt text-primary-orange mr-2"></i><strong>Location:</strong> ${project.location}</p>
          <p><i class="fas fa-rupee-sign text-primary-orange mr-2"></i><strong>Price:</strong> ${project.price}</p>
          <p><i class="fas fa-compass text-primary-orange mr-2"></i><strong>Facing:</strong> ${project.facing}</p>
        </div>
        <div class="flex gap-3">
          ${project.brochure ? `<a href="${project.brochure}" target="_blank" class="flex-1 bg-primary-orange text-white py-2 px-4 rounded hover:bg-orange-600 transition text-center">
            <i class="fas fa-file-pdf mr-2"></i>Brochure
          </a>` : ''}
          <a href="tel:+919646333344" class="flex-1 bg-dark-charcoal text-white py-2 px-4 rounded hover:bg-gray-700 transition text-center">
            <i class="fas fa-phone mr-2"></i>Contact
          </a>
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
        <img src="${testimonial.photo || 'assets/images/avatar-placeholder.jpg'}" alt="${testimonial.name}">
        <h4 class="font-heading text-xl font-semibold mb-2">${testimonial.name}</h4>
        <div class="stars text-2xl mb-4">${stars}</div>
        <p class="text-gray-600 italic">"${testimonial.testimonial}"</p>
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
  loadProjects();
  loadTestimonials();
});
