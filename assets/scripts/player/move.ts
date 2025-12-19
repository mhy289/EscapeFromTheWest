
import { _decorator, Component, Node, Vec3, KeyCode } from 'cc';
import { VirtualInput } from '../input/VirtualInput.ts';
const { ccclass, property } = _decorator;

@ccclass('move')
export class move extends Component {

    @property({ tooltip: '移动速度' })
    speed: number = 10;

    @property({ tooltip: '是否使用虚拟摇杆' })
    useVirtualJoystick: boolean = false;

    // 键盘按键状态
    private moveUp: boolean = false;
    private moveDown: boolean = false;
    private moveLeft: boolean = false;
    private moveRight: boolean = false;

    // 虚拟摇杆移动方向
    private movementDirection: Vec3 = new Vec3(0, 0, 0);

    // 对外暴露设置摇杆方向方法
    public setMovementDirection(dir: Vec3) {
        this.movementDirection = dir;
    }

    update(deltaTime: number) {
        let dx = 0;
        let dy = 0;

        if (this.useVirtualJoystick) {
            dx = this.movementDirection.x;
            dy = this.movementDirection.y;
        } else {
            if (this.moveUp) dy += 1;
            if (this.moveDown) dy -= 1;
            if (this.moveLeft) dx -= 1;
            if (this.moveRight) dx += 1;

            // 对角线归一化
            const len = Math.sqrt(dx * dx + dy * dy);
            if (len > 0) {
                dx /= len;
                dy /= len;
            }
        }

        if (dx === 0 && dy === 0) return;

        const moveX = dx * this.speed * deltaTime;
        const moveY = dy * this.speed * deltaTime;

        const pos = this.node.getPosition();
        this.node.setPosition(pos.x + moveX, pos.y + moveY, pos.z);
    }

    // 键盘控制接口
    public onKeyDown(keyCode: KeyCode) {
        switch (keyCode) {
            case KeyCode.KEY_W: this.moveUp = true; break;
            case KeyCode.KEY_S: this.moveDown = true; break;
            case KeyCode.KEY_A: this.moveLeft = true; break;
            case KeyCode.KEY_D: this.moveRight = true; break;
        }
    }

    public onKeyUp(keyCode: KeyCode) {
        switch (keyCode) {
            case KeyCode.KEY_W: this.moveUp = false; break;
            case KeyCode.KEY_S: this.moveDown = false; break;
            case KeyCode.KEY_A: this.moveLeft = false; break;
            case KeyCode.KEY_D: this.moveRight = false; break;
        }
    }
}
