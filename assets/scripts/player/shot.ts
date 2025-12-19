import { _decorator, Component, Node, KeyCode, Vec3, Prefab, instantiate, math, Camera, v3, EventMouse, find } from 'cc';
import { InputManager } from './InputManager.ts';
import { Bullet } from './Bullet.ts';
const { ccclass, property } = _decorator;

@ccclass('PlayerShooter')
export class PlayerShooter extends Component {
    @property({
        type: Prefab,
        tooltip: '子弹预制体：需要包含Bullet脚本的子弹对象预制体'
    })
    bulletPrefab: Prefab = null;

    @property({
        tooltip: '子弹速度：子弹飞行的速度，数值越大子弹飞行越快（默认：800）'
    })
    bulletSpeed: number = 800;

    @property({
        tooltip: '射击频率：两次射击之间的最小间隔时间，单位秒（默认：0.15秒，约每秒6-7发）'
    })
    fireRate: number = 0.15;

    @property({
        tooltip: '最大弹药数：一个弹匣能装填的子弹数量（默认：30发）'
    })
    maxAmmo: number = 30;

    @property({
        tooltip: '换弹时间：从开始换弹到完成换弹所需的时间，单位秒（默认：2.0秒）'
    })
    reloadTime: number = 2.0;

    @property({
        tooltip: '子弹伤害：每发子弹对敌人造成的伤害值（默认：25点伤害）'
    })
    bulletDamage: number = 25;

    @property({
        type: Camera,
        tooltip: '主相机：用于鼠标模式下计算鼠标方向，必须绑定场景中的主相机（键盘鼠标模式必需）'
    })
    mainCamera: Camera = null;

    // UI按钮节点（虚拟摇杆模式使用）
    @property({
        type: Node,
        tooltip: '开火按钮：虚拟摇杆模式下的开火按钮节点，按住可连续射击（虚拟摇杆模式必需）'
    })
    fireButton: Node = null;

    @property({
        type: Node,
        tooltip: '换弹按钮：虚拟摇杆模式下的换弹按钮节点，点击触发换弹（虚拟摇杆模式必需）'
    })
    reloadButton: Node = null;

    @property({
        type: Node,
        tooltip: '虚拟摇杆节点：单摇杆模式下的摇杆节点，用于控制射击方向（可选，推荐使用DualJoystick）'
    })
    virtualJoystick: Node = null;

    // 操作模式
    @property({
        tooltip: '操作模式：false=键盘鼠标模式（WASD+鼠标+左键+R键），true=虚拟摇杆模式（双摇杆+按钮）'
    })
    useVirtualJoystick: boolean = true;

    // 状态变量
    private canFire: boolean = true;
    private isReloading: boolean = false;
    private currentAmmo: number = 30;
    private lastFireTime: number = 0;
    private joystickAngle: number = 0; // 摇杆角度（弧度）
    private mouseDirection: Vec3 = new Vec3(1, 0, 0); // 鼠标方向
    private aimJoystickDirection: Vec3 = new Vec3(1, 0, 0); // 右摇杆（瞄准摇杆）方向

    // 按键状态
    private fireKeyPressed: boolean = false;
    private reloadKeyPressed: boolean = false;

    // 敌人追踪模式
    @property({
        tooltip: '是否启用敌人追踪模式：true=子弹自动射向最近的敌人，false=正常方向射击'
    })
    autoAimMode: boolean = true;

    @property({
        tooltip: '敌人追踪范围：在此范围内的敌人会被追踪（像素单位）'
    })
    aimRange: number = 1000;

    // 保存绑定的函数引用，用于正确移除监听器
    private boundOnKeyDown: (keyCode: number) => void = null;
    private boundOnKeyUp: (keyCode: number) => void = null;
    private boundOnMouseDown: (button: number, event: EventMouse) => void = null;
    private boundOnMouseUp: (button: number, event: EventMouse) => void = null;
    private boundOnMouseMove: (event: EventMouse) => void = null;

    protected onLoad(): void {
        // 初始化弹药
        this.currentAmmo = this.maxAmmo;

        // 延迟设置控制模式，确保InputManager已经初始化
        this.scheduleOnce(() => {
            this.setupControlMode();
        }, 0.1);
    }

    protected start(): void {
        console.log(`PlayerShooter initialized - Mode: ${this.useVirtualJoystick ? 'Virtual Joystick' : 'Keyboard + Mouse'}`);
        console.log(`Ammo: ${this.currentAmmo}/${this.maxAmmo}`);
    }

