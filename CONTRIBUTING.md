# CONTRIBUTING.md

感谢您对《EscapeFromTheWest》项目感兴趣并愿意贡献力量！本指南将帮助您了解如何参与项目开发、提交贡献以及遵循的流程规范。


## 贡献方式
您可以通过以下方式为项目贡献：
- 提交代码修复（Bug Fix）
- 开发新功能（Feature）
- 优化现有代码或资源
- 完善文档（包括README、注释等）
- 报告Bug或提出功能建议（通过Issue）
- 参与Issue讨论或代码审查


## 开发流程

### 1. 准备工作
- 确保已阅读并同意项目的[行为准则](CODE_OF_CONDUCT.md)
- 安装必要的开发环境（见README中的环境配置）
- Fork本仓库到您的个人账号
- 克隆Fork后的仓库到本地：
  ```bash
  git clone https://github.com/您的用户名/EscapeFromTheWest.git
  cd EscapeFromTheWest
  ```


### 2. 创建分支
所有代码修改必须在独立分支中进行，分支命名遵循以下规范：
- 功能开发：`feature/简短功能描述`（例如：`feature/player-jump-animation`）
- Bug修复：`fix/问题描述`（例如：`fix/ui-button-click-issue`）
- 文档更新：`docs/文档内容`（例如：`docs/update-install-guide`）
- 紧急修复：`hotfix/问题描述`（仅用于生产环境紧急修复）

创建分支命令：
```bash
# 确保主分支是最新的
git checkout main
git pull origin main

# 创建并切换到新分支
git checkout -b feature/your-feature-name
```


### 3. 代码规范
提交代码前请确保：
- 遵循项目的代码风格（参考`DEVELOPMENT_GUIDE.md`）
- TypeScript代码通过ESLint检查
- 新增功能需包含必要的测试（如适用）
- 不提交不必要的文件（参考`.gitignore`）
- 资源文件命名使用小写+连字符格式（如：`player-idle.png`）


### 4. 提交变更
提交代码时请遵循以下规范：
- 提交信息格式：`[类型] 描述内容`
  - 类型包括：`feat`（功能）、`fix`（修复）、`docs`（文档）、`style`（格式）、`refactor`（重构）、`test`（测试）、`chore`（杂项）
  - 示例：`[feat] 添加玩家二段跳功能`

提交命令：
```bash
# 添加变更文件
git add .

# 提交变更
git commit -m "[类型] 描述内容"

# 推送到个人仓库
git push origin 您的分支名
```


### 5. 提交Pull Request (PR)
1. 在GitHub上导航到您Fork的仓库
2. 点击"Compare & pull request"按钮
3. 填写PR描述，包括：
   - 变更内容及目的
   - 相关Issue编号（如：`Fixes #123`）
   - 测试方式（如何验证您的变更）
4. 至少指定1名审阅人（可在项目成员中选择）
5. 确保所有CI检查通过（如自动测试、代码风格检查）


### 6. 代码审查与合并
- 项目维护者会审核您的PR，可能会提出修改建议
- 请根据反馈修改代码并更新PR
- 审核通过后，维护者将合并您的代码到主分支
- 合并后可删除您的功能分支


## 报告Bug
若发现Bug，请通过GitHub Issues提交，内容应包括：
- 清晰的Bug描述
- 复现步骤
- 预期结果与实际结果
- 截图或录屏（如适用）
- 运行环境（操作系统、Cocos版本等）


## 提出功能建议
功能建议请通过GitHub Issues提交，内容应包括：
- 功能描述及应用场景
- 实现思路（如有）
- 为什么该功能对项目有益


## 联系我们
如在贡献过程中有任何疑问，可通过以下方式联系：
- GitHub Issues留言
- 邮件：2568237200@qq.com

再次感谢您的贡献，让我们共同打造更好的《EscapeFromTheWest》！
