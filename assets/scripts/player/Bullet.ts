import { _decorator, Component, Node, Vec3, Collider, RigidBody } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {
    private direction: Vec3 = new Vec3(1, 0, 0); // 默认向右
    private speed: number = 800;
    private damage: number = 25;
    private lifetime: number = 3.0; // 子弹生命周期（秒）
    private currentTime: number = 0;

    private rigidBody: RigidBody = null;
    private collider: Collider = null;

    protected onLoad(): void {
        // 获取物理组件
        this.rigidBody = this.node.getComponent(RigidBody);
        this.collider = this.node.getComponent(Collider);

        // 设置子弹为触发器
        if (this.collider) {
            this.collider.isTrigger = true;
        }
    }

    protected start(): void {
        // 如果有刚体组件，设置速度
        if (this.rigidBody) {
            const velocity = new Vec3(
                this.direction.x * this.speed,
                this.direction.y * this.speed,
                0
            );
            this.rigidBody.setLinearVelocity(velocity);
        }
    }

    // 初始化子弹
    public initialize(direction: Vec3, speed: number, damage: number): void {
        this.direction = Vec3.clone(direction);
        this.speed = speed;
        this.damage = damage;

        // 归一化方向向量
        Vec3.normalize(this.direction, this.direction);

        console.log(`子弹初始化: 方向(${this.direction.x.toFixed(2)}, ${this.direction.y.toFixed(2)}), 速度${speed}, 伤害${damage}`);
    }

    protected update(deltaTime: number): void {
        this.currentTime += deltaTime;

        // 手动移动（如果没有刚体组件）
        if (!this.rigidBody) {
            const pos = this.node.getPosition();
            const moveX = this.direction.x * this.speed * deltaTime;
            const moveY = this.direction.y * this.speed * deltaTime;
            this.node.setPosition(pos.x + moveX, pos.y + moveY, pos.z);
        }

        // 生命周期结束时销毁子弹
        if (this.currentTime >= this.lifetime) {
            this.destroyBullet();
        }
    }

    protected onTriggerEnter(other: Node): void {
        // 检查碰撞对象
        const enemyTag = other.name.toLowerCase();
        
        if (enemyTag.includes('enemy') || enemyTag.includes('怪物')) {
            // 对敌人造成伤害
            this.dealDamage(other);
            this.destroyBullet();
        }
        else if (other.name.toLowerCase().includes('wall') || other.name.toLowerCase().includes('障碍')) {
            // 击中墙壁，销毁子弹
            this.destroyBullet();
        }
    }

    private dealDamage(target: Node): void {
        const enemyScript = target.getComponent('Enemy');
        if (enemyScript && typeof enemyScript.takeDamage === 'function') {
            enemyScript.takeDamage(this.damage);
            console.log(`子弹对敌人造成 ${this.damage} 点伤害`);
        }
    }

    private destroyBullet(): void {
        // 创建击中特效（如果有的话）
        // this.createHitEffect();

        // 销毁子弹
        this.node.destroy();
    }

    protected onDestroy(): void {
        // 清理资源
    }
}