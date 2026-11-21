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