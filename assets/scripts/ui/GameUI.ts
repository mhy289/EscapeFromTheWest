/*
import { _decorator, Component, Node, Label, Button, input, Input } from 'cc';
import { PlayerShooter } from '../player/shot.ts';
import { VirtualJoystick } from './VirtualJoystick.ts';
import { DualJoystick } from './DualJoystick.ts';
const { ccclass, property } = _decorator;

@ccclass('GameUI')
export class GameUI extends Component {
    // UI元素引用
    @property({
        type: Node,
        tooltip: '开火按钮：虚拟摇杆模式下的开火按钮节点，用于触发射击（虚拟摇杆模式必需）'
    })
    fireButton: Node = null;

    @property({
        type: Node,
        tooltip: '换弹按钮：虚拟摇杆模式下的换弹按钮节点，用于触发换弹（虚拟摇杆模式必需）'
    })
    reloadButton: Node = null;

    @property({
        type: Label,
        tooltip: '弹药标签：显示当前弹药信息的文本标签，格式为"当前/最大"（推荐）'
    })
    ammoLabel: Label = null;

    @property({
        type: Label,
        tooltip: '生命值标签：显示当前生命值的文本标签，格式为"当前/最大"（推荐）'
    })
    healthLabel: Label = null;

    @property({
        type: Node,
        tooltip: '摇杆节点：单摇杆模式下的虚拟摇杆节点（可选，推荐使用DualJoystick）'
    })
    joystickNode: Node = null;

    @property({
        type: Node,
        tooltip: '双摇杆节点：虚拟摇杆模式下的双摇杆容器节点（虚拟摇杆模式推荐）'
    })
    dualJoystickNode: Node = null;

    @property({
        type: Node,
        tooltip: '键盘UI容器：键盘鼠标模式下的UI容器节点，包含弹药和生命值显示（键盘模式推荐）'
    })
    keyboardUI: Node = null;

    @property({
        type: Node,
        tooltip: '摇杆UI容器：虚拟摇杆模式下的UI容器节点，包含按钮、弹药、生命值和摇杆（虚拟摇杆模式推荐）'
    })
    virtualJoystickUI: Node = null;

    // 组件引用
    @property({
        type: PlayerShooter,
        tooltip: '玩家射击组件：玩家节点的PlayerShooter脚本，用于获取弹药信息和设置回调（必需）'
    })
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

            // 移除摇杆射击回调 - 移动摇杆不再控制射击方向
            // 射击方向现在由PlayerAim组件根据右摇杆输入控制
            if (this.dualJoystick) {
                // 双摇杆模式：右摇杆通过PlayerAim组件控制射击方向，不需要这里设置回调
                console.log('双摇杆模式：右摇杆通过PlayerAim组件控制射击方向');
            } else if (this.virtualJoystick) {
                // 单摇杆模式：左摇杆只控制移动，不控制射击
                console.log('单摇杆模式：左摇杆只控制移动');
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
        console.log('GameUI: 射击按钮按下 - 开始射击');
        if (this.playerShooter) {
            this.playerShooter['fireKeyPressed'] = true;
        }
    }

    private onFireButtonReleased(): void {
        console.log('GameUI: 射击按钮释放 - 停止射击');
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
        
        // 移除摇杆回调设置 - 移动摇杆不再控制射击方向
        // 射击方向现在由PlayerAim组件通过右摇杆控制
        console.log('GameUI: 玩家射击组件已设置，移动摇杆不再触发射击');
    }

    // 这个onDestroy方法被移除，使用下面的版本
}
    */

import { _decorator, Component, Node, Label, input, Input, Vec3 } from 'cc';
import { PlayerShooter } from '../player/shot.ts';
import { UIJoyStick } from './moveUIJoyStick.ts';
import { VirtualInput } from '../input/VirtualInput.ts';
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
        if (!this.joystickNode) return;
        this.joystick = this.joystickNode.getComponent(UIJoyStick);

        this.setupUIEvents();
        this.setupUIMode();
    }

    private setupUIEvents(): void {
        // 移除重复的事件监听器设置 - 保留原始的onFireButtonPressed方法调用
        // 事件监听器已在setupTouchControls中设置
        console.log('GameUI: setupUIEvents - 事件已在其他地方设置');
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
