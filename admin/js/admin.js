// API Configuration
const API_BASE_URL = '/api';

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token) {
        window.location.href = '/admin/login.html';
        return null;
    }

    document.getElementById('user-email').textContent = user.email || '';
    return token;
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/admin/login.html';
}

// Get auth headers
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`
    };
}

// Tab switching
function showTab(tab) {
    // Update tab buttons
    document.getElementById('tab-projects').classList.remove('text-orange-500', 'border-b-2', 'border-orange-500');
    document.getElementById('tab-testimonials').classList.remove('text-orange-500', 'border-b-2', 'border-orange-500');
    if (document.getElementById('tab-slider')) document.getElementById('tab-slider').classList.remove('text-orange-500', 'border-b-2', 'border-orange-500');
    if (document.getElementById('tab-stats')) document.getElementById('tab-stats').classList.remove('text-orange-500', 'border-b-2', 'border-orange-500');

    document.getElementById(`tab-${tab}`).classList.add('text-orange-500', 'border-b-2', 'border-orange-500');

    // Update content
    document.getElementById('content-projects').classList.add('hidden');
    document.getElementById('content-testimonials').classList.add('hidden');
    if (document.getElementById('content-slider')) document.getElementById('content-slider').classList.add('hidden');
    if (document.getElementById('content-stats')) document.getElementById('content-stats').classList.add('hidden');

    document.getElementById(`content-${tab}`).classList.remove('hidden');
}

// Load dashboard stats
async function loadStats() {
    try {
        const [projectsRes, testimonialsRes] = await Promise.all([
            fetch(`${API_BASE_URL}/projects`),
            fetch(`${API_BASE_URL}/testimonials`)
        ]);

        const projects = await projectsRes.json();
        const testimonials = await testimonialsRes.json();

        document.getElementById('total-projects').textContent = projects.length;
        document.getElementById('total-testimonials').textContent = testimonials.length;
        document.getElementById('ongoing-projects').textContent = projects.filter(p => p.status === 'ongoing').length;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load projects
async function loadProjects() {
    try {
        const response = await fetch(`${API_BASE_URL}/projects`);
        const projects = await response.json();

        const projectsList = document.getElementById('projects-list');
        if (projects.length === 0) {
            projectsList.innerHTML = '<p class="text-gray-500">No projects yet.</p>';
            return;
        }

        projectsList.innerHTML = projects.map(project => `
      <div class="border rounded-lg p-4 flex justify-between items-start">
        <div class="flex-1">
          <h3 class="text-xl font-bold mb-2">${project.name}</h3>
          <div class="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <p><strong>Size:</strong> ${project.size}</p>
            <p><strong>Location:</strong> ${project.location}</p>
            <p><strong>Price:</strong> ${project.price}</p>
            <p><strong>Facing:</strong> ${project.facing}</p>
            <p><strong>Status:</strong> <span class="px-2 py-1 rounded text-xs ${getStatusColor(project.status)}">${project.status}</span></p>
          </div>
        </div>
        <div class="flex space-x-2">
          <button onclick="editProject('${project._id}')" class="text-blue-500 hover:text-blue-700">
            <i class="fas fa-edit"></i>
          </button>
          <button onclick="deleteProject('${project._id}')" class="text-red-500 hover:text-red-700">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Load testimonials
