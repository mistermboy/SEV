var Enemigo = cc.Class.extend({
    tiempoSalto:0,
    tiempoEntreSaltos:0,
    gameLayer:null,
    sprite:null,
    shape:null,
ctor:function (gameLayer, posicion) {
    this.gameLayer = gameLayer;

    this.tiempoEntreSaltos = 2 + Math.floor(Math.random() * 2);
    var framesAnimacion = [];
    for (var i = 1; i <= 8; i++) {
        var str = "cuervo" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    var actionAnimacionBucle =
        new cc.RepeatForever(new cc.Animate(animacion));

    this.sprite = new cc.PhysicsSprite("#cuervo1.png");
    this.body = new cp.Body(5, cp.momentForBox(1,
        this.sprite.getContentSize().width,
        this.sprite.getContentSize().height));

    this.body.setPos(posicion);
    this.body.setAngle(0);
    this.sprite.setBody(this.body);
    gameLayer.space.addBody(this.body);


    this.shape = new cp.BoxShape(this.body,
        this.sprite.getContentSize().width - 16,
        this.sprite.getContentSize().height - 16);

    this.shape.setCollisionType(tipoEnemigo);
    gameLayer.space.addShape(this.shape);
    this.sprite.runAction(actionAnimacionBucle);


    gameLayer.addChild(this.sprite,10);

}, update:function (dt, jugadorX) {


        if ( this.body.vx < 0.005 && this.body.vx > -0.005){
            this.orientacion = this.orientacion *-1;
        }

        if ( this.orientacion > 0){
            this.sprite.flippedX = true; // Invertir Sprite
            if (this.body.vx < 100){
                this.body.applyImpulse(cp.v(300, 0), cp.v(0, 0));
            } else { // vx mayor más de 100
                this.body.vx = 100;
            }
        }

        if ( this.orientacion < 0) {
            this.sprite.flippedX = false; // No invertir Sprite
            if (this.body.vx > -100){
                this.body.applyImpulse(cp.v(-300, 0), cp.v(0, 0));
            } else { // vx nunca menor que -100
                this.body.vx = -100; //limitado
            }
        }

        this.tiempoSalto = this.tiempoSalto + dt;

      if(this.tiempoSalto > this.tiempoEntreSaltos &&
         Math.abs( this.body.p.x - jugadorX ) < 500){

          var impulsoX = 200 - Math.floor(Math.random() * 400);
          var impulsoY = 800 + Math.floor(Math.random() * 1200);

          this.body.setAngle(0);

          this.body.applyImpulse(cp.v(impulsoX, impulsoY), cp.v(0, 0));
          this.tiempoSalto = 0;
      }

      if(this.body.getVel().x > 0){
          this.sprite.flippedX = true;
      } else {
           this.sprite.flippedX = false;
      }
  }, eliminar: function (){
        this.gameLayer.space.removeShape(this.shape);
        this.gameLayer.removeChild(this.sprite);
    }




});
