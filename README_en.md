> [中文版本 (Chinese Version)](README.md)| [English Version](README_en.md)


# EscapeFromTheWest

## Project Introduction
"EscapeFromTheWest" is a game project developed using Cocos Creator. This repository contains the game's core code, resources, and development specifications. It aims to ensure project development efficiency and code quality through standardized team collaboration processes.


## Environment Configuration
### Development Tools
- **Cocos Creator Version**: 3.8.7 (All team members must use the same version to avoid resource compatibility issues)
- **Development Language**: TypeScript (Follows ES6+ syntax specifications)


## Quick Start
1. **Clone the Repository**
   ```bash
   git clone [repository URL]
   cd EscapeFromTheWest
   ```

2. **Environment Preparation**
   - Install Cocos Creator 3.8.7 (Version must match exactly)
   - Open Cocos Creator and import the current project directory

3. **Branch Initialization**
   ```bash
   # Sync the latest code from the main branch
   git checkout main
   git pull origin main
   
   # Create a personal feature branch (naming format: feature/feature-name or fix/bug-description)
   git checkout -b feature/your-feature-name
   ```


## Project Structure
The core directory structure follows team development specifications. Key directories are explained as follows:
```
EscapeFromTheWest/
├─ assets/               # Core game resources (Manually created resources must be committed)
│  ├─ textures/          # Image resources (Categorized by module: ui/, role/, map/, etc.)
│  ├─ audio/             # Audio resources (bgm/, sound/, etc.)
│  ├─ prefabs/           # Prefabs (Categorized by function)
│  ├─ scripts/           # Script files (Categorized by module, consistent with class names)
│  └─ scenes/            # Scene files (Main scenes and sub-scenes are separated)
├─ settings/             # Project configurations (Build configurations, layer settings, etc., must be committed)
├─ .gitignore            # Git ignore file configuration
├─ DEVELOPMENT_GUIDE.md  # Team development specification document
└─ LICENSE               # Apache License 2.0
```


## Development Specifications
Please strictly follow the `DEVELOPMENT_GUIDE.md` document in the project root directory. Core specifications include:
1. **Branch Strategy**: The `main` branch can only be merged via PR. Use `feature/xxx` branches for feature development and `fix/xxx` branches for bug fixes.
2. **Code Commit**: The commit message format is `[Type] Description` (e.g., `[feat] Add player movement function`). Types include feat/fix/docs, etc.
3. **Resource Management**: File names use "lowercase + hyphen" format. Large files (>100MB) should use Git LFS or cloud storage sharing.
4. **PR Process**: Before submitting a PR, sync with the main branch code, pass local tests, and @ at least 1 reviewer.


## License
This project is open-source under the Apache License 2.0. See the `LICENSE` file for details.


## Team Collaboration
- Sync `main` branch code before the end of each workday to avoid accumulating conflicts
- For technical issues or conflicts, prioritize communication in the team group
- After version release, tag the `main` branch (e.g., `v1.0.0`) and note the release content

## Code of Conduct
This project adheres to the [Contributor Covenant v2.0](CODE_OF_CONDUCT.md). Please read it carefully before participating.

For further clarification, please refer to `DEVELOPMENT_GUIDE.md` or contact the team leader.