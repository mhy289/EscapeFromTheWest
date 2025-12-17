# 输入系统修复说明

## 问题描述
无法三个操作同时进行：可以同时按两个方向键，但点击左键时，某个操作就会失效。这是由于多个组件同时监听相同的输入事件导致的事件冲突问题。

## 解决方案
创建了统一的输入管理器 `InputManager` 来解决事件冲突：

### 1. 新增文件
- `assets/scripts/player/InputManager.ts` - 统一输入管理器
- `assets/scripts/game/GameManager.ts` - 游戏管理器，负责初始化InputManager

### 2. 修改文件
- `assets/scripts/player/move.ts` - 改为使用InputManager
- `assets/scripts/player/shot.ts` - 改为使用InputManager

## 设置步骤

### 步骤1: 添加GameManager到场景
1. 在场景中创建一个空节点（如果还没有）
2. 将该节点命名为 `GameManager`
3. 将 `GameManager.ts` 脚本添加到该节点上
4. 在Inspector中可以保持 `inputManagerNode` 为空（会自动在GameManager节点上添加InputManager）

### 步骤2: 验证InputManager
1. 运行游戏
2. 查看控制台，应该看到：
   ```
   GameManager: 初始化游戏系统
   GameManager: 在GameManager节点上添加InputManager组件
   InputManager: 初始化完成
   InputManager: 输入事件监听设置完成
   ```

### 步骤3: 测试输入
现在应该可以同时进行三个操作：
- 同时按住 WASD 键进行移动
- 同时点击鼠标左键进行射击
- 同时按住 R 键进行换弹

### 步骤4: 关闭调试日志（可选）
如果觉得调试日志太多，可以注释掉InputManager中的console.log语句：
```typescript
// 注释掉这些行
// console.log(`InputManager: 按键按下 - ${this.getKeyName(keyCode)}`);
// console.log(`InputManager: 鼠标按下 - 按钮${button}`);
```

## 技术原理

### 问题原因
之前的实现中：
- `move.ts` 和 `shot.ts` 都调用 `input.on(Input.EventType.KEY_DOWN, ...)`
- Cocos Creator的事件系统可能存在事件监听器冲突
- 当多个组件监听同一事件时，可能导致某些监听器失效

### 解决原理
- `InputManager` 作为单例，统一管理所有输入事件
- 其他组件通过 `InputManager.instance` 注册监听器
- 所有事件在InputManager中被统一处理，然后分发到各个组件
- 避免了多个组件直接监听同一事件的冲突

### 优势
1. **无冲突**: 所有输入事件统一管理，避免监听器冲突
2. **单例模式**: 确保全局只有一个InputManager实例
3. **统一调试**: 所有输入事件都在一个地方记录，便于调试
4. **扩展性**: 新增输入类型只需在InputManager中添加
5. **解耦**: 组件之间不直接依赖输入系统，通过InputManager接口交互

## 验证方法

运行游戏后，在控制台应该看到完整的输入事件日志：
```
InputManager: 按键按下 - W
InputManager: 按键按下 - A
InputManager: 鼠标按下 - 按钮0
Move: 按键按下 - W
Move: 按键按下 - A
Shot: 鼠标左键按下 - 开始射击
```

如果看到这些日志，说明输入系统修复成功，现在可以同时进行移动和射击操作了。