const navbar = document.querySelector(".header-navbar");
const navbarLinks = document.querySelector(".nav-links");
const navLinks = document.querySelectorAll(".nav-links-link");
const btnMenu = document.querySelector("#hamburger-1");
let btnMenuIsOpen = false;

const galeriaProductos = document.querySelector("#galeria-productos")
const listaCarrito = document.querySelector("#carrito-productos")
const btnVaciarCarrito = document.querySelector("#vaciar-carrito")
const btnComprar = document.querySelector("#comprar")
const linkCarrito = document.querySelector("#link-carrito")
const cantidadCarrito = document.querySelector("#cantidad-carrito")
let productos = []
let carrito = []
let carritoLargoAnterior = carrito.length

const formContacto = document.querySelector(".contacto-form")
const mailtoPixel = document.querySelector("#mailto-pixel")

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


// CRUD
const buscarEnCarrito = (idProducto) => carrito.findIndex(producto => producto.id === idProducto)

const guardarCarrito = () => {
    localStorage.setItem( "carritoEsMarina",JSON.stringify(carrito))
}
const cargarCarrito = () => JSON.parse(localStorage.getItem("carritoEsMarina"))

const handleAccionesProducto = (id) => {
    document.querySelector(`#btn-agregar-${id}`).classList.toggle("disable")
    document.querySelector(`#btn-sumar-${id}`).classList.toggle("disable")
    document.querySelector(`#input-manual-${id}`).classList.toggle("disable")
    document.querySelector(`#btn-restar-${id}`).classList.toggle("disable")
}

const handleCarrito = () => {
    if (carrito.length > 0) {
        document.querySelector("#carrito").classList.remove("disable")
    } else {
        document.querySelector("#carrito").classList.add("disable")
    }
}

const updateCantidades = (id) => {
    const carritoIndex = buscarEnCarrito(id)

    if (carritoIndex !== -1) {
        document.querySelector(`#input-manual-${id}`).value = carrito[carritoIndex].cantidad
        document.querySelector(`#carrito-input-manual-${id}`).value = carrito[carritoIndex].cantidad
        document.querySelector(`#total-producto-${id}`).innerHTML = `<strong>Total: $${carrito[carritoIndex].cantidad*carrito[carritoIndex].precio}</strong>`
    } else {
        document.querySelector(`#input-manual-${id}`).value = 0
    }

}


const updateViews = () => {
    handleCarrito()
    if (carrito.length !== carritoLargoAnterior) {
        loadCarrito()
        carritoLargoAnterior = carrito.length
    }
    if (carrito.length !== 0) {
        let sumCarrito = 0
        let cantidadProductos = 0
        carrito.forEach(producto => {
            sumCarrito += producto.precio * producto.cantidad
            cantidadProductos += producto.cantidad
        })
        document.querySelector("#total-carrito").innerHTML = `${sumCarrito}`
        cantidadCarrito.classList.remove("disable")
        cantidadCarrito.innerHTML = `${cantidadProductos}`
        linkCarrito.setAttribute("href", "#carrito")
    } else {
        cantidadCarrito.classList.add("disable")
        cantidadCarrito.innerHTML = ``
        linkCarrito.setAttribute("href", "#productos")
    }

}

const agregarAlCarrito = (producto) => {
    const carritoIndex = buscarEnCarrito(producto.id)

    if (carritoIndex !== -1) {
        carrito[carritoIndex].cantidad++
    } else {
        carrito.push({...producto, cantidad: 1})
        handleAccionesProducto(producto.id)
    }
    updateViews()
    updateCantidades(producto.id)
    guardarCarrito()
}
const eliminarDelCarrito = (idProducto) => {
    const carritoIndex = buscarEnCarrito(idProducto)
    if (carritoIndex !== -1) {
        carrito.splice(carritoIndex, 1)
        updateViews()
        updateCantidades(idProducto)
        guardarCarrito()
        handleAccionesProducto(idProducto)
    }
}
const restarDelCarrito = (id) => {
    const carritoIndex = buscarEnCarrito(id)
    
    if (carritoIndex !== -1) {
        if (carrito[carritoIndex].cantidad === 1) {
            eliminarDelCarrito(id)
        } else {
            carrito[carritoIndex].cantidad--
            updateViews()
            updateCantidades(id)
            guardarCarrito()
        }
    }
    
}
const settearAlCarrito = (producto, cantidadASettear) => {
    const carritoIndex = buscarEnCarrito(producto.id)
    
    if (carritoIndex !== -1) {
        if (cantidadASettear === 0) {
            eliminarDelCarrito(producto.id)
        } else {
            carrito[carritoIndex].cantidad = cantidadASettear
            updateViews()
            updateCantidades(producto.id)
            guardarCarrito()
        }
    } else {
        carrito.push({...producto, cantidad: cantidadASettear})
        updateViews()
        updateCantidades(producto.id)
        guardarCarrito()
    }
}

