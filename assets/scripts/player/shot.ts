import { _decorator, Component, Node, KeyCode, Vec3, Prefab, instantiate, math, Camera, v3, EventMouse } from 'cc';
import { InputManager } from './InputManager';
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
    useVirtualJoystick: boolean = false;

    // 状态变量
    private canFire: boolean = true;
    private isReloading: boolean = false;
    private currentAmmo: number = 30;
    private lastFireTime: number = 0;
    private joystickAngle: number = 0; // 摇杆角度（弧度）
    private mouseDirection: Vec3 = new Vec3(1, 0, 0); // 鼠标方向

    // 按键状态
    private fireKeyPressed: boolean = false;
    private reloadKeyPressed: boolean = false;

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
            InputManager.instance.addKeyDownListener(this.onKeyDown.bind(this));
            InputManager.instance.addKeyUpListener(this.onKeyUp.bind(this));
            InputManager.instance.addMouseDownListener(this.onMouseDown.bind(this));
            InputManager.instance.addMouseUpListener(this.onMouseUp.bind(this));
            InputManager.instance.addMouseMoveListener(this.onMouseMove.bind(this));
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
        // 设置触摸控制
        this.setupTouchControls();
    }

    private onKeyDown(keyCode: number): void {
        // R键换弹（两种模式通用）
        if (keyCode === KeyCode.KEY_R) {
            console.log('Shot: R键按下 - 开始换弹');
            this.reloadKeyPressed = true;
            this.tryReload();
        }
    }

    private onKeyUp(keyCode: number): void {
        if (keyCode === KeyCode.KEY_R) {
            console.log('Shot: R键释放');
            this.reloadKeyPressed = false;
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

    private setupTouchControls(): void {
        // 设置开火按钮
        if (this.fireButton) {
            this.fireButton.on(Input.EventType.TOUCH_START, this.onFireButtonPress, this);
            this.fireButton.on(Input.EventType.TOUCH_END, this.onFireButtonRelease, this);
            this.fireButton.on(Input.EventType.TOUCH_CANCEL, this.onFireButtonRelease, this);
        }

        // 设置换弹按钮
        if (this.reloadButton) {
            this.reloadButton.on(Input.EventType.TOUCH_START, this.onReloadButtonPress, this);
        }

        // 设置虚拟摇杆（如果需要自定义摇杆逻辑）
        if (this.virtualJoystick) {
            this.setupVirtualJoystick();
        }
    }

    private onFireButtonPress(): void {
        this.fireKeyPressed = true;
    }

    private onFireButtonRelease(): void {
        this.fireKeyPressed = false;
    }

    private onReloadButtonPress(): void {
        this.tryReload();
    }

    private setupVirtualJoystick(): void {
        // 这里可以添加自定义摇杆逻辑
        // 或者使用第三方摇杆插件
        console.log('Virtual joystick setup completed');
    }

    // 设置摇杆角度（由摇杆组件调用）
    public setJoystickAngle(angle: number): void {
        this.joystickAngle = angle;
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
        
        // 设置子弹速度和方向（这里需要在子弹脚本中实现）
        const bulletScript = bullet.getComponent('Bullet');
        if (bulletScript) {
            bulletScript.initialize(direction, this.bulletSpeed, this.bulletDamage);
        }

        // 将子弹添加到场景中
        this.node.parent.addChild(bullet);

        // 更新射击状态
        this.currentAmmo--;
        this.lastFireTime = Date.now() / 1000;
        this.canFire = false;

        // 播放射击音效（如果有的话）
        // AudioManager.instance.playGunshot();

        console.log(`开火！剩余弹药: ${this.currentAmmo}/${this.maxAmmo}`);

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
        if (this.useVirtualJoystick) {
            // 虚拟摇杆模式：使用摇杆方向
            const x = Math.cos(this.joystickAngle);
            const y = Math.sin(this.joystickAngle);
            return new Vec3(x, y, 0);
        } else {
            // 键盘鼠标模式：使用鼠标方向
            return Vec3.clone(this.mouseDirection);
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

    protected onDestroy(): void {
        // 清理事件监听
        if (this.useVirtualJoystick) {
            // 虚拟摇杆模式清理
            if (this.fireButton) {
                this.fireButton.off(Input.EventType.TOUCH_START, this.onFireButtonPress, this);
                this.fireButton.off(Input.EventType.TOUCH_END, this.onFireButtonRelease, this);
                this.fireButton.off(Input.EventType.TOUCH_CANCEL, this.onFireButtonRelease, this);
            }

            if (this.reloadButton) {
                this.reloadButton.off(Input.EventType.TOUCH_START, this.onReloadButtonPress, this);
            }
        } else {
            // 键盘鼠标模式清理
            if (InputManager.instance) {
                InputManager.instance.removeKeyDownListener(this.onKeyDown.bind(this));
                InputManager.instance.removeKeyUpListener(this.onKeyUp.bind(this));
                InputManager.instance.removeMouseDownListener(this.onMouseDown.bind(this));
                InputManager.instance.removeMouseUpListener(this.onMouseUp.bind(this));
                InputManager.instance.removeMouseMoveListener(this.onMouseMove.bind(this));
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
}