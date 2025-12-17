# 场景设置检查清单

## 必须完成的步骤

### 1. 检查 GameManager 是否存在
在场景层级面板中确认有一个名为 `GameManager` 的节点，并且上面挂载了 `GameManager` 脚本。

### 2. 检查脚本加载顺序
确保 GameManager 节点在场景中的加载顺序：
- GameManager 节点应该在 Player 节点之前初始化
- 在 Cocos Creator 中，可以通过调整节点层级顺序来控制初始化顺序
- 建议将 GameManager 放在场景层级的最顶部

### 3. 验证初始化日志
运行游戏后，控制台应该显示：
```
GameManager: 开始初始化InputManager
GameManager: InputManager.instance = 不存在
GameManager: 在GameManager节点上添加InputManager组件
GameManager: 添加InputManager组件
InputManager: 初始化完成
InputManager: 输入事件监听设置完成
GameManager: 延迟检查 - InputManager.instance = 成功
Move: 开始设置控制，当前模式：键盘
Move: InputManager.instance = 存在
Move: 设置键盘控制（使用InputManager）
Move: 键盘控制设置成功
Shot: 设置键盘鼠标控制（使用InputManager）
Shot: 键盘鼠标控制设置成功
```

## 故障排除

### 如果看不到 GameManager 日志
- 确认场景中确实有 GameManager 节点
- 确认 GameManager 节点上挂载了 GameManager.ts 脚本
- 尝试删除 GameManager 节点后重新创建

### 如果看到 "InputManager实例不存在" 错误
- 检查 GameManager 节点是否在 Player 节点之前加载
- 尝试将 GameManager 节点拖到场景层级面板的最顶部
- 检查是否有其他脚本错误导致初始化失败

### 如果按键还是不起作用
- 运行游戏并按住 WASD 键
- 检查控制台是否显示：
  ```
  InputManager: 按键按下 - W
  Move: 按键按下 - W
  Move: 按键状态 - Up:true Down:false Left:false Right:false
  ```
- 如果只有 InputManager 日志而没有 Move 日志，说明监听器注册失败

## 快速修复方案

如果上述步骤都不行，可以尝试这个简单方案：

1. 删除场景中的所有 GameManager 相关内容
2. 在 Player 节点上直接添加 InputManager 组件：
   - 选择 Player 节点
   - 在 Inspector 中点击 "添加组件"
   - 搜索并添加 "InputManager"
   - 确保 InputManager 组件在 Player 节点上，且在 move 和 shot 组件之前

这样 InputManager 会随着 Player 节点一起初始化，确保其他组件能找到它。