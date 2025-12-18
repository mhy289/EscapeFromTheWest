import { _decorator, Component, Node, Label, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {
    @property({
        tooltip: '敌人最大生命值'
    })
    maxHealth: number = 100;

    private currentHealth: number = 100;

    protected start(): void {
        this.currentHealth = this.maxHealth;
        console.log(`敌人生成，生命值: ${this.currentHealth}/${this.maxHealth}`);
    }

    // 受到伤害
    public takeDamage(damage: number): void {
        this.currentHealth = Math.max(0, this.currentHealth - damage);
        console.log(`敌人受到 ${damage} 点伤害，剩余生命值: ${this.currentHealth}/${this.maxHealth}`);

        // 显示伤害数字（可选）
        this.showDamageNumber(damage);

        // 检查是否死亡
        if (this.currentHealth <= 0) {
            this.onDeath();
        }
    }

    private showDamageNumber(damage: number): void {
        // 这里可以创建一个伤害数字UI来显示伤害
        console.log(`显示伤害: ${damage}`);
    }

    private onDeath(): void {
        console.log('敌人死亡！');
        
        // 播放死亡动画（如果有）
        // this.playDeathAnimation();

        // 掉落物品（如果有）
        // this.dropItems();

        // 销毁敌人
        this.node.destroy();

        // 可以在这里添加游戏逻辑，比如增加分数等
        // GameManager.instance.addScore(100);
    }

    // 获取当前生命值
    public getCurrentHealth(): number {
        return this.currentHealth;
    }

    // 获取最大生命值
    public getMaxHealth(): number {
        return this.maxHealth;
    }
}