    private setupControlMode(): void {
        if (this.useVirtualJoystick) {
            // 虚拟摇杆模式
            this.setupVirtualJoystickControls();
        } else {
            // 键盘鼠标模式
            this.setupKeyboardMouseControls();
        }
    }

    private setupKeyboardMouseControls(): void {
        console.log('Shot: 设置键盘鼠标控制（使用InputManager）');
        
        // 检查InputManager是否存在，如果不存在则等待
        if (InputManager.instance) {
            // 创建绑定的函数引用并保存
            this.boundOnKeyDown = this.onKeyDown.bind(this);
            this.boundOnKeyUp = this.onKeyUp.bind(this);
            this.boundOnMouseDown = this.onMouseDown.bind(this);
            this.boundOnMouseUp = this.onMouseUp.bind(this);
            this.boundOnMouseMove = this.onMouseMove.bind(this);
            
            InputManager.instance.addKeyDownListener(this.boundOnKeyDown);
            InputManager.instance.addKeyUpListener(this.boundOnKeyUp);
            InputManager.instance.addMouseDownListener(this.boundOnMouseDown);
            InputManager.instance.addMouseUpListener(this.boundOnMouseUp);
            InputManager.instance.addMouseMoveListener(this.boundOnMouseMove);
            console.log('Shot: 键盘鼠标控制设置成功');
        } else {
            console.error('Shot: InputManager实例不存在，尝试延迟重试...');
            // 延迟重试
            this.scheduleOnce(() => {
                this.setupKeyboardMouseControls();
            }, 0.2);
        }
        
        console.log('键盘鼠标模式已启用');
    }

    private setupVirtualJoystickControls(): void {
        console.log('Shot: 设置虚拟摇杆控制');
        
        // 查找开火按钮节点
        const canvas = find('Canvas');
        if (canvas) {
            console.log('Canvas下的子节点:');
            for (let i = 0; i < canvas.children.length; i++) {
                const child = canvas.children[i];
                console.log(`  - ${child.name} (active: ${child.active})`);
            }
            
            // 查找shoot节点
            const shootNode = canvas.getChildByName('shoot');
            if (shootNode) {
                console.log('✅ 找到shoot节点:', shootNode.name);
                
                // 检查是否有Button组件
                const button = shootNode.getComponent(Button);
                if (button) {
                    console.log('✅ shoot节点有Button组件');
                    console.log('📝 请在Cocos Creator中配置shoot按钮的Click Events：');
                    console.log('   - Target: 拖拽Player节点');
                    console.log('   - Component: 选择PlayerShooter');
                    console.log('   - Function: 选择onFireButtonClick');
                } else {
                    console.warn('⚠️ shoot节点没有Button组件');
                }
            } else {
                console.warn('⚠️ 未找到shoot节点');
            }
        } else {
            console.error('❌ 未找到Canvas节点！');
        }
        
        // 提供键盘备用方案
        console.log('📱 虚拟摇杆模式控制说明：');
        console.log('  - 移动：屏幕左侧摇杆');
        console.log('  - 瞄准：屏幕右侧摇杆');
        console.log('  - 开火：点击shoot按钮或按空格键');
        
        console.log('虚拟摇杆控制设置完成');
    }
    
    // Click Event回调方法 - 由Button组件调用
    public onFireButtonClick(): void {
        console.log('🔥 Click Event: 开火按钮被点击');
        this.fireKeyPressed = true;
        
        // 短暂延迟后重置开火状态，模拟按压效果
        this.scheduleOnce(() => {
            this.fireKeyPressed = false;
        }, 0.1);
    }

    private onKeyDown(keyCode: number): void {
        // R键换弹（两种模式通用）
        if (keyCode === KeyCode.KEY_R) {
            console.log('Shot: R键按下 - 开始换弹');
            this.reloadKeyPressed = true;
            this.tryReload();
        }
        
        // 虚拟摇杆模式下的键盘备用方案
        if (this.useVirtualJoystick) {
            // 空格键开火（虚拟摇杆模式的备用方案）
            if (keyCode === KeyCode.SPACE) {
                console.log('🔥 Shot: 空格键开火（虚拟摇杆模式）');
                this.fireKeyPressed = true;
            }
        }
    }

