import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('move')
export class move extends Component {
    start() {

    }

    update(deltaTime: number) {
        //wasd移动2d刚体
        /* if (this.node.getComponent(RigidBody2D)) {
            move()
        } */
        //else {
            move2d()
       //}
    }

    //wasd移动2d图片
    move2d() {
        const pos = this.node.getPosition();
        if (input.isKeyDown(KeyCode.W)) {
            console.log("移动了w"+pos.y)
            pos.y += 0.1;
        }
        if (input.isKeyDown(KeyCode.S)) {
            console.log("移动了s"+pos.y)
            pos.y -= 0.1;
        }
        if (input.isKeyDown(KeyCode.A)) {
            console.log("移动了a"+pos.x)
            pos.x -= 0.1;
        }
        if (input.isKeyDown(KeyCode.D)) {
            console.log("移动了d"+pos.x)
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


