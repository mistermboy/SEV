class Bomba extends Modelo {

    constructor(x, y) {
        super(imagenes.asteroide, x, y)

        this.vy = 0;
        this.vx = 1;
    }

    actualizar (){

        this.vx = -2;
        this.x = this.x + this.vx;
    }


}