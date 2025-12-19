import { _decorator, Component, CCFloat, EventTouch, Input, math, Sprite, v3, Vec3 } from 'cc';
import { VirtualInput } from '../input/VirtualInput.ts';
const { ccclass, property } = _decorator;

/**
 * 摇杆控制器
 */
@ccclass('UIJoyStick')
export class UIJoyStick extends Component {

    /**
     * 手指部分
     */
    @property(Sprite)
    thumbnail: Sprite | null = null;

    /**
     * 摇杆的背景
     */
    @property(Sprite)
    joyStickBg: Sprite | null = null;

    /**
     * 摇杆的半径
     */
    @property(CCFloat)
    radius: number = 130;

    /**
     * 摇杆初始化的位置
     */
    initJoyStickBgPosition: Vec3 = v3()

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
        let x = eventTouch.touch.getUILocationX();
        let y = eventTouch.touch.getUILocationY();
        this.joyStickBg.node.setWorldPosition(x, y, 0);
    }

    /**
     * 触摸移动
     * @param touchEvent 
     */
    onTouchMove(touchEvent: EventTouch) {
        // 获取摇杆在 UI 的位置
        let x = touchEvent.touch.getUILocationX();
        let y = touchEvent.touch.getUILocationY();

        let worldPosition = new Vec3(x, y, 0);
        let localPosition = v3();

        // 转化摇杆的位置到背景图的本地坐标
        this.joyStickBg.node.inverseTransformPoint(localPosition, worldPosition);
        let thumbnailPosition = v3();
        let len = localPosition.length();
        localPosition.normalize();
        Vec3.scaleAndAdd(thumbnailPosition, v3(), localPosition, math.clamp(len, 0, this.radius));

        this.thumbnail.node.setPosition(thumbnailPosition);

        // 将计算的结果赋予给 Input
        VirtualInput.moveX = this.thumbnail.node.position.x / this.radius;
        VirtualInput.moveY = this.thumbnail.node.position.y / this.radius;

        // 调试信息
        if (Math.abs(VirtualInput.moveX) > 0.1 || Math.abs(VirtualInput.moveY) > 0.1) {
            console.log(`🎮 移动摇杆 - 方向:(${VirtualInput.moveX.toFixed(2)}, ${VirtualInput.moveY.toFixed(2)}) - 只移动，不射击`);
        }
    }

    /**
     * 触摸结束
     * @param touchEvent 
     */
    onTouchEnd(touchEvent: EventTouch) {
        this.thumbnail.node.setPosition(v3());
        VirtualInput.moveX = 0;
        VirtualInput.moveY = 0;

        console.log('🎮 移动摇杆结束 - 重置方向(0, 0) - 确保不触发射击');

        // 摇杆的位置回归到初始化位置
        this.joyStickBg.node.worldPosition = this.initJoyStickBgPosition;
    }
}

