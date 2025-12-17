import { _decorator, Component, Node, Label, Button, input, Input } from 'cc';
import { PlayerShooter } from '../player/shot';
import { VirtualJoystick } from './VirtualJoystick';
import { DualJoystick } from './DualJoystick';
const { ccclass, property } = _decorator;

@ccclass('GameUI')
export class GameUI extends Component {
    // UI元素引用
    @property(Node)
    fireButton: Node = null;

    @property(Node)
    reloadButton: Node = null;

    @property(Label)
    ammoLabel: Label = null;

    @property(Label)
    healthLabel: Label = null;

    @property(Node)
    joystickNode: Node = null;

    @property(Node)
    dualJoystickNode: Node = null; // 双摇杆节点

    @property(Node)
    keyboardUI: Node = null; // 键盘模式UI

    @property(Node)
    virtualJoystickUI: Node = null; // 虚拟摇杆模式UI

    // 组件引用
    @property(PlayerShooter)
    playerShooter: PlayerShooter = null;

    private virtualJoystick: VirtualJoystick = null;
    private dualJoystick: DualJoystick = null;
    private ammoUpdateInterval: number = 0;

    protected onLoad(): void {
        // 获取组件引用
        this.getComponentReferences();
        
        // 设置UI事件
        this.setupUIEvents();
        
        // 初始化摇杆系统
        this.initializeJoystickSystem();

        // 根据控制模式显示相应UI
        this.setupUIMode();
    }

    protected start(): void {
        console.log('GameUI initialized');
        this.updateUI();
    }

    protected update(deltaTime: number): void {
        // 定期更新弹药显示
        this.ammoUpdateInterval += deltaTime;
        if (this.ammoUpdateInterval >= 0.1) { // 每0.1秒更新一次
            this.updateAmmoDisplay();
            this.ammoUpdateInterval = 0;
        }
    }

    private getComponentReferences(): void {
        // 如果没有在编辑器中设置，尝试自动获取
        if (!this.fireButton) {
            this.fireButton = this.node.getChildByName('FireButton');
        }
        
        if (!this.reloadButton) {
            this.reloadButton = this.node.getChildByName('ReloadButton');
        }
        
        if (!this.ammoLabel) {
            const ammoNode = this.node.getChildByName('AmmoLabel');
            if (ammoNode) {
                this.ammoLabel = ammoNode.getComponent(Label);
            }
        }
        
        if (!this.healthLabel) {
            const healthNode = this.node.getChildByName('HealthLabel');
            if (healthNode) {
                this.healthLabel = healthNode.getComponent(Label);
            }
        }
        
        if (!this.joystickNode) {
            this.joystickNode = this.node.getChildByName('VirtualJoystick');
        }

        if (!this.dualJoystickNode) {
            this.dualJoystickNode = this.node.getChildByName('DualJoystick');
        }

        if (!this.keyboardUI) {
            this.keyboardUI = this.node.getChildByName('KeyboardUI');
        }

        if (!this.virtualJoystickUI) {
            this.virtualJoystickUI = this.node.getChildByName('VirtualJoystickUI');
        }

        // 获取玩家射击组件
        if (!this.playerShooter) {
            const player = this.node.parent?.getChildByName('Player');
            if (player) {
                this.playerShooter = player.getComponent(PlayerShooter);
            }
        }
    }

    private setupUIEvents(): void {
        // 设置开火按钮
        if (this.fireButton) {
            this.fireButton.on(Input.EventType.TOUCH_START, this.onFireButtonPressed, this);
            this.fireButton.on(Input.EventType.TOUCH_END, this.onFireButtonReleased, this);
            this.fireButton.on(Input.EventType.TOUCH_CANCEL, this.onFireButtonReleased, this);
        }

        // 设置换弹按钮
        if (this.reloadButton) {
            this.reloadButton.on(Input.EventType.TOUCH_START, this.onReloadButtonPressed, this);
        }
    }

    private initializeJoystickSystem(): void {
        if (this.joystickNode) {
            this.virtualJoystick = this.joystickNode.getComponent(VirtualJoystick);
        }

        if (this.dualJoystickNode) {
            this.dualJoystick = this.dualJoystickNode.getComponent(DualJoystick);
        }

        // 设置摇杆回调（在setupUIMode中根据模式具体设置）
    }

