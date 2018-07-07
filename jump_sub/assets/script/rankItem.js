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
        bg:cc.Sprite,
        rank:cc.Label,
        rankSp:cc.Sprite,
        avatar:cc.Sprite,
        nickname:cc.Label,
        score:cc.Label,
        rank1:cc.SpriteFrame,
        rank2:cc.SpriteFrame,
        rank3:cc.SpriteFrame,
        rankNum1:cc.SpriteFrame,
        rankNum2:cc.SpriteFrame,
        rankNum3:cc.SpriteFrame,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    init (rank, data) {
        let avatarUrl = data.avatarUrl;
        let nick = data.nickname;
        let score = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;
        if (rank <= 3) {
            this.rank.node.active = false;
            this.bg.spriteFrame = this['rank' + rank];
            this.rankSp.spriteFrame = this['rankNum' + rank];
        } else {
            this.rankSp.node.active = false;
            this.rank.string = '' + rank;
        }
        this.createImage(avatarUrl);
        this.avatar.node.setContentSize(75, 75);
        this.nickname.string = nick;
        this.score.string = score.toString();
    },

    createImage(avatarUrl) {
        try{
            let image = wx.createImage();
            image.onload = () => {
                try {
                    let texture = new cc.Texture2D();
                    texture.initWithElement(image);
                    texture.handleLoadedTexture();
                    this.avatar.spriteFrame = new cc.SpriteFrame(texture);
                    this.avatar.node.setContentSize(75, 75);
                } catch (e) {
                    cc.log(e);
                    this.avatar.node.active = false;
                }
            };
            image.src = avatarUrl;
        } catch (e) {
            cc.log(e);
            this.avatar.node.active = false;
        }
    }

    // update (dt) {},
});
