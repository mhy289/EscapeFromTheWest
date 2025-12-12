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
        this.btnLogin.interactable = false;
        cc.director.preloadScene(this.sceneName, this.prloadSceneCallback.bind(this));
    }

    start() {

    }

    btnLoginClick(e:cc.Event, custom:string){
        cc.director.loadScene(this.sceneName, this.loadSceneCallback);
    }

    prloadSceneCallback(){
        cc.log("预加载场景完成");
        this.btnLogin.interactable = true;
    }

    loadSceneCallback(){
        cc.log("加载场景完成");
    }

    update(deltaTime: number) {
        
    }
}