    private setupUIMode(): void {
        if (!this.playerShooter) return;

        const useVirtualJoystick = this.playerShooter['useVirtualJoystick'];

        if (useVirtualJoystick) {
            // 虚拟摇杆模式
            this.showVirtualJoystickUI(true);
            this.showKeyboardUI(false);

            // 设置双摇杆回调
            if (this.dualJoystick && this.playerShooter) {
                this.dualJoystick.setOnRightMoveCallback((data: any) => {
                    this.playerShooter.setJoystickAngle(data.angle);
                });
            } else if (this.virtualJoystick && this.playerShooter) {
                // 单摇杆模式兼容
                this.virtualJoystick.setOnMoveCallback((angle: number, distance: number) => {
                    this.playerShooter.setJoystickAngle(angle);
                });
            }
        } else {
            // 键盘鼠标模式
            this.showVirtualJoystickUI(false);
            this.showKeyboardUI(true);
        }
    }

    private showKeyboardUI(show: boolean): void {
        if (this.keyboardUI) {
            this.keyboardUI.active = show;
        }
    }

    private showVirtualJoystickUI(show: boolean): void {
        if (this.virtualJoystickUI) {
            this.virtualJoystickUI.active = show;
        }
        if (this.joystickNode) {
            this.joystickNode.active = show;
        }
        if (this.dualJoystickNode) {
            this.dualJoystickNode.active = show;
        }
        if (this.fireButton) {
            this.fireButton.active = show;
        }
        if (this.reloadButton) {
            this.reloadButton.active = show;
        }
    }

    private onFireButtonPressed(): void {
        if (this.playerShooter) {
            // 直接调用射击器的按键处理
            // 或者通过公共方法触发射击
            this.playerShooter['fireKeyPressed'] = true;
        }
    }

    private onFireButtonReleased(): void {
        if (this.playerShooter) {
            this.playerShooter['fireKeyPressed'] = false;
        }
    }

    private onReloadButtonPressed(): void {
        if (this.playerShooter) {
            // 触发换弹
            this.playerShooter['tryReload']();
        }
    }

    private updateUI(): void {
        this.updateAmmoDisplay();
        this.updateHealthDisplay();
    }

    private updateAmmoDisplay(): void {
        if (this.ammoLabel && this.playerShooter) {
            const ammoInfo = this.playerShooter.getAmmoInfo();
            const ammoText = ammoInfo.isReloading ? 
                `换弹中...` : 
                `${ammoInfo.current}/${ammoInfo.max}`;
            
            this.ammoLabel.string = ammoText;
        }
    }

    private updateHealthDisplay(): void {
        if (this.healthLabel) {
            // 这里可以从玩家控制器获取生命值信息
            // const healthInfo = this.playerController.getHealthInfo();
            // this.healthLabel.string = `${healthInfo.current}/${healthInfo.max}`;
        }
    }

    // 公共方法：更新生命值显示
    public updateHealthDisplay(current: number, max: number): void {
        if (this.healthLabel) {
            this.healthLabel.string = `${current}/${max}`;
        }
    }

    // 公共方法：显示/隐藏UI元素
    public showFireButton(show: boolean): void {
        if (this.fireButton) {
            this.fireButton.active = show;
        }
    }

    public showReloadButton(show: boolean): void {
        if (this.reloadButton) {
            this.reloadButton.active = show;
        }
    }

    public showJoystick(show: boolean): void {
        if (this.joystickNode) {
            this.joystickNode.active = show;
        }
    }

    // 设置玩家射击组件引用
    public setPlayerShooter(shooter: PlayerShooter): void {
        this.playerShooter = shooter;
        
        // 重新初始化摇杆回调
        if (this.virtualJoystick && shooter) {
            this.virtualJoystick.setOnMoveCallback((angle: number, distance: number) => {
                shooter.setJoystickAngle(angle);
            });
        }
    }

    protected onDestroy(): void {
        // 清理事件监听
        if (this.fireButton) {
            this.fireButton.off(Input.EventType.TOUCH_START, this.onFireButtonPressed, this);
            this.fireButton.off(Input.EventType.TOUCH_END, this.onFireButtonReleased, this);
            this.fireButton.off(Input.EventType.TOUCH_CANCEL, this.onFireButtonReleased, this);
        }

        if (this.reloadButton) {
            this.reloadButton.off(Input.EventType.TOUCH_START, this.onReloadButtonPressed, this);
        }
    }
}