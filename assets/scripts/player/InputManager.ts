import { _decorator, Component, input, Input, KeyCode, EventMouse } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 输入管理器 - 统一管理所有输入事件，避免多个组件监听同一事件导致冲突
 */
@ccclass('InputManager')
export class InputManager extends Component {
    // 单例实例
    private static _instance: InputManager = null;
    
    // 按键状态
    private keyStates: Map<number, boolean> = new Map();
    private mouseButtonStates: Map<number, boolean> = new Map();
    
    // 监听器列表
    private keyDownListeners: Array<(keyCode: number) => void> = [];
    private keyUpListeners: Array<(keyCode: number) => void> = [];
    private mouseDownListeners: Array<(button: number, event: EventMouse) => void> = [];
    private mouseUpListeners: Array<(button: number, event: EventMouse) => void> = [];
    private mouseMoveListeners: Array<(event: EventMouse) => void> = [];

    public static get instance(): InputManager {
        return InputManager._instance;
    }

    protected onLoad(): void {
        // 设置单例
        if (InputManager._instance === null) {
            InputManager._instance = this;
            this.setupInputEvents();
            console.log('InputManager: 初始化完成');
        } else {
            console.warn('InputManager: 已存在实例，销毁重复实例');
            this.node.destroy();
        }
    }

    private setupInputEvents(): void {
        // 键盘事件
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        
        // 鼠标事件
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        
        console.log('InputManager: 输入事件监听设置完成');
    }

    private onKeyDown(event: any): void {
        const keyCode = event.keyCode;
        this.keyStates.set(keyCode, true);
        console.log(`InputManager: 按键按下 - ${this.getKeyName(keyCode)}`);
        
        // 通知所有监听器
        this.keyDownListeners.forEach(listener => {
            try {
                listener(keyCode);
            } catch (error) {
                console.error('InputManager: keyDown监听器错误', error);
            }
        });
    }

    private onKeyUp(event: any): void {
        const keyCode = event.keyCode;
        this.keyStates.set(keyCode, false);
        console.log(`InputManager: 按键释放 - ${this.getKeyName(keyCode)}`);
        
        // 通知所有监听器
        this.keyUpListeners.forEach(listener => {
            try {
                listener(keyCode);
            } catch (error) {
                console.error('InputManager: keyUp监听器错误', error);
            }
        });
    }

    private onMouseDown(event: EventMouse): void {
        const button = event.getButton();
        this.mouseButtonStates.set(button, true);
        console.log(`InputManager: 鼠标按下 - 按钮${button}`);
        
        // 通知所有监听器
        this.mouseDownListeners.forEach(listener => {
            try {
                listener(button, event);
            } catch (error) {
                console.error('InputManager: mouseDown监听器错误', error);
            }
        });
    }

    private onMouseUp(event: EventMouse): void {
        const button = event.getButton();
        this.mouseButtonStates.set(button, false);
        console.log(`InputManager: 鼠标释放 - 按钮${button}, 监听器数量: ${this.mouseUpListeners.length}`);
        
        // 通知所有监听器
        this.mouseUpListeners.forEach((listener, index) => {
            try {
                console.log(`InputManager: 调用mouseUp监听器 ${index}`);
                listener(button, event);
                console.log(`InputManager: mouseUp监听器 ${index} 执行成功`);
            } catch (error) {
                console.error(`InputManager: mouseUp监听器 ${index} 错误`, error);
            }
        });
    }

    private onMouseMove(event: EventMouse): void {
        // 通知所有监听器
        this.mouseMoveListeners.forEach(listener => {
            try {
                listener(event);
            } catch (error) {
                console.error('InputManager: mouseMove监听器错误', error);
            }
        });
    }

    private getKeyName(keyCode: number): string {
        switch(keyCode) {
            case KeyCode.KEY_W: return 'W';
            case KeyCode.KEY_S: return 'S';
            case KeyCode.KEY_A: return 'A';
            case KeyCode.KEY_D: return 'D';
            case KeyCode.KEY_R: return 'R';
            default: return `KeyCode(${keyCode})`;
        }
    }

