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
        hero:cc.Node,
        camera:cc.Node,
        floorLabel:cc.Label,
        normalPb:cc.Prefab,
        blinkPb:cc.Prefab,
        cloudPb:cc.Prefab,
        spikesPb:cc.Prefab,
        springPb:cc.Prefab,
        lifes:[cc.Node],
        tipsNode:cc.Node,
        tipsLabel:cc.Label,
        clickAu:cc.AudioClip,
        gameoverAu:cc.AudioClip
    },

    // LIFE-CYCLE CALLBACKS:

    _touchStart(event) {
        let hero = this.hero.getComponent('hero');
        if (this.pause) {
            hero.accLeft = false;
            hero.accRight = false;
            return;
        }
        let pos = this.node.parent.convertToNodeSpaceAR(event.getLocation());
        if (pos.x < 0) {
            this.hero.scaleX = 1;
            hero.accLeft = true;
            hero.accRight = false;
        } else {
            this.hero.scaleX = -1;
            hero.accRight = true;
            hero.accLeft = false;
        }
    },

    _touchEnd(event) {
        if (this.pause) return;
        let hero = this.hero.getComponent('hero');
        hero.accLeft = false;
        hero.accRight = false;
    },

    onDestroy() {
        this.node.parent.off(cc.Node.EventType.TOUCH_START, this._touchStart, this);
        this.node.parent.off(cc.Node.EventType.TOUCH_END, this._touchEnd, this);
        this.normalPool.clear();
        this.blinkPool.clear();
        this.cloudPool.clear();
        this.spikesPool.clear();
        this.springPool.clear();
    },

    onLoad () {
        this.node.parent.on(cc.Node.EventType.TOUCH_START, this._touchStart, this);
        this.node.parent.on(cc.Node.EventType.TOUCH_END, this._touchEnd, this);
        this.pause = true;
        this.hero.zIndex = 1;
        this.floor = 0;
        this.upSpeed = 50;
        this.stones = [];
        this.initPool();
        this.startGame();
        this.visibleSize = cc.view.getVisibleSize();
        let i = 0;
        while (i < 20) {
            i++;
            let last = null;
            if (this.stones.length > 0) {
                last = this.stones[this.stones.length - 1];
            }
            this.createStone(last);
        }
    },

    refreshStone() {
        for (var i = this.stones.length - 1; i >= 0; i--) {
            let stone = this.stones[i]
            if (this.camera.y - stone.y > this.visibleSize.height / 2 + 200) {
                // 移除
                this.stones.splice(i, 1);
                stone.parent = null;
                let type = stone.getComponent('stone').type;
                switch(type) {
                    case 0:
                        this.normalPool.put(stone);
                        break;
                    case 1:
                        this.blinkPool.put(stone);
                        break;
                    case 2:
                        this.cloudPool.put(stone);
                        break;
                    case 3:
                        this.spikesPool.put(stone);
                        break;
                    case 4:
                        this.springPool.put(stone);
                }
            }
        }
        while (i < 5) {
            i++;
            let last = null;
            if (this.stones.length > 0) {
                last = this.stones[this.stones.length - 1];
            }
            this.createStone(last);
        }
    },

    start () {
        
    },

    startGame() {
        this.createStone();
        let first = this.stones[0];
        this.hero.x = first.x;
        this.hero.y = first.y + 80;
        this.pause = false;
    },

    initPool(){
        let initCount = 15;
        this.normalPool = new cc.NodePool();
        for (let i = 0; i < initCount; i++) {
            let stone = cc.instantiate(this.normalPb);
            this.normalPool.put(stone);
        }

        this.blinkPool = new cc.NodePool();
        for (let i = 0; i < initCount; i++) {
            let stone = cc.instantiate(this.blinkPb);
            this.blinkPool.put(stone);
        }

        this.cloudPool = new cc.NodePool();
        for (let i = 0; i < initCount; i++) {
            let stone = cc.instantiate(this.cloudPb);
            this.cloudPool.put(stone);
        }

        this.spikesPool = new cc.NodePool();
        for (let i = 0; i < initCount; i++) {
            let stone = cc.instantiate(this.spikesPb);
            this.spikesPool.put(stone);
        }

        this.springPool = new cc.NodePool();
        for (let i = 0; i < initCount; i++) {
            let stone = cc.instantiate(this.springPb);
            this.springPool.put(stone);
        }
    },

    createStone(last) {
        let size = this.node.getContentSize();
        let ly = -size.height / 2;
        let lx = 0;
        let floor = 0;
        if (last) {
            ly = last.y;
            floor = last.getComponent('stone').floor;
        }
        let x = (Math.random() - 0.5) * (size.width - 185);
        let y = ly + 100;
        let weight = [0.7, 0.8, 0.9, 0.95, 1];
        if (floor == 0) {
            weight = [1, 1, 1, 1, 1];
        } else if (floor < 10) {
            weight = [0.7, 0.8, 0.9, 0.95, 1];
        } else if (floor < 20) {
            weight = [0.5, 0.7, 0.85, 0.96, 1];
        } else if (floor < 30) {
            weight = [0.4, 0.65, 0.8, 0.97, 1];
        } else if (floor < 40) {
            weight = [0.4, 0.65, 0.75, 0.98, 1];
        } else if (floor < 50) {
            weight = [0.3, 0.45, 0.70, 0.99, 1];
        } else {
            weight = [0.3, 0.45, 0.70, 0.99, 1];
            let f = Math.floor((floor - 60) / 10);
            weight[1] -= 0.005 * f;
            weight[1] = Math.max(weight[1], 0.40);
            weight[2] -= 0.01 * f;
            weight[2] = Math.max(weight[2], 0.60);
        }
        let rand = Math.random();
        let stone;
        for (let i = 0; i < weight.length; i++) {
            if (rand < weight[i]) {
                switch(i) {
                    case 0:
                        stone = this.createNormal();
                        break;
                    case 1:
                        stone = this.createBlink();
                        break;
                    case 2:
                        stone = this.createCloud();
                        break;
                    case 3:
                        stone = this.createSpikes();
                        break;
                    case 4:
                        stone = this.createSpring();
                        break;
                }
                break;
            }
        }
        stone.getComponent('stone').init(this, floor + 1, cc.p(x, y));
        stone.parent = this.hero.parent;
        stone.opacity = 255;
        stone.zIndex = 1;
        this.stones.push(stone);
    },

    createNormal(){
        let stone = null;
        if (this.normalPool.size() > 0) {
            stone = this.normalPool.get();
        } else {
            stone = cc.instantiate(this.normalPb);
        }
        return stone;
    },
    createBlink(){
        let stone = null;
        if (this.blinkPool.size() > 0) {
            stone = this.blinkPool.get();
        } else {
            stone = cc.instantiate(this.blinkPb);
        }
        return stone;
    },
    createCloud(){
        let stone = null;
        if (this.cloudPool.size() > 0) {
            stone = this.cloudPool.get();
        } else {
            stone = cc.instantiate(this.cloudPb);
        }
        return stone;
    },
    createSpikes(){
        let stone = null;
        if (this.spikesPool.size() > 0) {
            stone = this.spikesPool.get();
        } else {
            stone = cc.instantiate(this.spikesPb);
        }
        return stone;
    },
    createSpring(){
        let stone = null;
        if (this.springPool.size() > 0) {
            stone = this.springPool.get();
        } else {
            stone = cc.instantiate(this.springPb);
        }
        return stone;
    },

    changeFloor(floor) {
        let last = this.floor;
        this.floor = Math.max(floor, this.floor);
        this.floorLabel.string = this.floor;
        this.upSpeed += Math.min(Math.floor((this.floor - last) / 10 * 5), 60);
    },

    gameOver(){
        this.pause = true;
        this.hero.getComponent('hero').changeState(2);
        co.playAudio(this.gameoverAu);
        this.changeLife(0);
        this.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function(){
            this.tipsNode.active = true;
            this.tipsLabel.string = '' + this.floor;
        }.bind(this))));
        if (CC_WECHATGAME) {
            window.wx.postMessage({
                messageType: 1,
                MAIN_MENU_NUM: 'jump',
                score: this.floor
            });
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
    },

    changeLife(life) {
        let lifes = this.lifes;
        for (let i = 0; i < lifes.length; i++) {
            let n = lifes[i];
            n.active = i < life;
        }
    },

    closeTips(){
        co.playAudio(this.clickAu);
        this.tipsNode.active = false;
    },

    back(){
        co.playAudio(this.clickAu);
        cc.director.loadScene('main');
    },

    restart() {
        co.playAudio(this.clickAu);
        cc.director.loadScene('game');
    },

    share() {
        co.playAudio(this.clickAu);
        let self = this;
        let str = '我达到了' + this.floor + '层，快来挑战我';
        if (CC_WECHATGAME) {
            wx.shareAppMessage({
                title: str,
                imageUrl: co.getSharePicPath()
            });
        }
    },

    update (dt) {
        if (this.pause) return;
        let last = this.stones[this.stones.length - 1];
        if (last.y - this.camera.y < this.visibleSize.height / 2 + 200) {
            this.refreshStone();
        }
    },
});
