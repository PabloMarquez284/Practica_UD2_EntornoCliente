// Función para crear una tarjeta por cada producto
function crearTarjetaProducto(producto) {
    const article = document.createElement("article");

    // Crear y rellenar los datos basicos del producto
    const titulo = document.createElement("h3");
    titulo.textContent = producto.nombre;

    const categoria = document.createElement("p");
    categoria.textContent = "Categoría: " + producto.categoria;

    const precio = document.createElement("p");
    precio.textContent = "Precio: " + producto.precio.toFixed(2) + " €";

    const stock = document.createElement("p");
    if (producto.stock > 0) {
        stock.textContent = "Stock: " + producto.stock;
    } else {
        stock.textContent = "Sin existencias";
    }

    // Crear el campo numérico para elegir la cantidad
    const inputCantidad = document.createElement("input");
    inputCantidad.type = "number";
    inputCantidad.min = "1";
    inputCantidad.max = String(producto.stock);
    inputCantidad.step = "1";
    inputCantidad.value = "1";

    // Crear el botón de añadir y guardar el ID del producto
    const botonAnadir = document.createElement("button");
    botonAnadir.type = "button";
    botonAnadir.textContent = "Añadir";
    botonAnadir.dataset.id = String(producto.id);

    // Desactivar controles si no hay stock
    if (producto.stock === 0) {
        inputCantidad.disabled = true;
        botonAnadir.disabled = true;
    }

    // Añadir los elementos dentro de article
    article.append(titulo, categoria, precio, stock, inputCantidad, botonAnadir);
    
    return article;
}

// Función para mostrar un texto y un botón  de eliminar cada vez que se añade un producto al carrito
function crearLineaCarrito(linea, producto) {
    const li = document.createElement("li");
    const subtotal = producto.precio * linea.cantidad;

    // Texto de la línea
    const texto = document.createElement("span");
    texto.textContent = `${producto.nombre} - Cantidad: ${linea.cantidad} - Precio: ${producto.precio.toFixed(2)} € - Subtotal: ${subtotal.toFixed(2)} € `;
    // Botón eliminar
    const botonEliminar = document.createElement("button");
    botonEliminar.type = "button";
    botonEliminar.textContent = "Eliminar";
    botonEliminar.dataset.accion = "eliminar";
    botonEliminar.dataset.id = String(producto.id);

    // Añadir los elementos dentro de li
    li.append(texto, botonEliminar);
    return li;
}

// Crear la tarjeta visual de un pedido con detalle desplegable
function crearTarjetaPedido(pedido) {
    const article = document.createElement("article");

    // Cabecera con ID y fecha
    const titulo = document.createElement("h3");
    titulo.textContent = `Pedido #${pedido.id} — ${pedido.fecha}`;

    // Datos del cliente y modalidad
    const infoCliente = document.createElement("p");
    const textoEntrega = pedido.cliente.entrega === "envio"
        ? `Envío a domicilio (${pedido.cliente.direccion}, CP ${pedido.cliente.cp})`
        : "Recogida en tienda";
    infoCliente.textContent = `Cliente: ${pedido.cliente.nombre} (${pedido.cliente.email}) | Entrega: ${textoEntrega}`;

    // Resumen económico del pedido
    const infoImporte = document.createElement("p");
    infoImporte.textContent = `Subtotal: ${pedido.subtotal.toFixed(2)} € | Descuento: ${pedido.descuento.toFixed(2)} € | Total: ${pedido.total.toFixed(2)} €`;

    // Desplegable nativo HTML5 con las líneas compradas
    const detalles = document.createElement("details");
    const resumen = document.createElement("summary");
    resumen.textContent = `Ver productos comprados (${pedido.lineas.length})`;

    const listaLineas = document.createElement("ul");
    pedido.lineas.forEach((linea) => {
        const li = document.createElement("li");
        li.textContent = `${linea.nombre} — ${linea.cantidad} ud. × ${linea.precioUnitario.toFixed(2)} € = ${linea.subtotal.toFixed(2)} €`;
        listaLineas.append(li);
    });

    detalles.append(resumen, listaLineas);
    article.append(titulo, infoCliente, infoImporte, detalles);

    return article;
}