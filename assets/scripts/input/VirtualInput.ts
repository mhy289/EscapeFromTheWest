import { _decorator } from 'cc';
const { ccclass } = _decorator;

/**
 * VirtualInput
 * =========================
 * 只存“输入方向”，不存任何行为
 */
@ccclass('VirtualInput')
export class VirtualInput {

    /* ================= 移动（左摇杆 / WASD） ================= */

    private static _moveX: number = 0;
    static get moveX(): number {
        return this._moveX;
    }
    static set moveX(val: number) {
        this._moveX = val;
    }

    private static _moveY: number = 0;
    static get moveY(): number {
        return this._moveY;
    }
    static set moveY(val: number) {
        this._moveY = val;
    }

    /* ================= 视野 / 朝向（右摇杆 / 鼠标） ================= */

    // 默认朝向右，避免出现 0 向量
    private static _aimX: number = 1;
    static get aimX(): number {
        return this._aimX;
    }
    static set aimX(val: number) {
        this._aimX = val;
    }

    private static _aimY: number = 0;
    static get aimY(): number {
        return this._aimY;
    }
    static set aimY(val: number) {
        this._aimY = val;
    }
}