const vaciarCarrito = () => {
    carrito = []
    productos.forEach(producto => {
        document.querySelector(`#input-manual-${producto.id}`).value = 0
        document.querySelector(`#btn-agregar-${producto.id}`).classList.remove("disable")
        document.querySelector(`#btn-sumar-${producto.id}`).classList.add("disable")
        document.querySelector(`#input-manual-${producto.id}`).classList.add("disable")
        document.querySelector(`#btn-restar-${producto.id}`).classList.add("disable")
    })
    updateViews()
    guardarCarrito()
}

const loadCarrito = () => {
    listaCarrito.innerHTML = ""
    carrito.forEach(producto => {
        listaCarrito.innerHTML += 
        `<li class="producto" id="producto-carrito-${producto.id}">
            <img class="producto-imagen" src="${producto.imagenRef}" alt="${producto.nombre}">
            <ul class="producto-info">
                <h3>${producto.nombre}</h3>
                <li>Precio U.: $${producto.precio}</li>
            </ul>
            <div id="carrito-acciones-${producto.id}">
                <button id="carrito-btn-restar-${producto.id}">-</button>
                <input type="number" min="0" id="carrito-input-manual-${producto.id}">
                <button id="carrito-btn-sumar-${producto.id}">+</button>
                <button id="carrito-btn-eliminar-${producto.id}">E</button>
            </div>
            <p id="total-producto-${producto.id}"><strong>Total: $${producto.precio * producto.cantidad}</strong></p>
        </li>`
    })
    carrito.forEach((producto) => {
        document.querySelector(`#carrito-btn-restar-${producto.id}`).addEventListener("click", event => {
            event.preventDefault()
            restarDelCarrito(producto.id)
        })
        document.querySelector(`#carrito-input-manual-${producto.id}`).addEventListener("change", event => {
            event.preventDefault()
            settearAlCarrito(producto, parseInt(event.target.value))
        })
        document.querySelector(`#carrito-btn-sumar-${producto.id}`).addEventListener("click", event => {
            event.preventDefault()
            agregarAlCarrito(producto)
        })
        document.querySelector(`#carrito-btn-eliminar-${producto.id}`).addEventListener("click", event => {
            event.preventDefault()
            eliminarDelCarrito(producto.id)
        })
    })
    carrito.forEach(producto => updateCantidades(producto.id))
}

const loadProducts = (productos) => {
    productos.forEach((producto) => {
        galeriaProductos.innerHTML += 
        `<li class="producto" id="producto-${producto.id}">
            <img class="producto-imagen" src="${producto.imagenRef}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <ul class="producto-info">
                <li>N° piezas: ${producto.piezas}</li>
                <li>$${producto.precio}</li>
            </ul>
            <div id="acciones-${producto.id}">
                <button id="btn-agregar-${producto.id}">Agregar al carrito</button>
                <button id="btn-restar-${producto.id}" class="disable">-</button>
                <input type="number" id="input-manual-${producto.id}" class="disable">
                <button id="btn-sumar-${producto.id}" class="disable">+</button>
            </div>
        </li>`
    })
    productos.forEach((producto) => {
        document.querySelector(`#btn-agregar-${producto.id}`).addEventListener("click", event => {
            event.preventDefault()
            agregarAlCarrito(producto)
        })
        document.querySelector(`#btn-restar-${producto.id}`).addEventListener("click", event => {
            event.preventDefault()
            restarDelCarrito(producto.id)
        })
        document.querySelector(`#input-manual-${producto.id}`).addEventListener("change", event => {
            event.preventDefault()
            settearAlCarrito(producto, parseInt(event.target.value))
        })
        document.querySelector(`#btn-sumar-${producto.id}`).addEventListener("click", event => {
            event.preventDefault()
            agregarAlCarrito(producto)
        })
    })
}

window.onload = () => {
    btnVaciarCarrito.addEventListener("click", event => {
        event.preventDefault()
        vaciarCarrito()
    })
    btnComprar.addEventListener("click", event => {
        event.preventDefault()
        let sumCarrito = 0
        carrito.forEach(producto => sumCarrito += producto.precio * producto.cantidad)
        alert(`Gracias por tu compra!! Tu total es: $${sumCarrito}`)
        vaciarCarrito()
    })
    
    fetch("../productos.json")
    .then(res => res.json())
    .then(data => data.map( producto => {
        productos.push(producto)
    }))        
    .then(() => {
        loadProducts(productos)
        if (cargarCarrito() !== null ) {
            carrito = cargarCarrito()
            updateViews()
            carrito.forEach(producto => {
                updateCantidades(producto.id)
                handleAccionesProducto(producto.id)
            })
        }
    })
}

// Form contacto
formContacto.addEventListener("submit", event => {
    event.preventDefault()
    const formData = {
        nombre: event.target.nombre.value,
        correo: event.target.correo.value,
        consulta: event.target.consulta.value
    }
    event.target.nombre.value = ""
    event.target.correo.value = ""
    event.target.consulta.value = ""

    mailtoPixel.setAttribute("href",`mailto:hola@esmarina.com?subject=Consulta de ${formData.nombre}&body=Correo: ${formData.correo}%0D%0ANombre: ${formData.nombre}%0D%0A%0D%0AConsulta:%0D%0A${formData.consulta}`)
    mailtoPixel.click()
})