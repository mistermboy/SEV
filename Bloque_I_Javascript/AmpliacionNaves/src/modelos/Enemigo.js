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
        this.cadenciaDisparoEnemigo = 100;
        this.tiempoDisparoEnemigo = 0;

    }

    actualizar (){


        // Tiempo Disparo
        if ( this.tiempoDisparoEnemigo > 0 ) {
            this.tiempoDisparoEnemigo--;
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
        if ( this.tiempoDisparoEnemigo == 0) {
            // reiniciar Cadencia
            this.tiempoDisparoEnemigo = this.cadenciaDisparoEnemigo;
            return new DisparoEnemigo(this.x, this.y);
        } else {
            return null;
        }
    }


}
