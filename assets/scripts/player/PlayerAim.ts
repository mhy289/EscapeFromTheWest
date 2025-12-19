import { _decorator, Component, Vec3, math } from 'cc';
import { VirtualInput } from '../input/VirtualInput';
import { PlayerShooter } from './shot';
const { ccclass, property } = _decorator;

/**
 * 玩家视野 / 朝向模块
 * 只负责“方向”，不负责射击
 */
@ccclass('PlayerAim')
export class PlayerAim extends Component {

    @property({ type: PlayerShooter })
    shooter: PlayerShooter = null;

    /**
     * 当前视野方向（单位向量）
     * 默认朝向右侧
     */
    private _aimDirection: Vec3 = new Vec3(1, 0, 0);

    update(deltaTime: number) {
        const x = VirtualInput.aimX;
        const y = VirtualInput.aimY;
        let hasInput = false;

        // 右摇杆有输入时，更新方向
        if (Math.abs(x) > 0.01 || Math.abs(y) > 0.01) {
            this._aimDirection.set(x, y, 0);
            this._aimDirection.normalize();
            hasInput = true;
            console.log(`右摇杆输入: (${x.toFixed(2)}, ${y.toFixed(2)})`);
        }

        // 如果你是 2D 角色，可以在这里直接转向
        this.applyRotation();

        // 只有在有输入时才更新射击器的瞄准方向
        if (this.shooter && hasInput) {
            this.shooter.setAimJoystickDirection(this._aimDirection);
        }
    }

    /**
     * 应用朝向（可选）
     * 2D 游戏一般是旋转 Z
     */
    private applyRotation(): void {
        const angleRad = Math.atan2(this._aimDirection.y, this._aimDirection.x);
        const angleDeg = math.toDegree(angleRad);
        this.node.setRotationFromEuler(0, 0, angleDeg);
    }

    /**
     * 对外提供：获取当前视野方向
     */
    public getAimDirection(): Vec3 {
        return this._aimDirection.clone();
    }

    /**
     * 对外提供：获取当前视野角度（弧度）
     */
    public getAimAngleRad(): number {
        return Math.atan2(this._aimDirection.y, this._aimDirection.x);
    }

    /**
     * 对外提供：获取当前视野角度（角度制）
     */
    public getAimAngleDeg(): number {
        return math.toDegree(this.getAimAngleRad());
    }
}

