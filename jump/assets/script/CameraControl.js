// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        target:cc.Node,
        hero:cc.Node,
        camera:cc.Camera,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.startFollow = false;
        let canvas = cc.find('Canvas').getComponent(cc.Canvas);
        this.visibleSize = cc.view.getVisibleSize();
        this.initZoomRatio = this.camera.zoomRatio;
        this.previousY = this.hero.y;
    },

    start () {

    },

    update (dt) {
        let game = this.target.getComponent('game')
        if (game.pause) return;
        this.node.y += game.upSpeed * dt;
        let heroPos = this.node.parent.convertToWorldSpace(this.hero.position);
        if (heroPos.y - this.node.y > 100) {
            this.startFollow = true;
        } else {
            this.startFollow = false;
        }
        if (this.startFollow) {
            this.node.y += (this.hero.y - this.previousY);
        }
        if (heroPos.y - this.node.y < -this.visibleSize.height / 2 + 20) {
            cc.log('dead')
            this.hero.stopAllActions();
            this.hero.runAction(
                cc.sequence(
                    cc.repeat(
                        cc.sequence(
                            cc.tintTo(0.1, 255, 0, 0), 
                            cc.tintTo(0.1, 255, 255, 255)
                            ), 
                        2
                    ),
                    cc.tintTo(0.1, 255, 0, 0)
                )
            );
            game.gameOver();
        }
        this.previousY = this.hero.y;

    },
});
