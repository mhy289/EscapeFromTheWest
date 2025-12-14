    import { _decorator, Component, Node, Camera, Vec3, Rect, Size, view, UITransform } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('CameraFollowWithBounds')
export class CameraFollowWithBounds extends Component {
    @property(Node)
    player: Node = null;
    
    @property
    followSpeed: number = 5;
    
    @property
    z: number = 10;
    
    @property
    enableBounds: boolean = false;  // 是否启用边界限制
    
    @property
    bounds: Rect = new Rect(-500, -500, 1000, 1000);  // 相机移动边界
    
    private _camera: Camera = null;
    private _targetPos: Vec3 = new Vec3();
    private _screenSize: Size = null;
    
    onLoad() {
        this._camera = this.getComponent(Camera);
        this._screenSize = view.getVisibleSize();
        
        if (!this.player) {
            this.player = find('Player');
        }
    }
    
    start() {
        if (!this.player) {
            console.warn('CameraFollow: Player not assigned!');
            return;
        }
        this.node.setPosition(this.player.position.x, this.player.position.y, this.z);
    }
    
    lateUpdate(deltaTime: number) {
        if (!this.player) return;
        
        // 目标位置（玩家中心）
        let targetX = this.player.position.x;
        let targetY = this.player.position.y;
        
        // 边界限制
        if (this.enableBounds) {
            const halfWidth = this._screenSize.width / 2;
            const halfHeight = this._screenSize.height / 2;
            
            targetX = Math.max(this.bounds.x + halfWidth, 
                             Math.min(this.bounds.x + this.bounds.width - halfWidth, targetX));
            targetY = Math.max(this.bounds.y + halfHeight, 
                             Math.min(this.bounds.y + this.bounds.height - halfHeight, targetY));
        }
        
        Vec3.set(this._targetPos, targetX, targetY, this.z);
        
        // 平滑跟随
        const currentPos = this.node.position;
        const smoothPos = new Vec3();
        Vec3.lerp(smoothPos, currentPos, this._targetPos, this.followSpeed * deltaTime);
        
        this.node.setPosition(smoothPos);
    }
}