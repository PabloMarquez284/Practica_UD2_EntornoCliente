// Crear array catalogo con instancias de Porudtco
const catalogo = datosProductos.map(dato => new Producto(dato.id, dato.nombre, dato.categoria, dato.precio, dato.stock));

// Referencias a los elementos del DOM
const inputBusqueda = document.querySelector("#busqueda");
const selectCategoria = document.querySelector("#filtro-categoria");
const listaCatalogo = document.querySelector("#lista-catalogo");
const mensajeCatalogo = document.querySelector("#mensaje-catalogo");

// 2. Rellenar las opciones de #filtro-categoria
const categorias = [...new Set(catalogo.map((p) => p.categoria))];

categorias.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    selectCategoria.append(option);
});

// Función para procesar el catalogo
function renderizarCatalogo() {
    const textoBuscado = inputBusqueda.value.trim().toLowerCase();
    const categoriaElegida = selectCategoria.value;

    // Verificar los filtros
    const filtrados = catalogo.filter((prod) => {
        const coincideNombre = prod.nombre.toLowerCase().includes(textoBuscado);
        const coincideCategoria =categoriaElegida === "" || categoriaElegida === "todas" || prod.categoria === categoriaElegida;
        return coincideNombre && coincideCategoria;
    });

    // Vaciar el contenedor del catálogo
    listaCatalogo.replaceChildren();

    // Comprobar si hay resultados o mostrar mensaje
    if (filtrados.length === 0) {
        mensajeCatalogo.textContent = "No hay productos que coincidan con la búsqueda.";
    } else {
        mensajeCatalogo.textContent = "";
        filtrados.forEach((producto) => {
            listaCatalogo.append(crearTarjetaProducto(producto));
        });
    }
}


// Referencias a los elementos del DOM
const mensajeCarrito = document.querySelector("#mensaje-carrito");
const listaCarrito = document.querySelector("#lista-carrito");
const totalUnidades = document.querySelector("#total-unidades");
const subtotalCarrito = document.querySelector("#subtotal-carrito");
const descuentoCarrito = document.querySelector("#descuento-carrito");
const totalCarrito = document.querySelector("#total-carrito");

// Función para procesar el carrito
function renderizarCarrito() {
    // Vaciar el contenedor del catálogo
    listaCarrito.replaceChildren();

    let unidades = 0;

    if (carrito.length === 0) {
        mensajeCarrito.textContent = "El carrito está vacío.";
    } else {
        mensajeCarrito.textContent = "";
        carrito.forEach((linea) => {
            const producto = catalogo.find((p) => p.id === linea.productoId);
            if (producto) {
                unidades += linea.cantidad;
                listaCarrito.append(crearLineaCarrito(linea, producto));
            }
        });
    }

    // LLamar a las funciones para los cálculos
    const subtotal = calcularSubtotal(carrito, catalogo);
    const descuento = calcularDescuento(subtotal, 10);
    const total = subtotal - descuento;

    // Mostrar resultados en el DOM
    totalUnidades.textContent = String(unidades);
    subtotalCarrito.textContent = subtotal.toFixed(2);
    descuentoCarrito.textContent = descuento.toFixed(2);
    totalCarrito.textContent = total.toFixed(2);
}

// Registrar los eventos y mostrar al arrancar
inputBusqueda.addEventListener("input", renderizarCatalogo);
selectCategoria.addEventListener("change", renderizarCatalogo);

// Delegación de eventos para AÑADIR productos desde el catálogo
listaCatalogo.addEventListener("click", (e) => {
    const boton = e.target.closest("button[data-id]");
    if (!boton) return;

    const id = Number(boton.dataset.id);
    const producto = catalogo.find((p) => p.id === id);
    if (!producto) return;

    const input = boton.closest("article").querySelector("input");
    const cantidad = input.valueAsNumber;

    // Comprobar si ya existe en el carrito para sumar unidades
    const lineaExistente = carrito.find((item) => item.productoId === id);
    const cantidadActual = lineaExistente ? lineaExistente.cantidad : 0;
    const cantidadTotal = cantidadActual + cantidad;

    // Validar entero positivo y stock disponible
    if (!Number.isInteger(cantidad) || !producto.hayStock(cantidadTotal)) {
        mensajeCarrito.textContent = "Cantidad no válida o sin stock suficiente.";
        return;
    }

    if (lineaExistente) {
        lineaExistente.cantidad += cantidad;
    } else {
        carrito.push({ productoId: id, cantidad });
    }

    renderizarCarrito();
});

// Delegación de eventos para ELIMINAR líneas del carrito
listaCarrito.addEventListener("click", (e) => {
    const boton = e.target.closest('button[data-accion="eliminar"]');
    if (!boton) return;

    const id = Number(boton.dataset.id);
    const indice = carrito.findIndex((item) => item.productoId === id);

    if (indice !== -1) {
        carrito.splice(indice, 1);
        renderizarCarrito();
    }
});

// Pintado inicial
renderizarCatalogo();
renderizarCarrito();