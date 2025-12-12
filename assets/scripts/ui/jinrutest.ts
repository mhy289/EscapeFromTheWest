import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('jinrutest')
export class jinrutest extends Component {

    @property
    sceneName: string = '';

    @property({
        type: cc.Button
    })
    btnEnter: cc.Button = null;

    start() {

    }

    update(deltaTime: number) {
        
    }

    //点击进入
    onButtonClick(event: Event, customEventData: string) {
        cc.log("点击");
        //切换场景
        cc.director.loadScene(this.sceneName, this.loadSceneCallback);
    }
}


