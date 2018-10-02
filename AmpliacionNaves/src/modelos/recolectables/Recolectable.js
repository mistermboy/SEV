class Recolectable extends Modelo{

    constructor(imagen,x, y) {
        super(imagen, x, y)

        this.vy = 0;
        this.vx = 1;
    }

    actualizar (){
        this.vx = -2;
        this.x = this.x + this.vx;
    }


}