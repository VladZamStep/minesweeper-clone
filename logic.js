export const TILE_STATUSES = {
    HIDDEN: 'hidden',
    MARKED: 'marked',
    MINE: 'mine',
    NUMBER: 'number'
}

export const createBoard = (boardsize, numberOfMines) => {
    const board = [];
    for (let x = 0; x < boardsize; x++) {
        const row = [];
        const minesPositions = getMinesPosition(boardsize, numberOfMines);
        console.log(minesPositions)
        for (let y = 0; y < boardsize; y++) {
            const element = document.createElement('div');
            element.dataset.status = TILE_STATUSES.HIDDEN;
            const tile = {
                element,
                x,
                y,
                mine: minesPositions.some(positionMatch.bind(null, { x, y })),
                get status() {
                    return this.element.dataset.status;
                },
                set status(value) {
                    this.element.dataset.status = value;
                }
            }
            row.push(tile);
        };
        board.push(row);
    }
    return board;
}

// Function markTile()
export const markTile = (tile) => {
    if (tile.status !== TILE_STATUSES.HIDDEN &&
        tile.status !== TILE_STATUSES.MARKED) {
        return;
    }
    if (tile.status === TILE_STATUSES.MARKED) {
        tile.status = TILE_STATUSES.HIDDEN;
    }
    else tile.status = TILE_STATUSES.MARKED;
}

// Function revealTile()
export const revealTile = (board, tile) => {
    if (tile.status !== TILE_STATUSES.HIDDEN) {
        return;
    }
    if (tile.mine) {
        tile.status = TILE_STATUSES.MINE;
        return;
    }
    tile.status = TILE_STATUSES.NUMBER;
    const adjacentTile = nearByTiles(board, tile);
    const mines = adjacentTile.filter(t => t.mine);
    if (mines.length === 0) {
        adjacentTile.forEach(revealTile.bind(null, board));
    }
    else tile.element.textContent = mines.length;
}

export const checkWin = (board) => {
    return board.every(row => {
        row.every(tile => {
            return (
                tile.status === TILE_STATUSES.NUMBER ||
                (tile.mine &&
                    (tile.status === TILE_STATUSES.HIDDEN ||
                        tile.status === TILE_STATUSES.MARKED))
            )
        })
    })
}

export const checkLose = (board) => {
    return board.some(row => {
        return row.some(tile => {
            return tile.status === TILE_STATUSES.MINE;
        })
    })
}

const getMinesPosition = (boardsize, numberOfMines) => {
    const positions = [];
    while (positions.length < numberOfMines) {
        const position = {
            x: randomNum(boardsize),
            y: randomNum(boardsize)
        }
        if (!positions.some(positionMatch.bind(null, position))) {
            positions.push(position);
        }
    }
    return positions;
}
const positionMatch = (a, b) => {
    return a.x === b.x && a.y === b.y;
}
const randomNum = (size) => {
    return Math.floor(Math.random() * size)
}

const nearByTiles = (board, { x, y }) => {
    const tiles = [];
    for (let xOffset = -1; xOffset <= 1; xOffset++) {
        for (let yOffset = -1; yOffset <= 1; yOffset++) {
            const tile = board[x + xOffset]?.[y + yOffset];
            if (tile) tiles.push(tile);
        }
    }
    return tiles;
}