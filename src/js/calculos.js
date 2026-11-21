// Función para calcular el subtotal
function calcularSubtotal(carrito, catalogo) {
    let subtotal = 0;
    carrito.forEach((linea) => {
        const producto = catalogo.find((p) => p.id === linea.productoId);
        if (producto) subtotal += producto.precio * linea.cantidad;
    });
    return subtotal;
}

// Función para calcular el descuento (> 100 euros)
function calcularDescuento(subtotal, porcentaje = 0) {
    if (subtotal < 100) return 0;
    return subtotal * (porcentaje / 100);
}

// Funcion para validar los datos introducidos por el usuario
function validarDatosPedido(datos) {
    const errores = { nombre: "", email: "", entrega: "", direccion: "", cp: "", observaciones: "", acepto: "" };
    
    // Validar nombre
    const nombreVal = (datos.nombre || "").trim();
    if (nombreVal.length < 2 || nombreVal.length > 60) {
        errores.nombre = "El nombre debe tener entre 2 y 60 caracteres."
    }

    // Validar email
    const emailVal = (datos.email || "").trim();
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailVal === "" || !regexEmail.test(emailVal)) {
        errores.email = "Introduce un correo electrónico válido."
    }
    
    // Validar tipo de entrega
    if (!["recogida", "envio"].includes(datos.entrega)) {
        errores.entrega = "Selecciona un método de entrega válido.";
    }

    // Validar dirección y código postal solo si es envío a domicilio
    if (datos.entrega === "envio") {
        const direccionVal = datos.direccion.trim();
        if (direccionVal.length < 5 || direccionVal.length > 100) {
            errores.direccion = "La dirección debe tener entre 5 y 100 caracteres.";
        }

        // Código postal español de 5 dígitos (01000 a 52999)
        const regexCP = /^(?:0[1-9]|[1-4][0-9]|5[0-2])[0-9]{3}$/;    
        if (!regexCP.test(datos.cp.trim())) {
            errores.cp = "Introduce un código postal válido de 5 dígitos.";
        }
    }

    // Validar observaciones
    if ((datos.observaciones || "").length > 200) {
        errores.observaciones = "Las observaciones no pueden superar los 200 caracteres.";
    }

    // Validar aceptación de condiciones
    if (!datos.acepto) {
        errores.acepto = "Debes aceptar las condiciones del pedido.";
    }

    return errores;
}