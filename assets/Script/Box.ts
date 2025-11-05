import { _decorator, Component, Node, Size, Sprite, SpriteFrame, UITransform, Input, find, director, Animation } from 'cc';
import { Game, type GameBoard, type GameBoardTitle } from './Game'

const { ccclass, property } = _decorator;

type Colors = 'blue' | 'red' | 'green' | 'yellow' | 'perple'
type ColorsId = 1 | 2 | 3 | 4 | 5

type Position = [number, number]

const DIRECTIONS = {
    top: [-1, 0],
    bottom: [1, 0],
    left: [0, -1],
    right: [0, 1],
}

@ccclass('Box')
export class Box extends Component {

    public uiTransport: UITransform = null
    private gameBoard: GameBoard = null
    private originIndex: Position = [0, 0]
    private normalizedIndex: Position = [0, 0]

    start() {

    }

    onLoad(): void {
        this.uiTransport = this.node.getComponent(UITransform)
        this.node.on(Input.EventType.MOUSE_UP, this.onMouseUp, this)
        this.gameBoard = director.getScene().getChildByName('Canvas').getComponent(Game).gameBoard

        // this.normalizedIndex = getNormalizedIndex(this.originIndex, this.gameBoard[0].length)
    }
    protected lateUpdate(dt: number): void {
        const animation = this.node.getComponent(Animation)
        animation.pause()

        // const defaultClip = animation.defaultClip
        // defaultClip.duration = 1.0
        // defaultClip.keys = [[0.0, 0.5, 2.0]]
        // defaultClip.curves = [{
        //     modifiers: [
        //         'cc.UITransform.contentSize.width'
        //     ],
        //     data: {
        //         keys: 0,
        //         values: [0, 300, 150]
        //     }
        // }]
    }

    update(deltaTime: number) { }

    protected onDestroy(): void {
    }

    public setSpriteFrame(spriteFrame: SpriteFrame): void {
        this.node.getComponent(Sprite).spriteFrame = spriteFrame
    }

    public setContentSize(width: number, height: number) {
        this.node.getComponent(UITransform).setContentSize(width, height)
    }

    public setIndex2DMatrix(originIndex: Position) {
        this.originIndex = originIndex
    }

    private onMouseUp() {
        console.log("Position: " + this.node.position)
        console.log("Size: " + this.node.getComponent(UITransform).contentSize)
        console.log('Id: ' + this.node.uuid)
        console.log('Id: ' + this.originIndex)

        const startIndex = this.gameBoard.length > this.gameBoard[0].length ? this.gameBoard.length - this.gameBoard[0].length : 0


        const copyBoard = getCopyArrayByVerticalBoundary(this.gameBoard, startIndex, (item) => {
            if (item) {
                return item[4]
            }
        }) // Создание упрощенной копии массива с границами текущего поля
        const destroyedTitle = getSiblingTitle(copyBoard, getNormalizedIndex(this.originIndex, this.gameBoard[0].length))

        if (destroyedTitle === null) {
            console.log('Нет соседей')
            return;
        }

        // Поиск удаляемого тайтла по копии
        for (let i = 0; i < destroyedTitle.length; i++) {
            for (let j = 0; j < destroyedTitle[i].length; j++) {
                if (copyBoard[i][j] === null) {
                    const boxDenormalizedIndex = getDenormalizedIndex([i, j], this.gameBoard[0].length) // Индексы тайтла в оригинальном игровок поле
                    this.deleteNode(boxDenormalizedIndex)
                }
            }
        }
    }

    private deleteNode([rIndex, cIndex]: Position) {
        this.gameBoard[rIndex][cIndex][0].destroy();
        this.gameBoard[rIndex][cIndex] = null
    }
}

function getSiblingTitle<T>(board: Array<Array<T>>, position: Position): Array<Array<T>> | null {
    const [rIndex, cIndex] = position
    const startedTitle = board[rIndex][cIndex]
    const siblings = getSiblingTitleByPosition(board, position, startedTitle)
    if (!siblings.length) {
        return null
    }
    markTitle(board, [rIndex, cIndex])
    while (siblings.length) {
        const [rIndex, cIndex] = siblings.shift()
        const newSiblings = getSiblingTitleByPosition(board, [rIndex, cIndex], startedTitle)
        siblings.push(...newSiblings)
    }
    return board
}

function getSiblingTitleByPosition<T>(board: Array<Array<T>>, position: Position, targetTitle: T): Array<Position> {
    const siblings: Array<Position> = [];
    const [rIndex, cIndex] = position

    for (let direction in DIRECTIONS) {
        const newRowIndex = rIndex + DIRECTIONS[direction][0];
        const newColumnIndex = cIndex + DIRECTIONS[direction][1];

        const siblingTitle = isValidSibling(board, newRowIndex, newColumnIndex) ? board[newRowIndex][newColumnIndex] : null

        if (siblingTitle !== null && siblingTitle === targetTitle) {
            siblings.push([newRowIndex, newColumnIndex])
            markTitle(board, [newRowIndex, newColumnIndex])
        }
    }

    return siblings
}

function markTitle(board: Array<Array<unknown>>, [rIndex, cIndex]: Position): void {
    board[rIndex][cIndex] = null;
}

function isValidSibling(board: Array<Array<unknown>>, row: number, col: number): boolean {
    return row >= 0 && row < board.length && col >= 0 && col < board[0].length
}


function getCopyArrayByVerticalBoundary<T>(originBoard: Array<Array<T>>, startIndex: number, callback: (value: T) => any): Array<Array<number>> {
    const result = []
    const arrLength = originBoard[0].length
    for (let i = 0; i < arrLength; i++) {
        result.push([])
        for (let j = 0; j < arrLength; j++) {
            result[i].push(callback(originBoard[i + startIndex][j])
            )
        }
    }
    return result;
}

function getNormalizedIndex(index: Position, arrayBoundaryLength: number): Position {
    return index[0] >= arrayBoundaryLength ? [index[0] - arrayBoundaryLength, index[1]] : index
}
function getDenormalizedIndex(index: Position, arrayBoundaryLength: number): Position {
    return index[0] <= arrayBoundaryLength ? [index[0] + arrayBoundaryLength, index[1]] : index
}

