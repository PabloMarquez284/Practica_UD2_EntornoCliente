// Crear clase Producto
class Producto {
    constructor(id, nombre, categoria, precio, stock) {
        this.id = id;
        this.nombre = nombre;
        this.categoria = categoria; 
        this.precio = precio;
        this.stock = stock;
    }

    // Método para comprobar disponibilidad
    hayStock(cantidad) {
        return Number.isInteger(cantidad) && cantidad > 0 && cantidad <= this.stock;
    }

    // Método para descontar existencias
    descontarStock(cantidad) {
        if (this.hayStock(cantidad)){
            this.stock -= cantidad;
            return true;
        } else {
            return false;
        }
    }
}