async function loadTestimonials() {
    try {
        const response = await fetch(`${API_BASE_URL}/testimonials`);
        const testimonials = await response.json();

        const testimonialsList = document.getElementById('testimonials-list');
        if (testimonials.length === 0) {
            testimonialsList.innerHTML = '<p class="text-gray-500">No testimonials yet.</p>';
            return;
        }

        testimonialsList.innerHTML = testimonials.map(testimonial => `
      <div class="border rounded-lg p-4 flex justify-between items-start">
        <div class="flex-1">
          <h3 class="text-xl font-bold mb-2">${testimonial.name}</h3>
          <div class="text-yellow-500 mb-2">${'★'.repeat(testimonial.rating)}${'☆'.repeat(5 - testimonial.rating)}</div>
          <p class="text-gray-600 italic">"${testimonial.testimonial}"</p>
        </div>
        <div class="flex space-x-2">
          <button onclick="editTestimonial('${testimonial._id}')" class="text-blue-500 hover:text-blue-700">
            <i class="fas fa-edit"></i>
          </button>
          <button onclick="deleteTestimonial('${testimonial._id}')" class="text-red-500 hover:text-red-700">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');
    } catch (error) {
        console.error('Error loading testimonials:', error);
    }
}

// Helper function for status colors
function getStatusColor(status) {
    switch (status) {
        case 'ongoing': return 'bg-green-100 text-green-800';
        case 'upcoming': return 'bg-orange-100 text-orange-800';
        case 'completed': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

// Project Modal Functions
function showAddProjectModal() {
    document.getElementById('project-modal-title').textContent = 'Add Project';
    document.getElementById('project-form').reset();
    document.getElementById('project-id').value = '';
    document.getElementById('project-modal').classList.remove('hidden');
    document.getElementById('project-modal').classList.add('flex');
}

function closeProjectModal() {
    document.getElementById('project-modal').classList.add('hidden');
    document.getElementById('project-modal').classList.remove('flex');
}

async function editProject(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/projects/${id}`);
        const project = await response.json();

        document.getElementById('project-modal-title').textContent = 'Edit Project';
        document.getElementById('project-id').value = project._id;
        document.getElementById('project-name').value = project.name;
        document.getElementById('project-size').value = project.size;
        document.getElementById('project-location').value = project.location;
        document.getElementById('project-price').value = project.price;
        document.getElementById('project-facing').value = project.facing;
        document.getElementById('project-status').value = project.status;
        document.getElementById('project-description').value = project.description || '';

        document.getElementById('project-modal').classList.remove('hidden');
        document.getElementById('project-modal').classList.add('flex');
    } catch (error) {
        console.error('Error loading project:', error);
        alert('Error loading project');
    }
}

async function deleteProject(id) {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (response.ok) {
            loadProjects();
            loadStats();
            alert('Project deleted successfully');
        } else {
            alert('Error deleting project');
        }
    } catch (error) {
        console.error('Error deleting project:', error);
        alert('Error deleting project');
    }
}

// Testimonial Modal Functions
function showAddTestimonialModal() {
    document.getElementById('testimonial-modal-title').textContent = 'Add Testimonial';
    document.getElementById('testimonial-form').reset();
    document.getElementById('testimonial-id').value = '';
    document.getElementById('testimonial-modal').classList.remove('hidden');
    document.getElementById('testimonial-modal').classList.add('flex');
}

function closeTestimonialModal() {
    document.getElementById('testimonial-modal').classList.add('hidden');
    document.getElementById('testimonial-modal').classList.remove('flex');
}

