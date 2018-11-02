class DisparoEnemigo extends Modelo {

    constructor(imagen,x, y) {
        super(imagen, x, y)
        this.vx = 5;
        this.orientacion = orientaciones.derecha;
    }

    actualizar (){
        this.x = this.x + this.vx;
    }


}
