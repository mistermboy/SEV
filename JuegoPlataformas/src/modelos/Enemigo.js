class Enemigo extends Modelo {

    constructor(x, y) {
        super(imagenes.enemigo, x, y)

        this.estado = estados.moviendo;

        this.aMover = new Animacion(imagenes.enemigo_movimiento,
            this.ancho, this.alto, 6, 3);

        this.aMorir = new Animacion(imagenes.enemigo_morir,
            this.ancho,this.alto,2,8, this.finAnimacionMorir.bind(this));
        // Ref a la animación actual
        this.animacion = this.aMover;

        this.vy = 0;
        this.vx = 1;
    }

    actualizar (){

        // Actualizar animación
        this.animacion.actualizar();

        switch (this.estado){
            case estados.moviendo:
                this.animacion = this.aMover;
                break;
            case estados.muriendo:
                this.animacion = this.aMorir;
                break;
        }

        if ( this.estado != estados.muriendo) {
            this.vx = -2;
            this.x = this.x + this.vx;
        }
    }


    dibujar (scrollX){
        scrollX = scrollX || 0;
        this.animacion.dibujar(this.x - scrollX, this.y);
    }


    finAnimacionMorir(){
        this.estado = estados.muerto;
    }

    impactado(){
        if ( this.estado != estados.muriendo ){
            this.estado = estados.muriendo;
        }
    }



}
