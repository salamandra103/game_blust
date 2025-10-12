import { _decorator, Component, Node, input, Input, EventMouse, EventTouch, director, instantiate, SpriteFrame, resources, Prefab, assetManager } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {

    @property({ type: Node })
    private exampleBox: Node = null

    protected onLoad(): void {
        console.log('onLoad')
    }

    protected onEnable(): void {
        console.log('onEnable')

    }

    start() {
        console.log('start')
        // this.node.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        // let node = instantiate(this.exampleBox);

        resources.preload("prefab/Box", Prefab);

        resources.load("prefab/Box", Prefab, (err, data) => {
            debugger
        });

    }

    update(deltaTime: number) {
        console.log('update')
    }

    protected onDisable(): void {
        console.log('onDisable')

    }

    protected onDestroy(): void {
        console.log('onDestroy')

    }

    onMouseUp(event: EventMouse) {
        // director.loadScene('Menu', (err, scene) => {
        //     director.runScene(scene);
        // })
    }
}


