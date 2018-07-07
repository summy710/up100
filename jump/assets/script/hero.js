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
        game:cc.Node,
        jumpSF:cc.SpriteFrame,
        caiSF:cc.SpriteFrame,
        failSF:cc.SpriteFrame,
        jumpAu:cc.AudioClip
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.life = 10;
        this.xSpeed = 0; // 水平方向速度
        this.ySpeed = 0; // 垂直方向速度
        this.bJump = false;
        this.gravity = 980, // 重力加速度
        this.accel = 250, // 水平方向加速度
        // 左右加速度开关
        this.accLeft = false;
        this.accRight = false;
        this.bDrop = false;

        this.setInputControl();
        this.outOfControl = false;

    },

    start () {
        
    },

    setInputControl: function () {
        var self = this;
        // 添加键盘事件监听
        // 有按键按下时，判断是否是我们指定的方向控制键，并设置向对应方向加速
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event){
            switch(event.keyCode) {
                case cc.KEY.a:
                    self.node.scaleX = 1;
                    self.accLeft = true;
                    break;
                case cc.KEY.d:
                    self.node.scaleX = -1;
                    self.accRight = true;
                    break;
            }
        });

        // 松开按键时，停止向该方向的加速
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, function (event){
            switch(event.keyCode) {
                case cc.KEY.a:
                    self.accLeft = false;
                    break;
                case cc.KEY.d:
                    self.accRight = false;
                    break;
            }
        });
    },

    jump(bStep, type) {
        switch (type) {
            case 0:
            case 1:
            case 2:
            case 4:
                {
                    if (bStep) break;
                    this.life += 1;
                    this.life = Math.min(10, this.life);
                    this.node.color = cc.color(255, 255, 255);
                    break;
                }
            case 3:
                {
                    this.life -= 3;
                    this.life = Math.max(0, this.life);
                    this.node.runAction(
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
                    break;
                }

        }

        if (this.life == 0) {
            this.game.getComponent('game').gameOver();
            return;
        } else {
            this.game.getComponent('game').changeLife(this.life);
        }

        let self = this;
        this.node.zIndex = 0;
        this.bJump = true;
        self.getComponent(cc.Sprite).spriteFrame = self.caiSF;
        self.gravity = type != 4 ? 0 : 100;
        self.ySpeed = 0;
        self.outOfControl = true;
        this.node.runAction(
            cc.sequence(
                cc.delayTime(0.1),
                cc.callFunc(
                    function(){
                        if (self.life == 0) return;
                        self.getComponent(cc.Sprite).spriteFrame = self.jumpSF;
                        if (type == 2) {
                            self.ySpeed = 700;
                        } else if (type == 4) {
                            self.ySpeed = 1000;
                        } else {
                            self.ySpeed = 800;
                        }
                        self.gravity = 980;
                        self.outOfControl = false;
                        co.playJump(self.jumpAu);
                    }
                ),
                cc.delayTime(0.1),
                cc.callFunc(
                    function() {
                        self.node.zIndex = 1;
                        self.bJump = false;
                    }
                )
            )
        )
    },

    changeState(state) {
        if (state == 0) {
            this.getComponent(cc.Sprite).spriteFrame = this.jumpSF;
        } else if (state == 1) {
            this.getComponent(cc.Sprite).spriteFrame = this.caiSF;
        } else if (state == 2) {
            this.getComponent(cc.Sprite).spriteFrame = this.failSF;
        }
    },

    update (dt) {
        if (this.game.getComponent('game').pause) return;
        if (this.outOfControl) {
            this.xSpeed = 0;
        } else {
            if (this.accLeft) {
                this.xSpeed = -this.accel;
            } else if (this.accRight) {
                this.xSpeed = this.accel;
            } else {
                this.xSpeed = 0;
            }
        }
        this.ySpeed -= this.gravity * dt;
        this.node.y += this.ySpeed * dt;
        this.node.x += this.xSpeed * dt;
        let g_size = this.game.getContentSize();
        let h_size = this.node.getContentSize();
        if (this.node.x < 0) this.node.x = Math.max(-g_size.width / 2 + h_size.width / 2 + 29 , this.node.x);
        if (this.node.x > 0) this.node.x = Math.min(g_size.width / 2 - h_size.width / 2 - 29, this.node.x);
        this.bDrop = this.ySpeed < 0;
    },
});
