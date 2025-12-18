# 武器系统使用说明

## 功能概述

已完成的子弹发射功能包含：
- 子弹自动瞄准最近的敌人
- 子弹飞行和碰撞检测
- 敌人受到伤害和死亡逻辑

## 主要组件

### 1. PlayerShooter (shot.ts)
- 新增敌人追踪模式
- `autoAimMode`: 是否启用自动瞄准 (默认: true)
- `aimRange`: 瞄准范围 (默认: 1000像素)

### 2. Bullet (Bullet.ts)
- 增强敌人检测逻辑
- 支持多种敌人组件 (Enemy, testmove)
- 完善的伤害处理

### 3. Enemy (Enemy.ts) - 新增
- 基础敌人生命值系统
- 受伤和死亡逻辑

### 4. testmove (修改)
- 添加伤害处理接口
- 自动添加Enemy组件

## 使用方法

### 在编辑器中设置：
1. 为Player节点添加PlayerShooter组件
2. 设置bulletPrefab为子弹预制体
3. 启用autoAimMode让子弹自动瞄准敌人

### 创建敌人：
1. 创建敌人节点
2. 添加testmove组件（移动）和Enemy组件（生命值）
3. 或者直接使用Enemy预制体

### 测试：
1. 添加WeaponTest组件到测试节点
2. 设置bulletPrefab和enemyPrefab
3. 按空格键测试发射

## 工作流程

1. 玩家按射击键 (鼠标左键/开火按钮)
2. PlayerShooter查找瞄准范围内的最近敌人
3. 创建子弹并设置朝向敌人的方向
4. 子弹飞行并检测碰撞
5. 击中敌人时调用伤害方法
6. 敌人生命值归零时销毁

## 参数调整建议

- `bulletSpeed`: 子弹速度 (推荐: 800)
- `bulletDamage`: 子弹伤害 (推荐: 25)
- `fireRate`: 射击频率 (推荐: 0.15秒)
- `aimRange`: 瞄准范围 (根据关卡大小调整)

## 注意事项

1. 确保子弹预制体包含Bullet脚本和Collider组件
2. 敌人节点需要有Enemy或testmove组件才能被识别
3. Collider需要设置为Trigger模式
4. 推荐在PlayerShooter中启用autoAimMode获得最佳体验