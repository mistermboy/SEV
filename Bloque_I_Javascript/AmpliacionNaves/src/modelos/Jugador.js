class Jugador extends Modelo {

    constructor(x, y) {
        super(imagenes.jugador , x, y)
        this.vx = 0; // velocidadX
        this.vy = 0; // velocidadY

        // Disparo
        this.cadenciaDisparo = 15;
        this.tiempoDisparo = 0;

        this.vidas = 3;

        this.numDisparos = 15;

    }

    actualizar(){

        // Tiempo Disparo
        if ( this.tiempoDisparo > 0 ) {
            this.tiempoDisparo--;
        }

        if(this.x + this.vx > 0 && this.x + this.vx < 480 && this.y + this.vy > 70 && this.y + this.vy < 300){
            this.x = this.x + this.vx;
            this.y = this.y + this.vy;
        }
    }


    moverX (direccion){
        this.vx = direccion * 8;
    }

    moverY (direccion){
        this.vy = direccion * 8;
    }

    disparar(){
        if ( this.tiempoDisparo == 0 && this.numDisparos > 0) {
            // reiniciar Cadencia
            this.numDisparos--;
            this.tiempoDisparo = this.cadenciaDisparo;
            return new DisparoJugador(this.x, this.y);
        } else {
            return null;
        }
    }



}
