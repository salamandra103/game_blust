import { _decorator, Component, Node, Size, Sprite, SpriteFrame, UITransform } from 'cc';
const { ccclass, property } = _decorator;

type Colors = 'blue' | 'red' | 'green' | 'yellow' | 'perple'
type ColorsId = 1 | 2 | 3 | 4 | 5

@ccclass('Box')
export class Box extends Component {

    public sprite: Sprite = null
    public uiTransport: UITransform = null
    start() {

    }

    protected onLoad(): void {
        this.sprite = this.node.getComponent(Sprite)
        this.uiTransport = this.node.getComponent(UITransform)
    }


    update(deltaTime: number) {

    }
}


