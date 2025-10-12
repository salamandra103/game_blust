import { _decorator, Component, Node, input, Input, EventMouse, EventTouch, director } from 'cc';
const { ccclass, property } = _decorator;



@ccclass('Menu')
export class Menu extends Component {
    @property(Node)
    startButton: Node = null;
    @property(Node)
    exitButton: Node = null;
    @property(Node)
    statsButton: Node = null;

    start() {
        this.node.children.forEach(child => {
            child.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        })

        director.preloadScene("Game", function () {
            console.log('Game scene preloaded');
        });
    }

    protected onLoad(): void {
    }


    setInputActive(active: boolean) {
        if (active) {
            input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this)
        } else {
            input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this)
        }
    }

    update(deltaTime: number) {

    }

    onTouchStart(event: EventTouch) {
        console.log(event)
    }

    onMouseUp(event: EventMouse) {
        const target = event.target as Node

        if (event.getButton() === 0) {
            switch (target) {
                case this.startButton:
                    director.loadScene('Game', (err, scene) => {
                        director.runScene(scene);
                    })
                    break;
                default:
                    break;
            }
        }

    }
}


