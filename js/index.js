const navbar = document.querySelector(".header-navbar");
const navbarLinks = document.querySelector(".nav-links");
const navLinks = document.querySelectorAll(".nav-links-link");
const btnMenu = document.querySelector("#hamburger-1");
let btnMenuIsOpen = false;

// Esta funcion maneja el cambio en estilos al presionar el boton de menu y cualquier link del nav en mobile
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

// Esta funcion se encarga de observar el pixel sensor y darle la funcionalidad de que activar o desactivar los estilos
if (
    "IntersectionObserver" in window &&
    "IntersectionObserverEntry" in window &&
    "intersectionRatio" in window.IntersectionObserverEntry.prototype
) {
    let observer = new IntersectionObserver(entries => {
        if (entries[0].boundingClientRect.y < 0) {
            navbar.classList.add("no-en-top");
        } else {
            navbar.classList.remove("no-en-top");
        }
    });
    observer.observe(document.querySelector("#top-del-sitio-pixel-sensor"));
};

// Estas funciones son los eventos que permiten escuchar cuando se clickea el boton y los links de la navbar
btnMenu.addEventListener("click", event => {
    event.preventDefault();
    handleBtnMenuIsOpen();
})

navLinks.forEach(link => {
    link.addEventListener("click", event => {
        handleBtnMenuIsOpen();
    })
});