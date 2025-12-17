import { _decorator, Component, Node, KeyCode, Vec3 } from 'cc';
import { DualJoystick, JoystickData } from '../ui/DualJoystick';
import { InputManager } from './InputManager';
const { ccclass, property } = _decorator;

@ccclass('move')
export class move extends Component {

    @property({
        tooltip: '移动速度：角色移动的基础速度，数值越大移动越快（默认：10）'
    })
    speed: number = 10;

    @property({
        tooltip: '操作模式：false=键盘模式（WASD键控制移动），true=虚拟摇杆模式（左摇杆控制移动）\n注意：必须与PlayerShooter组件的设置保持一致'
    })
    useVirtualJoystick: boolean = false;

    @property({
        type: DualJoystick,
        tooltip: '双摇杆系统：虚拟摇杆模式下的双摇杆控制器，左摇杆用于移动控制（虚拟摇杆模式必需）'
    })
    dualJoystick: DualJoystick = null;

    // 按键状态（键盘模式）
    private moveUp: boolean = false;
    private moveDown: boolean = false;
    private moveLeft: boolean = false;
    private moveRight: boolean = false;

    // 虚拟摇杆移动数据
    private movementDirection: Vec3 = new Vec3(0, 0, 0);

    // 保存绑定的函数引用，用于正确移除监听器
    private boundOnKeyDown: (keyCode: number) => void = null;
    private boundOnKeyUp: (keyCode: number) => void = null;

    protected onLoad(): void {
        // 延迟设置控制，确保InputManager已经初始化
        this.scheduleOnce(() => {
            this.setupControls();
        }, 0.1);
    }

    private setupControls(): void {
        console.log('Move: 开始设置控制，当前模式：', this.useVirtualJoystick ? '虚拟摇杆' : '键盘');
        console.log('Move: InputManager.instance =', InputManager.instance ? '存在' : '不存在');
        
        if (this.useVirtualJoystick) {
            this.setupVirtualJoystick();
        } else {
            this.setupKeyboardControls();
        }
    }

    private setupKeyboardControls(): void {
        console.log('Move: 设置键盘控制（使用InputManager）');
        
        // 检查InputManager是否存在，如果不存在则等待
        if (InputManager.instance) {
            // 创建绑定的函数引用并保存
            this.boundOnKeyDown = this.onKeyDown.bind(this);
            this.boundOnKeyUp = this.onKeyUp.bind(this);
            
            InputManager.instance.addKeyDownListener(this.boundOnKeyDown);
            InputManager.instance.addKeyUpListener(this.boundOnKeyUp);
            console.log('Move: 键盘控制设置成功');
        } else {
            console.error('Move: InputManager实例不存在，尝试延迟重试...');
            // 延迟重试
            this.scheduleOnce(() => {
                this.setupKeyboardControls();
            }, 0.2);
        }
    }

    protected onDestroy(): void {
        if (this.useVirtualJoystick) {
            this.cleanupVirtualJoystick();
        } else {
            this.cleanupKeyboardControls();
        }
    }

    private setupKeyboardControls(): void {
        console.log('Move: 设置键盘控制（使用InputManager）');
        
        // 使用InputManager来监听键盘事件
        if (InputManager.instance) {
            InputManager.instance.addKeyDownListener(this.onKeyDown.bind(this));
            InputManager.instance.addKeyUpListener(this.onKeyUp.bind(this));
        } else {
            console.error('Move: InputManager实例不存在！');
        }
    }

    private setupVirtualJoystick(): void {
        if (!this.dualJoystick) {
            console.error('Move: 虚拟摇杆模式需要设置DualJoystick引用！');
            return;
        }

        // 设置左摇杆回调用于移动
        this.dualJoystick.setOnLeftMoveCallback(this.onLeftJoystickMove.bind(this));
        this.dualJoystick.setOnLeftEndCallback(this.onLeftJoystickEnd.bind(this));
    }

    private cleanupKeyboardControls(): void {
        // 使用InputManager来移除监听器
        if (InputManager.instance) {
            if (this.boundOnKeyDown) {
                InputManager.instance.removeKeyDownListener(this.boundOnKeyDown);
                this.boundOnKeyDown = null;
            }
            if (this.boundOnKeyUp) {
                InputManager.instance.removeKeyUpListener(this.boundOnKeyUp);
                this.boundOnKeyUp = null;
            }
        }
    }

