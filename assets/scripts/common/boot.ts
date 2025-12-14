import { _decorator, Component, director } from 'cc';
import { AudioManager } from './AudioManager';
const { ccclass } = _decorator;

@ccclass('Boot')
export class Boot extends Component {

    start () {
        // 播放背景音乐
        AudioManager.instance.playBGM();

        // 进入开始界面
        director.loadScene('kaishi');
    }
}
