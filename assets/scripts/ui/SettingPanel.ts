import { _decorator, Component, Node, Slider } from 'cc';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('SettingPanel')
export class SettingPanel extends Component {

    @property(Node)
    panel: Node = null;

    @property(Slider)
    bgmSlider: Slider = null;

    @property(Slider)
    sfxSlider: Slider = null;

    onLoad () {
        this.node.active = false;

        // 初始化 Slider 值
        this.bgmSlider.progress = AudioManager.instance.getBGMVolume();
        this.sfxSlider.progress = AudioManager.instance.getSFXVolume();
    }

    /** 打开设置面板 */
    show() {
        this.node.active = true;
    }

    /** 关闭设置面板 */
    hide() {
        this.node.active = false;
    }

    /** 背景音乐音量变化 */
    onBGMChange(slider: Slider) {
        AudioManager.instance.setBGMVolume(slider.progress);
    }

    /** 音效音量变化 */
    onSFXChange(slider: Slider) {
        AudioManager.instance.setSFXVolume(slider.progress);
        AudioManager.instance.playSFX(); // 拖动时给试听反馈
    }
}
