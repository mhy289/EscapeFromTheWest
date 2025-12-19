import { _decorator, Component, CCFloat, EventTouch, Input, math, Sprite, v3, Vec3 } from 'cc';
import { VirtualInput } from '../input/VirtualInput.ts';
const { ccclass, property } = _decorator;

/**
 * 右摇杆控制器
 * 功能：更新 VirtualInput.aimX / aimY
 */
@ccclass('RightJoyStick')
export class RightJoyStick extends Component {

    @property(Sprite)
    thumbnail: Sprite | null = null;

    @property(Sprite)
    joyStickBg: Sprite | null = null;

    @property(CCFloat)
    radius: number = 130;

    initJoyStickBgPosition: Vec3 = v3();

    start() {
        this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.initJoyStickBgPosition = this.joyStickBg.node.worldPosition.clone();
    }

    onDestroy() {
        this.node.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.node.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(eventTouch: EventTouch) {
        const x = eventTouch.touch.getUILocationX();
        const y = eventTouch.touch.getUILocationY();
        this.joyStickBg.node.setWorldPosition(x, y, 0);
    }

    onTouchMove(eventTouch: EventTouch) {
        const x = eventTouch.touch.getUILocationX();
        const y = eventTouch.touch.getUILocationY();

        const worldPos = v3(x, y, 0);
        const localPos = v3();
        this.joyStickBg.node.inverseTransformPoint(localPos, worldPos);

        const thumbPos = v3();
        const len = localPos.length();
        localPos.normalize();
        Vec3.scaleAndAdd(thumbPos, v3(), localPos, math.clamp(len, 0, this.radius));

        this.thumbnail.node.setPosition(thumbPos);

        // 更新 VirtualInput 右摇杆
        VirtualInput.aimX = this.thumbnail.node.position.x / this.radius;
        VirtualInput.aimY = this.thumbnail.node.position.y / this.radius;

        // 调试信息
        if (Math.abs(VirtualInput.aimX) > 0.1 || Math.abs(VirtualInput.aimY) > 0.1) {
            console.log(`🎯 瞄准摇杆 - 方向:(${VirtualInput.aimX.toFixed(2)}, ${VirtualInput.aimY.toFixed(2)}) - 控制射击方向`);
        }
    }

    onTouchEnd(eventTouch: EventTouch) {
        this.thumbnail.node.setPosition(v3());
        VirtualInput.aimX = 0;
        VirtualInput.aimY = 0;

        this.joyStickBg.node.worldPosition = this.initJoyStickBgPosition;
    }
}

