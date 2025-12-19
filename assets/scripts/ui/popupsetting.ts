import { _decorator, Component, Node, Button } from 'cc';
import { AudioManager } from '../common/AudioManager.ts';
const { ccclass, property } = _decorator;

@ccclass('SimpleSetting')
export class SimpleSetting extends Component {

    @property(Node)
    settingPanel: Node = null; // 设置面板节点，初始设置 active = false

    @property(Button)
    btnOpen: Button = null;  // 点击按钮弹出设置面板

    onLoad() {
        // 确保面板隐藏
        if (this.settingPanel) this.settingPanel.active = false;

        // 按钮点击事件
        if (this.btnOpen) {
            this.btnOpen.node.on('click', () => {
                AudioManager.instance.playSFX(); // 播放点击音效
                if (this.settingPanel) this.settingPanel.active = true;
            });
        }
    }
}


