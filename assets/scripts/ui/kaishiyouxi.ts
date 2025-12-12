import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('kaishiyouxi')
export class kaishiyouxi extends Component {
    
    @property
    sceneName: string = '';
    
    @property(
        {
            type : cc.Button
        })
    btnLogin: cc.Button = null;

    onLoad () {
        cc.log("onLoad");
        this.btnLogin.interactable = false;
        cc.director.preloadScene(this.sceneName, this.prloadSceneCallback.bind(this));
    }

    start() {

    }

    //登录按钮点击事件
    btnLoginClick(e:cc.Event, custom:string){
        cc.log("按钮点击事件", custom);
        cc.director.loadScene(this.sceneName, this.loadSceneCallback);
    }

    //预加载场景完成回调
    prloadSceneCallback(){
        cc.log("预加载场景完成");
        this.btnLogin.interactable = true;
    }

    //加载场景完成回调
    loadSceneCallback(){
        cc.log("加载场景完成");
    }

    update(deltaTime: number) {
        
    }
}


