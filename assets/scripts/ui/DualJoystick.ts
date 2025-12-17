import { _decorator, Component, Node, Vec3 } from 'cc';
import { VirtualJoystick } from './VirtualJoystick';
const { ccclass, property } = _decorator;

export interface JoystickData {
    angle: number;
    distance: number;
    direction: Vec3;
}

@ccclass('DualJoystick')
export class DualJoystick extends Component {
    @property(VirtualJoystick)
    leftJoystick: VirtualJoystick = null; // 左摇杆：控制移动

    @property(VirtualJoystick)
    rightJoystick: VirtualJoystick = null; // 右摇杆：控制朝向

    // 回调函数
    private onLeftJoystickMove: ((data: JoystickData) => void) = null;
    private onRightJoystickMove: ((data: JoystickData) => void) = null;
    private onLeftJoystickEnd: (() => void) = null;
    private onRightJoystickEnd: (() => void) = null;

    protected onLoad(): void {
        if (!this.leftJoystick || !this.rightJoystick) {
            console.error('DualJoystick: 请在编辑器中设置左右摇杆引用！');
            return;
        }

        this.setupJoystickCallbacks();
    }

    private setupJoystickCallbacks(): void {
        // 设置左摇杆回调
        this.leftJoystick.setOnMoveCallback((angle: number, distance: number) => {
            const data = this.createJoystickData(angle, distance);
            if (this.onLeftJoystickMove) {
                this.onLeftJoystickMove(data);
            }
        });

        this.leftJoystick.setOnEndCallback(() => {
            if (this.onLeftJoystickEnd) {
                this.onLeftJoystickEnd();
            }
        });

        // 设置右摇杆回调
        this.rightJoystick.setOnMoveCallback((angle: number, distance: number) => {
            const data = this.createJoystickData(angle, distance);
            if (this.onRightJoystickMove) {
                this.onRightJoystickMove(data);
            }
        });

        this.rightJoystick.setOnEndCallback(() => {
            if (this.onRightJoystickEnd) {
                this.onRightJoystickEnd();
            }
        });
    }

    private createJoystickData(angle: number, distance: number): JoystickData {
        const direction = new Vec3(Math.cos(angle), Math.sin(angle), 0);
        return {
            angle: angle,
            distance: distance,
            direction: direction
        };
    }

    // 设置左摇杆移动回调
    public setOnLeftMoveCallback(callback: (data: JoystickData) => void): void {
        this.onLeftJoystickMove = callback;
    }

    // 设置右摇杆移动回调
    public setOnRightMoveCallback(callback: (data: JoystickData) => void): void {
        this.onRightJoystickMove = callback;
    }

    // 设置左摇杆结束回调
    public setOnLeftEndCallback(callback: () => void): void {
        this.onLeftJoystickEnd = callback;
    }

    // 设置右摇杆结束回调
    public setOnRightEndCallback(callback: () => void): void {
        this.onRightJoystickEnd = callback;
    }

    // 获取左摇杆数据
    public getLeftJoystickData(): JoystickData {
        if (!this.leftJoystick) return null;
        
        return {
            angle: this.leftJoystick.getAngle(),
            distance: this.leftJoystick.getDistance(),
            direction: this.leftJoystick.getDirection()
        };
    }

    // 获取右摇杆数据
    public getRightJoystickData(): JoystickData {
        if (!this.rightJoystick) return null;
        
        return {
            angle: this.rightJoystick.getAngle(),
            distance: this.rightJoystick.getDistance(),
            direction: this.rightJoystick.getDirection()
        };
    }

    // 获取左摇杆方向（用于移动）
    public getMovementDirection(): Vec3 {
        const leftData = this.getLeftJoystickData();
        return leftData ? leftData.direction : new Vec3(0, 0, 0);
    }

    // 获取右摇杆角度（用于射击方向）
    public getAimAngle(): number {
        const rightData = this.getRightJoystickData();
        return rightData ? rightData.angle : 0;
    }

    // 获取移动强度（0-1之间）
    public getMovementIntensity(): number {
        const leftData = this.getLeftJoystickData();
        if (!leftData) return 0;
        return Math.min(leftData.distance / (this.leftJoystick['maxRadius'] || 80), 1.0);
    }

    // 检查是否在操作
    public isMoving(): boolean {
        const intensity = this.getMovementIntensity();
        return intensity > 0.1; // 阈值避免抖动
    }

    public isAiming(): boolean {
        const rightData = this.getRightJoystickData();
        if (!rightData) return false;
        return rightData.distance > 10; // 阈值避免抖动
    }
}