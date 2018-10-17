class Enemigo extends Modelo {

    constructor(x, y) {
        super(imagenes.enemigo, x, y)

        this.vy = 0;
        this.vx = 1;

        this.vida = 2;
    }

    actualizar (){
        this.vx = -2;
        this.x = this.x + this.vx;
    }

    decrementaVida(){
        this.vida--;
    }

}
