document.addEventListener('DOMContentLoaded', () => {
    const navbarToggle = document.getElementById('navbarToggle');
    const menu = document.querySelector('.navbar-menu');
    
    navbarToggle.addEventListener('click', () => {
        menu.classList.toggle('active');
    });
});
