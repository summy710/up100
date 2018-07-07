// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let co = require('Common');

cc.Class({
    extends: cc.Component,

    properties: {
        type:0 // 0-普通 1-闪烁 2-云 3-钉刺 4-弹簧

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    init(game, floor, position) {
        this.game = game;
        this.floor = floor;
        this.bStep = false;
        this.node.position = position;
        if (this.type == 2) {
            this.drt = this.node.x < 0 ? 1 : -1;
            this.c_speed = Math.random() * 20 + 5;
        }
    },

    step() {
        let hero = this.game.hero;
        this.game.getComponent('game').changeFloor(this.floor);
        hero.getComponent('hero').jump(this.bStep, this.type);
        this.bStep = true;
        if (this.type == 1) {
            this.node.runAction(
                cc.sequence(
                    cc.repeat(
                        cc.sequence(cc.fadeOut(0.1), cc.fadeIn(0.1))
                        , 3
                    ), 
                cc.fadeOut(0.1)
                )
            );
        } else if (this.type == 4) {
            this.node.getComponent(cc.Animation).play('bounce');
        } else if (this.type == 3) {
            if (CC_WECHATGAME) {
                if (!co.getShakeStatus()) return;
                window.wx.vibrateLong({
                    success(res){
                        console.log('震动');
                        console.log(res);
                    },
                    fail(res){
                        console.log('没有震动');
                        console.log(res);
                    },
                    complete(res){
                        console.log('完成');
                        console.log(res);
                    }
                });
            }
        }
    },

    update (dt) {
        if (this.game.getComponent('game').pause) return;
        if (this.type == 2) {
            this.node.x += this.c_speed * dt * this.drt;
        }
        let hero = this.game.hero;
        if (this.type == 1 && this.bStep) return;
        if (hero.getComponent('hero').bJump) return;
        if (hero.getComponent('hero').bDrop) {
            let sx = this.node.x;
            let hx = hero.x;
            let sy = this.node.y;
            let hy = hero.y;
            let ssize = this.node.getContentSize();
            let hsize = hero.getContentSize();
            if (hy > sy && Math.abs(hy - sy) <= 35) {
                if ((hx - sx < 0 && hx - sx > -(ssize.width + hsize.width) / 2) || (hx - sx >= 0 && hx - sx < (ssize.width + hsize.width) / 2)) {
                    this.step();
                }
            }
        }
    },

});