    private cleanupVirtualJoystick(): void {
        if (this.dualJoystick) {
            this.dualJoystick.setOnLeftMoveCallback(null);
            this.dualJoystick.setOnLeftEndCallback(null);
        }
    }

    private onKeyDown(keyCode: number) {
        console.log(`Move: 按键按下 - ${this.getKeyName(keyCode)}`);
        
        if (keyCode === KeyCode.KEY_W) {
            this.moveUp = true;
        } else if (keyCode === KeyCode.KEY_S) {
            this.moveDown = true;
        } else if (keyCode === KeyCode.KEY_A) {
            this.moveLeft = true;
        } else if (keyCode === KeyCode.KEY_D) {
            this.moveRight = true;
        }
    }

    private onKeyUp(keyCode: number) {
        console.log(`Move: 按键释放 - ${this.getKeyName(keyCode)}`);
        
        if (keyCode === KeyCode.KEY_W) {
            this.moveUp = false;
        } else if (keyCode === KeyCode.KEY_S) {
            this.moveDown = false;
        } else if (keyCode === KeyCode.KEY_A) {
            this.moveLeft = false;
        } else if (keyCode === KeyCode.KEY_D) {
            this.moveRight = false;
        }
    }

    private getKeyName(keyCode: number): string {
        switch(keyCode) {
            case KeyCode.KEY_W: return 'W';
            case KeyCode.KEY_S: return 'S';
            case KeyCode.KEY_A: return 'A';
            case KeyCode.KEY_D: return 'D';
            default: return `KeyCode(${keyCode})`;
        }
    }

    private onLeftJoystickMove(data: JoystickData): void {
        // 使用摇杆方向作为移动方向
        this.movementDirection = Vec3.clone(data.direction);
        
        // 调试信息
        // console.log(`移动方向: (${this.movementDirection.x.toFixed(2)}, ${this.movementDirection.y.toFixed(2)})`);
    }

    private onLeftJoystickEnd(): void {
        // 摇杆释放时停止移动
        this.movementDirection = new Vec3(0, 0, 0);
    }

    start() {
        // 可选：不要依赖固定帧率，注释掉强制设置
        // cc.game.setFrameRate(60);
    }

    update(deltaTime: number) {
        let dx = 0;
        let dy = 0;

        if (this.useVirtualJoystick) {
            // 虚拟摇杆模式：使用摇杆方向
            dx = this.movementDirection.x;
            dy = this.movementDirection.y;
            
            // 调试信息
            if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
                console.log(`摇杆移动: dx=${dx.toFixed(2)}, dy=${dy.toFixed(2)}`);
            }
        } else {
            // 键盘模式：使用WASD按键
            console.log(`Move: 按键状态 - Up:${this.moveUp} Down:${this.moveDown} Left:${this.moveLeft} Right:${this.moveRight}`);
            
            if (this.moveUp) dy += 1;
            if (this.moveDown) dy -= 1;
            if (this.moveRight) dx += 1;
            if (this.moveLeft) dx -= 1;

            // 对角线归一化，保证斜向移动速度与直向相同
            let len = Math.sqrt(dx * dx + dy * dy);
            if (len > 0) {
                dx = dx / len;
                dy = dy / len;
            }
            
            console.log(`Move: 计算得到的移动方向 - dx=${dx.toFixed(2)}, dy=${dy.toFixed(2)}`);
        }

        if (dx === 0 && dy === 0) {
            console.log('Move: 没有移动输入，跳过更新');
            return;
        }

        const currentPos = this.node.getPosition();
        const moveX = dx * this.speed * deltaTime;
        const moveY = dy * this.speed * deltaTime;
        
        console.log(`Move: 当前位置 (${currentPos.x.toFixed(1)}, ${currentPos.y.toFixed(1)}), 移动距离 (${moveX.toFixed(2)}, ${moveY.toFixed(2)})`);
        
        // 更新位置
        this.node.setPosition(currentPos.x + moveX, currentPos.y + moveY, currentPos.z);
        
        const newPos = this.node.getPosition();
        console.log(`Move: 移动后位置 (${newPos.x.toFixed(1)}, ${newPos.y.toFixed(1)})`);
    }
}


