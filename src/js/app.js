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

// Referencias al formulario y sus controles
const formPedido = document.querySelector("#form-pedido");
const bloqueEnvio = document.querySelector("#bloque-envio");
const contadorObs = document.querySelector("#contador-obs");
const estadoPedido = document.querySelector("#estado-pedido");

const campoNombre = formPedido.elements.namedItem("nombre");
const campoEmail = formPedido.elements.namedItem("email");
const campoDireccion = formPedido.elements.namedItem("direccion");
const campoCP = formPedido.elements.namedItem("cp");
const campoObs = formPedido.elements.namedItem("observaciones");
const campoAcepto = formPedido.elements.namedItem("acepto");
const radioEntrega = document.querySelector('input[name="entrega"]');

// Lista de campos editados (para no mostrar errores antes de tocar un campo)
const visitados = new Set();
const camposValidables = [campoNombre, campoEmail, radioEntrega, campoDireccion, campoCP, campoObs, campoAcepto];

// Función para alternar entre las opciones (recogida y envio)
function actualizarModalidad() {
    const modalidad = formPedido.elements.entrega.value;

    if (modalidad === "envio") {
        bloqueEnvio.hidden = false;
        campoDireccion.required = true;
        campoCP.required = true;
    } else {
        bloqueEnvio.hidden = true;
        campoDireccion.required = false;
        campoCP.required = false;
        
        // Limpiar errores previos si el usuario vuelve a recogida
        campoDireccion.setCustomValidity("");
        campoCP.setCustomValidity("");
        document.querySelector("#e-direccion").textContent = "";
        document.querySelector("#e-cp").textContent = "";
        campoDireccion.removeAttribute("aria-invalid");
        campoCP.removeAttribute("aria-invalid");
    }
}

// Función para validar el formulario
function validarFormulario() {
    // Limpiar errores personalizados anteriores de todos los campos
    camposValidables.forEach((campo) => {
        campo.setCustomValidity("");
    });

    // Recoger los datos actuales con FormData
    const formData = new FormData(formPedido);
    const datos = {
        nombre: formData.get("nombre"),
        email: formData.get("email"),
        entrega: formData.get("entrega"),
        direccion: formData.get("direccion"),
        cp: formData.get("cp"),
        observaciones: formData.get("observaciones"),
        acepto: campoAcepto.checked
    };

    // Validar con la función pura y asignar cada error a su control
    const errores = validarDatosPedido(datos);

    campoNombre.setCustomValidity(errores.nombre);
    campoEmail.setCustomValidity(errores.email);
    radioEntrega.setCustomValidity(errores.entrega);
    campoDireccion.setCustomValidity(errores.direccion);
    campoCP.setCustomValidity(errores.cp);
    campoObs.setCustomValidity(errores.observaciones);
    campoAcepto.setCustomValidity(errores.acepto);

    // Devolver si todo el formulario es válido
    return formPedido.checkValidity();
}

// Parejas de [control, etiqueta <small> donde pintar su error]
const paresError = [
    [campoNombre, document.querySelector("#e-nombre")],
    [campoEmail, document.querySelector("#e-email")],
    [radioEntrega, document.querySelector("#e-entrega")],
    [campoDireccion, document.querySelector("#e-direccion")],
    [campoCP, document.querySelector("#e-cp")],
    [campoObs, document.querySelector("#e-observaciones")],
    [campoAcepto, document.querySelector("#e-acepto")]
];

// Función para mostrar los errores que se produzcan
function mostrarErrores(todos = false) {
    const esRecogida = formPedido.elements.entrega.value === "recogida";

    paresError.forEach(([campo, etiquetaError]) => {
        // Si es recogida, no mostramos errores de dirección ni código postal
        if (esRecogida && (campo === campoDireccion || campo === campoCp)) {
            return;
        }
        // Si no se piden todos, solo mostramos los campos que el usuario ya tocó
        if (!todos && !visitados.has(campo)) {
            return;
        }
        etiquetaError.textContent = campo.validationMessage;
        campo.setAttribute("aria-invalid", String(!campo.validity.valid));
    });
}

// Contador de caracteres en vivo para observaciones
campoObs.addEventListener("input", () => {
    contadorObs.textContent = `${campoObs.value.length} / 200 caracteres`;
});

// Validación en vivo mientras el usuario edita
function revisarEdicion(e) {
    if (e.target.name === "entrega") {
        actualizarModalidad();
    }
    const control = e.target.name === "entrega" ? radioEntrega : e.target;
    visitados.add(control);
    estadoPedido.textContent = "";
    validarFormulario();
    mostrarErrores();
}

formPedido.addEventListener("input", revisarEdicion);
formPedido.addEventListener("change", revisarEdicion);

