import { _decorator, Component, Node, input,Input, KeyCode, RigidBody2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('move')
export class move extends Component {

    @property
    speed: number = 10;

    protected onLoad(): void {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    protected onDestroy(): void {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    private onKeyDown(key) {
        if (key.keyCode === KeyCode.KEY_W) {
            console.log("按下了w")
        }else if (key.keyCode === KeyCode.KEY_S) {
            console.log("按下了s")
        }else if (key.keyCode === KeyCode.KEY_A) {
            console.log("按下了a")
        }else if (key.keyCode === KeyCode.KEY_D) {
            console.log("按下了d")
        }
    }

    start() {
        
    }

    update(deltaTime: number) {
        const pos = this.node.getPosition();
        this.node.setPosition(pos.x + this.speed * deltaTime, pos.y, pos.z);
    }
}


