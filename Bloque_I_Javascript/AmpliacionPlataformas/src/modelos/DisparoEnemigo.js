class DisparoEnemigo extends Modelo {

    constructor(x, y) {
        super(imagenes.flecha, x, y)
        this.vx = -5;
    }

    actualizar (){
        this.x = this.x + this.vx;
    }


}
