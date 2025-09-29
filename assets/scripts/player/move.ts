import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('move')
export class move extends Component {
    start() {

    }

    update(deltaTime: number) {
        //wasd移动2d刚体
        if (this.node.getComponent(RigidBody2D)) {
            move()
        }
    }

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


