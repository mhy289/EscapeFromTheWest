# 射击控制系统使用指南

## 概述
这个射击控制系统支持**双模式操作**：

### 🎮 **模式一：键盘鼠标模式**
- **WASD**: 移动控制
- **鼠标**: 控制角色朝向
- **左键**: 开火
- **R键**: 换弹

### 📱 **模式二：虚拟摇杆模式**
- **左摇杆**: 移动控制
- **右摇杆**: 朝向控制
- **开火按钮**: 开火
- **换弹按钮**: 换弹

### 核心功能
- 完整的弹药管理系统
- 流畅的射击控制
- 支持两种操作模式切换
- 模块化设计，易于扩展

## 文件结构
```
assets/scripts/
├── player/
│   ├── shot.ts              # 射击控制系统（支持双模式）
│   ├── Bullet.ts            # 子弹逻辑
│   ├── PlayerController.ts  # 玩家控制器
│   └── move.ts              # 移动控制（支持双模式）
└── ui/
    ├── VirtualJoystick.ts   # 虚拟摇杆
    ├── DualJoystick.ts      # 双摇杆系统
    └── GameUI.ts           # 游戏UI管理（支持双模式）
```

## 快速设置指南

### 1. 选择操作模式
在PlayerShooter组件中设置：
- `useVirtualJoystick = false`: 键盘鼠标模式
- `useVirtualJoystick = true`: 虚拟摇杆模式

### 2. 玩家节点设置
在Cocos Creator中：
1. 创建一个玩家节点（Player）
2. 添加以下组件：
   - `PlayerController` 脚本
   - `move` 脚本（用于移动）
   - `PlayerShooter` 脚本
   - 刚体组件（RigidBody）
   - 碰撞体组件（Collider）

### 3. UI节点设置（根据模式选择）

#### **键盘鼠标模式UI**：
```
Canvas/
├── KeyboardUI/           # 键盘模式UI容器
│   ├── AmmoLabel        # 弹药显示
│   └── HealthLabel      # 生命值显示
└── Camera               # 主相机（需要在PlayerShooter中绑定）
```

#### **虚拟摇杆模式UI**：
```
Canvas/
├── VirtualJoystickUI/    # 摇杆模式UI容器
│   ├── FireButton        # 开火按钮
│   ├── ReloadButton      # 换弹按钮
│   ├── AmmoLabel         # 弹药显示
│   └── HealthLabel       # 生命值显示
├── DualJoystick/         # 双摇杆系统
│   ├── LeftJoystick/     # 左摇杆（移动）
│   │   ├── JoystickBg
│   │   └── JoystickKnob
│   └── RightJoystick/    # 右摇杆（朝向）
│       ├── JoystickBg
│       └── JoystickKnob
```

### 4. 组件脚本添加
- DualJoystick节点添加 `DualJoystick` 脚本
- LeftJoystick和RightJoystick节点添加 `VirtualJoystick` 脚本
- Canvas节点添加 `GameUI` 脚本

### 5. 组件绑定
在Cocos Creator编辑器中拖拽绑定：

**PlayerController组件：**
- Shooter: 拖拽玩家节点到这个字段
- Mover: 拖拽玩家节点到这个字段  
- Joystick: 拖拽VirtualJoystick节点到这个字段（单摇杆模式）
- Dual Joystick: 拖拽DualJoystick节点到这个字段（双摇杆模式）

**PlayerShooter组件：**
- Bullet Prefab: 创建子弹预制体并拖拽到这里
- Use Virtual Joystick: 设置操作模式（false=键盘鼠标，true=虚拟摇杆）
- Main Camera: 拖拽主相机节点（键盘鼠标模式必需）
- Fire Button: 拖拽FireButton节点（虚拟摇杆模式）
- Reload Button: 拖拽ReloadButton节点（虚拟摇杆模式）
- Virtual Joystick: 拖拽VirtualJoystick节点（单摇杆模式）

**move组件：**
- Use Virtual Joystick: 设置操作模式（与PlayerShooter保持一致）
- Dual Joystick: 拖拽DualJoystick节点（虚拟摇杆模式）

**DualJoystick组件：**
- Left Joystick: 拖拽左摇杆节点
- Right Joystick: 拖拽右摇杆节点

