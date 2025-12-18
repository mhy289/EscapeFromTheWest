import { _decorator, Component, Node } from 'cc';
import { Enemy } from './Enemy';
const { ccclass, property } = _decorator;

@ccclass('testmove')
export class testmove extends Component {
    @property({ type: Node })
    target: Node | null = null; // 玩家节点，需要在编辑器中拖拽绑定

    @property
    speed: number = 2; // 靠近玩家的速度（单位：单位/秒）

    @property
    randomOffset: number = 1; // 横向摆动的最大偏移幅度（单位）

    @property
    swayFrequency: number = 1.5; // 摆动频率（Hz）

    @property
    stopDistance: number = 0.5; // 距离小于该值则停止靠近

    @property
    failDistance: number = 0.4; // 距离小于该值触发失败提示（控制台）

    // 内部状态
    private _phase: number = Math.random() * Math.PI * 2; // 随机初相
    private _time: number = 0;
    private _failed: boolean = false; // 是否已触发失败，避免重复提示

    start() {
        // 可在 start 中根据需要随机化参数
        // this._phase = Math.random() * Math.PI * 2;
        
        // 确保敌人有Enemy组件用于处理伤害
        if (!this.node.getComponent(Enemy)) {
            this.node.addComponent(Enemy);
            console.log('为testmove节点添加Enemy组件');
        }
    }

    // 受到伤害（委托给Enemy组件）
    public takeDamage(damage: number): void {
        const enemyComponent = this.node.getComponent(Enemy);
        if (enemyComponent) {
            enemyComponent.takeDamage(damage);
        } else {
            console.log('敌人受到伤害但没有Enemy组件，直接销毁');
            // 如果没有Enemy组件，受到伤害直接销毁（简单处理）
            if (damage >= 50) { // 假设伤害大于50直接销毁
                this.node.destroy();
            }
        }
    }

    update(deltaTime: number) {
        if (!this.target) return;

        this._time += deltaTime;

        const pos = this.node.getPosition();
        const tpos = this.target.getPosition();

        // 计算到目标的向量（2D：x,y）
        let dx = tpos.x - pos.x;
        let dy = tpos.y - pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // 失败判断（优先于停止靠近）
        if (!this._failed && dist <= this.failDistance) {
            this._failed = true;
            console.log('玩家失败：被敌人接近');
            return;
        }

        if (dist <= this.stopDistance) return; // 已足够近

        // 归一化朝向向量
        const dirX = dx / dist;
        const dirY = dy / dist;

        // 计算垂直向量（用于左右摆动）
        const perpX = -dirY;
        const perpY = dirX;

        // 摆动幅度随时间变化（正弦），randomOffset 为最大幅度
        const omega = 2 * Math.PI * this.swayFrequency; // 角频率
        const sway = Math.sin(this._time * omega + this._phase) * this.randomOffset;

        // 将摆动转换为横向速度项（把幅度转换成速度的近似：幅度 * frequency）
        const lateralSpeed = sway * this.swayFrequency;

        // 合成速度（靠近方向 + 横向摆动速度）
        const velX = dirX * this.speed + perpX * lateralSpeed;
        const velY = dirY * this.speed + perpY * lateralSpeed;

        // 移动节点（与帧率无关）
        const newX = pos.x + velX * deltaTime;
        const newY = pos.y + velY * deltaTime;
        this.node.setPosition(newX, newY, pos.z);
    }
}
