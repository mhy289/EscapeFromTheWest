import { _decorator, Component, Node, input, Input, KeyCode } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('move')
export class move extends Component {

    @property
    speed: number = 10;

    // 按键状态
    private moveUp: boolean = false;
    private moveDown: boolean = false;
    private moveLeft: boolean = false;
    private moveRight: boolean = false;

    protected onLoad(): void {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    protected onDestroy(): void {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
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

    start() {
        // 可选：不要依赖固定帧率，注释掉强制设置
        // cc.game.setFrameRate(60);
    }

    update(deltaTime: number) {
        let dx = 0;
        let dy = 0;
        if (this.moveUp) dy += 1;
        if (this.moveDown) dy -= 1;
        if (this.moveRight) dx += 1;
        if (this.moveLeft) dx -= 1;

        if (dx === 0 && dy === 0) return;

        // 对角线归一化，保证斜向移动速度与直向相同
        let len = Math.sqrt(dx * dx + dy * dy);
        if (len > 0) {
            dx = dx / len;
            dy = dy / len;
        }

        const pos = this.node.getPosition();
        const moveX = dx * this.speed * deltaTime;
        const moveY = dy * this.speed * deltaTime;
        this.node.setPosition(pos.x + moveX, pos.y + moveY, pos.z);
    }
}


