
// -- Change Password Logic --

function showChangePasswordModal() {
    document.getElementById('password-modal').classList.remove('hidden');
    document.getElementById('password-modal').classList.add('flex');
}

function closeChangePasswordModal() {
    document.getElementById('password-modal').classList.add('hidden');
    document.getElementById('password-modal').classList.remove('flex');
    document.getElementById('password-form').reset();
}

document.getElementById('password-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');

    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Updating...';

        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ currentPassword, newPassword })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Password updated successfully!');
            closeChangePasswordModal();
        } else {
            alert(data.message || 'Failed to update password');
        }
    } catch (error) {
        console.error('Password update error:', error);
        alert('An error occurred. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Update Password';
    }
});
