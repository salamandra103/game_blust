import { _decorator, Component, Node, input, Input, EventMouse, EventTouch, director, instantiate, SpriteFrame, resources, Prefab, assetManager, Layout, Camera, Sprite, Size, UITransform } from 'cc';
import { Box } from './Box'

const { ccclass, property } = _decorator;

const MAX_GAME_BOARD_SIZE = 10
const MIN_GAME_BOARD_SIZE = 5

@ccclass('Game')
export class Game extends Component {

    @property({ type: Number, max: MAX_GAME_BOARD_SIZE, min: MIN_GAME_BOARD_SIZE, }) private GameBoardSize: number = MAX_GAME_BOARD_SIZE
    @property({ type: Prefab }) private Box: Prefab = null
    @property({ type: Layout }) private BoxesLayout: Layout = null
    @property({ type: Camera }) private Camera: Camera = null
    @property({ type: Sprite }) private Background: Sprite = null

    private boxSpriteFrames: Array<SpriteFrame> = []

    constructor() {
        super()
    }

    protected onLoad(): void {

        this.loadAssets(() => {
            this.initPositions()
            this.initGameField()
        })
    }

    public loadAssets(callback) {


        const loadBlue = new Promise<SpriteFrame>((resolve, reject) => resources.load('images/block_blue/spriteFrame', SpriteFrame, (err, data) => err ? reject(err) : resolve(data)))
        const loadRed = new Promise<SpriteFrame>((resolve, reject) => resources.load('images/block_red/spriteFrame', SpriteFrame, (err, data) => err ? reject(err) : resolve(data)))
        const loadGreen = new Promise<SpriteFrame>((resolve, reject) => resources.load('images/block_green/spriteFrame', SpriteFrame, (err, data) => err ? reject(err) : resolve(data)))
        const loadYellow = new Promise<SpriteFrame>((resolve, reject) => resources.load('images/block_yellow/spriteFrame', SpriteFrame, (err, data) => err ? reject(err) : resolve(data)))
        const loadPurpure = new Promise<SpriteFrame>((resolve, reject) => resources.load('images/block_purpure/spriteFrame', SpriteFrame, (err, data) => err ? reject(err) : resolve(data)))

        Promise.all([loadBlue, loadRed, loadGreen, loadYellow, loadPurpure]).then((sprites) => {
            this.boxSpriteFrames = sprites
            callback()
        })

    }

    private initGameField() {
        const boxSpacing = 5;
        const layout = this.BoxesLayout.getComponent(Layout)
        const uiTransport = this.BoxesLayout.getComponent(UITransform)
        // const cellSize = Math.floor((uiTransport.contentSize.width - ((this.GameBoardSize - 1) * layout.spacingX)) / this.GameBoardSize);
        const cellSize = uiTransport.contentSize.width / this.GameBoardSize;
        // this.BoxesLayout.cellSize = new Size(cellSize, cellSize)

        for (let i = 0; i < this.GameBoardSize * this.GameBoardSize; i++) {
            const boxNode = instantiate(this.Box)
            const uiTransport = boxNode.getComponent(UITransform)
            const randomColorIndex = Math.floor(Math.random() * 5);

            boxNode.getComponent(Sprite).spriteFrame = this.boxSpriteFrames[randomColorIndex]
            uiTransport.setContentSize(new Size(cellSize, cellSize))
            this.BoxesLayout.node.addChild(boxNode)
        }
    }

    private initPositions() {
        this.Camera.node.setSiblingIndex(0)
        this.Background.node.setSiblingIndex(1)
        this.BoxesLayout.node.setSiblingIndex(10)
    }

    protected onEnable(): void {
        // console.log('onEnable')

    }

    start() {
        // console.log('start')
        // this.node.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        // let node = instantiate(this.exampleBox);

        // resources.preload("prefab/Box", Prefab);

        // resources.load("prefab/Box", Prefab, (err, data) => {
        // });

    }

    update(deltaTime: number) {
        // console.log('update')
    }

    protected onDisable(): void {
        // console.log('onDisable')

    }

    protected onDestroy(): void {
        // console.log('onDestroy')

    }

    onMouseUp(event: EventMouse) {
        // director.loadScene('Menu', (err, scene) => {
        //     director.runScene(scene);
        // })
    }
}


