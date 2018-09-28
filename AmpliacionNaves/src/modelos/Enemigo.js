class Enemigo extends Modelo {

    constructor(x, y) {
        super(imagenes.enemigo, x, y)

        this.aMover = new Animacion(imagenes.enemigo_movimiento,
            this.ancho, this.alto, 6, 3);
        // Ref a la animación actual
        this.animacion = this.aMover;

        this.vy = 0;
        this.vx = 1;

        // Disparo
        this.cadenciaDisparo = 100;
        this.tiempoDisparo = 0;

    }

    actualizar (){


        // Tiempo Disparo
        if ( this.tiempoDisparo > 0 ) {
            this.tiempoDisparo--;
        }

        // Actualizar animación
        this.animacion.actualizar();

        this.vx = -2;
        this.x = this.x + this.vx;
    }


    dibujar (){
        this.animacion.dibujar(this.x, this.y);
    }



    disparar(){
        if ( this.tiempoDisparo == 0) {
            // reiniciar Cadencia
            this.tiempoDisparo = this.cadenciaDisparo;
            return new DisparoEnemigo(this.x, this.y);
        } else {
            return null;
        }
    }


}