    private onKeyUp(keyCode: number): void {
        if (keyCode === KeyCode.KEY_R) {
            this.reloadKeyPressed = false;
        }
        
        // 虚拟摇杆模式下的键盘备用方案
        if (this.useVirtualJoystick) {
            // 空格键开火（虚拟摇杆模式的备用方案）
            if (keyCode === KeyCode.SPACE) {
                console.log('🔥 Shot: 空格键释放 - 停止开火');
                this.fireKeyPressed = false;
            }
        }
    }

    private onMouseMove(event: EventMouse): void {
        if (this.useVirtualJoystick) return;
        
        // 计算鼠标方向
        this.updateMouseDirection(event);
    }

    private onMouseDown(button: number, event: EventMouse): void {
        if (this.useVirtualJoystick) return;
        
        console.log(`Shot: 鼠标按下 - 按钮${button}`);
        
        if (button === EventMouse.BUTTON_LEFT) {
            console.log('Shot: 鼠标左键按下 - 开始射击');
            this.fireKeyPressed = true;
            this.tryFire();
        }
    }

    private onMouseUp(button: number, event: EventMouse): void {
        console.log(`Shot: onMouseUp被调用 - 按钮${button}, useVirtualJoystick: ${this.useVirtualJoystick}`);
        
        if (this.useVirtualJoystick) return;
        
        if (button === EventMouse.BUTTON_LEFT) {
            console.log('Shot: 鼠标左键释放 - 停止射击');
            this.fireKeyPressed = false;
        }
    }

    private updateMouseDirection(event: EventMouse): void {
        if (!this.mainCamera) {
            console.warn('未设置主相机，无法计算鼠标方向');
            return;
        }

        const mousePos = event.getLocation();
        const playerPos = this.node.worldPosition;
        
        // 将玩家位置转换为屏幕坐标
        const playerScreenPos = this.mainCamera.worldToScreen(v3(playerPos.x, playerPos.y, playerPos.z));
        
        // 计算方向向量
        const dx = mousePos.x - playerScreenPos.x;
        const dy = mousePos.y - playerScreenPos.y;
        
        // 归一化方向向量
        const length = Math.sqrt(dx * dx + dy * dy);
        if (length > 0) {
            this.mouseDirection.x = dx / length;
            this.mouseDirection.y = dy / length;
            this.mouseDirection.z = 0;
            
            // 调试信息
            // console.log(`鼠标方向: (${this.mouseDirection.x.toFixed(2)}, ${this.mouseDirection.y.toFixed(2)})`);
        }
    }

    

    // 设置摇杆角度（由摇杆组件调用）- 现在主要用于左摇杆移动
    public setJoystickAngle(angle: number): void {
        this.joystickAngle = angle;
    }

    // 设置瞄准摇杆方向（由PlayerAim调用）
    public setAimJoystickDirection(direction: Vec3): void {
        this.aimJoystickDirection = direction.clone();
        this.aimJoystickDirection.normalize();
    }

    private tryFire(): void {
        // 检查是否可以射击
        if (!this.canFire || this.isReloading || this.currentAmmo <= 0) {
            if (this.currentAmmo <= 0) {
                console.log('弹药耗尽！请换弹');
            }
            return;
        }

        const currentTime = Date.now() / 1000;
        if (currentTime - this.lastFireTime < this.fireRate) {
            return; // 射速限制
        }

        this.fire();
    }

    private fire(): void {
        if (!this.bulletPrefab) {
            console.error('子弹预制体未设置！');
            return;
        }

        // 创建子弹
        const bullet = instantiate(this.bulletPrefab);
        
        // 设置子弹位置（玩家当前位置）
        bullet.setPosition(this.node.getPosition());

        // 计算射击方向
        const direction = this.getFireDirection();
        
        console.log(`🔥 发射子弹: 方向(${direction.x.toFixed(2)}, ${direction.y.toFixed(2)})`);
        
        // 设置子弹速度和方向
        const bulletScript = bullet.getComponent(Bullet);
        if (bulletScript) {
            bulletScript.initialize(direction, this.bulletSpeed, this.bulletDamage);
        } else {
            console.warn('子弹预制体没有Bullet组件，尝试添加...');
            // 尝试动态添加Bullet组件
            const addedScript = bullet.addComponent(Bullet);
            if (addedScript) {
                addedScript.initialize(direction, this.bulletSpeed, this.bulletDamage);
            } else {
                console.error('无法添加Bullet组件，销毁子弹');
                bullet.destroy();
                return;
            }
        }

        // 将子弹添加到场景中
        this.node.parent.addChild(bullet);

        // 更新射击状态
        this.currentAmmo--;
        this.lastFireTime = Date.now() / 1000;
        this.canFire = false;

        // 播放射击音效（如果有的话）
        // AudioManager.instance.playGunshot();

        console.log(`🔥 开火！弹药: ${this.currentAmmo}/${this.maxAmmo}`);

        // 射击冷却
        this.scheduleOnce(() => {
            this.canFire = true;
        }, this.fireRate);

        // 自动换弹（如果弹匣为空）
        if (this.currentAmmo <= 0) {
            this.scheduleOnce(() => {
                this.tryReload();
            }, 0.5); // 延迟0.5秒自动换弹
        }
    }

