import { _decorator, Component, Node, input, Input, Vec3, math, EventTouch } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('VirtualJoystick')
export class VirtualJoystick extends Component {
    @property(Node)
    joystickBg: Node = null; // 摇杆背景

    @property(Node)
    joystickKnob: Node = null; // 摇杆手柄

    @property
    maxRadius: number = 80; // 摇杆最大半径

    // 回调函数
    private onJoystickMove: ((angle: number, distance: number) => void) = null;
    private onJoystickEnd: (() => void) = null;

    private isTouching: boolean = false;
    private touchStartPos: Vec3 = new Vec3();
    private currentPos: Vec3 = new Vec3();
    private centerPos: Vec3 = new Vec3();

    protected onLoad(): void {
        if (!this.joystickBg || !this.joystickKnob) {
            console.error('VirtualJoystick: 请在编辑器中设置摇杆背景和手柄节点！');
            return;
        }

        // 设置触摸事件
        this.setupTouchEvents();

        // 获取摇杆中心位置
        this.centerPos = this.joystickBg.getPosition();
    }

    private setupTouchEvents(): void {
        // 在摇杆背景上监听触摸事件
        this.joystickBg.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.joystickBg.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.joystickBg.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.joystickBg.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        // 也可以监听整个屏幕的触摸事件
        // 这样用户可以触摸屏幕任意位置来控制摇杆
        this.node.on(Input.EventType.TOUCH_START, this.onScreenTouchStart, this);
    }

    private onTouchStart(event: EventTouch): void {
        this.isTouching = true;
        const touchPos = this.getTouchPosition(event);
        this.touchStartPos = Vec3.clone(touchPos);
        this.updateJoystick(touchPos);
    }

    private onTouchMove(event: EventTouch): void {
        if (!this.isTouching) return;

        const touchPos = this.getTouchPosition(event);
        this.updateJoystick(touchPos);
    }

    private onTouchEnd(event: EventTouch): void {
        this.isTouching = false;
        this.resetJoystick();
        
        if (this.onJoystickEnd) {
            this.onJoystickEnd();
        }
    }

    private onScreenTouchStart(event: EventTouch): void {
        // 如果触摸点不在摇杆区域内，可以选择忽略或重新定位摇杆
        // 这里选择忽略，让摇杆在固定位置工作
    }

    private getTouchPosition(event: EventTouch): Vec3 {
        const touchLocation = event.getUILocation();
        
        // 转换为相对于摇杆背景的本地坐标
        const localPos = this.joystickBg.inverseTransformPoint(new Vec3(touchLocation.x, touchLocation.y, 0));
        
        return localPos;
    }

    private updateJoystick(touchPos: Vec3): void {
        // 计算触摸点相对于中心的位置
        const deltaX = touchPos.x;
        const deltaY = touchPos.y;
        
        // 计算距离
        let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // 限制在最大半径内
        if (distance > this.maxRadius) {
            const ratio = this.maxRadius / distance;
            deltaX *= ratio;
            deltaY *= ratio;
            distance = this.maxRadius;
        }

        // 更新手柄位置
        const knobPos = new Vec3(deltaX, deltaY, 0);
        this.joystickKnob.setPosition(knobPos);

        // 计算角度（弧度）
        let angle = Math.atan2(deltaY, deltaX);
        
        // 确保角度在 0 到 2π 之间
        if (angle < 0) {
            angle += 2 * Math.PI;
        }

        // 存储当前位置
        this.currentPos = knobPos;

        // 触发回调
        if (this.onJoystickMove) {
            this.onJoystickMove(angle, distance);
        }

        // 调试信息
        // console.log(`摇杆角度: ${(angle * 180 / Math.PI).toFixed(1)}°, 距离: ${distance.toFixed(1)}`);
    }

    private resetJoystick(): void {
        // 重置手柄位置到中心
        this.joystickKnob.setPosition(0, 0, 0);
        this.currentPos = new Vec3(0, 0, 0);
    }

    // 设置移动回调函数
    public setOnMoveCallback(callback: (angle: number, distance: number) => void): void {
        this.onJoystickMove = callback;
    }

    // 设置结束回调函数
    public setOnEndCallback(callback: () => void): void {
        this.onJoystickEnd = callback;
    }

    // 获取当前摇杆方向（归一化的向量）
    public getDirection(): Vec3 {
        if (this.currentPos.equals(Vec3.ZERO)) {
            return new Vec3(0, 0, 0);
        }

        const direction = Vec3.clone(this.currentPos);
        Vec3.normalize(direction, direction);
        return direction;
    }

    // 获取当前摇杆角度（弧度）
    public getAngle(): number {
        if (this.currentPos.equals(Vec3.ZERO)) {
            return 0;
        }

        return Math.atan2(this.currentPos.y, this.currentPos.x);
    }

    // 获取当前摇杆距离
    public getDistance(): number {
        return Vec3.len(this.currentPos);
    }

    // 获取摇杆强度（0-1之间）
    public getIntensity(): number {
        const distance = this.getDistance();
        return Math.min(distance / this.maxRadius, 1.0);
    }

    protected onDestroy(): void {
        // 清理事件监听
        if (this.joystickBg) {
            this.joystickBg.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
            this.joystickBg.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
            this.joystickBg.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
            this.joystickBg.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }

        if (this.node) {
            this.node.off(Input.EventType.TOUCH_START, this.onScreenTouchStart, this);
        }
    }
}