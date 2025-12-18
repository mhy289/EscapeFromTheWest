import { _decorator, Component, Node, Prefab, instantiate, Vec3, Collider2D, RigidBody2D } from 'cc';
import { Bullet } from '../player/Bullet';
const { ccclass, property } = _decorator;

/**
 * 子弹预制体配置工具 - 用于正确配置子弹预制体
 */
@ccclass('BulletSetupTool')
export class BulletSetupTool extends Component {

    @property({
        type: Prefab,
        tooltip: '需要配置的子弹预制体'
    })
    bulletPrefab: Prefab = null;

    protected start(): void {
        if (this.bulletPrefab) {
            this.setupBulletPrefab();
        } else {
            console.log('请在编辑器中设置bulletPrefab属性');
        }
    }

    // 配置子弹预制体
    private setupBulletPrefab(): void {
        console.log('开始配置子弹预制体...');

        // 实例化预制体进行配置
        const bulletInstance = instantiate(this.bulletPrefab);
        
        // 1. 添加Bullet脚本组件
        if (!bulletInstance.getComponent(Bullet)) {
            const bulletScript = bulletInstance.addComponent(Bullet);
            console.log('✅ 添加Bullet组件成功');
        } else {
            console.log('ℹ️ Bullet组件已存在');
        }

        // 2. 添加物理组件
        let hasRigidBody = false;
        let hasCollider = false;

        // 检查是否有RigidBody2D组件
        if (!bulletInstance.getComponent(RigidBody2D)) {
            bulletInstance.addComponent(RigidBody2D);
            console.log('✅ 添加RigidBody2D组件成功');
        } else {
            console.log('ℹ️ RigidBody2D组件已存在');
        }

        // 检查是否有Collider2D组件
        if (!bulletInstance.getComponent(Collider2D)) {
            const collider = bulletInstance.addComponent(Collider2D);
            // 设置为触发器
            if (collider) {
                collider.sensor = true;
                console.log('✅ 添加Collider2D组件并设置为触发器');
            }
        } else {
            console.log('ℹ️ Collider2D组件已存在');
        }

        console.log('🎯 子弹预制体配置完成！');
        console.log('');
        console.log('📋 配置清单：');
        console.log('   • Bullet脚本组件 - 控制子弹逻辑');
        console.log('   • RigidBody2D组件 - 提供物理运动');
        console.log('   • Collider2D组件 - 检测碰撞（触发器模式）');
        console.log('');
        console.log('💡 提示：');
        console.log('   1. 现在可以使用PlayerShooter发射子弹了');
        console.log('   2. 子弹会自动朝向敌人移动');
        console.log('   3. 击中敌人时会触发伤害');

        // 清理实例
        bulletInstance.destroy();
    }

    // 检查预制体配置
    public checkBulletPrefab(): void {
        if (!this.bulletPrefab) {
            console.log('❌ 未设置bulletPrefab');
            return;
        }

        const bulletInstance = instantiate(this.bulletPrefab);
        
        console.log('🔍 检查子弹预制体配置：');
        console.log(`   • Bullet组件: ${bulletInstance.getComponent(Bullet) ? '✅' : '❌'}`);
        console.log(`   • RigidBody2D组件: ${bulletInstance.getComponent(RigidBody2D) ? '✅' : '❌'}`);
        console.log(`   • Collider2D组件: ${bulletInstance.getComponent(Collider2D) ? '✅' : '❌'}`);
        
        bulletInstance.destroy();
    }
}