import { _decorator, Component, Node, Label, Button, input, Input, Vec3 } from 'cc';
import { PlayerShooter } from '../player/shot.ts';
import { UIJoyStick } from './moveUIJoyStick.ts';
const { ccclass, property } = _decorator;

@ccclass('GameUI')
export class GameUI extends Component {
    @property({ type: Node }) fireButton: Node = null;
    @property({ type: Node }) reloadButton: Node = null;
    @property({ type: Label }) ammoLabel: Label = null;
    @property({ type: Label }) healthLabel: Label = null;
    @property({ type: Node }) joystickNode: Node = null;
    @property({ type: Node }) keyboardUI: Node = null;
    @property({ type: Node }) virtualJoystickUI: Node = null;

    @property({ type: PlayerShooter }) playerShooter: PlayerShooter = null;
    private joystick: UIJoyStick = null;
    private ammoUpdateInterval: number = 0;

    protected onLoad(): void {
        console.log('🔥 GameUI: onLoad() 被调用，组件开始初始化');
        
        // 获取玩家射击组件
        if (!this.playerShooter) {
            console.log('🔥 GameUI: playerShooter未设置，尝试自动查找...');
            const player = this.node.parent?.getChildByName('Player');
            if (player) {
                this.playerShooter = player.getComponent(PlayerShooter);
                console.log('🔥 GameUI: 找到PlayerShooter组件:', this.playerShooter ? '成功' : '失败');
            } else {
                console.error('🔥 GameUI: 未找到Player节点');
            }
        } else {
            console.log('🔥 GameUI: playerShooter已在检查器中设置');
        }

        if (!this.joystickNode) return;
        this.joystick = this.joystickNode.getComponent(UIJoyStick);

        this.setupUIEvents();
        this.setupUIMode();
    }

    private setupUIEvents(): void {
        // 设置开火按钮
        if (this.fireButton) {
            console.log('🔥 GameUI: 设置开火按钮事件监听器');
            this.fireButton.on(Input.EventType.TOUCH_START, this.onFireButtonPressed, this);
            this.fireButton.on(Input.EventType.TOUCH_END, this.onFireButtonReleased, this);
            this.fireButton.on(Input.EventType.TOUCH_CANCEL, this.onFireButtonReleased, this);
        }

        // 设置换弹按钮
        if (this.reloadButton) {
            console.log('🔥 GameUI: 设置换弹按钮事件监听器');
            this.reloadButton.on(Input.EventType.TOUCH_START, this.onReloadButtonPressed, this);
        }
    }

    private setupUIMode(): void {
        const useVirtualJoystick = this.playerShooter ? this.playerShooter['useVirtualJoystick'] : false;
        this.showVirtualJoystickUI(useVirtualJoystick);
        this.showKeyboardUI(!useVirtualJoystick);
    }

    private showKeyboardUI(show: boolean): void {
        if (this.keyboardUI) this.keyboardUI.active = show;
    }

    private showVirtualJoystickUI(show: boolean): void {
        if (this.virtualJoystickUI) this.virtualJoystickUI.active = show;
        if (this.joystickNode) this.joystickNode.active = show;
        if (this.fireButton) this.fireButton.active = show;
        if (this.reloadButton) this.reloadButton.active = show;
    }

    protected update(deltaTime: number): void {
        this.ammoUpdateInterval += deltaTime;
        if (this.ammoUpdateInterval >= 0.1) {
            this.updateAmmoDisplay();
            this.ammoUpdateInterval = 0;
        }

        // 移动摇杆不再控制射击方向，移动摇杆只影响移动
        // 射击方向由PlayerAim组件根据右摇杆输入控制
        // 这里不需要任何移动摇杆相关的射击逻辑
    }

    private updateAmmoDisplay(): void {
        if (this.ammoLabel && this.playerShooter) {
            const ammoInfo = this.playerShooter.getAmmoInfo();
            this.ammoLabel.string = ammoInfo.isReloading ? '换弹中...' : `${ammoInfo.current}/${ammoInfo.max}`;
        }
    }

    public updateHealthDisplay(current: number, max: number): void {
        if (this.healthLabel) this.healthLabel.string = `${current}/${max}`;
    }

    private onFireButtonPressed(): void {
        console.log('🔥 GameUI: 射击按钮按下 - 设置fireKeyPressed=true');
        if (this.playerShooter) {
            this.playerShooter['fireKeyPressed'] = true;
            console.log('🔥 GameUI: 成功设置fireKeyPressed=true');
        } else {
            console.error('🔥 GameUI: playerShooter为null，无法设置fireKeyPressed');
        }
    }

    private onFireButtonReleased(): void {
        console.log('🔥 GameUI: 射击按钮释放 - 设置fireKeyPressed=false');
        if (this.playerShooter) {
            this.playerShooter['fireKeyPressed'] = false;
            console.log('🔥 GameUI: 成功设置fireKeyPressed=false');
        } else {
            console.error('🔥 GameUI: playerShooter为null，无法设置fireKeyPressed');
        }
    }

    private onReloadButtonPressed(): void {
        if (this.playerShooter) {
            this.playerShooter['tryReload']();
        }
    }

    protected onDestroy(): void {
        // 清理所有事件监听器
        if (this.fireButton) {
            this.fireButton.off(Input.EventType.TOUCH_START, this.onFireButtonPressed, this);
            this.fireButton.off(Input.EventType.TOUCH_END, this.onFireButtonReleased, this);
            this.fireButton.off(Input.EventType.TOUCH_CANCEL, this.onFireButtonReleased, this);
        }
        
        if (this.reloadButton) {
            this.reloadButton.off(Input.EventType.TOUCH_START, this.onReloadButtonPressed, this);
        }
        
        console.log('GameUI: 事件监听器已清理');
    }
}