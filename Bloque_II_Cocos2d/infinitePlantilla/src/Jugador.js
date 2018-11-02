var estadoCaminando = 1;
var estadoSaltando = 2;

var Jugador = cc.Class.extend({
    estado: estadoCaminando,
    animacion:null,
    saSaltar:null,
    aCaminar:null,
    gameLayer:null,
    sprite:null,
    shape:null,
    body:null,
ctor:function (gameLayer, posicion) {
    this.gameLayer = gameLayer;

    // Crear Sprite - Cuerpo y forma
    this.sprite = new cc.PhysicsSprite("#jugador_caminar1.png");
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
        this.sprite.getContentSize().width,
        this.sprite.getContentSize().height);

    this.shape.setCollisionType(tipoJugador);

    // forma dinamica
    gameLayer.space.addShape(this.shape);
    // añadir sprite a la capa
    gameLayer.addChild(this.sprite,10);


    // Crear animación
    var framesAnimacion = [];
    for (var i = 1; i <= 4; i++) {
        var str = "jugador_caminar" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    var actionAnimacionBucle =
        new cc.RepeatForever(new cc.Animate(animacion));
    // ejecutar la animación
    this.aCaminar = actionAnimacionBucle;
    this.aCaminar.retain();


    var framesAnimacionSaltar = [];
        for (var i = 1; i <= 4; i++) {
            var str = "jugador_saltar" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacionSaltar.push(frame);
        }
     var animacionSaltar = new cc.Animation(framesAnimacionSaltar, 0.2);
     this.aSaltar  =
            new cc.RepeatForever(new cc.Animate(animacionSaltar));

     this.aSaltar.retain();



    this.body.applyImpulse(cp.v(3000, 0), cp.v(0, 0));

},
 saltar: function(){
       // solo salta si está caminando
        if(this.estado == estadoCaminando){
            this.estado = estadoSaltando;
            this.body.applyImpulse(cp.v(0, 1800), cp.v(0, 0));
        }
 },
  actualizar: function (){
      switch ( this.estado ){
          case estadoSaltando:
              if (this.animacion != this.aSaltar){
                  this.animacion = this.aSaltar;
                  this.sprite.stopAllActions();
                  this.sprite.runAction(this.animacion);
              }
          break;
          case estadoCaminando:
              if (this.animacion != this.aCaminar){
                  this.animacion = this.aCaminar;
                  this.sprite.stopAllActions();
                  this.sprite.runAction(this.animacion);
              }
          break;
      }
  },

       tocaSuelo: function(){
               if(this.estado != estadoCaminando){
                   this.estado = estadoCaminando;
               }
          }


});
