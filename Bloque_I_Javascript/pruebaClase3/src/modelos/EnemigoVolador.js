class EnemigoVolador extends Modelo {

    constructor(x, y) {
        super(imagenes.enemigo, x, y)
        this.estado = estados.moviendo;
        this.vyInteligencia = -1;
        this.vy = this.vyInteligencia;

        this.aMover = new Animacion(imagenes.enemigo_movimiento,
            this.ancho, this.alto, 6, 3);
        this.aMorir = new Animacion(imagenes.enemigo_morir,
            this.ancho,this.alto,6,8, this.finAnimacionMorir.bind(this));

        // Ref a la animación actual
        this.animacion = this.aMover;


        this.vx = 0;

    }

    finAnimacionMorir(){
        this.estado = estados.muerto;
    }

    impactado(){
        if ( this.estado != estados.muriendo ){
            this.estado = estados.muriendo;
        }
    }

    actualizar (){
        this.animacion.actualizar();

        switch (this.estado){
            case estados.moviendo:
                this.animacion = this.aMover;
                break;
            case estados.muriendo:
                this.animacion = this.aMorir;
                break;
        }

        if ( this.estado == estados.muriendo) {
            this.vy = 0;
        } else {
            if ( this.vy == 0){
                this.vyInteligencia = this.vxInteligencia * -1;
                this.vy = this.vxInteligencia;
            }
        }
    }

    dibujar (scrollX){
        scrollX = scrollX || 0;
        this.animacion.dibujar(this.x - scrollX, this.y );
    }


}