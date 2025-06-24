document.addEventListener('DOMContentLoaded', () => {
    const usernameDisplay = document.getElementById('username-display');
    const logoutButton = document.getElementById('logout-button');

    if (usernameDisplay && logoutButton) {
        const loggedInUser = localStorage.getItem('loggedInUser');
        const token = localStorage.getItem('loggedInUserToken');

        if (loggedInUser && token) {
            usernameDisplay.textContent = loggedInUser;
        } else {
            alert('الرجاء تسجيل الدخول أولاً.');
            window.location.href = 'login.html';
        }

        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('loggedInUser');
            localStorage.removeItem('loggedInUserToken');
            window.location.href = 'login.html';
        });
    }
});