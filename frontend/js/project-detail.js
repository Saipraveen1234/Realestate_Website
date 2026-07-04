// Get project id from URL query string
function getProjectId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

async function fetchProjectById(id) {
    try {
        const response = await fetch(`/api/projects/${id}`);
        if (!response.ok) throw new Error('Failed to fetch project');
        return await response.json();
    } catch (error) {
        console.error('Error fetching project:', error);
        return null;
    }
}

function statusLabel(status) {
    if (status === 'upcoming') return 'Upcoming';
    if (status === 'completed') return 'Completed';
    return 'Ongoing';
}

async function loadProjectDetail() {
    const id = getProjectId();
    if (!id) {
        window.location.href = 'index.html';
        return;
    }

    const project = await fetchProjectById(id);
    if (!project) {
        document.getElementById('detail-name').textContent = 'Project Not Found';
        document.getElementById('detail-description').textContent = 'This project could not be found.';
        return;
    }

    document.title = `${project.name} - Soudha Projects`;
    document.getElementById('page-title').textContent = `${project.name} - Soudha Projects`;

    document.getElementById('detail-name').textContent = project.name;
    document.getElementById('detail-location').querySelector('span').textContent = project.location;
    document.getElementById('detail-status').textContent = statusLabel(project.status);
    document.getElementById('detail-description').textContent = project.description || 'No description available.';

    document.getElementById('stat-size').textContent = project.size || '-';
    document.getElementById('stat-price').textContent = project.price || '-';
    document.getElementById('stat-facing').textContent = project.facing ? `${project.facing}` : '-';
    document.getElementById('stat-status').textContent = statusLabel(project.status);

    if (project.image) {
        document.getElementById('hero-image').style.backgroundImage = `url('${project.image}')`;
    }

    if (project.brochure) {
        const brochureLink = document.getElementById('brochure-link');
        brochureLink.href = project.brochure;
        brochureLink.classList.remove('hidden');
    }

    if (project.layoutImage) {
        setupDigitalLayout(project);
    }
}

// Digital layout modal: zoomable/pannable site layout image, kept on our own site
function setupDigitalLayout(project) {
    const viewBtn = document.getElementById('view-layout-btn');
    const modal = document.getElementById('layout-modal');
    const closeBtn = document.getElementById('close-layout-btn');
    const viewport = document.getElementById('layout-zoom-viewport');
    const img = document.getElementById('layout-modal-img');

    document.getElementById('layout-modal-title').textContent = project.name;
    document.getElementById('layout-modal-location').textContent = project.location;
    img.src = project.layoutImage;

    viewBtn.classList.remove('hidden');
    viewBtn.classList.add('inline-flex');

    let scale = 1, panX = 0, panY = 0;
    let isDragging = false, startX = 0, startY = 0;

    function applyTransform() {
        img.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
    }

    function resetTransform() {
        scale = 1; panX = 0; panY = 0;
        applyTransform();
    }

    function openModal() {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
        resetTransform();
    }

    function closeModal() {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
    }

    viewBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);

    viewport.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        scale = Math.min(4, Math.max(1, scale + delta));
        applyTransform();
    }, { passive: false });

    viewport.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - panX;
        startY = e.clientY - panY;
        viewport.classList.add('cursor-grabbing');
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        panX = e.clientX - startX;
        panY = e.clientY - startY;
        applyTransform();
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        viewport.classList.remove('cursor-grabbing');
    });

    // Basic touch pinch/pan support
    let lastTouchDist = null;
    viewport.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isDragging = true;
            startX = e.touches[0].clientX - panX;
            startY = e.touches[0].clientY - panY;
        } else if (e.touches.length === 2) {
            lastTouchDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
        }
    });

    viewport.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (e.touches.length === 1 && isDragging) {
            panX = e.touches[0].clientX - startX;
            panY = e.touches[0].clientY - startY;
            applyTransform();
        } else if (e.touches.length === 2 && lastTouchDist) {
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            const delta = (dist - lastTouchDist) / 200;
            scale = Math.min(4, Math.max(1, scale + delta));
            lastTouchDist = dist;
            applyTransform();
        }
    }, { passive: false });

    viewport.addEventListener('touchend', () => {
        isDragging = false;
        lastTouchDist = null;
    });
}

document.addEventListener('DOMContentLoaded', loadProjectDetail);
