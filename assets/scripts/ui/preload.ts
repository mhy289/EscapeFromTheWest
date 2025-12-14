import { _decorator, Component, director, Node, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Preload')
export class Preload extends Component {
    
    @property({ tooltip: '要进入的游戏场景名称' })
    sceneName: string = '';

    @property({ tooltip: '最短加载时间（秒）' })
    minLoadTime: number = 8.5;

    @property({ type: [Node], tooltip: '轮播图片节点数组' })
    carouselImages: Node[] = [];

    @property({ tooltip: '轮播间隔时间（秒）' })
    carouselInterval: number = 3;

    private _sceneLoaded = false;
    private _timeReached = false;    
    private _currentIndex = 0;
    private _isTweening = false;

    onLoad () {
        console.log('进入预加载场景，开始预加载：', this.sceneName);

        // 初始化轮播，只显示第一张，其余隐藏，透明度设为0
        this.carouselImages.forEach((node, i) => {
            node.active = i === 0;
            node.opacity = i === 0 ? 255 : 0;
        });

        // 开始轮播
        if (this.carouselImages.length > 1) {
            this.schedule(this.switchImage, this.carouselInterval);
        }

        // 最短加载时间计时
        this.scheduleOnce(this.onMinTimeReached.bind(this), this.minLoadTime);

        // 开始预加载场景
        director.preloadScene(
            this.sceneName,
            this.onPreloadProgress.bind(this),
            this.onPreloadComplete.bind(this)
        );
    }

    // 切换图片，淡入淡出
    switchImage() {
        if (this.carouselImages.length <= 1 || this._isTweening) return;

        this._isTweening = true;

        const currentNode = this.carouselImages[this._currentIndex];
        const nextIndex = (this._currentIndex + 1) % this.carouselImages.length;
        const nextNode = this.carouselImages[nextIndex];

        // 确保下张图显示
        nextNode.active = true;

        // 淡出当前 + 淡入下张
        tween(currentNode)
            .to(0.5, { opacity: 0 })
            .call(() => { currentNode.active = false; })
            .start();

        tween(nextNode)
            .to(0.5, { opacity: 255 })
            .call(() => {
                this._currentIndex = nextIndex;
                this._isTweening = false;
            })
            .start();
    }

    onPreloadProgress(completed: number, total: number) {
        const progress = Math.floor(completed / total * 100);
        console.log(`加载进度：${progress}%`);
    }

    onPreloadComplete() {
        console.log('场景预加载完成');
        this._sceneLoaded = true;
        this.tryEnterNextScene();
    }

    onMinTimeReached() {
        console.log('最短加载时间到达');
        this._timeReached = true;
        this.tryEnterNextScene();
    }

    tryEnterNextScene() {
        if (this._sceneLoaded && this._timeReached) {
            console.log('条件满足，进入下一个场景');
            director.loadScene(this.sceneName);
        }
    }
}