    private getFireDirection(): Vec3 {
        // 如果启用敌人追踪模式，优先自动瞄准
        if (this.autoAimMode) {
            const enemyDirection = this.getNearestEnemyDirection();
            if (enemyDirection) {
                console.log(`自动瞄准敌人: 方向(${enemyDirection.x.toFixed(2)}, ${enemyDirection.y.toFixed(2)})`);
                return enemyDirection;
            }
        }

        // 否则检查是否有右摇杆（瞄准摇杆）输入
        const hasAimJoystickInput = this.aimJoystickDirection.length() > 0.01;
        
        if (hasAimJoystickInput) {
            console.log(`使用右摇杆方向: (${this.aimJoystickDirection.x.toFixed(2)}, ${this.aimJoystickDirection.y.toFixed(2)})`);
            return this.aimJoystickDirection.clone();
        }

        // 否则使用默认射击方向
        if (this.useVirtualJoystick) {
            // 虚拟摇杆模式：使用摇杆方向（备用，通常不使用）
            const x = Math.cos(this.joystickAngle);
            const y = Math.sin(this.joystickAngle);
            console.log(`使用备用摇杆方向: (${x.toFixed(2)}, ${y.toFixed(2)})`);
            return new Vec3(x, y, 0);
        } else {
            // 键盘鼠标模式：使用鼠标方向
            console.log(`使用鼠标方向: (${this.mouseDirection.x.toFixed(2)}, ${this.mouseDirection.y.toFixed(2)})`);
            return Vec3.clone(this.mouseDirection);
        }
    }

    // 获取最近敌人的方向
    private getNearestEnemyDirection(): Vec3 | null {
        // 查找场景中所有敌人
        const enemies: Node[] = [];
        
        // 递归搜索所有节点寻找敌人
        this.findEnemies(find('Canvas'), enemies);
        
        if (enemies.length === 0) {
            console.log('未找到敌人');
            return null;
        }

        // 找到最近的敌人
        let nearestEnemy: Node | null = null;
        let minDistance = Infinity;
        const playerPos = this.node.worldPosition;

        for (const enemy of enemies) {
            const enemyPos = enemy.worldPosition;
            const dx = enemyPos.x - playerPos.x;
            const dy = enemyPos.y - playerPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // 检查是否在追踪范围内
            if (distance <= this.aimRange && distance < minDistance) {
                minDistance = distance;
                nearestEnemy = enemy;
            }
        }

        if (!nearestEnemy) {
            console.log(`范围内(${this.aimRange})未找到敌人`);
            return null;
        }

        // 计算方向向量
        const enemyPos = nearestEnemy.worldPosition;
        let direction = new Vec3(
            enemyPos.x - playerPos.x,
            enemyPos.y - playerPos.y,
            0
        );

        // 归一化方向向量
        Vec3.normalize(direction, direction);
        
        console.log(`找到最近敌人，距离: ${minDistance.toFixed(1)}`);
        return direction;
    }

    // 递归搜索敌人节点
    private findEnemies(node: Node, enemyList: Node[]): void {
        if (!node) return;

        // 检查当前节点是否是敌人
        const nodeName = node.name.toLowerCase();
        const hasEnemyScript = node.getComponent('testmove') || node.getComponent('Enemy');
        
        if (hasEnemyScript || nodeName.includes('enemy') || nodeName.includes('怪物')) {
            enemyList.push(node);
        }

        // 递归检查子节点
        for (let i = 0; i < node.children.length; i++) {
            this.findEnemies(node.children[i], enemyList);
        }
    }

