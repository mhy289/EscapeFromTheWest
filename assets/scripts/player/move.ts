import { _decorator, Component, Node, input, KeyCode, RigidBody2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('move')
export class move extends Component {
    start() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    // 按键状态记录
    private keys: Record<number, boolean> = {};

    onKeyDown(event) {
        this.keys[event.keyCode] = true;
    }

    onKeyUp(event) {
        this.keys[event.keyCode] = false;
    }

    update(deltaTime: number) {
        //wasd移动2d刚体
        /* if (this.node.getComponent(RigidBody2D)) {
            move()
        } */
        //else {
        this.move2d()
        //}
    }

    //wasd移动2d图片
    move2d() {
        const pos = this.node.getPosition();
        if (this.keys[KeyCode.W]) {
            console.log("移动了w" + pos.y)
            pos.y += 0.1;
        }
        if (this.keys[KeyCode.S]) {
            console.log("移动了s" + pos.y)
            pos.y -= 0.1;
        }
        if (this.keys[KeyCode.A]) {
            console.log("移动了a" + pos.x)
            pos.x -= 0.1;
        }
        if (this.keys[KeyCode.D]) {
            console.log("移动了d" + pos.x)
            pos.x += 0.1;
        }
        this.node.setPosition(pos);
    }

    //移动2d刚体
    move() {
        const body = this.node.getComponent(RigidBody2D);
        const velocity = body.linearVelocity;
        velocity.x = 0;
        velocity.y = 0;
        if (input.isKeyDown(KeyCode.W)) {
            velocity.y = 10;
        }
        if (input.isKeyDown(KeyCode.S)) {
            velocity.y = -10;
        }
        if (input.isKeyDown(KeyCode.A)) {
            velocity.x = -10;
        }
        if (input.isKeyDown(KeyCode.D)) {
            velocity.x = 10;
        }
        body.linearVelocity = velocity;
    }
}


