/*
import { _decorator, Component, Node } from 'cc';
import { PlayerShooter } from './shot';
import { VirtualJoystick } from '../ui/VirtualJoystick';
import { DualJoystick } from '../ui/DualJoystick';
import { move } from './move';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    // 组件引用
    @property({
        type: PlayerShooter,
        tooltip: '射击组件：玩家节点的PlayerShooter脚本组件，负责射击控制（必需）'
    })
    shooter: PlayerShooter = null;

    @property({
        type: move,
        tooltip: '移动组件：玩家节点的move脚本组件，负责角色移动（必需）'
    })
    mover: move = null;

    @property({
        type: VirtualJoystick,
        tooltip: '单摇杆组件：单摇杆模式下的虚拟摇杆控制器（可选，推荐使用DualJoystick）'
    })
    joystick: VirtualJoystick = null;

    @property({
        type: DualJoystick,
        tooltip: '双摇杆组件：虚拟摇杆模式下的双摇杆控制器，左摇杆移动+右摇杆朝向（虚拟摇杆模式推荐）'
    })
    dualJoystick: DualJoystick = null;

    // 玩家属性
    @property({
        tooltip: '最大生命值：角色的最大生命值，起始生命值将等于此值（默认：100）'
    })
    maxHealth: number = 100;

    private currentHealth: number = 100;

    protected onLoad(): void {
        // 获取组件引用（如果没有在编辑器中设置）
        this.getComponentReferences();
        
        // 初始化系统
        this.initializeSystems();
    }

    protected start(): void {
        console.log('PlayerController initialized');
        console.log(`Health: ${this.currentHealth}/${this.maxHealth}`);
    }

    private getComponentReferences(): void {
        if (!this.shooter) {
            this.shooter = this.node.getComponent(PlayerShooter);
        }
        
        if (!this.mover) {
            this.mover = this.node.getComponent(move);
        }

        if (!this.joystick) {
            // 尝试从父节点或场景中找到摇杆
            const joystickNode = this.node.parent?.getChildByName('VirtualJoystick');
            if (joystickNode) {
                this.joystick = joystickNode.getComponent(VirtualJoystick);
            }
        }

        if (!this.dualJoystick) {
            // 尝试找到双摇杆系统
            const dualJoystickNode = this.node.parent?.getChildByName('DualJoystick');
            if (dualJoystickNode) {
                this.dualJoystick = dualJoystickNode.getComponent(DualJoystick);
            }
        }
    }

    private initializeSystems(): void {
        // 初始化摇杆系统
        this.initializeJoystickSystems();

        // 初始化生命值
        this.currentHealth = this.maxHealth;
    }

    private initializeJoystickSystems(): void {
        // 检查使用的控制模式
        const useVirtualJoystick = this.shooter ? this.shooter['useVirtualJoystick'] : false;

        if (useVirtualJoystick) {
            // 虚拟摇杆模式
            if (this.dualJoystick) {
                // 设置右摇杆回调用于射击方向
                this.dualJoystick.setOnRightMoveCallback((data: any) => {
                    if (this.shooter) {
                        this.shooter.setJoystickAngle(data.angle);
                    }
                });
            } else if (this.joystick) {
                // 单摇杆模式（兼容性）
                this.joystick.setOnMoveCallback(this.onJoystickMove.bind(this));
                this.joystick.setOnEndCallback(this.onJoystickEnd.bind(this));
            }
        }
        // 键盘鼠标模式不需要设置摇杆回调
    }

    private onJoystickMove(angle: number, distance: number): void {
        // 更新射击方向（单摇杆模式）
        if (this.shooter) {
            this.shooter.setJoystickAngle(angle);
        }
    }

    private onJoystickEnd(): void {
        // 摇杆释放时的处理
    }

    // 受到伤害
    public takeDamage(damage: number): void {
        this.currentHealth = Math.max(0, this.currentHealth - damage);
        console.log(`玩家受到 ${damage} 点伤害，剩余生命值: ${this.currentHealth}/${this.maxHealth}`);

        // 更新UI显示生命值
        this.updateHealthUI();

        // 检查是否死亡
        if (this.currentHealth <= 0) {
            this.onDeath();
        }
    }

    // 恢复生命值
    public heal(amount: number): void {
        this.currentHealth = Math.min(this.maxHealth, this.currentHealth + amount);
        console.log(`玩家恢复 ${amount} 点生命值，当前生命值: ${this.currentHealth}/${this.maxHealth}`);
        this.updateHealthUI();
    }

    private updateHealthUI(): void {
        // 更新生命值UI
        // 这里可以调用UI管理器更新血条显示
        // UIManager.instance.updateHealthBar(this.currentHealth, this.maxHealth);
    }

    private onDeath(): void {
        console.log('玩家死亡！');
        
        // 禁用玩家控制
        if (this.shooter) {
            // 可以设置一个标志来禁用射击
        }
        
        if (this.mover) {
            // 可以禁用移动
        }

        // 显示游戏结束界面
        // GameManager.instance.showGameOver();
        
        // 播放死亡动画
        // this.playDeathAnimation();
    }

    // 获取玩家状态信息
    public getPlayerStatus(): any {
        return {
            health: {
                current: this.currentHealth,
                max: this.maxHealth
            },
            ammo: this.shooter ? this.shooter.getAmmoInfo() : null,
            position: this.node.getPosition()
        };
    }

    // 重置玩家状态
    public resetPlayer(): void {
        this.currentHealth = this.maxHealth;
        
        if (this.shooter) {
            // 重置射击器状态
        }

        this.updateHealthUI();
        
        // 重置位置
        this.node.setPosition(0, 0, 0);
        
        console.log('玩家状态已重置');
    }

    protected onDestroy(): void {
        // 清理资源
    }
}
    */

import { _decorator, Component, Vec3 } from 'cc';
import { PlayerShooter } from './shot';
import { UIJoyStick } from '../ui/UIJoyStick';
import { move } from './move';
import { VirtualInput } from '../input/VirtualInput';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {

    @property({ type: PlayerShooter })
    shooter: PlayerShooter = null;

    @property({ type: move })
    mover: move = null;

    @property({ type: UIJoyStick })
    joystick: UIJoyStick = null;

    protected update(deltaTime: number) {
        if (!this.mover) return;

        // 从UIJoyStick通过VirtualInput获取移动方向
        const dir = new Vec3(VirtualInput.horizontal, VirtualInput.vertical, 0);
        this.mover.setMovementDirection(dir);

        // 更新射击角度
        if (this.shooter && dir.length() > 0) {
            const angle = Math.atan2(dir.y, dir.x);
            this.shooter.setJoystickAngle(angle);
        }
    }
}
