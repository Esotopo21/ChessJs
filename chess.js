const DEF_CHESSBOARD = [
    [2, 3, 4, 6, 5, 4, 3, 2],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-2, -3, -4, -6, -5, -4, -3, -2]
];

const DEBUG_CHESSBOARD = [
    [0, 0, 0, 0, 0, 0, 0, -1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [-1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 6, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, -1, 0]
];

let moveCount = '...';
let chessboard;
let moving = { from: [null, null], piece: null };

window.onload = () => {
    chessboard = DEF_CHESSBOARD;
    drawChessboard();
    updateChessboard();
}

function updateChessboard() {
    cleanAvailiable();
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {

            const id = getCeilId(i, j);
            const ceil = document.getElementById(id);
            const piece = getPiece(chessboard[i][j]);
            if (piece.id) {
                ceil.style.backgroundImage = `url(sprite/${piece.value > 0 ? 'white' : 'black'}_${piece.name}.png)`;
            } else {
                ceil.style.backgroundImage = 'none';
            }
            ceil.onclick = () => performAction(piece, i, j);
        }
    }
}

function drawChessboard() {
    let blackFlag;
    for (let i = 0; i < 8; i++) {
        blackFlag = i % 2 ? true : false;
        for (let j = 0; j < 8; j++) {

            const ceil = document.createElement('div');
            ceil.classList.add('square');
            ceil.classList.add(blackFlag ? 'black' : 'white');
            blackFlag = !blackFlag;
            ceil.id = getCeilId(i, j);
            document.getElementById('chessboard').appendChild(ceil);

        }
    }
}

function move(i, j, ti, tj) {
    const eaten = chessboard[ti][tj] !== 0;
    chessboard[ti][tj] = chessboard[i][j];
    chessboard[i][j] = 0;

    if ((ti == 7 && chessboard[ti][tj] == 1) || (ti == 0 && chessboard[ti][tj] == -1)) {
        promotion(ti, tj);
    }
    return eaten;
}

function getCeilId(i, j) {
    return String.fromCharCode(j + 97) + '' + (i + 1);
}

function getPiece(num) {
    switch (num) {
        case 1:
        case -1:
            return { id: 'P', name: 'pawn', value: num > 0 ? 1 : -1, action: (i, j, value) => getPawnMoves(i, j, value) };
        case 2:
        case -2:
            return { id: 'R', name: 'rook', value: num > 0 ? 5 : -5, action: (i, j, value) => getRookMoves(i, j, value) };
        case 3:
        case -3:
            return { id: 'N', name: 'knight', value: num > 0 ? 3 : -3, action: (i, j, value) => getKnightMoves(i, j, value) };
        case 4:
        case -4:
            return { id: 'B', name: 'bishop', value: num > 0 ? 4 : -4, action: (i, j, value) => getBishopMoves(i, j, value) };
        case 5:
        case -5:
            return { id: 'Q', name: 'queen', value: num > 0 ? 8 : -8, action: (i, j, value) => getQueenMoves(i, j, value) };
        case 6:
        case -6:
            return { id: 'K', name: 'king', value: num > 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY, action: (i, j, value) => getKingMoves(i, j, value) };
        default:
            return {
                id: null,
                name: 'void',
                value: 0,
                action: (i, j) => { return [] }
            };

    }
}

function getKingMoves(i, j, value) {
    let ti, tj; // target i, target j
    const moves = [];

    ti = i + 1;
    tj = j + 1;

    if (canMove(ti, tj) || canEat(ti, tj, value)) {
        moves.push([ti, tj]);
    }

    ti = i - 1;
    tj = j - 1;

    if (canMove(ti, tj) || canEat(ti, tj, value)) {
        moves.push([ti, tj]);
    }

    ti = i + 1;
    tj = j - 1;

    if (canMove(ti, tj) || canEat(ti, tj, value)) {
        moves.push([ti, tj]);
    }

    ti = i - 1;
    tj = j + 1;

    if (canMove(ti, tj) || canEat(ti, tj, value)) {
        moves.push([ti, tj]);
    }

    ti = i + 1;
    tj = j;

    if (canMove(ti, tj) || canEat(ti, tj, value)) {
        moves.push([ti, tj]);
    }

    ti = i - 1;
    tj = j;

    if (canMove(ti, tj) || canEat(ti, tj, value)) {
        moves.push([ti, tj]);
    }

    ti = i;
    tj = j - 1;

    if (canMove(ti, tj) || canEat(ti, tj, value)) {
        moves.push([ti, tj]);
    }

    ti = i;
    tj = j + 1;

    if (canMove(ti, tj) || canEat(ti, tj, value)) {
        moves.push([ti, tj]);
    }

    return moves;

}

