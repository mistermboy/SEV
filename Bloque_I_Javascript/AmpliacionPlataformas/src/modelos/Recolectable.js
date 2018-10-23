class Recolectable extends Modelo {

    constructor(rutaImagen, x, y) {
        super(rutaImagen, x, y)

        this.animacion = new Animacion(imagenes.recolectable,
            this.ancho, this.alto, 1, 8);
    }


    actualizar () {
        // Actualizar animación
        this.animacion.actualizar();
    }

    dibujar (scrollX){
        scrollX = scrollX || 0;
        this.animacion.dibujar(this.x - scrollX, this.y);
    }
}
