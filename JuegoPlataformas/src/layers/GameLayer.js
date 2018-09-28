class GameLayer extends Layer {

    constructor() {
        super();
        this.iniciar();
    }

    iniciar() {

        this.scrollX = 0;

        this.bloques = [];

        this.fondoPuntos =
            new Fondo(imagenes.icono_puntos, 480*0.85,320*0.05);

        this.puntos = new Texto(0,480*0.9,320*0.07 );

        this.fondo = new Fondo(imagenes.fondo_2,480*0.5,320*0.5);

        this.enemigos = [];

        this.disparosJugador = []

        this.cargarMapa("res/0.txt");

    }

    actualizar (){

        this.fondo.vx = -6;
        this.fondo.actualizar();

        //Actualizo elementos
        this.jugador.actualizar();
        for (var i=0; i < this.enemigos.length; i++){
            this.enemigos[i].actualizar();
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
                    this.enemigos[j].impactado();
                    this.puntos.valor++;
                }
            }
        }


        // Enemigos muertos fuera del juego
        for (var j=0; j < this.enemigos.length; j++){
            if ( this.enemigos[j] != null &&
                this.enemigos[j].estado == estados.muerto  ) {

                this.enemigos.splice(j, 1);
            }
        }


        // Eliminar disparos fuera de pantalla
        for (var i=0; i < this.disparosJugador.length; i++){
            if ( this.disparosJugador[i] != null &&
                !this.disparosJugador[i].estaEnPantalla()){

                this.disparosJugador.splice(i, 1);
            }
        }


    }

    calcularScroll(){
        this.scrollX = this.jugador.x -100;
    }


    dibujar (){

        this.calcularScroll();
        this.fondo.dibujar();
        for (var i=0; i < this.bloques.length; i++){
            this.bloques[i].dibujar(this.scrollX);
        }

        for (var i=0; i < this.disparosJugador.length; i++) {
            this.disparosJugador[i].dibujar(this.scrollX);
        }

        this.jugador.dibujar();
        for (var i=0; i < this.enemigos.length; i++){
            this.enemigos[i].dibujar(this.scrollX);
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

    cargarMapa(ruta) {
        var fichero = new XMLHttpRequest();
        fichero.open("GET", ruta, false);
        fichero.onreadystatechange = function () {
            var texto = fichero.responseText;
            var lineas = texto.split('\n');
            for (var i = 0; i < lineas.length; i++){
                var linea = lineas[i];
                for (var j = 0; j < linea.length; j++){
                    var simbolo = linea[j];
                    var x = 40/2 + j * 40; // x central
                    var y = 32 + i * 32; // y de abajo
                    this.cargarObjetoMapa(simbolo,x,y);
                }
            }
        }.bind(this);

        fichero.send(null);
    }


    cargarObjetoMapa(simbolo, x, y){
        switch(simbolo) {
            case "1":
                this.jugador = new Jugador(x, y);
                // modificación para empezar a contar desde el suelo
                this.jugador.y = this.jugador.y - this.jugador.alto/2;
                break;
            case "#":
                var bloque = new Bloque(imagenes.bloque_tierra, x,y);
                bloque.y = bloque.y - bloque.alto/2;
                // modificación para empezar a contar desde el suelo
                this.bloques.push(bloque);
                break;
            case "E":
                var enemigo = new Enemigo(x,y);
                enemigo.y = enemigo.y - enemigo.alto/2;
                // modificación para empezar a contar desde el suelo
                this.enemigos.push(enemigo);
                break;

        }
    }





}
