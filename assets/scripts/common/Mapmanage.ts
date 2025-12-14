// MapManager.ts - 动态加载分割后的地图
import { _decorator, Component, Node, TiledMap, Prefab, instantiate, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MapManager')
export class MapManager extends Component {
    @property(Prefab)
    mapChunkPrefab: Prefab[] = []; // 分割后的地图块预制体
    
    @property
    chunkSize: number = 20; // 每个地图块的图块数量
    
    @property
    tileSize: number = 64; // 每个图块的大小
    
    private loadedChunks: Map<string, Node> = new Map();
    private playerPos: Vec3 = Vec3.ZERO;
    
    start() {
        // 初始加载玩家周围的地图块
        this.loadChunksAroundPlayer();
    }
    
    loadChunksAroundPlayer() {
        // 计算玩家所在的区块坐标
        const playerChunkX = Math.floor(this.playerPos.x / (this.chunkSize * this.tileSize));
        const playerChunkY = Math.floor(this.playerPos.y / (this.chunkSize * this.tileSize));
        
        // 加载周围9个区块
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                const chunkKey = `${playerChunkX + x},${playerChunkY + y}`;
                this.loadChunk(chunkKey, playerChunkX + x, playerChunkY + y);
            }
        }
        
        // 卸载远处的区块
        this.unloadDistantChunks(playerChunkX, playerChunkY);
    }
    
    loadChunk(chunkKey: string, chunkX: number, chunkY: number) {
        if (this.loadedChunks.has(chunkKey)) return;
        
        const chunkIndex = this.getChunkIndex(chunkX, chunkY);
        if (chunkIndex >= 0 && chunkIndex < this.mapChunkPrefab.length) {
            const chunk = instantiate(this.mapChunkPrefab[chunkIndex]);
            chunk.parent = this.node;
            
            // 设置位置
            chunk.setPosition(
                chunkX * this.chunkSize * this.tileSize,
                chunkY * this.chunkSize * this.tileSize,
                0
            );
            
            this.loadedChunks.set(chunkKey, chunk);
        }
    }
    
    getChunkIndex(x: number, y: number): number {
        // 根据区块坐标计算预制体索引
        // 假设地图是 3x3 的区块
        const gridWidth = 3;
        return (y + 1) * gridWidth + (x + 1);
    }
    
    unloadDistantChunks(centerX: number, centerY: number) {
        const keysToRemove: string[] = [];
        
        this.loadedChunks.forEach((chunk, key) => {
            const [x, y] = key.split(',').map(Number);
            const distance = Math.max(Math.abs(x - centerX), Math.abs(y - centerY));
            
            if (distance > 1) { // 距离超过1个区块
                chunk.destroy();
                keysToRemove.push(key);
            }
        });
        
        keysToRemove.forEach(key => this.loadedChunks.delete(key));
    }
    
    updatePlayerPosition(pos: Vec3) {
        this.playerPos = pos;
        this.loadChunksAroundPlayer();
    }
}