**VirtualJoystick组件（每个摇杆都需要）：**
- Joystick Bg: 拖拽摇杆背景节点
- Joystick Knob: 拖拽摇杆手柄节点
- Max Radius: 设置摇杆最大半径（建议80）

**GameUI组件：**
- Fire Button: 拖拽FireButton节点
- Reload Button: 拖拽ReloadButton节点
- Ammo Label: 拖拽弹药显示标签
- Health Label: 拖拽生命值显示标签
- Joystick Node: 拖拽VirtualJoystick节点
- Dual Joystick Node: 拖拽DualJoystick节点
- Keyboard UI: 拖拽键盘模式UI容器
- Virtual Joystick UI: 拖拽虚拟摇杆模式UI容器
- Player Shooter: 拖拽玩家节点

## 操作说明

### 🎮 **模式一：键盘鼠标操作**
- **WASD**: 移动控制
- **鼠标移动**: 控制角色朝向
- **鼠标左键**: 开火（按住连发）
- **R键**: 换弹

### 📱 **模式二：虚拟摇杆操作**
- **左摇杆**: 移动控制
- **右摇杆**: 控制角色朝向
- **开火按钮**: 开火（按住连发）
- **换弹按钮**: 点击换弹

### 🔧 **模式切换**
修改PlayerShooter和move组件的`useVirtualJoystick`属性：
- `false`: 键盘鼠标模式
- `true`: 虚拟摇杆模式

## 自定义配置

### 射击参数（PlayerShooter组件）
- `Bullet Speed`: 子弹速度（默认800）
- `Fire Rate`: 射击间隔秒数（默认0.15）
- `Max Ammo`: 最大弹药数（默认30）
- `Reload Time`: 换弹时间秒数（默认2.0）
- `Bullet Damage`: 子弹伤害（默认25）

### 摇杆参数（VirtualJoystick组件）
- `Max Radius`: 摇杆最大半径（默认80像素）

## 创建子弹预制体
1. 创建一个Sprite节点作为子弹
2. 添加刚体组件（RigidBody）
3. 添加碰撞体组件（Collider），设置为触发器
4. 添加 `Bullet` 脚本
5. 拖拽到预制体文件夹创建预制体
6. 将预制体拖拽到PlayerShooter的Bullet Prefab字段

## 敌人设置
敌人节点需要：
1. 包含 "Enemy" 或 "怪物" 的名称
2. 添加包含 `takeDamage()` 方法的脚本

## 扩展功能

### 添加音效
在对应位置取消注释并实现：
```typescript
// AudioManager.instance.playGunshot();  // 射击音效
// AudioManager.instance.playReload();   // 换弹音效
```

### 添加击中特效
在Bullet.ts的destroyBullet方法中添加特效逻辑

### 生命值系统
PlayerController已包含完整生命值系统，需要在GameUI中连接显示

## 调试技巧
1. 查看控制台输出了解弹药和伤害信息
2. 使用调试模式检查组件绑定是否正确
3. 测试键盘和触摸两种控制方式

## 常见问题

### 通用问题
1. **子弹不出现**: 检查子弹预制体是否正确设置
2. **换弹失败**: 确认弹药参数设置正确

### 键盘鼠标模式问题
3. **鼠标不控制朝向**: 
   - 检查Main Camera是否绑定到PlayerShooter
   - 确认相机组件正确设置
4. **左键不射击**: 检查PlayerShooter的`useVirtualJoystick`是否设为false

### 虚拟摇杆模式问题
5. **摇杆不工作**: 
   - 确认VirtualJoystick和DualJoystick脚本的节点引用
   - 检查摇杆背景和手柄节点是否正确绑定
6. **按钮没响应**: 检查GameUI脚本的节点绑定
7. **UI不显示**: 确认`useVirtualJoystick`设置正确，UI会根据模式自动显示/隐藏

### 模式切换问题
8. **模式切换后UI不变化**: 
   - 确保PlayerShooter和move组件的`useVirtualJoystick`设置一致
   - 检查GameUI组件的UI容器节点绑定

这个系统提供了完整的双模式射击游戏框架，支持PC和移动端，可以根据具体游戏需求进行扩展和定制。