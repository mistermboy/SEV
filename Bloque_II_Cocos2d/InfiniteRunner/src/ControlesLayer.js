

var ControlesLayer = cc.Layer.extend({
    spriteBotonSaltar:null,
    etiquetaMonedas:null,
    monedas:0,
    etiquetaVidas:null,
    ctor:function () {
        this._super();
        var size = cc.winSize;


        // BotonSaltar
        this.spriteBotonSaltar = cc.Sprite.create(res.boton_saltar_png);
        this.spriteBotonSaltar.setPosition(
            cc.p(size.width*0.8, size.height*0.5));

        this.addChild(this.spriteBotonSaltar);


        //Vidas
        this.etiquetaVidas=new cc.LabelTTF("Vidas: 3","Helvetica",20);
        this.etiquetaVidas.setPosition(cc.p(size.width*0.1, size.height*0.9));
        this.etiquetaVidas.fillStyle.color="#000000";
        this.addChild(this.etiquetaVidas);

        //Monedas
        this.etiquetaMonedas=new cc.LabelTTF("Monedas: 0","Helvetica",20);
        this.etiquetaMonedas.setPosition(cc.p(size.width*0.1, size.height*0.8));
        this.etiquetaMonedas.fillStyle.color="#000000";
        this.addChild(this.etiquetaMonedas);



        // Registrar Mouse Down
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: this.procesarMouseDown
        }, this)

        this.scheduleUpdate();
        return true;
    },update:function (dt) {

    },procesarMouseDown:function(event) {
        var instancia = event.getCurrentTarget();
        var areaBoton = instancia.spriteBotonSaltar.getBoundingBox();

        // La pulsación cae dentro del botón
        if (cc.rectContainsPoint(areaBoton,
            cc.p(event.getLocationX(), event.getLocationY()) )){



            // Accedemos al padre (Scene), pedimos la capa con la idCapaJuego
            var gameLayer = instancia.getParent().getChildByTag(idCapaJuego);
            // tenemos el objeto GameLayer
            gameLayer.jugador.saltar();

        }
    },setVidas:function (vidas) {
        this.etiquetaVidas.setString("Vidas: "+ vidas);
    },addMonedas:function() {
        this.monedas++;
        this.etiquetaMonedas.setString("Monedas: "+ this.monedas);
    }
});
