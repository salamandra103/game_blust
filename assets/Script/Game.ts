import { _decorator, Component, Node, input, find, Input, EventMouse, EventTouch, director, instantiate, SpriteFrame, resources, Prefab, assetManager, Layout, Camera, Sprite, Size, UITransform } from 'cc';
import { Box } from './Box'

const { ccclass, property } = _decorator;

const MAX_GAME_BOARD_SIZE = 10
const MIN_GAME_BOARD_SIZE = 2
const MAX_BOX_GAP = 10;
const MIN_BOX_GAP = 1;
const BOX_COLOR_TYPE_COUNT = 5;


type Colors = 'blue' | 'red' | 'green' | 'yellow' | 'purpure'


export type GameBoardTitle = [Node, UITransform, coords: [number, number], index: [number, number], colorIndex: number]
export type GameBoard = Array<Array<GameBoardTitle>>
@ccclass('Game')
export class Game extends Component {

    @property({ type: Number, max: MAX_GAME_BOARD_SIZE, min: MIN_GAME_BOARD_SIZE, }) private GameBoardSize: number = MAX_GAME_BOARD_SIZE
    @property({ type: Number, max: MAX_BOX_GAP, min: MIN_BOX_GAP, }) private BoxGap: number = MAX_BOX_GAP
    @property({ type: Prefab }) private Box: Prefab = null
    @property({ type: Layout }) private BoxesLayout: Layout = null
    @property({ type: Camera }) private Camera: Camera = null
    @property({ type: Sprite }) private Background: Sprite = null

    private boxSpriteFrames: Array<SpriteFrame> = []
    public gameBoard: GameBoard = []

    onLoad(): void {
        this.loadAssets(() => {
            const shadowBoxesLayoutNode = instantiate(this.BoxesLayout.node)
            this.BoxesLayout.node.parent.addChild(shadowBoxesLayoutNode)

            const layoutBoundingBox = this.BoxesLayout.getComponent(UITransform).getBoundingBox()
            // shadowBoxesLayoutNode.setPosition(layoutBoundingBox.center.x, layoutBoundingBox.center.y - layoutBoundingBox.height - this.BoxGap)

            this.initLayoutIndexes()
            this.initGameField(shadowBoxesLayoutNode.getComponent(Layout))
            this.initGameField(this.BoxesLayout)
        })
    }

    /**
     * Загрузка ассетов
    */
    private loadAssets(callback) {
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

    /**
     * Инициализация игрового поля
     * 1. Установка рандомного цвета тайтла.
     * 2. Установка позиции тайтла на игровок поле.
     * 3. Создание матрицы тайтлов аналогично игровому полю.
     */
    private initGameField(layout: Layout) {
        const uiTransportLayout = layout.getComponent(UITransform)
        const cellSize = (uiTransportLayout.contentSize.width / this.GameBoardSize) - this.BoxGap;
        const layoutBoundingBox = uiTransportLayout.getBoundingBox()

        const startIndex = this.gameBoard.length ? this.gameBoard.length : 0

        for (let i = startIndex; i < startIndex + this.GameBoardSize; i++) {
            this.gameBoard.push([])
            for (let j = 0; j < this.GameBoardSize; j++) {
                const node = instantiate(this.Box)

                const nodeComponent = node.getComponent(Box)
                const colorIndex = Math.floor(Math.random() * BOX_COLOR_TYPE_COUNT)

                let zeroX = (layoutBoundingBox.x + cellSize * 0.5)
                let zeroY = (layoutBoundingBox.y + cellSize * 0.5)
                let gap = (layoutBoundingBox.width - this.GameBoardSize * cellSize) / (this.GameBoardSize - 1)
                let x = zeroX + (j * (cellSize + gap))
                let y = zeroY + (i * (cellSize + gap))

                node.setPosition(x, y * -1)
                nodeComponent.setSpriteFrame(this.boxSpriteFrames[colorIndex])
                nodeComponent.setContentSize(cellSize, cellSize)
                nodeComponent.setIndex2DMatrix([i, j])
                this.gameBoard[i].push([node, nodeComponent.uiTransport, [node.position.x, node.position.y], [i, j], colorIndex])
                layout.node.addChild(node)
            }
        }
        console.log(this.gameBoard)
    }

    /**
     * Инициализация порядка слоев.
     */
    private initLayoutIndexes() {
        this.Camera.node.setSiblingIndex(0)
        this.Background.node.setSiblingIndex(1)
        this.BoxesLayout.node.setSiblingIndex(10)
    }

    protected onEnable(): void {
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


