// Canvas y contexto del Canvas
var canvas = document.getElementById("canvas");
var contexto = canvas.getContext("2d");
var escaladoMinimo = 1;

// Capas
var gameLayer;

// Controles
var controles = {};


// Inicio capas y bucle del juego
function iniciarJuego() {
    gameLayer = new GameLayer();
    setInterval(loop, 1000 / 30);
}

function loop(){
    gameLayer.actualizar();
    if (entrada == entradas.pulsaciones) {
        gameLayer.calcularPulsaciones(pulsaciones);
    }
    gameLayer.procesarControles();
    gameLayer.dibujar();

    actualizarPulsaciones();
}


function actualizarPulsaciones () {
    for(var i=0; i < pulsaciones.length; i++){
        if ( pulsaciones[i].tipo ==  tipoPulsacion.inicio){
            pulsaciones[i].tipo = tipoPulsacion.mantener;
        }
    }
}


// Cambio de escalado
window.addEventListener('load', this.resize, false);

function resize() {
    console.log("Resize")
    var escaladoAncho = parseFloat(window.innerWidth / canvas.width);
    var escaladoAlto = parseFloat(window.innerHeight / canvas.height);

    escaladoMinimo = Math.min(escaladoAncho, escaladoAlto);

    canvas.width = this.canvas.width*escaladoMinimo;
    canvas.height = this.canvas.height*escaladoMinimo;

    contexto.scale(escaladoMinimo,escaladoMinimo);
}