    // 公共方法：添加监听器
    public addKeyDownListener(listener: (keyCode: number) => void): void {
        this.keyDownListeners.push(listener);
    }

    public addKeyUpListener(listener: (keyCode: number) => void): void {
        this.keyUpListeners.push(listener);
    }

    public addMouseDownListener(listener: (button: number, event: EventMouse) => void): void {
        this.mouseDownListeners.push(listener);
    }

    public addMouseUpListener(listener: (button: number, event: EventMouse) => void): void {
        this.mouseUpListeners.push(listener);
    }

    public addMouseMoveListener(listener: (event: EventMouse) => void): void {
        this.mouseMoveListeners.push(listener);
    }

    // 公共方法：移除监听器
    public removeKeyDownListener(listener: (keyCode: number) => void): void {
        const index = this.keyDownListeners.indexOf(listener);
        if (index > -1) {
            console.log(`InputManager: 移除keyDown监听器，索引 ${index}`);
            this.keyDownListeners.splice(index, 1);
        } else {
            console.warn(`InputManager: 未找到要移除的keyDown监听器，当前数量: ${this.keyDownListeners.length}`);
            // 尝试通过函数内容匹配查找
            for (let i = 0; i < this.keyDownListeners.length; i++) {
                if (this.keyDownListeners[i].toString() === listener.toString()) {
                    console.log(`InputManager: 通过内容匹配找到并移除keyDown监听器，索引 ${i}`);
                    this.keyDownListeners.splice(i, 1);
                    break;
                }
            }
        }
    }

    public removeKeyUpListener(listener: (keyCode: number) => void): void {
        const index = this.keyUpListeners.indexOf(listener);
        if (index > -1) {
            console.log(`InputManager: 移除keyUp监听器，索引 ${index}`);
            this.keyUpListeners.splice(index, 1);
        } else {
            console.warn(`InputManager: 未找到要移除的keyUp监听器，当前数量: ${this.keyUpListeners.length}`);
            // 尝试通过函数内容匹配查找
            for (let i = 0; i < this.keyUpListeners.length; i++) {
                if (this.keyUpListeners[i].toString() === listener.toString()) {
                    console.log(`InputManager: 通过内容匹配找到并移除keyUp监听器，索引 ${i}`);
                    this.keyUpListeners.splice(i, 1);
                    break;
                }
            }
        }
    }

    public removeMouseDownListener(listener: (button: number, event: EventMouse) => void): void {
        const index = this.mouseDownListeners.indexOf(listener);
        if (index > -1) {
            this.mouseDownListeners.splice(index, 1);
        }
    }

    public removeMouseUpListener(listener: (button: number, event: EventMouse) => void): void {
        const index = this.mouseUpListeners.indexOf(listener);
        if (index > -1) {
            this.mouseUpListeners.splice(index, 1);
        }
    }

    public removeMouseMoveListener(listener: (event: EventMouse) => void): void {
        const index = this.mouseMoveListeners.indexOf(listener);
        if (index > -1) {
            this.mouseMoveListeners.splice(index, 1);
        }
    }

    // 公共方法：获取按键状态
    public isKeyPressed(keyCode: number): boolean {
        return this.keyStates.get(keyCode) || false;
    }

    public isMouseButtonPressed(button: number): boolean {
        return this.mouseButtonStates.get(button) || false;
    }

    protected onDestroy(): void {
        // 清理事件监听
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        
        // 清空监听器
        this.keyDownListeners = [];
        this.keyUpListeners = [];
        this.mouseDownListeners = [];
        this.mouseUpListeners = [];
        this.mouseMoveListeners = [];
        
        // 清空状态
        this.keyStates.clear();
        this.mouseButtonStates.clear();
        
        // 清空单例
        if (InputManager._instance === this) {
            InputManager._instance = null;
        }
        
        console.log('InputManager: 销毁完成');
    }
}