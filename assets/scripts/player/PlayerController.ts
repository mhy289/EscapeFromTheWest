
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

        // 更新射击角度
        if (this.shooter && dir.length() > 0) {
            const angle = Math.atan2(dir.y, dir.x);
            this.shooter.setJoystickAngle(angle);
        }
    }
}
