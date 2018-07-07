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
        sv:cc.ScrollView,
        content: cc.Node,
        rankItem: cc.Prefab,
        loading:cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.removeChild();
        window.wx.onMessage(data => {
            if (data.messageType == 0) {
                this.removeChild();
            } else if (data.messageType == 1) { // 提交得分
                this.submit(data.MAIN_MENU_NUM, data.score);
            } else if (data.messageType == 2) { // 获取好友排行榜
                this.fetchFriendData(data.MAIN_MENU_NUM);
            } else if (data.messageType == 3) {
                this.fetchGroupData(data.MAIN_MENU_NUM, data.shareTicket);
            }
        });
    },

    submit(MAIN_MENU_NUM, score) {
        window.wx.getUserCloudStorage({
            keyList: [MAIN_MENU_NUM],
                success: (getres) => {
                    console.log('getUserCloudStorage', 'success', getres)
                    if (getres.KVDataList.length != 0) {
                        if (parseFloat(getres.KVDataList[0].value) > score) {
                            return;
                        }
                    }
                    // 对用户托管数据进行写数据操作
                    window.wx.setUserCloudStorage({
                        KVDataList: [{key: MAIN_MENU_NUM, value: "" + score}],
                        success: (res) => {
                            console.log('setUserCloudStorage', 'success', res)
                        },
                        fail: (res) => {
                            console.log('setUserCloudStorage', 'fail')
                        },
                        complete: (res) => {
                            console.log('setUserCloudStorage', 'ok')
                        }
                    });
                },
                fail: (res) => {
                    console.log('getUserCloudStorage', 'fail')
                },
                complete: (res) => {
                    console.log('getUserCloudStorage', 'ok')
                }
        });
    },

    fetchGroupData(MAIN_MENU_NUM, shareTicket) {
        this.removeChild();
        this.sv.node.active = true;
        wx.getGroupCloudStorage({
            shareTicket: shareTicket,
            keyList: [MAIN_MENU_NUM],
            success: res => {
                console.log("wx.getGroupCloudStorage success", res);
                let data = res.data;
                data.sort((a, b) => {
                    if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                        return 0;
                    }
                    if (a.KVDataList.length == 0) {
                        return 1;
                    }
                    if (b.KVDataList.length == 0) {
                        return -1;
                    }
                    return b.KVDataList[0].value - a.KVDataList[0].value;
                });
                for (let i = 0; i < data.length; i++) {
                    var playerInfo = data[i];
                    var item = cc.instantiate(this.rankItem);
                    item.getComponent('rankItem').init((i + 1), playerInfo);
                    this.content.addChild(item);
                }
                this.loading.active = false;
            },
            fail: (res) => {
                console.log("wx.getFriendCloudStorage fail", res);
                this.loading.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
            }
        });
    },

    fetchFriendData(MAIN_MENU_NUM) {
        this.removeChild();
        this.sv.node.active = true;
        window.wx.getFriendCloudStorage({
            keyList: [MAIN_MENU_NUM],
            success: (res) => {
                console.log('getFriendCloudStorage', 'success', res);
                let data = res.data;
                data.sort((a, b) => {
                    if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                        return 0;
                    }
                    if (a.KVDataList.length == 0) {
                        return 1;
                    }
                    if (b.KVDataList.length == 0) {
                        return -1;
                    }
                    return b.KVDataList[0].value - a.KVDataList[0].value;
                });
                for (let i = 0; i < data.length; i++) {
                    var playerInfo = data[i];
                    var item = cc.instantiate(this.rankItem);
                    item.getComponent('rankItem').init((i + 1), playerInfo);
                    this.content.addChild(item);
                }
                this.loading.active = false;
            },
            fail: (res) => {
                console.log("wx.getFriendCloudStorage fail", res);
                this.loading.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
            }
        });
    },

    removeChild() {
        this.sv.node.active = false;
        this.content.removeAllChildren();
        this.loading.getComponent(cc.Label).string = "玩命加载中...";
        this.loading.active = true;
    },

    // update (dt) {},
});
