class Arquero extends Modelo {

    constructor(x, y) {
        super(imagenes.arquero, x, y)

        this.vxInteligencia = -1;
        this.vx = this.vxInteligencia;

        this.estado = estados.moviendo;
        this.orientacion = orientaciones.izquierda;


        this.aDispararDerecha = new Animacion(imagenes.arquero_animacion_ataque_dcha,
            this.ancho, this.alto, 6, 2, this.finAnimacionDisparar.bind(this) );

        this.aDispararIzquierda = new Animacion(imagenes.arquero_animacion_ataque_izda,
            this.ancho, this.alto, 6, 2, this.finAnimacionDisparar.bind(this));

        this.aIdleDerecha = new Animacion(imagenes.arquero_dcha,
            this.ancho, this.alto, 6, 1);
        this.aIdleIzquierda = new Animacion(imagenes.arquero_izda,
            this.ancho, this.alto, 6, 1);
        this.aCorriendoDerecha =
            new Animacion(imagenes.arquero_animacion_dcha,
                this.ancho, this.alto, 8,2);
        this.aCorriendoIzquierda = new Animacion(imagenes.arquero_animacion_izda,
            this.ancho, this.alto, 8, 2, null);


        this.aMorir = new Animacion(imagenes.arquero_animacion_muerte,
            this.ancho, this.alto, 1, 6, this.finAnimacionMorir.bind(this));

        // Ref a la animación actual
        this.animacion =  this.aIdleIzquierda;

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

        // Establecer orientación
        if ( this.vx > 0 ){
            this.orientacion = orientaciones.derecha;
        }
        if ( this.vx < 0 ){
            this.orientacion = orientaciones.izquierda;
        }

        // Selección de animación
        switch (this.estado){
            case estados.disparando:
                if (this.orientacion == orientaciones.derecha) {
                    this.animacion = this.aDispararDerecha;
                }
                if (this.orientacion == orientaciones.izquierda) {
                    this.animacion = this.aDispararIzquierda;
                }
                break;
            case estados.moviendo:
                if ( this.vx != 0 ) {
                    if (this.orientacion == orientaciones.derecha) {
                        this.animacion = this.aCorriendoDerecha;
                    }
                    if (this.orientacion == orientaciones.izquierda) {
                        this.animacion = this.aCorriendoIzquierda;
                    }
                }
                if ( this.vx == 0){
                    if (this.orientacion == orientaciones.derecha) {
                        this.animacion = this.aIdleDerecha;
                    }
                    if (this.orientacion == orientaciones.izquierda) {
                        this.animacion = this.aIdleIzquierda;
                    }
                }
                break;
            case estados.muriendo:
                this.animacion = this.aMorir;
                break;
        }

        if ( this.estado == estados.muriendo) {
            this.vx = 0;
        } else {

            if ( this.vx == 0){
                this.vxInteligencia = this.vxInteligencia * -1;
                this.vx = this.vxInteligencia;
            }

            if (this.fueraPorDerecha ){
                // mover hacia la izquierda vx negativa
                if ( this.vxInteligencia > 0){
                    this.vxInteligencia = this.vxInteligencia * -1;
                    this.orientacion = orientaciones.izquierda;
                }
                this.vx = this.vxInteligencia;

            }
            if (this.fueraPorIzquierda ){
                // mover hacia la derecha vx positiva
                if ( this.vxInteligencia < 0){
                    this.vxInteligencia = this.vxInteligencia * -1;
                    this.orientacion = orientaciones.derecha;
                }
                this.vx = this.vxInteligencia;

            }

        }
    }


    finAnimacionDisparar(){
        this.estado = estados.moviendo;
    }

    finAnimacionMorir(){
        this.estado = estados.muerto;
    }

    impactado(){
        if ( this.estado != estados.muriendo ){
            this.estado = estados.muriendo;
        }
    }

    dibujar (scrollX){
        scrollX = scrollX || 0;
        this.animacion.dibujar(this.x - scrollX, this.y);
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