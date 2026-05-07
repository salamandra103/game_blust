import { _decorator, BlockInputEventsComponent, Color, Component, Graphics, view, UIOpacity, tween, Layout, Input } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ModalController')
export class ModalController extends Component {
    @property({ type: Layout }) successButton: Layout = null
    @property({ type: Layout }) errorButton: Layout = null

    public eventTarget: EventTarget = new EventTarget()

    private init() {
        const visibleSize = view.getVisibleSize()
        const graphicsComponent = this.node.addComponent(Graphics)

        graphicsComponent.rect(-visibleSize.width / 2, -visibleSize.height / 2, visibleSize.width, visibleSize.height);
        graphicsComponent.fillColor = new Color(0, 0, 0, 255 / 2);
        graphicsComponent.fill();

        this.node.addComponent(BlockInputEventsComponent)
    }

    private onMouseUpSuccessButton() {
        console.log('success')
        this.eventTarget.dispatchEvent(new Event('onMouseUpSuccessButton'))
        this.node.active = false
    }

    private onMouseUpErrorButton() {
        console.log('error')
        this.eventTarget.dispatchEvent(new Event('onMouseUpErrorButton'))
        this.node.active = false
    }

    public show(): void {
        this.init();
        this.node.active = true;
        this.successButton?.node.on(Input.EventType.TOUCH_END, this.onMouseUpSuccessButton, this)
        this.errorButton?.node.on(Input.EventType.TOUCH_END, this.onMouseUpErrorButton, this)
    }
    public hide(): void {
        this.node.active = false;
        this.successButton?.node.off(Input.EventType.TOUCH_END, this.onMouseUpSuccessButton, this)
        this.errorButton?.node.off(Input.EventType.TOUCH_END, this.onMouseUpErrorButton, this)
    }

    protected onEnable(): void {
        let uiOpacity = this.getComponent(UIOpacity);
        if (!uiOpacity) {
            uiOpacity = this.addComponent(UIOpacity);
        }
        uiOpacity.opacity = 0;
        tween(uiOpacity)
            .to(0.3, { opacity: 255 }, { easing: 'fade' })
            .start();
    }
}