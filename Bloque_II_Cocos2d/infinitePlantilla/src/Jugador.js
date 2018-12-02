
var estadoCaminando = 1;
var estadoSaltando = 2;

var Jugador = cc.Class.extend({
    estado: estadoCaminando,
    gameLayer:null,
    sprite:null,
    shape:null,
    body:null,
    aaSaltar:null,
    aaCaminar:null,
    vidas:3,
ctor:function (gameLayer, posicion) {
    this.gameLayer = gameLayer;

    // Crear animación
    var framesAnimacion = [];
    for (var i = 1; i <= 4; i++) {
        var str = "jugador_avanzando" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    var actionAnimacionBucle =
        new cc.RepeatForever(new cc.Animate(animacion));
    this.aaCaminar = actionAnimacionBucle;
    this.aaCaminar.retain();

    var framesAnimacionSaltar = [];
        for (var i = 1; i <= 4; i++) {
            var str = "jugador_subiendo" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacionSaltar.push(frame);
        }
     var animacionSaltar = new cc.Animation(framesAnimacionSaltar, 0.2);
     this.aaSaltar  =
            new cc.RepeatForever(new cc.Animate(animacionSaltar));

     this.aaSaltar.retain();






    // Crear Sprite - Cuerpo y forma
    this.sprite = new cc.PhysicsSprite("#jugador_avanzando1.png");
    // Cuerpo dinámico, SI le afectan las fuerzas
    this.body = new cp.Body(5, cp.momentForBox(1,
        this.sprite.getContentSize().width,
        this.sprite.getContentSize().height));

    this.body.setPos(posicion);
    //body.w_limit = 0.02;
    this.body.setAngle(0);
    this.sprite.setBody(this.body);

    // Se añade el cuerpo al espacio
    gameLayer.space.addBody(this.body);




    // forma 16px más pequeña que la imagen original
    this.shape = new cp.BoxShape(this.body,
        this.sprite.getContentSize().width - 16,
        this.sprite.getContentSize().height - 16);
    this.shape.setCollisionType(tipoJugador);
    // forma dinamica
    gameLayer.space.addShape(this.shape);



    // ejecutar la animación
    this.sprite.runAction(actionAnimacionBucle);
    // añadir sprite a la capa
    gameLayer.addChild(this.sprite,10);

    // Impulso inicial
    this.body.applyImpulse(cp.v(1800, 0), cp.v(0, 0));

},saltar: function(){
       // solo salta si está caminando
        if(this.estado == estadoCaminando){
            this.estado = estadoSaltando;
            this.body.applyImpulse(cp.v(0, 1800), cp.v(0, 0));
            this.sprite.stopAllActions();
            this.sprite.runAction(this.aaSaltar);
        }
  }, tocaSuelo: function(){
       if(this.estado != estadoCaminando){
           this.estado = estadoCaminando;
           this.sprite.stopAllActions();
           this.sprite.runAction(this.aaCaminar);
       }
   }




});
