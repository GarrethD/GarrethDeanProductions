document.addEventListener("DOMContentLoaded", function() {
    const burger = document.querySelector('.burger-menu');
    const nav = document.querySelector('.nav-wrapper');

    if (burger && nav) {
        burger.addEventListener('click', function() {
            const isOpen = nav.classList.toggle('open');
            burger.classList.toggle('open', isOpen);
            burger.setAttribute('aria-expanded', isOpen ? "true" : "false");
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
    }
});