function getKnightMoves(i, j, value) {
    let ti, tj; // target i, target j
    const moves = [];

    ti = i + 1;
    tj = j + 2;

    if (canMove(ti, tj) || canEat(ti, tj, value)) {
        moves.push([ti, tj]);
    }

    ti = i + 2;
    tj = j + 1;

    if (canMove(ti, tj) || canEat(ti, tj, value)) {
        moves.push([ti, tj]);
    }

    ti = i - 1;
    tj = j - 2;

    if (canMove(ti, tj) || canEat(ti, tj, value)) {
        moves.push([ti, tj]);
    }

    ti = i - 2;
    tj = j - 1;

    if (canMove(ti, tj) || canEat(ti, tj, value)) {
        moves.push([ti, tj]);
    }

    ti = i - 1;
    tj = j + 2;

    if (canMove(ti, tj) || canEat(ti, tj, value)) {
        moves.push([ti, tj]);
    }

    ti = i - 2;
    tj = j + 1;

    if (canMove(ti, tj) || canEat(ti, tj, value)) {
        moves.push([ti, tj]);
    }

    ti = i + 1;
    tj = j - 2;

    if (canMove(ti, tj) || canEat(ti, tj, value)) {
        moves.push([ti, tj]);
    }

    ti = i + 2;
    tj = j - 1;

    if (canMove(ti, tj) || canEat(ti, tj, value)) {
        moves.push([ti, tj]);
    }

    return moves;
}

function getQueenMoves(i, j, value) {
    let moves = [];
    getBishopMoves(i, j, value).forEach(move => moves.push(move));
    getRookMoves(i, j, value).forEach(move => moves.push(move));
    return moves;
}

function getBishopMoves(i, j, value) {
    const moves = [];
    let ti, tj; // target i, target j
    let blocked = false;
    ti = i + 1;
    tj = j + 1;

    while (areCoordinatesInBounds(ti, tj) && !blocked) {
        if (canMove(ti, tj)) {
            moves.push([ti, tj]);
        } else {
            if (canEat(ti, tj, value)) {
                moves.push([ti, tj]);
            }
            blocked = true;
        }
        ti++;
        tj++;
    }

    blocked = false;
    ti = i + 1;
    tj = j - 1;

    while (areCoordinatesInBounds(ti, tj) && !blocked) {
        if (canMove(ti, tj)) {
            moves.push([ti, tj]);
        } else {
            if (canEat(ti, tj, value)) {
                moves.push([ti, tj]);
            }
            blocked = true;
        }
        ti++;
        tj--
    }

    blocked = false;
    ti = i - 1;
    tj = j - 1;

    while (areCoordinatesInBounds(ti, tj) && !blocked) {
        if (canMove(ti, tj)) {
            moves.push([ti, tj]);
        } else {
            if (canEat(ti, tj, value)) {
                moves.push([ti, tj]);
            }
            blocked = true;
        }
        ti--
        tj--
    }

    blocked = false;
    ti = i - 1;
    tj = j + 1;

    while (areCoordinatesInBounds(ti, tj) && !blocked) {
        if (canMove(ti, tj)) {
            moves.push([ti, tj]);
        } else {
            if (canEat(ti, tj, value)) {
                moves.push([ti, tj]);
            }
            blocked = true;
        }
        ti--
        tj++;
    }

    return moves;
}




