var controles = {};
var teclas = [];

var GameLayer = cc.Layer.extend({
        spritePelota: null,
        velocidadX: null,
        velocidadY: null,
        spriteBarra: null,
        spriteBloque: null,
        arrayBloques: [],
        ctor: function () {
            this._super();
            cc.director.resume();
            var size = cc.winSize;

            // cachear
            // SIEMPRE AL INICIO DEL CONSTRUCTOR PARA NO OLVIDARSE
            cc.spriteFrameCache.addSpriteFrames(res.animacioncocodrilo_plist);
            cc.spriteFrameCache.addSpriteFrames(res.animacionpanda_plist);
            cc.spriteFrameCache.addSpriteFrames(res.animaciontigre_plist);


            this.velocidadX = 6;
            this.velocidadY = 3;

            this.spriteFondo = cc.Sprite.create(res.fondo_png);
            this.spriteFondo.setPosition(cc.p(size.width/2 , size.height/2));
            this.spriteFondo.setScale( size.width / this.spriteFondo.width );
            this.addChild(this.spriteFondo);

            this.spritePelota = cc.Sprite.create(res.bola_png);
            this.spritePelota.setPosition(cc.p(size.width / 2, size.height / 2));
            this.addChild(this.spritePelota);

            this.inicializarBloques();

            this.spriteBarra = cc.Sprite.create(res.barra_2_png);
            this.spriteBarra.setPosition(cc.p(size.width / 2, size.height * 0.1));
            this.addChild(this.spriteBarra);




            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseDown: this.procesarMouseDown.bind(this)
            }, this)

            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: this.procesarKeyPressed.bind(this),
                onKeyReleased: this.procesarKeyReleased.bind(this)
            }, this);


            this.scheduleUpdate();

            return true;
        },

        procesarMouseDown: function (event) {
            console.log(event.getLocationX());
            console.log(event.getLocationY());

            var actionMoverPelotaAPunto =
                cc.MoveTo.create(1,
                    cc.p(event.getLocationX(),
                        event.getLocationY()));

            // Ambito procesarMouseDown
            this.spritePelota.runAction(actionMoverPelotaAPunto);

        },

        procesarKeyPressed(keyCode) {
            console.log("procesarKeyPressed " + keyCode);
            var posicion = teclas.indexOf(keyCode);
            if (posicion == -1) {
                teclas.push(keyCode);
                switch (keyCode) {
                    case 39:
                        // ir derecha
                        console.log("controles.moverX = 1");
                        controles.moverX = 1;
                        break;
                    case 37:
                        // ir izquierda
                        controles.moverX = -1;
                        break;
                }
            }
        },

        procesarKeyReleased(keyCode) {
            console.log("procesarKeyReleased " + keyCode);
            var posicion = teclas.indexOf(keyCode);
            teclas.splice(posicion, 1);
            switch (keyCode) {
                case 39:
                    if (controles.moverX == 1) {
                        controles.moverX = 0;
                    }
                    break;
                case 37:
                    if (controles.moverX == -1) {
                        controles.moverX = 0;
                    }
                    break;
            }
        },

        procesarControles() {
            if (controles.moverX > 0) {
                this.spriteBarra.velocidadX = 5;
            }
            if (controles.moverX < 0) {
                this.spriteBarra.velocidadX = -5;
            }
            if (controles.moverX == 0) {
                this.spriteBarra.velocidadX = 0;
            }
        },


        update: function (dt) {

            this.procesarControles();

            // Mover barra
            if (this.spriteBarra.velocidadX == null) {
                this.spriteBarra.velocidadX = 0;
            }
            this.spriteBarra.x = this.spriteBarra.x + this.spriteBarra.velocidadX;


            var mitadAncho = this.spritePelota.getContentSize().width / 2;
            var mitadAlto = this.spritePelota.getContentSize().height / 2;

            // Nuevas posiciones
            this.spritePelota.x = this.spritePelota.x + this.velocidadX;
            this.spritePelota.y = this.spritePelota.y + this.velocidadY;

            // Rebote
            if (this.spritePelota.x < 0 + mitadAncho) {
                this.spritePelota.x = 0 + mitadAncho;
                this.velocidadX = this.velocidadX * -1;
            }
            if (this.spritePelota.x > cc.winSize.width - mitadAncho) {
                this.spritePelota.x = cc.winSize.width - mitadAncho;
                this.velocidadX = this.velocidadX * -1;
            }
            if (this.spritePelota.y < 0 + mitadAlto) {
                // No rebota, se acaba el juego
                cc.director.pause();
                this.getParent().addChild(new GameOverLayer());
            }
            if (this.spritePelota.y > cc.winSize.height - mitadAlto) {
                this.spritePelota.y = cc.winSize.height - mitadAlto;
                this.velocidadY = this.velocidadY * -1;
            }


            //  C O L I S I O N E S

            // Pelota y Barra
            var areaPelota = this.spritePelota.getBoundingBox();
            var areaBarra = this.spriteBarra.getBoundingBox();
            if (cc.rectIntersectsRect(areaPelota, areaBarra)) {
                console.log("Colision");

                this.velocidadX = (this.spritePelota.x - this.spriteBarra.x) / 5;
                this.velocidadY = this.velocidadY * -1;

            }

            // Pelota y Bloque
            for(var i = 0; i < this.arrayBloques.length; i++){
                var areaBloque = this.arrayBloques[i].getBoundingBox();
                if( cc.rectIntersectsRect(areaPelota, areaBloque)){
                    if(this.arrayBloques[i] != null) {
                        this.removeChild(this.arrayBloques[i]);
                        this.arrayBloques.splice(i, 1);
                        console.log("Quedan : " + this.arrayBloques.length);
                    }
                }
            }



        },

        inicializarBloques: function () {
            var insertados = 0;
            var fila = 0;
            var columna = 0;

            var framesCocdrilo = [];
            framesCocdrilo.push(cc.spriteFrameCache.getSpriteFrame("cocodrilo1.png"));
            framesCocdrilo.push(cc.spriteFrameCache.getSpriteFrame("cocodrilo2.png"));
            framesCocdrilo.push(cc.spriteFrameCache.getSpriteFrame("cocodrilo3.png"));
            framesCocdrilo.push(cc.spriteFrameCache.getSpriteFrame("cocodrilo4.png"));
            framesCocdrilo.push(cc.spriteFrameCache.getSpriteFrame("cocodrilo5.png"));
            framesCocdrilo.push(cc.spriteFrameCache.getSpriteFrame("cocodrilo6.png"));
            framesCocdrilo.push(cc.spriteFrameCache.getSpriteFrame("cocodrilo7.png"));
            framesCocdrilo.push(cc.spriteFrameCache.getSpriteFrame("cocodrilo8.png"));

            var framesPanda = [];
            framesPanda.push(cc.spriteFrameCache.getSpriteFrame("panda1.png"));
            framesPanda.push(cc.spriteFrameCache.getSpriteFrame("panda2.png"));
            framesPanda.push(cc.spriteFrameCache.getSpriteFrame("panda3.png"));
            framesPanda.push(cc.spriteFrameCache.getSpriteFrame("panda4.png"));
            framesPanda.push(cc.spriteFrameCache.getSpriteFrame("panda5.png"));
            framesPanda.push(cc.spriteFrameCache.getSpriteFrame("panda6.png"));
            framesPanda.push(cc.spriteFrameCache.getSpriteFrame("panda7.png"));
            framesPanda.push(cc.spriteFrameCache.getSpriteFrame("panda8.png"));

            var framesTigre = [];
            framesTigre.push(cc.spriteFrameCache.getSpriteFrame("tigre1.png"));
            framesTigre.push(cc.spriteFrameCache.getSpriteFrame("tigre2.png"));
            framesTigre.push(cc.spriteFrameCache.getSpriteFrame("tigre3.png"));
            framesTigre.push(cc.spriteFrameCache.getSpriteFrame("tigre4.png"));
            framesTigre.push(cc.spriteFrameCache.getSpriteFrame("tigre5.png"));
            framesTigre.push(cc.spriteFrameCache.getSpriteFrame("tigre6.png"));
            framesTigre.push(cc.spriteFrameCache.getSpriteFrame("tigre7.png"));
            framesTigre.push(cc.spriteFrameCache.getSpriteFrame("tigre8.png"));


            var animacionCocodrilo = new cc.Animation(framesCocdrilo, 0.1);
            var animacionPanda = new cc.Animation(framesPanda, 0.1);
            var animacionTigre = new cc.Animation(framesTigre, 0.1);


            while (insertados < 50) {

                var num = Math.floor((Math.random() * 3) + 1);

                var accionAnimacionBloque;

                switch (num){

                    case 1:
                        accionAnimacionBloque =
                            new cc.RepeatForever(new cc.Animate(animacionCocodrilo));
                        break;

                    case 2:
                        accionAnimacionBloque =
                            new cc.RepeatForever(new cc.Animate(animacionPanda));
                        break;

                    case 3:
                        accionAnimacionBloque =
                            new cc.RepeatForever(new cc.Animate(animacionTigre));
                        break;

                }


                var spriteBloqueActual = cc.Sprite.create("#cocodrilo1.png");
                spriteBloqueActual.runAction(accionAnimacionBloque);

                var x = (spriteBloqueActual.width / 2) +
                    (spriteBloqueActual.width * columna);
                var y = (cc.winSize.height - spriteBloqueActual.height / 2) -
                    (spriteBloqueActual.height * fila);
                console.log("Insertado en: " + x + " ," + y);

                spriteBloqueActual.setPosition(cc.p(x, y));

                this.arrayBloques.push(spriteBloqueActual);
                this.addChild(spriteBloqueActual);

                insertados++;
                columna++;

                if (x + spriteBloqueActual.width / 2 > cc.winSize.width) {
                    columna = 0;
                    fila++;
                }
            }
        }
    }

);

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});

