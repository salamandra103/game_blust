import { _decorator, BlockInputEventsComponent, Color, Component, Graphics, Node, view, UIOpacity, tween, Vec3, UITransform, Layers, Widget, find } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ModalController')
export class ModalController extends Component {
    start() {

    }

    update(deltaTime: number) {

    }

    protected onLoad(): void {
        const visibleSize = view.getVisibleSize()
        // this.node.active = false;
        const graphicsComponent = this.node.addComponent(Graphics)

        graphicsComponent.rect(-visibleSize.width / 2, -visibleSize.height / 2, visibleSize.width, visibleSize.height);
        graphicsComponent.fillColor = new Color(0, 0, 0, 255 / 2);
        graphicsComponent.fill();
        this.node.addComponent(BlockInputEventsComponent)
    }

    public show(): void {
        this.node.active = true;
    }
    public hide(): void {
        this.node.active = false;
    }

    protected onEnable(): void {
        let uiOpacity = this.getComponent(UIOpacity);
        if (!uiOpacity) {
            uiOpacity = this.addComponent(UIOpacity);
        }
        uiOpacity.opacity = 0;
        // this.node.setScale(0.8, 0.8, 0.8);

        tween(uiOpacity)
            .to(0.3, { opacity: 255 }, { easing: 'fade' })
            .start();

        // tween(this.node)
        //     .to(0.3, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
        //     .start();
    }


}


