
var tipoMuro = 2;
var tipoBloque = 3;


var GameLayer = cc.Layer.extend({

    space:null,
    mundoActivo: false,
    tiempoTiro: 0,
    formasEliminar: [],
    arrayBloques:[],
    spriteFondo: null,
    spritePelota:null,
    intentos:3,
    ctor:function () {
        this._super();
        var size = cc.winSize;

        // Inicializar Space
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, -350);

        this.depuracion = new cc.PhysicsDebugNode(this.space);
        this.addChild(this.depuracion, 10);


        // Muros
        var muroIzquierdaShape = new cp.SegmentShape(this.space.staticBody,
            cp.v(0, 0),// Punto de Inicio
            cp.v(0, size.height),// Punto final
            10);// Ancho del muro
        this.space.addStaticShape(muroIzquierdaShape);

        var muroArribaShape = new cp.SegmentShape(this.space.staticBody,
            cp.v(0, size.height),// Punto de Inicio
            cp.v(size.width, size.height),// Punto final
            10);// Ancho del muro
        this.space.addStaticShape(muroArribaShape);

        var muroDerechaShape = new cp.SegmentShape(this.space.staticBody,
            cp.v(size.width, 0),// Punto de Inicio
            cp.v(size.width, size.height),// Punto final
            10);// Ancho del muro
        this.space.addStaticShape(muroDerechaShape);

        var muroAbajoShape = new cp.SegmentShape(this.space.staticBody,
            cp.v(0, 0),// Punto de Inicio
            cp.v(size.width, 0),// Punto final
            10);// Ancho del muro
        muroAbajoShape.setFriction(1);
        muroAbajoShape.setCollisionType(tipoMuro);
        this.space.addStaticShape(muroAbajoShape);

        // muro y bloque
        this.space.addCollisionHandler(tipoMuro, tipoBloque,
            null, null, this.collisionBloqueConMuro.bind(this), null);


        this.space.addCollisionHandler(tipoMuro, tipoBloque,
            null, null, this.collisionBloqueConMuro.bind(this), null);

        // Fondo
        this.spriteFondo = cc.Sprite.create(res.fondo_png);
        this.spriteFondo.setPosition(cc.p(size.width/2 , size.height/2));
        this.spriteFondo.setScale( size.width / this.spriteFondo.width );
        this.addChild(this.spriteFondo);

        // cache
        cc.spriteFrameCache.addSpriteFrames(res.animacion_bola_plist);
        cc.spriteFrameCache.addSpriteFrames(res.barra_3_plist);
        cc.spriteFrameCache.addSpriteFrames(res.animacioncocodrilo_plist);


        this.spritePelota = new cc.PhysicsSprite("#animacion_bola1.png");

        var body = new cp.Body(1, cp.momentForCircle(1, 0,
            this.spritePelota.width/2, cp.vzero));


        body.p = cc.p(size.width*0.1 , size.height*0.5);


        var shape = new cp.CircleShape(body, this.spritePelota.width/2, cp.vzero);


        this.space.addShape(shape);
        this.addChild(this.spritePelota);


        this.spritePelota.setBody(body);

        this.space.addBody(body);


        // Evento MOUSE
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: this.procesarMouseDown.bind(this)
        }, this);

        this.inicializarPlataformas();
        this.inicializarBloques();

        this.scheduleUpdate();
        return true;

    },procesarMouseDown:function(event) {
        this.mundoActivo = true;

        if (this.tiempoTiro == 0){

            this.tiempoTiro = 1;
            // PRUEBA 2:
            var body = this.spritePelota.body;
            body.applyImpulse(
                cp.v( event.getLocationX() - body.p.x, event.getLocationY() - body.p.y),
                cp.v(0,0));
        }


    },update:function (dt) {


        console.log("TIEMPOTIROO " +this.tiempoTiro);
        if ( this.tiempoTiro != 0){
            this.tiempoTiro++;
        }


        if(this.mundoActivo){
            this.space.step(dt);
        }

        for(var i = 0; i < this.formasEliminar.length; i++) {
            var shape = this.formasEliminar[i];

            for (var j = 0; j < this.arrayBloques.length; j++) {
                if (this.arrayBloques[j] != null &&
                    this.arrayBloques[j].body.shapeList[0] == shape) {

                    // quita la forma
                    this.space.removeShape(shape);
                    // quita el cuerpo *opcional, funciona igual
                    this.space.removeBody(shape.getBody());
                    // quita el sprite de la capa (es como capa.removeChild(sprite))
                    this.arrayBloques[j].removeFromParent();
                    // Borrar tambien de ArrayBloques
                    this.arrayBloques.splice(j, 1);

                }
            }
        }
        this.formasEliminar = [];

        if( this.arrayBloques.length > 0){
            var quietos = true;
            for(var i = 0; i < this.arrayBloques.length; i++) {
                var vel = this.arrayBloques[i].body.getVel();
                if( vel.x < -0.09 && vel.x > 0.09 ){
                    quietos = false;
                }
            }
            if ( this.tiempoTiro > 300 &&
                quietos && this.intentos>1){
                this.tiempoTiro=0;
                this.mundoActivo=false;
                this.intentos--;
                //Devolver pelota a posición inicial
                var size = cc.winSize;
                var body = new cp.Body(1,
                    cp.momentForCircle(1, 0, this.spritePelota.width/2, cp.vzero));
                body.p = cc.p(size.width*0.1 , size.height*0.5);
                this.removeChild(this.spritePelota);
                this.spritePelota.setBody(body);
                this.space.addBody(body);
                var shape =
                    new cp.CircleShape(body, this.spritePelota.width/2, cp.vzero);

                this.space.addShape(shape);

                this.addChild(this.spritePelota);
            }
            else if ( this.tiempoTiro > 300 &&
                quietos && this.intentos<=1){
                cc.director.pause();
                cc.audioEngine.stopMusic();
                this.getParent().addChild(new GameOverLayer());
            }


        } else {
            cc.director.pause();
            cc.audioEngine.stopMusic();
            this.getParent().addChild(new GameOverLayer());
        }



    },
    inicializarPlataformas:function () {

    var spritePlataforma = new cc.PhysicsSprite("#barra_3.png");

    var body = new cp.StaticBody();
    body.p = cc.p(cc.winSize.width*0.7 , cc.winSize.height*0.4);
    spritePlataforma.setBody(body);
    // Los cuerpos estáticos no se añaden al espacio
    //this.space.addBody(body);

    var shape = new cp.BoxShape(body, spritePlataforma.width, spritePlataforma.height);
    shape.setFriction(1);
    // addStaticShape en lugar de addShape
    this.space.addStaticShape(shape);

    this.addChild(spritePlataforma);

},inicializarBloques:function () {
        var altoTorre = 0;
        while(altoTorre < 4) {


            var spriteBloque = new cc.PhysicsSprite("#cocodrilo1.png");

            // Masa 1
            var body = new cp.Body(1, cp.momentForBox(1, spriteBloque.width, spriteBloque.height));

            body.p = cc.p(cc.winSize.width * 0.7, cc.winSize.height * 0.4 + 10 + 20 + + spriteBloque.height*altoTorre);
            spriteBloque.setBody(body);
            // Este si hay que añadirlo
            this.space.addBody(body);

            var shape = new cp.BoxShape(body, spriteBloque.width, spriteBloque.height);
            shape.setFriction(1);
            shape.setCollisionType(tipoBloque);
            this.space.addShape(shape);
            this.addChild(spriteBloque);

            // agregar el Sprite al array Bloques
            this.arrayBloques.push(spriteBloque);
            altoTorre++;
        }

},
    collisionBloqueConMuro:function (arbiter, space) {
        var shapes = arbiter.getShapes();
        // shapes[0] es el muro
        this.formasEliminar.push(shapes[1]);
    },

});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        cc.director.resume();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});

