import { _decorator, Component, Node, input, Input, KeyCode, Vec3 } from 'cc';
import { DualJoystick, JoystickData } from '../ui/DualJoystick';
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

    protected onLoad(): void {
        if (this.useVirtualJoystick) {
            this.setupVirtualJoystick();
        } else {
            this.setupKeyboardControls();
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
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
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
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    private cleanupVirtualJoystick(): void {
        if (this.dualJoystick) {
            this.dualJoystick.setOnLeftMoveCallback(null);
            this.dualJoystick.setOnLeftEndCallback(null);
        }
    }

    private onKeyDown(event: any) {
        const key = event.keyCode;
        if (key === KeyCode.KEY_W) {
            this.moveUp = true;
        } else if (key === KeyCode.KEY_S) {
            this.moveDown = true;
        } else if (key === KeyCode.KEY_A) {
            this.moveLeft = true;
        } else if (key === KeyCode.KEY_D) {
            this.moveRight = true;
        }
    }

    private onKeyUp(event: any) {
        const key = event.keyCode;
        if (key === KeyCode.KEY_W) {
            this.moveUp = false;
        } else if (key === KeyCode.KEY_S) {
            this.moveDown = false;
        } else if (key === KeyCode.KEY_A) {
            this.moveLeft = false;
        } else if (key === KeyCode.KEY_D) {
            this.moveRight = false;
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
                // console.log(`摇杆移动: dx=${dx.toFixed(2)}, dy=${dy.toFixed(2)}`);
            }
        } else {
            // 键盘模式：使用WASD按键
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
        }

        if (dx === 0 && dy === 0) return;

        const currentPos = this.node.getPosition();
        const moveX = dx * this.speed * deltaTime;
        const moveY = dy * this.speed * deltaTime;
        
        // 更新位置
        this.node.setPosition(currentPos.x + moveX, currentPos.y + moveY, currentPos.z);
        
        // 调试移动信息
        // console.log(`角色移动到: (${currentPos.x.toFixed(1)}, ${currentPos.y.toFixed(1)})`);
    }
}


