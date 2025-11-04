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
        const [rIndex, cIndex] = position
        getSiblingTitle(board, [rIndex, cIndex]);
    }

    function getSiblingTitle(board, position) {
        const [rIndex, cIndex] = position
        const startedTitle = board[rIndex][cIndex]
        const siblings = getSiblingTitleByPosition(board, position, startedTitle)

        if (!siblings.length) {
            return 0;
        }
        board[rIndex][cIndex] = null

        while (siblings.length) {
            const [rIndex, cIndex] = siblings.shift()
            let newSiblings = getSiblingTitleByPosition(board, [rIndex, cIndex], startedTitle)
            siblings.push(...newSiblings)
        }
    }

    function getSiblingTitleByPosition(board, position, startedTitle) {
        const siblings = [];
        const [rIndex, cIndex] = position

        for (let direction in directions) {
            const newRowIndex = rIndex + directions[direction][0];
            const newColumnIndex = cIndex + directions[direction][1];
            const siblingTitle = isValidSibling(newRowIndex, newColumnIndex) ? board[newRowIndex][newColumnIndex] : null

            if (siblingTitle !== null && siblingTitle === startedTitle) {
                siblings.push([newRowIndex, newColumnIndex])
                markTitle(board, [newRowIndex, newColumnIndex])
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
    const board = [[1, 1, 1, 1, 1], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0]]
    removeSimilarTitle(board, [1, 1]);

    console.log(board)
}