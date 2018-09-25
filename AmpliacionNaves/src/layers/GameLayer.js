class GameLayer extends Layer {

    constructor() {
        super();
        this.iniciar();
    }

    iniciar() {
        this.jugador = new Jugador(50, 50);
        this.fondo = new Fondo(imagenes.fondo,480*0.5,320*0.5);

        this.enemigos = [];
        this.enemigos.push(new Enemigo(300,50));
        this.enemigos.push(new Enemigo(350,200));

        this.disparosJugador = [];

        this.recolectables = [];

        this.recolectables.push(new Recolectable(400,20));
        this.recolectables.push(new Recolectable(370,150));
        this.recolectables.push(new Recolectable(360,160));
        this.recolectables.push(new Recolectable(430,190));


    }

    actualizar (){
        //Actualizo elementos
        // Generar Enemigos
        if (this.iteracionesCrearEnemigos == null){
            this.iteracionesCrearEnemigos = 0;
        }
        // iteracionesCrearEnemigos tiene que ser un número
        this.iteracionesCrearEnemigos ++;

        if ( this.iteracionesCrearEnemigos > 110){
            var rX = Math.random() * (600 - 500) + 500;
            var rY = Math.random() * (300 - 60) + 60;
            this.enemigos.push(new Enemigo(rX,rY));
            this.iteracionesCrearEnemigos = 0;

        }

        //Genero recolectables
        if (this.iteracionesCrearRecolectables == null){
            this.iteracionesCrearRecolectables = 0;
        }

        this.iteracionesCrearRecolectables ++;
        console.log(this.iteracionesCrearRecolectables);
        if ( this.iteracionesCrearRecolectables > 50){
            var rX = Math.random() * (600 - 500) + 500;
            var rY = Math.random() * (300 - 60) + 60;
            this.recolectables.push(new Recolectable(rX,rY));
            this.iteracionesCrearRecolectables = 0;
        }

        this.jugador.actualizar();

        for (var i=0; i < this.enemigos.length; i++){
            this.enemigos[i].actualizar();
        }

        for (var i=0; i < this.recolectables.length; i++){
            this.recolectables[i].actualizar();
        }

        for (var i=0; i < this.disparosJugador.length; i++) {
            this.disparosJugador[i].actualizar();
        }



        // Miro Colisiones

        //Enemigo con jugador
        for (var i=0; i < this.enemigos.length; i++){
            if ( this.jugador.colisiona(this.enemigos[i])){
                this.iniciar();
            }
        }

        // colisiones , disparoJugador - Enemigo
        for (var i=0; i < this.disparosJugador.length; i++){
            for (var j=0; j < this.enemigos.length; j++){
                if (this.disparosJugador[i] != null &&
                    this.enemigos[j] != null &&
                    this.disparosJugador[i].colisiona(this.enemigos[j])) {

                    this.disparosJugador.splice(i, 1);



                    if(this.enemigos[j].vida > 0){
                        this.enemigos[j].decrementaVida();
                    }else{
                        this.enemigos.splice(j, 1);
                    }


                }
            }
        }

        //Colisiones jugador - moneda
        for (var i=0; i < this.recolectables.length; i++){
            if ( this.jugador.colisiona(this.recolectables[i])){
                this.recolectables.splice(i, 1);
                this.jugador.incrementaDisparos();
            }
        }




    }

    dibujar (){
        this.fondo.dibujar();

        for (var i=0; i < this.disparosJugador.length; i++) {
            this.disparosJugador[i].dibujar();
        }


        this.jugador.dibujar();
        for (var i=0; i < this.enemigos.length; i++){
            this.enemigos[i].dibujar();
        }

        for (var i=0; i < this.recolectables.length; i++){
            this.recolectables[i].dibujar();
        }

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
