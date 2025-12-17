import { _decorator, Component, Node, director } from 'cc';
import { InputManager } from '../player/InputManager';
const { ccclass, property } = _decorator;

/**
 * 游戏管理器 - 负责初始化游戏系统和全局组件
 * 将此组件添加到场景的根节点上
 */
@ccclass('GameManager')
export class GameManager extends Component {

    @property({
        type: Node,
        tooltip: 'InputManager节点：如果为空，将自动创建InputManager组件'
    })
    inputManagerNode: Node = null;

    protected onLoad(): void {
        console.log('GameManager: 初始化游戏系统');
        this.initializeInputManager();
    }

    protected start(): void {
        console.log('GameManager: 游戏系统启动完成');
    }

    private initializeInputManager(): void {
        console.log('GameManager: 开始初始化InputManager');
        
        // 先检查是否已存在实例
        console.log(`GameManager: InputManager.instance = ${InputManager.instance ? '已存在' : '不存在'}`);
        
        if (InputManager.instance) {
            console.log('GameManager: InputManager已存在，跳过初始化');
            return;
        }

        // 如果没有指定InputManager节点，尝试在当前节点添加
        if (!this.inputManagerNode) {
            console.log('GameManager: 在GameManager节点上添加InputManager组件');
            this.inputManagerNode = this.node;
        }

        // 检查是否已经有InputManager组件
        const existingComponent = this.inputManagerNode.getComponent(InputManager);
        if (!existingComponent) {
            console.log('GameManager: 添加InputManager组件');
            this.inputManagerNode.addComponent(InputManager);
        } else {
            console.log('GameManager: InputManager组件已存在');
        }
        
        // 延迟检查是否初始化成功
        this.scheduleOnce(() => {
            console.log(`GameManager: 延迟检查 - InputManager.instance = ${InputManager.instance ? '成功' : '失败'}`);
        }, 0.1);
    }

    protected onDestroy(): void {
        console.log('GameManager: 游戏管理器销毁');
    }
}