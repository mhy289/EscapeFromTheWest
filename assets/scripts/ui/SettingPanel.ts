import { _decorator, Component, Slider } from 'cc';
import { AudioManager } from '../common/AudioManager';

const { ccclass } = _decorator;

@ccclass('SettingPanel')
export class SettingPanel extends Component {

    // 关闭设置框（按钮点击）
    onClickClose () {
        AudioManager.instance.playSFX(); // 播放点击音效
        this.node.active = false;
    }

    // BGM 音量调节（Slider 事件）
    onBGMChange (slider: Slider) {
        AudioManager.instance.setBGMVolume(slider.progress);
    }

    // SFX 音量调节（Slider 事件）
    onSFXChange (slider: Slider) {
        AudioManager.instance.setSFXVolume(slider.progress);
    }

    onClickTestSFX () {
    AudioManager.instance.playSFX();
    }

}