async function editTestimonial(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/testimonials/${id}`);
        const testimonial = await response.json();

        document.getElementById('testimonial-modal-title').textContent = 'Edit Testimonial';
        document.getElementById('testimonial-id').value = testimonial._id;
        document.getElementById('testimonial-name').value = testimonial.name;
        document.getElementById('testimonial-rating').value = testimonial.rating;
        document.getElementById('testimonial-text').value = testimonial.testimonial;

        document.getElementById('testimonial-modal').classList.remove('hidden');
        document.getElementById('testimonial-modal').classList.add('flex');
    } catch (error) {
        console.error('Error loading testimonial:', error);
        alert('Error loading testimonial');
    }
}

async function deleteTestimonial(id) {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (response.ok) {
            loadTestimonials();
            loadStats();
            alert('Testimonial deleted successfully');
        } else {
            alert('Error deleting testimonial');
        }
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        alert('Error deleting testimonial');
    }
}

// Form Submissions
document.getElementById('project-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const id = document.getElementById('project-id').value;

    formData.append('name', document.getElementById('project-name').value);
    formData.append('size', document.getElementById('project-size').value);
    formData.append('location', document.getElementById('project-location').value);
    formData.append('price', document.getElementById('project-price').value);
    formData.append('facing', document.getElementById('project-facing').value);
    formData.append('status', document.getElementById('project-status').value);
    formData.append('description', document.getElementById('project-description').value);

    const imageFile = document.getElementById('project-image').files[0];
    if (imageFile) formData.append('image', imageFile);

    const brochureFile = document.getElementById('project-brochure').files[0];
    if (brochureFile) formData.append('brochure', brochureFile);

    try {
        const url = id ? `${API_BASE_URL}/projects/${id}` : `${API_BASE_URL}/projects`;
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: getAuthHeaders(),
            body: formData
        });

        if (response.ok) {
            closeProjectModal();
            loadProjects();
            loadStats();
            alert(id ? 'Project updated successfully' : 'Project added successfully');
        } else {
            const error = await response.json();
            alert('Error: ' + (error.message || 'Failed to save project'));
        }
    } catch (error) {
        console.error('Error saving project:', error);
        alert('Error saving project');
    }
});

document.getElementById('testimonial-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const id = document.getElementById('testimonial-id').value;

    formData.append('name', document.getElementById('testimonial-name').value);
    formData.append('rating', document.getElementById('testimonial-rating').value);
    formData.append('testimonial', document.getElementById('testimonial-text').value);

    const photoFile = document.getElementById('testimonial-photo').files[0];
    if (photoFile) formData.append('photo', photoFile);

    try {
        const url = id ? `${API_BASE_URL}/testimonials/${id}` : `${API_BASE_URL}/testimonials`;
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: getAuthHeaders(),
            body: formData
        });

        if (response.ok) {
            closeTestimonialModal();
            loadTestimonials();
            loadStats();
            alert(id ? 'Testimonial updated successfully' : 'Testimonial added successfully');
        } else {
            const error = await response.json();
            alert('Error: ' + (error.message || 'Failed to save testimonial'));
        }
    } catch (error) {
        console.error('Error saving testimonial:', error);
        alert('Error saving testimonial');
    }
});

// Load slides
async function loadSlides() {
    try {
        const response = await fetch(`${API_BASE_URL}/hero`);
        // if endpoint doesn't exist yet, it returns html or error, so parse carefully
        if (!response.ok) throw new Error('Failed to fetch slides');

        const slides = await response.json();

        const slidesList = document.getElementById('slides-list');
        if (slides.length === 0) {
            slidesList.innerHTML = '<p class="text-gray-500">No slides yet. Add one to customize your heroes!</p>';
            return;
        }

        slidesList.innerHTML = slides.map(slide => `
      <div class="border rounded-lg p-4 flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <img src="${slide.image}" alt="Slide" class="w-16 h-16 object-cover rounded">
          <div>
            <h3 class="font-bold">${slide.title || 'No Title'}</h3>
            <p class="text-sm text-gray-600">${slide.subtitle || 'No Subtitle'}</p>
            <p class="text-xs text-gray-500">Order: ${slide.order}</p>
          </div>
        </div>
        <div class="flex space-x-2">
          <button onclick="editSlide('${slide._id}')" class="text-blue-500 hover:text-blue-700">
            <i class="fas fa-edit"></i>
          </button>
          <button onclick="deleteSlide('${slide._id}')" class="text-red-500 hover:text-red-700">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');
    } catch (error) {
        console.error('Error loading slides:', error);
        document.getElementById('slides-list').innerHTML = '<p class="text-red-500">Error loading slides (API might be missing)</p>';
    }
}

// Slide Modal Functions
function showAddSlideModal() {
    document.getElementById('slide-modal-title').textContent = 'Add Slide';
    document.getElementById('slide-form').reset();
    document.getElementById('slide-id').value = '';
    document.getElementById('slide-modal').classList.remove('hidden');
    document.getElementById('slide-modal').classList.add('flex');
}