function getRookMoves(i, j, value) {
    const moves = [];
    let ti, tj; // target i, target j
    let blocked = false;
    ti = i + 1;
    tj = j;
    while (ti < 8 && !blocked) {
        if (canMove(ti, tj)) {
            moves.push([ti, tj]);
        } else {
            if (canEat(ti, tj, value)) {
                moves.push([ti, tj]);
            }
            blocked = true;
        }
        ti++;
    }
    ti = i - 1;
    blocked = false;
    while (ti >= 0 && !blocked) {
        if (canMove(ti, tj)) {
            moves.push([ti, tj]);
        } else {
            if (canEat(ti, tj, value)) {
                moves.push([ti, tj]);
            }
            blocked = true;
        }
        ti--;
    }
    ti = i;
    tj = j + 1;
    blocked = false;
    while (ti < 8 && !blocked) {
        if (canMove(ti, tj)) {
            moves.push([ti, tj]);
        } else {
            if (canEat(ti, tj, value)) {
                moves.push([ti, tj]);
            }
            blocked = true;
        }
        tj++;
    }
    tj = j - 1;
    blocked = false;
    while (tj >= 0 && !blocked) {
        if (canMove(ti, tj)) {
            moves.push([ti, tj]);
        } else {
            if (canEat(ti, tj, value)) {
                moves.push([ti, tj]);
            }
            blocked = true;
        }
        tj--;
    }
    return moves;
}

function getPawnMoves(i, j, value) {
    const moves = [];
    let ti, tj, tc, tp; // target i, target j, target ceil, target piece
    const colorFactor = value > 0 ? 1 : -1;

    ti = i + colorFactor;
    tj = j;

    if (canMove(ti, tj)) {
        moves.push([ti, tj]);
    }

    if ((colorFactor == 1 && i == 1) || (colorFactor == -1 && i == 6)) {
        ti = i + 2 * colorFactor;
        if (canMove(ti, tj)) {
            moves.push([ti, tj]);
        }
    }

    ti = i + colorFactor;
    tj = j - 1;
    if (canEat(ti, tj, value)) {
        moves.push([ti, tj]);
    }

    ti = i + colorFactor;
    tj = j + 1;
    if (canEat(ti, tj, value)) {
        moves.push([ti, tj]);
    }

    return moves;
}

function canMove(i, j) {
    return areCoordinatesInBounds(i, j) && (chessboard[i][j] == 0);
}

function canEat(i, j, value) {
    return areCoordinatesInBounds(i, j) && (chessboard[i][j] * value < 0);
}

function cleanAvailiable() {
    Array.from(document.getElementsByClassName('availiable')).forEach(ceil => ceil.classList.remove('availiable'));
}

function performAction(piece, i, j) {
    if (!moving.piece && piece.id) {
        markAvailiable(piece, i, j);
        moving = { from: [i, j], to: [null, null], piece: piece };
    } else {
        if (moving.piece && isAvailiable(i, j)) {
            const eaten = move(moving.from[0], moving.from[1], i, j);
            updateChessboard();
            logMove(moving.from[0], moving.from[1], i, j, moving.piece, eaten);
        }
        moving = {};
        cleanAvailiable();
    }
    if (!piece.id) {
        moving = {};
        cleanAvailiable();
    }
}

function logMove(i, j, ti, tj, piece, eaten) {
    console.log(`${moveCount} ${piece.id != 'P' ? piece.id : ''}${eaten ? 'x' : ''}${getCeilId(i,j)}`);
}

function promotion(i, j) {
    chessboard[i][j] = chessboard[i][j] * 5;
}

function isAvailiable(i, j) {
    return document.getElementById(getCeilId(i, j)).classList.contains('availiable');
}

function markAvailiable(piece, i, j) {
    cleanAvailiable();
    const moves = piece.action(i, j, piece.value);
    moves.forEach(coordinate => {
        document.getElementById(getCeilId(coordinate[0], coordinate[1])).classList.add('availiable');
    })
}

function areCoordinatesInBounds(i, j) {
    return (i >= 0 && i < 8 && j >= 0 && j < 8);
}