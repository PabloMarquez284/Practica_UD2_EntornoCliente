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