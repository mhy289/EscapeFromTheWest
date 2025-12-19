import { _decorator, Component, Node, Vec3, Vec2, Collider, RigidBody, Collider2D, RigidBody2D, find } from 'cc';
import { Enemy } from '../enemy/Enemy.ts';
import { testmove } from '../enemy/testmove.ts';
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
    private rigidBody2D: RigidBody2D = null;
    private collider: Collider = null;
    private collider2D: Collider2D = null;

    protected onLoad(): void {
        // 获取物理组件（优先使用2D组件）
        this.rigidBody = this.node.getComponent(RigidBody);
        this.rigidBody2D = this.node.getComponent(RigidBody2D);
        this.collider = this.node.getComponent(Collider);
        this.collider2D = this.node.getComponent(Collider2D);

        // 设置子弹为触发器
        if (this.collider) {
            this.collider.isTrigger = true;
        }
        if (this.collider2D) {
            this.collider2D.sensor = true;
        }

        console.log(`Bullet组件加载 - 3D刚体: ${this.rigidBody ? '✅' : '❌'}, 2D刚体: ${this.rigidBody2D ? '✅' : '❌'}, 3D碰撞体: ${this.collider ? '✅' : '❌'}, 2D碰撞体: ${this.collider2D ? '✅' : '❌'}`);
    }

    protected start(): void {
        console.log(`Bullet start: 方向(${this.direction.x.toFixed(2)}, ${this.direction.y.toFixed(2)}), 3D刚体: ${this.rigidBody ? '是' : '否'}, 2D刚体: ${this.rigidBody2D ? '是' : '否'}`);
        
        // 优先使用2D刚体（更常见）
        if (this.rigidBody2D) {
            const velocity = new Vec2(
                this.direction.x * this.speed,
                this.direction.y * this.speed
            );
            this.rigidBody2D.linearVelocity = velocity;
            console.log(`设置2D刚体速度: (${velocity.x.toFixed(1)}, ${velocity.y.toFixed(1)})`);
        }
        // 备用：使用3D刚体
        else if (this.rigidBody) {
            const velocity = new Vec3(
                this.direction.x * this.speed,
                this.direction.y * this.speed,
                0
            );
            this.rigidBody.setLinearVelocity(velocity);
            console.log(`设置3D刚体速度: (${velocity.x.toFixed(1)}, ${velocity.y.toFixed(1)})`);
        }
    }

    // 初始化子弹
    public initialize(direction: Vec3, speed: number, damage: number): void {
        this.direction = Vec3.clone(direction);
        this.speed = speed;
        this.damage = damage;

        // 归一化方向向量
        Vec3.normalize(this.direction, this.direction);
        
        // 调整子弹视觉朝向：预制体的x负方向是头部，需要将子弹旋转到正确的朝向
        // 计算飞行方向的角度
        const flightAngle = Math.atan2(this.direction.y, this.direction.x);
        // 由于预制体的x负方向是头部，所以需要将节点旋转180度
        // 这样头部（x负方向）就会指向飞行方向
        this.node.angle = (flightAngle + Math.PI) * (180 / Math.PI);

        console.log(`子弹初始化: 飞行方向(${this.direction.x.toFixed(2)}, ${this.direction.y.toFixed(2)}), 节点旋转角度${(this.node.angle).toFixed(1)}°, 速度${speed}, 伤害${damage}`);
        console.log(`✨ 子弹朝向已调整：头部指向飞行方向，移动方向保持不变`);

        // 立即应用移动（不等待start）
        this.applyMovement();
    }

    // 应用移动逻辑
    private applyMovement(): void {
        // 优先使用2D刚体系统
        if (this.rigidBody2D) {
            const velocity = new Vec2(
                this.direction.x * this.speed,
                this.direction.y * this.speed
            );
            this.rigidBody2D.linearVelocity = velocity;
            console.log(`立即设置2D刚体速度: (${velocity.x.toFixed(1)}, ${velocity.y.toFixed(1)})`);
        }
        // 备用：使用3D刚体系统
        else if (this.rigidBody) {
            const velocity = new Vec3(
                this.direction.x * this.speed,
                this.direction.y * this.speed,
                0
            );
            this.rigidBody.setLinearVelocity(velocity);
            console.log(`立即设置3D刚体速度: (${velocity.x.toFixed(1)}, ${velocity.y.toFixed(1)})`);
        } else {
            console.log('子弹没有刚体组件，将使用手动移动');
        }
    }

    protected update(deltaTime: number): void {
        this.currentTime += deltaTime;

        // 手动移动（如果没有刚体组件或有刚体但速度为0）
        if ((!this.rigidBody && !this.rigidBody2D) || this.isVelocityZero()) {
            const pos = this.node.getPosition();
            const moveX = this.direction.x * this.speed * deltaTime;
            const moveY = this.direction.y * this.speed * deltaTime;
            const newPos = new Vec3(pos.x + moveX, pos.y + moveY, pos.z);
            this.node.setPosition(newPos);
        }

        // 生命周期结束时销毁子弹
        if (this.currentTime >= this.lifetime) {
            this.destroyBullet();
        }
    }

    // 检查刚体速度是否为0
    private isVelocityZero(): boolean {
        if (this.rigidBody2D) {
            const velocity = this.rigidBody2D.linearVelocity;
            return Math.abs(velocity.x) < 0.1 && Math.abs(velocity.y) < 0.1;
        }
        if (this.rigidBody) {
            const velocity = this.rigidBody.getLinearVelocity();
            return Math.abs(velocity.x) < 0.1 && Math.abs(velocity.y) < 0.1;
        }
        return true;
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

    // 2D碰撞检测
    protected onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: any): void {
        const otherNode = otherCollider.node;
        
        // 检查是否击中敌人
        if (this.isEnemy(otherNode)) {
            console.log(`2D子弹击中敌人: ${otherNode.name}`);
            this.dealDamage(otherNode);
            this.destroyBullet();
        }
        else if (otherNode.name.toLowerCase().includes('wall') || otherNode.name.toLowerCase().includes('障碍')) {
            console.log('2D子弹击中墙壁');
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