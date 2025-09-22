> [中文版本 (Chinese Version)](README.md)| [English Version](README_en.md)


# EscapeFromTheWest

## 项目简介
《EscapeFromTheWest》是一款基于 Cocos Creator 开发的游戏项目，本仓库包含游戏的核心代码、资源及开发规范，旨在通过规范化的团队协作流程，保证项目开发效率与代码质量。


## 环境配置
### 开发工具
- **Cocos Creator 版本**：3.8.7（团队成员必须使用统一版本，避免资源兼容问题）
- **开发语言**：TypeScript（遵循 ES6+ 语法规范）


## 快速开始
1. **克隆仓库**
   ```bash
   git clone [仓库地址]
   cd EscapeFromTheWest
   ```

2. **环境准备**
   - 安装 Cocos Creator 3.8.7（版本需严格匹配）
   - 打开 Cocos Creator，导入当前项目目录

3. **分支初始化**
   ```bash
   # 同步主分支最新代码
   git checkout main
   git pull origin main
   
   # 创建个人功能分支（命名格式：feature/功能名 或 fix/bug描述）
   git checkout -b feature/your-feature-name
   ```


## 项目结构
核心目录结构遵循团队开发规范，关键目录说明如下：
```
EscapeFromTheWest/
├─ assets/               # 游戏核心资源（手动创建的资源需提交）
│  ├─ textures/          # 图片资源（按模块分类：ui/、role/、map/等）
│  ├─ audio/             # 音频资源（bgm/、sound/等）
│  ├─ prefabs/           # 预制体（按功能分类）
│  ├─ scripts/           # 脚本文件（按模块分类，与类名一致）
│  └─ scenes/            # 场景文件（主场景、子场景分离）
├─ settings/             # 项目配置（构建配置、图层设置等，需提交）
├─ .gitignore            # Git 忽略文件配置
├─ DEVELOPMENT_GUIDE.md  # 团队开发规范文档
└─ LICENSE               # Apache License 2.0 协议
```


## 开发规范
请严格遵循项目根目录下的 `DEVELOPMENT_GUIDE.md` 文档，核心规范包括：
1. **分支策略**：主分支 `main` 仅通过 PR 合并，功能开发使用 `feature/xxx` 分支，Bug 修复使用 `fix/xxx` 分支
2. **代码提交**：提交信息格式为 `[类型] 描述`（如 `[feat] 新增玩家移动功能`），类型包括 feat/fix/docs 等
3. **资源管理**：文件命名使用「小写+连字符」，大文件（>100MB）需用 Git LFS 或云盘共享
4. **PR 流程**：提交 PR 前需同步主分支代码、本地测试通过，并 @ 至少 1 名审阅人


## 许可证
本项目基于 Apache License 2.0 协议开源，详见 `LICENSE` 文件。


## 团队协作
- 每日下班前同步 `main` 分支代码，避免冲突积累
- 遇到技术问题或冲突，优先在团队群沟通
- 版本发布后需在 `main` 分支打 Tag（如 `v1.0.0`），并注明发布内容

## 行为准则
本项目遵循 [Contributor Covenant v2.0](CODE_OF_CONDUCT.md) 行为准则，参与前请仔细阅读。

如需进一步说明，请参考 `DEVELOPMENT_GUIDE.md` 或联系团队负责人。
