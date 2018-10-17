// Lista re recursos a precargar
var imagenes = {
    jugador : "res/jugador.png",
    fondo : "res/fondo.png",
    enemigo : "res/enemigo.png",
    enemigo_movimiento : "res/enemigo_movimiento.png",
    disparo_jugador : "res/disparo_jugador.png",
    disparo_enemigo : "res/disparo_enemigo.png",
    icono_puntos : "res/icono_puntos.png",
    icono_vidas : "res/icono_vidas.png",
    icono_recolectable : "res/icono_recolectable.png",
    fondo_2 : "res/fondo_2.png",
    jugador_idle_derecha : "res/jugador_idle_derecha.png",
    jugador_idle_izquierda : "res/jugador_idle_izquierda.png",
    jugador_corriendo_derecha : "res/jugador_corriendo_derecha.png",
    jugador_corriendo_izquierda : "res/jugador_corriendo_izquierda.png",
    jugador_disparando_derecha : "res/jugador_disparando_derecha.png",
    jugador_disparando_izquierda : "res/jugador_disparando_izquierda.png",
    jugador_saltando_derecha : "res/jugador_saltando_derecha.png",
    jugador_saltando_izquierda : "res/jugador_saltando_izquierda.png",
    enemigo_morir : "res/enemigo_morir.png",
    bloque_tierra : "res/bloque_tierra.png",
    bloque_metal : "res/bloque_metal.png",
    bloque_fondo_muro : "res/bloque_fondo_muro.png",
    copa : "res/copa.png",
    pad :"res/pad.png",
    boton_disparo : "res/boton_disparo.png",
    boton_salto : "res/boton_salto.png",
    boton_pausa : "res/boton_pausa.png",
    menu_fondo : "res/menu_fondo.png",
    boton_jugar : "res/boton_jugar.png",
    mensaje_como_jugar : "res/mensaje_como_jugar.png",
    mensaje_ganar : "res/mensaje_ganar.png",
    mensaje_perder : "res/mensaje_perder.png",

};

var rutasImagenes = Object.values(imagenes);
cargarImagenes(0);

function cargarImagenes(indice){
    var imagenCargar = new Image();
    imagenCargar.src = rutasImagenes[indice];
    imagenCargar.onload = function(){
        if ( indice < rutasImagenes.length-1 ){
            indice++;
            cargarImagenes(indice);
        } else {
            iniciarJuego();
        }
    }
}
