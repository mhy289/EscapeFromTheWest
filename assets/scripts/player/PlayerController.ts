
import { _decorator, Component, Vec3 } from 'cc';
import { PlayerShooter } from './shot';
import { UIJoyStick } from '../ui/moveUIJoyStick';
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
        const dir = new Vec3(VirtualInput.moveX, VirtualInput.moveY, 0);
        this.mover.setMovementDirection(dir);

        // 调试：确保移动摇杆没有意外触发射击
        if (dir.length() > 0.1) {
            // console.log(`移动摇杆方向: (${dir.x.toFixed(2)}, ${dir.y.toFixed(2)}) - 不触发射击`);
        }

        // 移动摇杆不再触发射击角度更新，只有右摇杆（瞄准摇杆）才控制射击方向
    }
}
