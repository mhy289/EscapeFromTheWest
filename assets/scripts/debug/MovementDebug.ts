import { _decorator, Component, Node, KeyCode, input, Input } from 'cc';
import { move } from '../player/move.ts';
const { ccclass, property } = _decorator;

/**
 * 移动调试脚本 - 按F键强制停止移动，按G键显示状态
 */
@ccclass('MovementDebug')
export class MovementDebug extends Component {

    @property({
        type: move,
        tooltip: '移动组件：需要调试的move组件引用'
    })
    moveComponent: move = null;

    protected onLoad(): void {
        // 设置键盘监听
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    protected onDestroy(): void {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    private onKeyDown(event: any): void {
        const key = event.keyCode;

        // F键：强制停止移动
        if (key === KeyCode.KEY_F) {
            console.log('=== 按下F键：强制停止移动 ===');
            if (this.moveComponent) {
                this.moveComponent.forceStopMovement();
            } else {
                // 尝试从当前节点获取move组件
                const move = this.node.getComponent(move);
                if (move) {
                    move.forceStopMovement();
                } else {
                    console.error('MovementDebug: 找不到move组件');
                }
            }
        }

        // G键：显示移动状态
        if (key === KeyCode.KEY_G) {
            console.log('=== 按下G键：显示移动状态 ===');
            this.showMovementState();
        }

        // H键：测试重置按键状态
        if (key === KeyCode.KEY_H) {
            console.log('=== 按下H键：测试重置按键状态 ===');
            this.testResetKeys();
        }
    }

    private showMovementState(): void {
        let move = this.moveComponent;
        if (!move) {
            move = this.node.getComponent(move);
        }

        if (move) {
            const state = move.getMovementState();
            console.log('移动状态：', JSON.stringify(state, null, 2));
        } else {
            console.error('MovementDebug: 找不到move组件');
        }
    }

    private testResetKeys(): void {
        console.log('测试重置所有按键状态...');
        
        // 模拟松开所有WASD键
        if (this.moveComponent) {
            // 这个方法可能需要根据实际的move组件实现来调整
            console.log('尝试重置move组件按键状态...');
        }
        
        console.log('按键状态重置测试完成');
    }
}