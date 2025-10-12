function init() {

    let maxRow = 3;
    let maxCol = 3;

    const directions = {
        top: [-1, 0],
        bottom: [1, 0],
        left: [0, -1],
        right: [0, 1],
    }

    function generateBoard(n) {
        let board = []

        maxRow = n;
        maxCol = n
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
    }

    function getSiblingTitle(board, position) {
        const [x, y] = position
        const startedTitle = board[x][y]
        const siblings = getSiblingTitleByPosition(board, position, startedTitle)

        if (!siblings.length) {
            return 0;
        }
        board[x][y] = null

        while (siblings.length) {
            const [x, y] = siblings.shift()

            siblings.concat(getSiblingTitleByPosition(board, [x, y], startedTitle))
        }
    }

    function getSiblingTitleByPosition(board, position, startedTitle) {
        const siblings = [];
        const [x, y] = position

        for (let direction in directions) {
            const newX = x + directions[direction][0];
            const newY = y + directions[direction][1];
            const siblingTitle = isValidSibling(newX, newY) ? board[newX][newY] : null

            if (siblingTitle !== null && siblingTitle === startedTitle) {
                siblings.push([newX, newY])
                markTitle(board, [newX, newY])
            }
        }

        return siblings
    }

    function markTitle(board, position) {
        board[position[0]][position[1]] = null;
    }

    function isValidSibling(row, col) {
        return row >= 0 && row < maxRow && col >= 0 && col < maxCol
    }

    // const board = generateBoard(9)
    const board = [[1, 1, 1], [1, 0, 0], [1, 0, 0]]
    removeSimilarTitle(board, [1, 1]);
}