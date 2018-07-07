// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
const co = require('Common');

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
        optionNode:cc.Node,
        soundCheck:cc.Node,
        shakeCheck:cc.Node,
        rankNode:cc.Node,
        ranksv:cc.Sprite,
        clickAu:cc.AudioClip,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.bAni = false;
        if (CC_WECHATGAME) {
            wx.updateShareMenu({
                withShareTicket:true,
            });
            this.tex = new cc.Texture2D();
            window.sharedCanvas.width = 720;
            window.sharedCanvas.height = 1280;
        }
        co.playBGM();
    },

    startGame() {
        if (this.bAni) return;
        this.bAni = true;
        co.playAudio(this.clickAu);
        cc.director.loadScene('game');
    },

    friendRank() {
        if (this.bAni) return;
        co.playAudio(this.clickAu);
        this.showRank();
        if (CC_WECHATGAME) {
            window.wx.postMessage({
                messageType:2,
                MAIN_MENU_NUM:"jump"
            });
        }
    },

    groupRank () {
        if (this.bAni) return;
        co.playAudio(this.clickAu);
        if (CC_WECHATGAME) {
            co.stopBGM();
            window.wx.shareAppMessage({
                title: '快来挑战你的极限',
                imageUrl: co.getSharePicPath(),
                success: (res) => {
                    co.playBGM();
                    if (res.shareTickets != undefined && res.shareTickets.length > 0) {
                        this.showRank();
                        window.wx.postMessage({
                            messageType: 3,
                            MAIN_MENU_NUM: "jump",
                            shareTicket: res.shareTickets[0]
                        });
                    }
                },
                fail:(res)=>{
                    co.playBGM();
                },
            });
        }
    },

    showRank() {
        this.rankNode.zIndex = 2;
        this.rankNode.active = true;
        this.refreshRank = true;
        this.bAni = true;
    },

    closeRank() {
        co.playAudio(this.clickAu);
        this.rankNode.active = false;
        this.refreshRank = false;
        this.bAni = false;
    },

    share () {
        if (this.bAni) return;
        co.playAudio(this.clickAu);
        if (CC_WECHATGAME) {
            co.stopBGM();
            let str = '快来挑战你的极限';
            wx.shareAppMessage({
                title: str,
                imageUrl: co.getSharePicPath()
            });
        }
    },

    option () {
        if (this.bAni) return;
        co.playAudio(this.clickAu);
        this.bAni = true;
        this.optionNode.active = true;
        this.soundCheck.active = co.getSoundStatus();
        this.shakeCheck.active = co.getShakeStatus();
    },

    optionClose() {
        this.bAni = false;
        co.playAudio(this.clickAu);
        this.optionNode.active = false;
    },

    soundClick() {
        let self = this;
        co.playAudio(this.clickAu);
        co.changeSoundStatus((b) => {
            self.soundCheck.active = b;
        });
    },

    shakeClick() {
        let self = this;
        co.playAudio(this.clickAu);
        co.changeShakeStatus((b) => {
            self.shakeCheck.active = b;
        });
    },


    update (dt) {
        if (this.refreshRank) {
            this._updateSubDomainCanvas(); // 刷新子域
        }
    },

        // 刷新子域的纹理
    _updateSubDomainCanvas() {
        if (CC_WECHATGAME) {
            if (window.sharedCanvas != undefined) {
                this.tex.initWithElement(window.sharedCanvas);
                this.tex.handleLoadedTexture();
                this.ranksv.spriteFrame = new cc.SpriteFrame(this.tex);
            }
        }
    },

    // update (dt) {},
});
