import { _decorator, Component, AudioSource, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {

    static instance: AudioManager;

    @property(AudioSource)
    bgmSource: AudioSource = null;

    @property(AudioSource)
    sfxSource: AudioSource = null;

    private _bgmVolume = 1;
    private _sfxVolume = 1;

    onLoad () {
        if (AudioManager.instance) {
            this.node.destroy();
            return;
        }

        AudioManager.instance = this;
        director.addPersistRootNode(this.node);
    }

    playBGM () {
        if (this.bgmSource && !this.bgmSource.playing) {
            this.bgmSource.volume = this._bgmVolume;
            this.bgmSource.play();
        }
    }

    playSFX (clip = null) {
        if (this.sfxSource) {
            this.sfxSource.playOneShot(
                clip ?? this.sfxSource.clip,
                this._sfxVolume
            );
        }
    }

    setBGMVolume (value: number) {
        this._bgmVolume = value;
        if (this.bgmSource) {
            this.bgmSource.volume = value;
        }
    }

    setSFXVolume (value: number) {
        this._sfxVolume = value;
    }

    getBGMVolume () {
        return this._bgmVolume;
    }

    getSFXVolume () {
        return this._sfxVolume;
    }
}
