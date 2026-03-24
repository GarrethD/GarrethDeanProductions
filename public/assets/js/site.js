document.addEventListener("DOMContentLoaded", function () {
    const button = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".site-nav");

    if (!button || !nav) {
        return;
    }

    button.addEventListener("click", function () {
        const isOpen = nav.classList.toggle("is-open");
        button.setAttribute("aria-expanded", isOpen ? "true" : "false");
        document.body.classList.toggle("nav-open", isOpen);
    });

    nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            nav.classList.remove("is-open");
            button.setAttribute("aria-expanded", "false");
            document.body.classList.remove("nav-open");
        });
    });
});
