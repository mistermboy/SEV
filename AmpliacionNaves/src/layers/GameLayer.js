class GameLayer extends Layer {

    constructor() {
        super();
        this.iniciar();
    }

    iniciar() {

        this.fondoPuntos =
            new Fondo(imagenes.icono_puntos, 480*0.85,320*0.05);

        this.fondoPrimeraVida =
            new Fondo(imagenes.vida, 480*0.07,320*0.06);

        this.fondoSegundaVida =
            new Fondo(imagenes.vida, 480*0.17,320*0.06);

        this.fondoTerceraVida =
            new Fondo(imagenes.vida, 480*0.27,320*0.06);

        this.puntos = new Texto(0,480*0.9,320*0.07 );

        this.jugador = new Jugador(50, 80);
        this.fondo = new Fondo(imagenes.fondo,480*0.5,320*0.5);

        this.enemigos = [];


        this.disparosJugador = [];

        this.disparosEnemigo = [];

        this.bombas = [];

        this.monedas = [];

        this.cajasMunicion = [];



    }

    actualizar (){

        this.fondo.vx = -6;
        this.fondo.actualizar();
        //Actualizo elementos
        // Generar Enemigos
        if (this.iteracionesCrearEnemigos == null){
            this.iteracionesCrearEnemigos = 0;
        }
        // iteracionesCrearEnemigos tiene que ser un número
        this.iteracionesCrearEnemigos ++;

        if ( this.iteracionesCrearEnemigos > 50){
            var rX = Math.random() * (600 - 500) + 500;
            var rY = Math.random() * (300 - 70) + 70;
            this.enemigos.push(new Enemigo(rX,rY));
            this.iteracionesCrearEnemigos = 0;
        }

        //Generar bombas
        if (this.iteracionesCrearBombas == null){
            this.iteracionesCrearBombas = 0;
        }

        this.iteracionesCrearBombas++;

        if ( this.iteracionesCrearBombas > 300){
            var rX = Math.random() * (600 - 500) + 500;
            var rY = Math.random() * (300 - 70) + 70;
            this.bombas.push(new Bomba(rX,rY));
            this.iteracionesCrearBombas = 0;
        }

        //Generar Monedas
        if (this.iteracionesCrearMonedas == null){
            this.iteracionesCrearMonedas = 0;
        }

        this.iteracionesCrearMonedas ++;
        if ( this.iteracionesCrearMonedas > 150){
            var rX = Math.random() * (600 - 500) + 500;
            var rY = Math.random() * (300 - 70) + 70;
            this.monedas.push(new Moneda(rX,rY));
            this.iteracionesCrearMonedas = 0;
        }


        //Generar Cajas de munición
        if (this.iteracionesCrearMunicion == null){
            this.iteracionesCrearMunicion = 0;
        }

        this.iteracionesCrearMunicion ++;
        if ( this.iteracionesCrearMunicion > 200){
            var rX = Math.random() * (600 - 500) + 500;
            var rY = Math.random() * (300 - 70) + 70;
            this.cajasMunicion.push(new Municion(rX,rY));
            this.iteracionesCrearMunicion = 0;
        }


        this.jugador.actualizar();
        for (var i=0; i < this.enemigos.length; i++){
            this.enemigos[i].actualizar();
        }

        for (var i=0; i < this.disparosJugador.length; i++) {
            this.disparosJugador[i].actualizar();
        }

        for (var i=0; i < this.disparosEnemigo.length; i++) {
            this.disparosEnemigo[i].actualizar();
        }

        for (var i=0; i < this.bombas.length; i++) {
            this.bombas[i].actualizar();
        }

        for (var i=0; i < this.monedas.length; i++){
            this.monedas[i].actualizar();
        }

        for (var i=0; i < this.cajasMunicion.length; i++){
            this.cajasMunicion[i].actualizar();
        }

        // Miro Colisiones

        //Enemigo con jugador
        for (var i=0; i < this.enemigos.length; i++){
            if ( this.jugador.colisiona(this.enemigos[i])){
                this.enemigos.splice(i, 1);
                this.decrementaVidas();
            }
        }

        // colisiones , disparoJugador - Enemigo
        for (var i=0; i < this.disparosJugador.length; i++){
            for (var j=0; j < this.enemigos.length; j++){
                if (this.disparosJugador[i] != null &&
                    this.enemigos[j] != null &&
                    this.disparosJugador[i].colisiona(this.enemigos[j])) {

                    this.disparosJugador.splice(i, 1);
                    this.enemigos.splice(j, 1);
                    this.puntos.valor++;
                }
            }
        }

        //Colisiones disparoEnemigo - jugador
        for (var i=0; i < this.disparosEnemigo.length; i++){
                if (this.disparosEnemigo[i] != null &&
                    this.disparosEnemigo[i].colisiona(this.jugador)) {
                    this.disparosEnemigo.splice(i, 1);
                   this.decrementaVidas();
                }

        }

        // Colisiones jugador - bomba
        for (var i=0; i < this.bombas.length; i++){
            if ( this.jugador.colisiona(this.bombas[i])){
                this.puntos.valor += this.enemigos.length;
                this.enemigos = [];
                this.bombas.splice(i,1);
            }
        }

        //Colisiones jugador - moneda
        for (var i=0; i < this.monedas.length; i++){
            if ( this.jugador.colisiona(this.monedas[i])){
                this.monedas.splice(i, 1);
                this.puntos.valor += 5;
            }
        }

        //Colisiones jugador - municion
        for (var i=0; i < this.cajasMunicion.length; i++){
            if ( this.jugador.colisiona(this.cajasMunicion[i])){
                this.cajasMunicion.splice(i, 1);
                this.jugador.numDisparos += 10;
            }
        }


        // Eliminar disparos fuera de pantalla
        for (var i=0; i < this.disparosJugador.length; i++){
            if ( this.disparosJugador[i] != null &&
                !this.disparosJugador[i].estaEnPantalla()){
                this.disparosJugador.splice(i, 1);
            }
        }

        // Generamos disparos para los enemigos
        for (var i=0; i < this.enemigos.length; i++){

            var nuevoDisparo = this.enemigos[i].disparar();
            if ( nuevoDisparo != null && this.enemigos[i].estaEnPantalla()) {
                this.disparosEnemigo.push(nuevoDisparo);
            }
        }

        //Comprobamos si el jugador se ha quedado sin vidas
        if(this.jugador.vidas<=0)
            this.iniciar();

    }

    dibujar (){
        this.fondo.dibujar();

        for (var i=0; i < this.disparosJugador.length; i++) {
            this.disparosJugador[i].dibujar();
        }

        for (var i=0; i < this.disparosEnemigo.length; i++) {
            this.disparosEnemigo[i].dibujar();
        }

        this.jugador.dibujar();
        for (var i=0; i < this.enemigos.length; i++){
            this.enemigos[i].dibujar();
        }

        for (var i=0; i < this.bombas.length; i++){
            this.bombas[i].dibujar();
        }

        for (var i=0; i < this.monedas.length; i++){
            this.monedas[i].dibujar();
        }

        for (var i=0; i < this.cajasMunicion.length; i++){
            this.cajasMunicion[i].dibujar();
        }

        //HUD

        this.fondoPuntos.dibujar();
        this.puntos.dibujar();

        if(this.fondoPrimeraVida != null)
            this.fondoPrimeraVida.dibujar();
        if(this.fondoSegundaVida != null)
            this.fondoSegundaVida.dibujar();
        if(this.fondoTerceraVida != null)
            this.fondoTerceraVida.dibujar();

    }

    procesarControles( ){
        // disparar
        if (  controles.disparo ){
            var nuevoDisparo = this.jugador.disparar();
            if ( nuevoDisparo != null ) {
                this.disparosJugador.push(nuevoDisparo);
            }
        }

        // Eje X
        if ( controles.moverX > 0 ){
            this.jugador.moverX(1);

        }else if ( controles.moverX < 0){
            this.jugador.moverX(-1);

        } else {
            this.jugador.moverX(0);
        }

        // Eje Y
        if ( controles.moverY > 0 ){
            this.jugador.moverY(-1);

        } else if ( controles.moverY < 0 ){
            this.jugador.moverY(1);

        } else {
            this.jugador.moverY(0);
        }

    }


    decrementaVidas(){

        this.jugador.vidas--;

        switch (this.jugador.vidas){

            case 2:
                this.fondoTerceraVida = null;
                break;

            case 1:
                this.fondoSegundaVida = null;
                break;


        }



    }


}
