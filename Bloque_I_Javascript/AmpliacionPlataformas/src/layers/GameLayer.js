class GameLayer extends Layer {

    constructor() {
        super();
        this.mensaje = new Boton(imagenes.mensaje_como_jugar, 480/2, 320/2);
        this.pausa = true;
        this.salvar = false;
        this.iniciar();
    }

    iniciar() {
        reproducirMusica();

        this.botonSalto = new Boton(imagenes.boton_salto,480*0.9,320*0.55);
        this.botonDisparo = new Boton(imagenes.boton_disparo,480*0.75,320*0.83);
        this.pad = new Pad(480*0.14,320*0.8);
        this.espacio = new Espacio(1);

        this.scrollX = 0;
        this.bloques = [];
        this.fondoPuntos =
            new Fondo(imagenes.icono_puntos, 480*0.85,320*0.05);

        this.puntos = new Texto(0,480*0.9,320*0.07 );

        this.fondoRecolectables =
            new Fondo(imagenes.icono_recolectable, 480*0.73,320*0.07);

        this.puntosRecolectables = new Texto(0,480*0.79,320*0.07 );

        this.jugador = new Jugador(50, 50);

        this.fondo = new Fondo(imagenes.fondo_2,480*0.5,320*0.5);

        this.disparosJugador = [];

        this.disparosEnemigo = [];

        this.enemigos = [];

        this.recolectables = [];

        this.enemigosEspeciales = [];

        this.cargarMapa("res/"+nivelActual+".txt");

        if(this.salvar)
            this.jugador.x=this.checkPoint.x;
    }

    actualizar (){
        if (this.pausa){
            return;
        }

        if ( this.copa.colisiona(this.jugador)){
            nivelActual++;
            if (nivelActual > nivelMaximo){
                nivelActual = 0;
            }
            this.pausa = true;
            this.mensaje =
                new Boton(imagenes.mensaje_ganar, 480/2, 320/2);
            this.salvar = false;
            this.iniciar();
        }


        //  Jugador - CheckPoint
        if ( this.checkPoint.colisiona(this.jugador)){
            this.checkPoint.imagen.src = imagenes.checkPassed;
            this.salvar = true;
        }

        // Jugador se cae
        if ( this.jugador.y > 480 ){
            this.iniciar();
        }

        this.espacio.actualizar();
        this.fondo.vx = -1;
        this.fondo.actualizar();
        this.jugador.actualizar();

        // Eliminar disparos sin velocidad
        for (var i=0; i < this.disparosJugador.length; i++){
            if ( this.disparosJugador[i] != null &&
                    this.disparosJugador[i].vx == 0){

                this.espacio
                    .eliminarCuerpoDinamico(this.disparosJugador[i]);
                this.disparosJugador.splice(i, 1);
            }
        }

        // Eliminar disparos fuera de pantalla
        for (var i=0; i < this.disparosJugador.length; i++){
            if ( this.disparosJugador[i] != null &&
                !this.disparosJugador[i].estaEnPantalla() ||
                    this.disparosJugador[i].vx == 0){
                this.espacio
                    .eliminarCuerpoDinamico(this.disparosJugador[i]);
                this.disparosJugador.splice(i, 1);
            }
        }

        for (var i=0; i < this.disparosEnemigo.length; i++) {
            this.disparosEnemigo[i].actualizar();
        }

        for (var i=0; i < this.enemigos.length; i++){
            this.enemigos[i].actualizar();
        }

        for (var i=0; i < this.enemigosEspeciales.length; i++){
            this.enemigosEspeciales[i].actualizar();
        }

        for (var i=0; i < this.recolectables.length; i++){
            this.recolectables[i].actualizar();
        }

        for (var i=0; i < this.disparosJugador.length; i++) {
            this.disparosJugador[i].actualizar();
        }

        // colisiones
        for (var i=0; i < this.enemigos.length; i++){
            if ( this.jugador.colisiona(this.enemigos[i])){
                this.jugador.golpeado();
                if (this.jugador.vidas <= 0){
                    this.iniciar();
                }
            }
        }


        // colisiones especiales
        for (var i=0; i < this.enemigosEspeciales.length; i++){
            if ( this.jugador.colisiona(this.enemigosEspeciales[i])){

                if(this.jugador.colisionaEncima(this.enemigosEspeciales[i]) && this.jugador.vy > 0){
                    this.enemigosEspeciales[i].impactado();
                    this.puntos.valor++;
                }



            }
/*
            if ( this.jugador.colisionaNormal(this.enemigos[i])){
                this.jugador.golpeado();
                if (this.jugador.vidas <= 0){
                    this.iniciar();
                }
            }
            */

        }

        // colisiones , disparoJugador - Enemigo
        for (var i=0; i < this.disparosJugador.length; i++){
            for (var j=0; j < this.enemigos.length; j++){

                if (this.disparosJugador[i] != null &&
                    this.enemigos[j] != null &&
                    this.disparosJugador[i].colisiona(this.enemigos[j])) {

                        this.espacio
                            .eliminarCuerpoDinamico(this.disparosJugador[i]);
                        this.disparosJugador.splice(i, 1);
                        this.enemigos[j].impactado();
                        this.puntos.valor++;

                }
            }
        }

        // colision , Jugador - Recolectable
        for (var i=0; i < this.recolectables.length; i++) {
            if (this.jugador.colisiona(this.recolectables[i])) {
                this.recolectables.splice(i, 1);
                this.puntosRecolectables.valor++;
            }
        }


        // Enemigos muertos fuera del juego

        for (var j=0; j < this.enemigos.length; j++){
            if ( this.enemigos[j] != null &&
                this.enemigos[j].estado == estados.muerto  ) {

                this.espacio
                    .eliminarCuerpoDinamico(this.enemigos[j]);
                this.enemigos.splice(j, 1);

            }
        }

        for (var j=0; j < this.enemigosEspeciales.length; j++) {
            if (this.enemigosEspeciales[j] != null &&
                this.enemigosEspeciales[j].estado == estados.muerto) {

                this.espacio
                    .eliminarCuerpoDinamico(this.enemigosEspeciales[j]);
                this.enemigosEspeciales.splice(j, 1);

            }
        }


            // Generamos disparos para los enemigos
            for (var i=0; i < this.enemigosEspeciales.length; i++){

                var nuevoDisparo = this.enemigosEspeciales[i].disparar();
                if ( nuevoDisparo != null && this.enemigosEspeciales[i].estaEnPantalla()) {
                    this.disparosEnemigo.push(nuevoDisparo);
                }
            }


    }


    calcularScroll(){
        // limite izquierda
        if ( this.jugador.x > 480 * 0.3) {
            if (this.jugador.x - this.scrollX < 480 * 0.3) {
                this.scrollX = this.jugador.x - 480 * 0.3;
            }
        }

        // limite derecha
        if ( this.jugador.x < this.anchoMapa - 480 * 0.3 ) {
            if (this.jugador.x - this.scrollX > 480 * 0.7) {
                this.scrollX = this.jugador.x - 480 * 0.7;
            }
        }
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
        this.copa.dibujar(this.scrollX);
        this.checkPoint.dibujar(this.scrollX);

        this.jugador.dibujar(this.scrollX);
        for (var i=0; i < this.enemigos.length; i++){
            this.enemigos[i].dibujar(this.scrollX);
        }

        for (var i=0; i < this.enemigosEspeciales.length; i++){
            this.enemigosEspeciales[i].dibujar();
        }

        for (var i=0; i < this.recolectables.length; i++){
            this.recolectables[i].dibujar(this.scrollX);
        }

        for (var i=0; i < this.disparosEnemigo.length; i++) {
            this.disparosEnemigo[i].dibujar();
        }

        this.fondoPuntos.dibujar();
        this.puntos.dibujar();

        this.fondoRecolectables.dibujar();
        this.puntosRecolectables.dibujar();

        if ( !this.pausa && entrada == entradas.pulsaciones) {
            this.botonDisparo.dibujar();
            this.botonSalto.dibujar();
            this.pad.dibujar();
        }
        if ( this.pausa ) {
            this.mensaje.dibujar();
        }
    }

    calcularPulsaciones(pulsaciones){
        // Suponemos botones no estan pulsados
        this.botonDisparo.pulsado = false;
        this.botonSalto.pulsado = false;
        // suponemos que el pad esta en el centro
        controles.moverX = 0;
        // Suponemos a false
        controles.continuar = false;

        for(var i=0; i < pulsaciones.length; i++){
            // Muy simple cualquier click en pantalla lo activa
            if(pulsaciones[i].tipo == tipoPulsacion.inicio){
                controles.continuar = true;
            }

            if (this.pad.contienePunto(pulsaciones[i].x , pulsaciones[i].y) ){
                var orientacionX = this.pad.obtenerOrientacionX(pulsaciones[i].x);
                if ( orientacionX > 20) { // de 0 a 20 no contabilizamos
                    controles.moverX = orientacionX;
                }
                if ( orientacionX < -20) { // de -20 a 0 no contabilizamos
                    controles.moverX = orientacionX;
                }
            }

            if (this.botonDisparo.contienePunto(pulsaciones[i].x , pulsaciones[i].y) ){
                this.botonDisparo.pulsado = true;
                if ( pulsaciones[i].tipo == tipoPulsacion.inicio) {
                    controles.disparo = true;
                }
            }

            if (this.botonSalto.contienePunto(pulsaciones[i].x , pulsaciones[i].y) ){
                this.botonSalto.pulsado = true;
                if ( pulsaciones[i].tipo == tipoPulsacion.inicio) {
                    controles.moverY = 1;
                }
            }

        }

        // No pulsado - Boton Disparo
        if ( !this.botonDisparo.pulsado ){
            controles.disparo = false;
        }

        // No pulsado - Boton Salto
        if ( !this.botonSalto.pulsado ){
            controles.moverY = 0;
        }
    }


    procesarControles( ){
        if (controles.continuar){
            controles.continuar = false;
            this.pausa = false;
        }
        // disparar
        if (  controles.disparo ){
            var nuevoDisparo = this.jugador.disparar();
            if ( nuevoDisparo != null ) {
                this.espacio.agregarCuerpoDinamico(nuevoDisparo);
                this.disparosJugador.push(nuevoDisparo);
            }
            controles.disparo = false;
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
            this.jugador.saltar();
            //controles.moverY = 0;

        } else if ( controles.moverY < 0 ){

        } else {

        }

    }


    cargarMapa(ruta){
        var fichero = new XMLHttpRequest();
        fichero.open("GET", ruta, false);

        fichero.onreadystatechange = function () {
            var texto = fichero.responseText;
            var lineas = texto.split('\n');
            this.anchoMapa = (lineas[0].length-1) * 40;
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
            case "C":
                this.copa = new Bloque(imagenes.copa, x,y);
                this.copa.y = this.copa.y - this.copa.alto/2;
                // modificación para empezar a contar desde el suelo
                this.espacio.agregarCuerpoDinamico(this.copa);
                break;
            case "A":
                this.checkPoint = new Bloque(imagenes.check, x,y);
                this.checkPoint.y = this.checkPoint.y - this.checkPoint.alto/2;
                this.espacio.agregarCuerpoDinamico(this.checkPoint);
                break;
            case "E":
                var enemigo = new Enemigo(x,y);
                enemigo.y = enemigo.y - enemigo.alto/2;
                // modificación para empezar a contar desde el suelo
                this.enemigos.push(enemigo);
                this.espacio.agregarCuerpoDinamico(enemigo);
                break;
            case "S":
                var enemigo = new Arquero(x,y);
                enemigo.y = enemigo.y - enemigo.alto/2;
                // modificación para empezar a contar desde el suelo
                this.enemigosEspeciales.push(enemigo);
                this.espacio.agregarCuerpoDinamico(enemigo);
                break;
            case "1":
                this.jugador = new Jugador(x, y);
                // modificación para empezar a contar desde el suelo
                this.jugador.y = this.jugador.y - this.jugador.alto/2;
                this.espacio.agregarCuerpoDinamico(this.jugador);
                break;
            case "#":
                var bloque = new Bloque(imagenes.bloque_tierra, x,y);
                bloque.y = bloque.y - bloque.alto/2;
                // modificación para empezar a contar desde el suelo
                this.bloques.push(bloque);
                this.espacio.agregarCuerpoEstatico(bloque);
                break;
            case "R":
                var rec = new Recolectable(imagenes.icono_recolectable, x,y);
                rec.y = rec.y - rec.alto/2;
                // modificación para empezar a contar desde el suelo
                this.recolectables.push(rec);
                this.espacio.agregarCuerpoDinamico(rec);
                break;
        }
    }

}