// Envío del formulario
formPedido.addEventListener("submit", (e) => {
    e.preventDefault();

    const esValido = validarFormulario();
    mostrarErrores(true);

    if (!esValido) {
        estadoPedido.textContent = "Revisa los campos marcados antes de confirmar.";
        formPedido.reportValidity();
        const primerInvalido = camposValidables.find((c) => !c.validity.valid);
        if (primerInvalido) {
            primerInvalido.focus();
        }
        return;
    }

    // Comprobar carrito/stock y guardar el pedido
    estadoPedido.textContent = "Datos del formulario válidos (pendiente de procesar pedido).";

    // Comprobar que el carrito no esté vacío
    if (carrito.length === 0) {
       estadoPedido.textContent = "Añade al menos un producto al carrito antes de confirmar."; 
       return;
    }

    // Verificar el stock de todas las líneas ANTES de modificar nada
    for (const linea of carrito) {
        const producto = catalogo.find((p) => p.id === linea.productoId);
        if (!producto || !producto.hayStock(linea.cantidad)) {
            const nombreProd = producto ? producto.nombre : "el producto seleccionado";
            estadoPedido.textContent = `No hay stock suficiente para ${nombreProd}.`;
            return;
        }
    }

    // Descontar el stock y construir el array de líneas compradas
    const lineasCompradas = [];
    carrito.forEach((linea) => {
        const producto = catalogo.find((p) => p.id === linea.productoId);
        producto.descontarStock(linea.cantidad);

        lineasCompradas.push({
            productoId: producto.id,
            nombre: producto.nombre,
            precioUnitario: producto.precio,
            cantidad: linea.cantidad,
            subtotal: producto.precio * linea.cantidad
        });
    });

    // Recoger los datos validados y guardar el pedido en el array pedidos
    const formData = new FormData(formPedido);
    const modalidad = formData.get("entrega");
    const datosCliente = {
        nombre: (formData.get("nombre") || "").trim(),
        email: (formData.get("email") || "").trim(),
        entrega: modalidad,
        direccion: modalidad === "envio" ? (formData.get("direccion") || "").trim() : "",
        cp: modalidad === "envio" ? (formData.get("cp") || "").trim() : "",
        observaciones: (formData.get("observaciones") || "").trim(),
        acepto: campoAcepto.checked
    };

    const subtotal = calcularSubtotal(carrito, catalogo);
    const descuento = calcularDescuento(subtotal, 10);
    const total = subtotal - descuento;

    const nuevoPedido = {
        id: pedidos.length + 1,
        fecha: new Date().toLocaleString("es-ES"),
        cliente: datosCliente,
        lineas: lineasCompradas,
        subtotal,
        descuento,
        total
    };

    pedidos.push(nuevoPedido);

    // Reiniciar estado e interfaz del formulario
    carrito.length = 0;

    formPedido.reset();
    visitados.clear();
    actualizarModalidad();
    contadorObs.textContent = "0 / 200 caracteres";
    camposValidables.forEach((campo) => campo.removeAttribute("aria-invalid"));

    renderizarCatalogo();
    renderizarCarrito();

    estadoPedido.textContent = `¡Pedido #${nuevoPedido.id} registrado correctamente!`;
});

// Referencias al DOM (Historial y Exportación JSON)
const filtroHistorial = document.querySelector("#filtro-historial");
const listaPedidos = document.querySelector("#lista-pedidos");
const mensajePedidos = document.querySelector("#mensaje-pedidos");
const totalPedidosHistorial = document.querySelector("#total-pedidos-historial");
const importePedidosHistorial = document.querySelector("#importe-pedidos-historial");
const btnExportar = document.querySelector("#btn-exportar");
const salidaJson = document.querySelector("#salida-json");

// Función para pintar el historial filtrado y su resumen
function renderizarHistorial() {
    const modalidadElegida = filtroHistorial.value;

    // Filtrar pedidos según el selector
    const filtrados = pedidos.filter((pedido) => {
        if (modalidadElegida === "todos" || modalidadElegida === "") {
            return true;
        }
        return pedido.cliente.entrega === modalidadElegida;
    });

    // Limpiar contenedor y pintar tarjetas
    listaPedidos.replaceChildren();

    if (filtrados.length === 0) {
        mensajePedidos.textContent = "No hay pedidos para mostrar con este filtro.";
    } else {
        mensajePedidos.textContent = "";
        filtrados.forEach((pedido) => {
            listaPedidos.append(crearTarjetaPedido(pedido));
        });
    }

    // Calcular y mostrar totales del filtro actual
    const resumen = calcularResumenHistorial(filtrados);
    totalPedidosHistorial.textContent = String(resumen.cantidad);
    importePedidosHistorial.textContent = resumen.importeTotal.toFixed(2);
}

// Evento para filtrar el historial al cambiar el select
filtroHistorial.addEventListener("change", renderizarHistorial);

// Evento para exportar los pedidos a formato JSON
btnExportar.addEventListener("click", () => {
    salidaJson.value = JSON.stringify(pedidos, null, 2);
});

// Pintado inicial
renderizarCatalogo();
renderizarCarrito();