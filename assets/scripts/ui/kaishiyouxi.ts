import { _decorator, Component, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('kaishiyouxi')
export class kaishiyouxi extends Component {

    @property({
        tooltip: '要进入的预加载场景名称'
    })
    sceneName: string = 'PreloadScene';

    // 开始按钮点击事件（在编辑器中绑定）
    btnLoginClick () {
        director.loadScene(
            this.sceneName,
            this.loadSceneCallback.bind(this)
        );
    }

    // 场景加载完成回调
    loadSceneCallback () {
        console.log('场景加载完成');
    }
}
