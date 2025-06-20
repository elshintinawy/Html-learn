document.addEventListener('DOMContentLoaded', () => {
    const usernameDisplay = document.getElementById('username-display');
    const logoutButton = document.getElementById('logout-button');

    if (usernameDisplay && logoutButton) {
        const loggedInUser = localStorage.getItem('loggedInUser');

        if (loggedInUser) {
            usernameDisplay.textContent = loggedInUser;
        } else {
            // If no user is logged in, force redirect to login page
            alert('الرجاء تسجيل الدخول أولاً.');
            window.location.href = 'login.html';
        }

        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('loggedInUser');
            window.location.href = 'login.html';
        });
    }
});