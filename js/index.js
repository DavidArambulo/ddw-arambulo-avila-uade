const navbar = document.querySelector(".header-navbar");
const navbarLinks = document.querySelector(".nav-links");
const navLinks = document.querySelectorAll(".nav-links-link");
const btnMenu = document.querySelector("#hamburger-1");
let btnMenuIsOpen = false;

const handleBtnMenuIsOpen = () => {

    if (btnMenuIsOpen) {
        btnMenu.classList.remove("is-active");
        navbarLinks.classList.remove("menu-abierto");
    } else {
        btnMenu.classList.add("is-active");
        navbarLinks.classList.add("menu-abierto");
    }

    btnMenuIsOpen = !btnMenuIsOpen;
};

if (
    "IntersectionObserver" in window &&
    "IntersectionObserverEntry" in window &&
    "intersectionRatio" in window.IntersectionObserverEntry.prototype
) {
    let observer = new IntersectionObserver(entries => {
        if (entries[0].boundingClientRect.y < 0) {
            navbar.classList.add("no-en-top");
            navbar.classList.remove("en-top");
        } else {
            navbar.classList.remove("no-en-top");
            navbar.classList.add("en-top");
        }
    });
    observer.observe(document.querySelector("#top-del-sitio-pixel-sensor"));
};

btnMenu.addEventListener("click", event => {
    event.preventDefault();
    handleBtnMenuIsOpen();
})

navLinks.forEach(link => {
    link.addEventListener("click", event => {
        handleBtnMenuIsOpen();
    })
});