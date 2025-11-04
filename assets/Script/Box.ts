import { _decorator, Component, Node, Size, Sprite, SpriteFrame, UITransform, Input, find, director } from 'cc';
import { Game, type GameBoard, type GameBoardTitle } from './Game'

const { ccclass, property } = _decorator;

type Colors = 'blue' | 'red' | 'green' | 'yellow' | 'perple'
type ColorsId = 1 | 2 | 3 | 4 | 5

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
    private indexes: [number, number] = [0, 0]

    start() { }

    onLoad(): void {
        this.uiTransport = this.node.getComponent(UITransform)
        this.node.on(Input.EventType.MOUSE_UP, this.onMouseUp, this)
        this.gameBoard = director.getScene().getChildByName('Canvas').getComponent(Game).gameBoard
    }

    update(deltaTime: number) { }

    public setSpriteFrame(spriteFrame: SpriteFrame): void {
        this.node.getComponent(Sprite).spriteFrame = spriteFrame
    }

    public setContentSize(width: number, height: number) {
        this.node.getComponent(UITransform).setContentSize(width, height)
    }

    public setIndex2DMatrix(indexes: [number, number]) {
        this.indexes = indexes
    }

    private onMouseUp() {
        console.log("Position: " + this.node.position)
        console.log("Size: " + this.node.getComponent(UITransform).contentSize)
        console.log('Id: ' + this.node.uuid)
        console.log('Id: ' + this.indexes)

        const copyBoard: Array<Array<number | null>> = []

        // Создание упрощенной копии массива
        for (let i = 0; i < this.gameBoard.length; i++) {
            copyBoard.push([])
            for (let j = 0; j < this.gameBoard[i].length; j++) {
                this.gameBoard[i][j] ? copyBoard[i].push(this.gameBoard[i][j][4]) : copyBoard[i].push(null)
            }
        }

        const destroyedTitle = getSiblingTitle(copyBoard, this.indexes)

        if (destroyedTitle === null) {
            console.log('Нет соседей')
            return;
        }

        // Поиск удаляемого тайтла по копии
        for (let i = 0; i < destroyedTitle.length; i++) {
            for (let j = 0; j < destroyedTitle[i].length; j++) {
                if (copyBoard[i][j] === null) {
                    this.deleteNode([i, j])
                }
            }
        }
    }

    private deleteNode([rIndex, cIndex]: [number, number]) {
        if (this.gameBoard[rIndex][cIndex]) {
            let prev = this.gameBoard[rIndex][cIndex]
            this.gameBoard[rIndex][cIndex][0].destroy()
            this.gameBoard[rIndex][cIndex] = null;

        }

    }
}

function getSiblingTitle<T>(board: Array<Array<T>>, position: [number, number]): Array<Array<T>> | null {
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

function getSiblingTitleByPosition<T>(board: Array<Array<T>>, position: [number, number], targetTitle: T): Array<[number, number]> {
    const siblings: Array<[number, number]> = [];
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

function markTitle(board: Array<Array<unknown>>, [rIndex, cIndex]: [number, number]): void {
    board[rIndex][cIndex] = null;
}

function isValidSibling(board: Array<Array<unknown>>, row: number, col: number): boolean {
    return row >= 0 && row < board[0].length && col >= 0 && col < board[1].length
}



