import { _decorator, Component, Node, Label, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DebugHelper')
export class DebugHelper extends Component {
    @property(Label)
    debugLabel: Label = null;

    private debugMessages: string[] = [];
    private maxMessages: number = 5;

    protected start(): void {
        // 重写console.log来捕获调试信息
        const originalLog = console.log;
        console.log = (...args: any[]) => {
            originalLog.apply(console, args);
            this.addDebugMessage(args.join(' '));
        };
    }

    private addDebugMessage(message: string): void {
        const timestamp = new Date().toLocaleTimeString();
        const formattedMessage = `[${timestamp}] ${message}`;
        
        this.debugMessages.push(formattedMessage);
        
        // 限制消息数量
        if (this.debugMessages.length > this.maxMessages) {
            this.debugMessages.shift();
        }
        
        this.updateDebugDisplay();
    }

    private updateDebugDisplay(): void {
        if (this.debugLabel) {
            this.debugLabel.string = this.debugMessages.join('\n');
        }
    }

    // 公共方法：手动添加调试信息
    public log(message: string): void {
        this.addDebugMessage(message);
    }

    // 清空调试信息
    public clear(): void {
        this.debugMessages = [];
        this.updateDebugDisplay();
    }
}