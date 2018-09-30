class GameLayer extends Layer {

    constructor() {
        super();
        this.iniciar();
    }

    iniciar() {

        this.fondoPuntos =
            new Fondo(imagenes.icono_puntos, 480*0.85,320*0.05);

        this.puntos = new Texto(0,480*0.9,320*0.07 );

        this.jugador = new Jugador(50, 50);
        this.fondo = new Fondo(imagenes.fondo,480*0.5,320*0.5);

        this.enemigos = [];
        this.enemigos.push(new Enemigo(300,50));
        this.enemigos.push(new Enemigo(350,200));

        this.disparosJugador = [];

        this.disparosEnemigo = [];

        this.bombas = [];

        this.monedas = [];

        this.monedas.push(new Moneda(400,20));
        this.monedas.push(new Moneda(370,150));
        this.monedas.push(new Moneda(360,160));
        this.monedas.push(new Moneda(430,190));

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

        if ( this.iteracionesCrearEnemigos > 70){
            var rX = Math.random() * (600 - 500) + 500;
            var rY = Math.random() * (300 - 60) + 60;
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
            var rY = Math.random() * (300 - 60) + 60;
            this.bombas.push(new Bomba(rX,rY));
            this.iteracionesCrearBombas = 0;
        }

        //Generar Monedas
        if (this.iteracionesCrearMonedas == null){
            this.iteracionesCrearMonedas = 0;
        }

        this.iteracionesCrearMonedas ++;
        if ( this.iteracionesCrearMonedas > 50){
            var rX = Math.random() * (600 - 500) + 500;
            var rY = Math.random() * (300 - 60) + 60;
            this.monedas.push(new Moneda(rX,rY));
            this.iteracionesCrearMonedas = 0;
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

        // Miro Colisiones

        //Enemigo con jugador
        for (var i=0; i < this.enemigos.length; i++){
            if ( this.jugador.colisiona(this.enemigos[i])){
                this.enemigos.splice(i, 1);
                this.jugador.vidas--;
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
                    this.jugador.vidas--;
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

        //HUD

        this.fondoPuntos.dibujar();
        this.puntos.dibujar();

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


}
