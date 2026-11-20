function crearTarjetaProducto(producto) {
    const article = document.createElement("article");

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

    const inputCantidad = document.createElement("input");
    inputCantidad.type = "number";
    inputCantidad.min = "1";
    inputCantidad.max = String(producto.stock);
    inputCantidad.step = "1";
    inputCantidad.value = "1";

    const botonAnadir = document.createElement("button");
    botonAnadir.type = "button";
    botonAnadir.textContent = "Añadir";
    botonAnadir.dataset.id = String(producto.id);

    if (producto.stock === 0) {
        inputCantidad.disabled = true;
        botonAnadir.disabled = true;
    }

    article.append(titulo, categoria, precio, stock, inputCantidad, botonAnadir);
    
    return article;
}