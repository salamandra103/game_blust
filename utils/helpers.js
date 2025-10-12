
let maxRow = maxCol = 3;

const directions = {
    top: [-1, 0],
    bottom: [1, 0],
    left: [0, -1],
    right: [0, 1],
}

function generateBoard(n) {
    let board = []

    maxRow = maxCol = n;

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

    getSiblingTitle(board, [x, y]);
    debugger
}

function getSiblingTitle(board, position) {
    const [x, y] = position
    // const currentTitle = board[x][y]
    // let siblingCount = 0;

    // const findingTitleTop = isValidSibling(x + top[0], y + top[1]) ? board[x + top[0]][y + top[1]] : 0
    // const findingTitleBottom = isValidSibling(x + bottom[0], y + bottom[1]) ? board[x + bottom[0]][y + bottom[1]] : 0
    // const findingTitleLeft = isValidSibling(x + left[0], y + left[1]) ? board[x + left[0]][y + left[1]] : 0
    // const findingTitleRight = isValidSibling(x + right[0], y + right[1]) ? board[x + right[0]][y + right[1]] : 0

    const queue = []

    for (let direction in directions) {
        const newX = x + direction[0];
        const newY = y + direction[1];
        const siblingTitle = isValidSibling(newX, newY) ? board[newX][newY] : null

        if (siblingTitle !== null) {
            queue.push([newX, newY])
        }
    }

    while (queue.length) {
        const value = queue.shift()
    }

    // switch (currentTitle) {
    //     case findingTitleTop:
    //         board[x][y] = 'yes'
    //         siblingCount++;
    //         getSiblingTitle(board, [x + top[0], y + top[1]]);
    //         break;
    //     case findingTitleBottom:
    //         board[x][y] = 'yes'
    //         siblingCount++;
    //         getSiblingTitle(board, [x + bottom[0], y + bottom[1]]);
    //         break;
    //     case findingTitleLeft:
    //         board[x][y] = 'yes'
    //         siblingCount++;
    //         getSiblingTitle(board, [x + left[0], y + left[1]]);
    //         break;
    //     case findingTitleRight:
    //         board[x][y] = 'yes'
    //         siblingCount++;
    //         getSiblingTitle(board, [x + right[0], y + right[1]]);
    //         break;
    //     default:
    //         if (siblingCount) {
    //             board[x][y] = 'yes';
    //         }
    //         break;
    // }
}

function isValidSibling(row, col) {
    return row >= 0 && row < maxRow && col >= 0 && col < maxCol
}

// const board = generateBoard(9)
const board = [[1, 1, 1], [1, 0, 0], [1, 0, 0]]
removeSimilarTitle(board, [1, 1]);
debugger