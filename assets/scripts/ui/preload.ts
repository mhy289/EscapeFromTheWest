
import { _decorator, Component, director, Node, tween, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Preload')
export class Preload extends Component {
    
    @property({ tooltip: '要进入的游戏场景名称' })
    sceneName: string = '';

    @property({ tooltip: '最短加载时间（秒）' })
    minLoadTime: number = 8.5;

    @property({ type: [Node], tooltip: '轮播图片数组 A' })
    carouselImagesA: Node[] = [];

    @property({ type: [Node], tooltip: '轮播图片数组 B' })
    carouselImagesB: Node[] = [];

    @property({ tooltip: 'A 组轮播间隔（秒）' })
    carouselIntervalA: number = 3;

    @property({ tooltip: 'B 组轮播间隔（秒）' })
    carouselIntervalB: number = 0.5;

    private _sceneLoaded = false;
    private _timeReached = false;

    private _currentIndexA = 0;
    private _isTweeningA = false;

    private _currentIndexB = 0;

    onLoad () {
        console.log('进入预加载场景，开始预加载：', this.sceneName);

        // 初始化 A 组
        this.initCarouselA(this.carouselImagesA);

        // 初始化 B 组
        this.initCarouselB(this.carouselImagesB);

        // 启动轮播
        if (this.carouselImagesA.length > 1) this.schedule(this.switchImageA, this.carouselIntervalA);
        if (this.carouselImagesB.length > 1) this.schedule(this.switchImageB, this.carouselIntervalB);

        // 最短加载时间
        this.scheduleOnce(this.onMinTimeReached.bind(this), this.minLoadTime);

        // 场景预加载
        director.preloadScene(
            this.sceneName,
            this.onPreloadProgress.bind(this),
            this.onPreloadComplete.bind(this)
        );
    }

    // ----------------- A 组轮播（淡入淡出） -----------------
    switchImage(
        images: Node[],
        getIndex: () => number,
        setIndex: (v: number) => void,
        getTweening: () => boolean,
        setTweening: (v: boolean) => void
    ) {
        if (images.length <= 1 || getTweening()) return;

        setTweening(true);

        const currentIndex = getIndex();
        const currentNode = images[currentIndex];
        const nextIndex = (currentIndex + 1) % images.length;
        const nextNode = images[nextIndex];

        const curOpacity = currentNode.getComponent(UIOpacity);
        const nextOpacity = nextNode.getComponent(UIOpacity);

        if (!curOpacity || !nextOpacity) {
            setTweening(false);
            return;
        }

        nextNode.active = true;

        tween(curOpacity)
            .to(0.5, { opacity: 0 })
            .call(() => currentNode.active = false)
            .start();

        tween(nextOpacity)
            .to(0.5, { opacity: 255 })
            .call(() => {
                setIndex(nextIndex);
                setTweening(false);
            })
            .start();
    }

    initCarouselA(images: Node[]) {
        images.forEach((node, i) => {
            const opacity = node.getComponent(UIOpacity);
            node.active = i === 0;
            if (opacity) opacity.opacity = i === 0 ? 255 : 0;
        });
        this._currentIndexA = 0;
    }

    switchImageA = () => {
        this.switchImage(
            this.carouselImagesA,
            () => this._currentIndexA,
            v => this._currentIndexA = v,
            () => this._isTweeningA,
            v => this._isTweeningA = v
        );
    };

    // ----------------- B 组轮播（瞬间切换） -----------------
    initCarouselB(images: Node[]) {
        images.forEach((node, i) => node.active = i === 0);
        this._currentIndexB = 0;
    }

    switchImageB = () => {
        const images = this.carouselImagesB;
        if (images.length <= 1) return;

        // 隐藏当前
        images[this._currentIndexB].active = false;

        // 下一个索引
        this._currentIndexB = (this._currentIndexB + 1) % images.length;

        // 显示下一个
        images[this._currentIndexB].active = true;
    };

    // ----------------- 场景预加载 -----------------
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
        if (this._sceneLoaded && this._timeReached && !this._isTweeningA) {
            director.loadScene(this.sceneName);
        }
    }
}
