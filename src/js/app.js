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

// Registrar los eventos y mostrar al arrancar
inputBusqueda.addEventListener("input", renderizarCatalogo);
selectCategoria.addEventListener("change", renderizarCatalogo);

// Pintado inicial
renderizarCatalogo();