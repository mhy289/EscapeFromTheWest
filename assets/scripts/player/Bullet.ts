import { _decorator, Component, Node, Vec3, Collider, RigidBody, find } from 'cc';
import { Enemy } from '../enemy/Enemy';
import { testmove } from '../enemy/testmove';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {
    // 子弹属性（通过initialize方法设置）
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
        
        // 检查是否击中敌人
        if (this.isEnemy(other)) {
            console.log(`子弹击中敌人: ${other.name}`);
            this.dealDamage(other);
            this.destroyBullet();
        }
        else if (enemyTag.includes('wall') || enemyTag.includes('障碍')) {
            console.log('子弹击中墙壁');
            this.destroyBullet();
        }
    }

    // 判断是否是敌人
    private isEnemy(node: Node): boolean {
        // 检查节点名称
        const nodeName = node.name.toLowerCase();
        if (nodeName.includes('enemy') || nodeName.includes('怪物')) {
            return true;
        }

        // 检查是否有敌人相关组件
        if (node.getComponent(Enemy) || node.getComponent(testmove)) {
            return true;
        }

        return false;
    }

    private dealDamage(target: Node): void {
        // 优先使用Enemy组件
        let enemyScript = target.getComponent(Enemy);
        if (enemyScript && typeof enemyScript.takeDamage === 'function') {
            enemyScript.takeDamage(this.damage);
            return;
        }

        // 备用：使用testmove组件的伤害方法
        enemyScript = target.getComponent(testmove);
        if (enemyScript && typeof enemyScript.takeDamage === 'function') {
            enemyScript.takeDamage(this.damage);
            return;
        }

        console.log(`找到敌人但无法造成伤害: ${target.name}`);
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