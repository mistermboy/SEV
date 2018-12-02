var Pinchos = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    shape:null,
    ctor:function (gameLayer, posicion) {
        this.gameLayer = gameLayer;

        this.sprite = new cc.PhysicsSprite("#tigre1.png");
        var body = new cp.StaticBody();
        body.setPos(posicion);
        this.sprite.setBody(body);
        var radio = this.sprite.getContentSize().width / 2;

        this.shape = new cp.CircleShape(body, radio , cp.vzero);

        this.shape.setSensor(true);
        this.shape.setCollisionType(tipoPincho);

        gameLayer.space.addStaticShape(this.shape);

        gameLayer.addChild(this.sprite,10);

        var framesAnimacion = [];
        for (var i = 1; i <= 8; i++) {
            var str = "tigre" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        var actionAnimacionBucle =
            new cc.RepeatForever(new cc.Animate(animacion));


}, update:function (dt, jugadorX) {

  }, eliminar: function (){
        this.gameLayer.space.removeShape(this.shape);
        this.gameLayer.removeChild(this.sprite);
    }

});
