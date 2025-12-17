# 🐛 问题修复指南

## ✅ 已解决的问题

### 1. EventMouse is not defined
**问题原因**: 缺少EventMouse导入
**解决方案**: 
```typescript
import { EventMouse, systemEvent, SystemEvent } from 'cc';
```

### 2. 角色移动和镜头跟随问题
**问题原因**: 
- 角色移动逻辑正确，但需要确保相机跟随脚本正确设置
- 相机跟随脚本已存在但可能未正确绑定

**解决方案**:
1. **确保相机跟随脚本设置**:
   - 在Main Camera节点添加 `CameraFollowWithBounds` 脚本
   - 绑定Player节点到Player属性
   - 调整followSpeed（建议：5-10）

2. **移动脚本优化**:
   - 添加了调试信息
   - 确保角色居中移动

### 3. 左键开火没有反应
**问题原因**: 
- 鼠标事件绑定方式不正确
- 使用了错误的API

**解决方案**:
1. **修复事件绑定**:
```typescript
// 正确的鼠标事件绑定
systemEvent.on(SystemEvent.EventType.MOUSE_DOWN, this.onMouseDown, this);
systemEvent.on(SystemEvent.EventType.MOUSE_UP, this.onMouseUp, this);
systemEvent.on(SystemEvent.EventType.MOUSE_MOVE, this.onMouseMove, this);
```

2. **添加调试日志**:
```typescript
console.log('鼠标左键按下 - 开始射击');
console.log('鼠标左键释放 - 停止射击');
```

## 🔧 设置检查清单

### 键盘鼠标模式设置
- [ ] PlayerShooter的 `useVirtualJoystick = false`
- [ ] move的 `useVirtualJoystick = false`  
- [ ] Main Camera绑定到PlayerShooter的mainCamera属性
- [ ] Main Camera添加CameraFollowWithBounds脚本
- [ ] Player绑定到CameraFollowWithBounds的player属性

### 虚拟摇杆模式设置
- [ ] PlayerShooter的 `useVirtualJoystick = true`
- [ ] move的 `useVirtualJoystick = true`
- [ ] DualJoystick正确绑定到相关组件
- [ ] FireButton和ReloadButton正确绑定

## 🎯 测试步骤

### 1. 测试键盘鼠标模式
```
1. 设置 useVirtualJoystick = false
2. 绑定Main Camera
3. 运行游戏
4. 检查控制台是否显示：'PlayerShooter initialized - Mode: Keyboard + Mouse'
5. 测试WASD移动
6. 测试鼠标控制朝向
7. 测试左键射击
8. 测试R键换弹
```

### 2. 测试虚拟摇杆模式
```
1. 设置 useVirtualJoystick = true
2. 绑定双摇杆和按钮
3. 运行游戏
4. 检查控制台是否显示：'PlayerShooter initialized - Mode: Virtual Joystick'
5. 测试左摇杆移动
6. 测试右摇杆朝向
7. 测试开火按钮
8. 测试换弹按钮
```

## 🐍 调试技巧

### 1. 启用调试信息
在shot.ts中取消注释：
```typescript
console.log(`鼠标方向: (${this.mouseDirection.x.toFixed(2)}, ${this.mouseDirection.y.toFixed(2)})`);
console.log(`摇杆移动: dx=${dx.toFixed(2)}, dy=${dy.toFixed(2)}`);
console.log(`角色移动到: (${currentPos.x.toFixed(1)}, ${currentPos.y.toFixed(1)})`);
```

### 2. 检查控制台输出
正常启动时应看到：
```
PlayerShooter initialized - Mode: Keyboard + Mouse
Ammo: 30/30
GameUI initialized
鼠标左键按下 - 开始射击
开火！剩余弹药: 29/30
```

### 3. 使用DebugHelper
1. 在Canvas上添加DebugHelper脚本
2. 绑定一个Label节点用于显示调试信息
3. 可以实时看到调试输出

## ⚠️ 常见错误

### 1. 鼠标不响应
- 确认Main Camera已绑定
- 确认useVirtualJoystick = false
- 检查控制台是否有'未设置主相机'警告

### 2. 角色不移动
- 确认move和PlayerShooter的useVirtualJoystick设置一致
- 检查WASD键是否被其他脚本拦截
- 查看控制台移动调试信息

### 3. 相机不跟随
- 确认CameraFollowWithBounds脚本已添加
- 确认Player已绑定
- 调整followSpeed值

### 4. UI不显示
- 确认GameUI脚本已添加
- 确认UI节点已正确绑定
- 检查UI容器active状态

## 📞 故障排除

如果问题仍然存在：

1. **重新编译**: 清理并重新构建项目
2. **检查版本**: 确认Cocos Creator版本兼容性
3. **测试简化版本**: 先测试最基本的功能
4. **查看控制台**: 仔细检查所有错误和警告信息
5. **逐步添加**: 从基础功能开始，逐步添加复杂功能

所有修复已应用，系统应该能正常工作！🎉