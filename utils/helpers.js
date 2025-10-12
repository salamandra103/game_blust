
const top = [-1, 0]
const bottom = [1, 0]
const left = [0, -1]
const right = [0, 1]

function generateBoard(n) {
    let board = []

    for (let i = 0; i < n; i++) {
        board.push([])
        for (let j = 0; j < n; j++) {
            let max = 5
            let min = 1
            let randomColor = Math.floor(Math.random() * (max - min + 1) + min);
            board[i].push(randomColor)
        }
    }
    return board
}

function removeSimilarTitle(board, position) {
    const [x, y] = position

    let siblintTitle = getSiblingTitle(board, [x, y]);
    debugger
}

function getSiblingTitle(board, position) {
    const [x, y] = position
    const allResolvedPosition = [position];
    const currentTitle = board[x][y]

    const findingTitleTop = (board[x + top[0]][y + top[1]]) || 0
    const findingTitleBottom = (board[x + bottom[0]][y + bottom[1]]) || 0
    const findingTitleLeft = (board[x + left[0]][y + left[1]]) || 0
    const findingTitleRight = (board[x + right[0]][y + right[1]]) || 0

    switch (currentTitle) {
        case findingTitleTop:
            allResolvedPosition.push(getSiblingTitle(board, [x + top[0], y + top[1]]))
            break;
        case findingTitleBottom:
            allResolvedPosition.push(getSiblingTitle(board, [x + bottom[0], y + bottom[1]]))
            break;
        case findingTitleLeft:
            allResolvedPosition.push(getSiblingTitle(board, [x + left[0], y + left[1]]))

            break;
        case findingTitleRight:
            allResolvedPosition.push(getSiblingTitle(board, [x + right[0], y + right[1]]))

            break;
        default:
            return position;
    }


}

// const board = generateBoard(9)
const board = [[1, 1, 1], [1, 0, 0], [1, 0, 0]]
removeSimilarTitle(board, [1, 1]);
debugger