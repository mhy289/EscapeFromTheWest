import { _decorator, Component, Node, Prefab, instantiate, Vec3, KeyCode, find } from 'cc';
import { Bullet } from '../player/Bullet.ts';
import { Enemy } from '../enemy/Enemy.ts';
import { testmove } from '../enemy/testmove.ts';
import { PlayerShooter } from '../player/shot.ts';
const { ccclass, property } = _decorator;

/**
 * 武器测试脚本 - 用于测试子弹发射和击中敌人
 */
@ccclass('WeaponTest')
export class WeaponTest extends Component {
    @property({
        type: Prefab,
        tooltip: '子弹预制体'
    })
    bulletPrefab: Prefab = null;

    @property({
        type: Prefab,
        tooltip: '敌人预制体'
    })
    enemyPrefab: Prefab = null;

    @property({
        tooltip: '是否使用PlayerShooter组件进行测试'
    })
    usePlayerShooter: boolean = true;

    private testEnemies: Node[] = [];
    private playerShooter: PlayerShooter = null;

    protected start(): void {
        console.log('武器测试初始化');
        
        // 如果使用PlayerShooter，获取组件引用
        if (this.usePlayerShooter) {
            const player = find('Canvas/Player');
            if (player) {
                this.playerShooter = player.getComponent(PlayerShooter);
                if (this.playerShooter) {
                    console.log('找到PlayerShooter组件，将使用其发射系统');
                } else {
                    console.warn('Player节点没有PlayerShooter组件，将使用独立发射系统');
                    this.usePlayerShooter = false;
                }
            }
        }
        
        this.createTestEnemies();
    }

    // 创建测试敌人
    private createTestEnemies(): void {
        if (!this.enemyPrefab) {
            console.warn('未设置敌人预制体，无法创建测试敌人');
            return;
        }

        // 在不同位置创建几个敌人
        const enemyPositions = [
            new Vec3(200, 100, 0),
            new Vec3(-150, 150, 0),
            new Vec3(0, -200, 0),
            new Vec3(300, -100, 0)
        ];

        for (let i = 0; i < enemyPositions.length; i++) {
            const enemy = instantiate(this.enemyPrefab);
            enemy.setPosition(enemyPositions[i]);
            enemy.name = `TestEnemy_${i + 1}`;
            
            // 添加testmove组件并设置目标为玩家
            const moveComponent = enemy.getComponent(testmove);
            if (moveComponent) {
                // 假设玩家节点名为'Player'
                const player = find('Canvas/Player');
                if (player) {
                    moveComponent['target'] = player;
                }
            }

            // 确保有Enemy组件用于处理伤害
            if (!enemy.getComponent(Enemy)) {
                enemy.addComponent(Enemy);
            }

            this.node.addChild(enemy);
            this.testEnemies.push(enemy);
        }

        console.log(`创建了 ${this.testEnemies.length} 个测试敌人`);
    }

    // 测试子弹发射（按空格键发射）
    protected update(deltaTime: number): void {
        if (Input.isKeyDown(KeyCode.SPACE)) {
            this.testFire();
        }
    }

    // 测试发射子弹
    private testFire(): void {
        console.log('触发测试发射');

        if (this.usePlayerShooter && this.playerShooter) {
            // 使用PlayerShooter的测试方法
            console.log('使用PlayerShooter测试发射');
            
            if (this.testEnemies.length > 0) {
                const targetEnemy = this.testEnemies[0];
                const enemyPos = targetEnemy.worldPosition;
                const playerPos = this.playerShooter.node.worldPosition;
                
                // 计算方向
                let direction = new Vec3(
                    enemyPos.x - playerPos.x,
                    enemyPos.y - playerPos.y,
                    0
                );
                
                // 归一化
                Vec3.normalize(direction, direction);
                
                this.playerShooter.testFireFixedDirection(direction);
            } else {
                // 没有敌人时，向右发射
                this.playerShooter.testFireFixedDirection(new Vec3(1, 0, 0));
            }
        } else {
            // 使用独立发射系统
            console.log('使用独立发射系统');
            if (!this.bulletPrefab) {
                console.error('未设置子弹预制体！');
                return;
            }

            const bullet = instantiate(this.bulletPrefab);
            bullet.setPosition(this.node.getPosition());

            // 设置子弹朝向第一个敌人（固定方向测试）
            if (this.testEnemies.length > 0) {
                const targetEnemy = this.testEnemies[0];
                const enemyPos = targetEnemy.worldPosition;
                const playerPos = this.node.worldPosition;
                
                // 计算方向
                let direction = new Vec3(
                    enemyPos.x - playerPos.x,
                    enemyPos.y - playerPos.y,
                    0
                );
                
                // 归一化
                Vec3.normalize(direction, direction);

                // 初始化子弹
                const bulletScript = bullet.getComponent(Bullet);
                if (bulletScript) {
                    bulletScript.initialize(direction, 800, 25);
                }

                console.log(`测试发射子弹朝向敌人，方向: (${direction.x.toFixed(2)}, ${direction.y.toFixed(2)})`);
            } else {
                // 没有敌人时，向右发射
                const direction = new Vec3(1, 0, 0);
                const bulletScript = bullet.getComponent(Bullet);
                if (bulletScript) {
                    bulletScript.initialize(direction, 800, 25);
                }
            }

            this.node.addChild(bullet);
        }
    }

    // 清理测试敌人
    public clearTestEnemies(): void {
        this.testEnemies.forEach(enemy => {
            if (enemy && enemy.isValid) {
                enemy.destroy();
            }
        });
        this.testEnemies = [];
        console.log('清理所有测试敌人');
    }
}