function closeSlideModal() {
    document.getElementById('slide-modal').classList.add('hidden');
    document.getElementById('slide-modal').classList.remove('flex');
}

async function editSlide(id) {
    // Current backend doesn't support GET /hero/:id, so strict CRUD might be GET /hero and find
    // But since I implemented standard CRUD, checking if GET /:id is available or just filtering from list
    // Wait, my implemented backend DOES NOT have GET /hero/:id, only PUT /hero/:id
    // So I should fetch all and find, OR implement GET /hero/:id.
    // I recall I did NOT implement GET /hero/:id in backend. I implemented GET / (all). 
    // Let's implement finding it from the list or implement the route.
    // I'll assume we can just pass the data or fetch all. Fetching all is safer for now.

    // Better: Fetch all and find
    try {
        const response = await fetch(`${API_BASE_URL}/hero`);
        const slides = await response.json();
        const slide = slides.find(s => s._id === id);

        if (!slide) throw new Error('Slide not found');

        document.getElementById('slide-modal-title').textContent = 'Edit Slide';
        document.getElementById('slide-id').value = slide._id;
        document.getElementById('slide-title').value = slide.title || '';
        document.getElementById('slide-subtitle').value = slide.subtitle || '';
        document.getElementById('slide-order').value = slide.order || 0;

        document.getElementById('slide-modal').classList.remove('hidden');
        document.getElementById('slide-modal').classList.add('flex');
    } catch (error) {
        console.error('Error loading slide:', error);
        alert('Error loading slide details');
    }
}

async function deleteSlide(id) {
    if (!confirm('Are you sure you want to delete this slide?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/hero/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (response.ok) {
            loadSlides();
            alert('Slide deleted successfully');
        } else {
            alert('Error deleting slide');
        }
    } catch (error) {
        console.error('Error deleting slide:', error);
        alert('Error deleting slide');
    }
}

document.getElementById('slide-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const id = document.getElementById('slide-id').value;

    formData.append('title', document.getElementById('slide-title').value);
    formData.append('subtitle', document.getElementById('slide-subtitle').value);
    formData.append('order', document.getElementById('slide-order').value);

    const imageFile = document.getElementById('slide-image').files[0];
    if (imageFile) formData.append('image', imageFile);

    try {
        const url = id ? `${API_BASE_URL}/hero/${id}` : `${API_BASE_URL}/hero`;
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: getAuthHeaders(),
            body: formData
        });

        if (response.ok) {
            closeSlideModal();
            loadSlides();
            alert(id ? 'Slide updated successfully' : 'Slide added successfully');
        } else {
            const error = await response.json();
            alert('Error: ' + (error.message || 'Failed to save slide'));
        }
    } catch (error) {
        console.error('Error saving slide:', error);
        alert('Error saving slide');
    }
});

// Initialize
checkAuth();
loadStats();
loadProjects();
loadTestimonials();
loadSlides();
loadCompanyStats();

// Load company stats for form
async function loadCompanyStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/stats`);
        if (!response.ok) throw new Error('Failed to fetch stats');
        const stats = await response.json();

        document.getElementById('stats-experience').value = stats.yearsOfExperience || 0;
        document.getElementById('stats-clients').value = stats.happyClients || 0;
        document.getElementById('stats-plots').value = stats.plotsSold || 0;
    } catch (error) {
        console.error('Error loading company stats:', error);
    }
}

document.getElementById('stats-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        yearsOfExperience: document.getElementById('stats-experience').value,
        happyClients: document.getElementById('stats-clients').value,
        plotsSold: document.getElementById('stats-plots').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/stats`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Statistics updated successfully');
        } else {
            alert('Error updating statistics');
        }
    } catch (error) {
        console.error('Error updating stats:', error);
        alert('Error updating statistics');
    }
});