    private tryReload(): void {
        if (this.isReloading || this.currentAmmo >= this.maxAmmo) {
            return;
        }

        this.startReload();
    }

    private startReload(): void {
        this.isReloading = true;
        console.log('开始换弹...');

        // 播放换弹音效（如果有的话）
        // AudioManager.instance.playReload();

        this.scheduleOnce(() => {
            this.completeReload();
        }, this.reloadTime);
    }

    private completeReload(): void {
        this.currentAmmo = this.maxAmmo;
        this.isReloading = false;
        console.log(`换弹完成！弹药: ${this.currentAmmo}/${this.maxAmmo}`);
    }

    update(deltaTime: number): void {
        // 持续射击（如果按住开火键）
        if (this.fireKeyPressed) {
            this.tryFire();
        }
    }

    // 调试方法：输出节点层次结构
    private logNodeHierarchy(node: Node, depth: number): void {
        if (depth > 3) return; // 限制递归深度
        
        const indent = '  '.repeat(depth);
        for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i];
            console.log(`${indent}- ${child.name} (active: ${child.active})`);
            
            // 检查是否是UI按钮相关的
            const lowerName = child.name.toLowerCase();
            if (lowerName.includes('fire') || lowerName.includes('button') || 
                lowerName.includes('reload') || lowerName.includes('shoot')) {
                console.log(`${indent}  🎯 发现可能的UI按钮节点！`);
            }
            
            this.logNodeHierarchy(child, depth + 1);
        }
    }

    protected onDestroy(): void {
        // 清理事件监听
        if (this.useVirtualJoystick) {
            // 使用Click Event时无需手动清理，由Button组件自动管理
            console.log('🔥 使用Click Event模式，无需手动清理事件监听器');
        } else {
            // 键盘鼠标模式清理
            if (InputManager.instance) {
                if (this.boundOnKeyDown) {
                    InputManager.instance.removeKeyDownListener(this.boundOnKeyDown);
                    this.boundOnKeyDown = null;
                }
                if (this.boundOnKeyUp) {
                    InputManager.instance.removeKeyUpListener(this.boundOnKeyUp);
                    this.boundOnKeyUp = null;
                }
                if (this.boundOnMouseDown) {
                    InputManager.instance.removeMouseDownListener(this.boundOnMouseDown);
                    this.boundOnMouseDown = null;
                }
                if (this.boundOnMouseUp) {
                    InputManager.instance.removeMouseUpListener(this.boundOnMouseUp);
                    this.boundOnMouseUp = null;
                }
                if (this.boundOnMouseMove) {
                    InputManager.instance.removeMouseMoveListener(this.boundOnMouseMove);
                    this.boundOnMouseMove = null;
                }
            }
        }

        this.unscheduleAllCallbacks();
    }

    // 公共方法：获取弹药信息
    public getAmmoInfo(): { current: number, max: number, isReloading: boolean } {
        return {
            current: this.currentAmmo,
            max: this.maxAmmo,
            isReloading: this.isReloading
        };
    }

    // 公共方法：添加弹药
    public addAmmo(amount: number): void {
        this.currentAmmo = Math.min(this.currentAmmo + amount, this.maxAmmo);
        console.log(`获得弹药 ${amount}，当前弹药: ${this.currentAmmo}/${this.maxAmmo}`);
    }

    // 测试方法：向固定方向发射子弹（用于调试）
    public testFireFixedDirection(direction: Vec3 = new Vec3(1, 0, 0)): void {
        if (!this.bulletPrefab) {
            console.error('子弹预制体未设置！');
            return;
        }

        // 创建子弹
        const bullet = instantiate(this.bulletPrefab);
        
        // 设置子弹位置（玩家当前位置）
        bullet.setPosition(this.node.getPosition());

        console.log(`测试发射子弹: 位置(${this.node.getPosition().x.toFixed(1)}, ${this.node.getPosition().y.toFixed(1)}), 固定方向(${direction.x.toFixed(2)}, ${direction.y.toFixed(2)})`);
        
        // 设置子弹速度和方向
        const bulletScript = bullet.getComponent(Bullet);
        if (bulletScript) {
            bulletScript.initialize(direction, this.bulletSpeed, this.bulletDamage);
            console.log('测试子弹初始化成功');
        } else {
            console.error('子弹预制体没有Bullet组件！');
            bullet.destroy();
            return;
        }

        // 将子弹添加到场景中
        this.node.parent.addChild(bullet);
    }
}