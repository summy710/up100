var common = {
    bShake:true,
    bSound:true,

    getSoundStatus() {
        if (CC_WECHATGAME) {
            let data = wx.getStorageSync('sound');
            if (data != undefined && data != null) this.bSound = data === 'true';
            return this.bSound;
        }
        return this.bSound;
    },

    changeSoundStatus(func) {
        this.bSound = !this.bSound;
        if (CC_WECHATGAME) {
            wx.setStorageSync('sound', '' + this.bSound);
        }
        if (func) func(this.bSound);
        if (this.bSound) {
            this.playBGM();
        } else {
            this.stopBGM();
        }
    },

    getShakeStatus() {
        if (CC_WECHATGAME) {
            let data = wx.getStorageSync('shake');
            if (data != undefined && data != null) this.bShake = data === 'true';
            return this.bShake;
        }
        return this.bShake;
    },

    changeShakeStatus(func) {
        this.bShake = !this.bShake;
        if (CC_WECHATGAME) {
            wx.setStorageSync('shake', '' + this.bShake);
        }
        if (func) func(this.bShake);
    },

    getSharePicPath() {
        return 'share.png';
    },

    showTip (node, str) {
        cc.loader.loadRes('/prefab/tips', cc.Prefab, function(err, prefab) {
            if (err) return;
            let n = cc.instantiate(prefab);
            n.parent = node;
            n.zIndex = 999;
            n.getComponent('tips').init(str);
        });
    },

    playAudio(audioClip) {
        if (!this.bSound) return;
        cc.audioEngine.play(audioClip, false, 1);
    },

    playJump(audioClip) {
        if (!this.bSound) return;
        if (CC_WECHATGAME) {
            this.context = wx.createInnerAudioContext();
            this.context.autoplay = true;
            this.context.loop = false;
            this.context.src = 'jump.mp3';
            this.context.play();
        } else {
            cc.audioEngine.play(audioClip, false, 1);
        }
    },

    playBGM() {
        if (this.bPlay || !this.bSound) return;
        this.bPlay = true;
        if (CC_WECHATGAME) {
            this.music = wx.createInnerAudioContext();
            this.music.autoplay = true;
            this.music.loop = true;
            this.music.src = 'BGM.mp3';
            this.music.play();
        } else {
            cc.loader.load(cc.url.raw('resources/audio/BGM.mp3'), function(err, clip) {
                this.bgm = cc.audioEngine.play(clip, true, 1);
            }.bind(this));
        }
    },

    stopBGM() {
        this.bPlay = false;
        if (CC_WECHATGAME) {
            this.music.stop();
        } else {
            cc.audioEngine.stop(this.bgm);
        }
    }
};

module.exports = common;