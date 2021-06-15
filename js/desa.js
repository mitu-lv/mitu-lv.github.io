
function createSVG(paths) {
    var namespace = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(namespace, 'svg');

    svg.setAttribute('viewBox', '0 0 128 128');

    paths.forEach(d => {
        var path = document.createElementNS(namespace, 'path');
        path.setAttribute('d', d);
        svg.appendChild(path);
    });

    return svg;
}

function getStatStyle(who) {
    let className = 'empty';

    switch(who) {
        case 1:
            className += ' player';
        break;
        case 2:
            className += ' cpu';
        break;
    }

    return className;
}

function updatePg(row, col, who) {
    const index = (3 * row + col);

    var blockElem = document.querySelector('.empty:nth-child(' +  (index + 1) + ')');

    blockElem.className = getStatStyle(who);
}

function desa(container) {
    const BLANK = 0;
    var PLAYER = 1;
    var CPU = 2;
    var turn = 1;

    var pgState = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ]

    function combinations() {

    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    function initialTurn() {
        turn = Math.round(Math.random()) + 1;
    }

    function hasWon(pgState, turn) {
        for (var i = 0, len = pgState.length; i < len; i++) {
            // cols
            if (pgState[i][0] === turn && pgState[i][1] === turn && pgState[i][2] === turn) {
                return true;
            }
            // rows
            if (pgState[0][i] === turn && pgState[1][i] === turn && pgState[2][i] === turn) {
                return true;
            }
            // diag 1
            if (pgState[0][0] === turn && pgState[1][1] === turn && pgState[2][2] === turn) {
                return true;
            }
            // diag 2
            if (pgState[0][2] === turn && pgState[1][1] === turn && pgState[2][0] === turn) {
                return true;
            }
        }
    }

    function noCellsLeft() {
        const free = getFreeCells();
        if (free.length === 0) {
            return true;
        }
    }

    function passTurn() {
        if (hasWon(pgState, turn)) {
            console.log(turn === CPU ? 'CPU' : 'PLAYER', ' has won');
            return;
        } else if (noCellsLeft()) {
            console.log('DRAW');
            return;
        }

        turn = 1 + (turn % 2);
        if (turn === CPU) {
            cpuTurn();
        }
    }

    function getFreeCells() {
        const freeCells = [];
        for (var i = 0, len = pgState.length; i < len; i++) {
            for (var j = 0, jlen=pgState[i].length; j < jlen; j++) {
                if (pgState[i][j] === 0) {
                    freeCells.push([i, j]);
                }
            }
        }
        return freeCells;
    }

    function cpuTurn() {
        const [_, choice] = Minimax(pgState, CPU);

        if (choice != null) {
            const [row, col] = choice;
            markState(row, col, CPU);
        }

        passTurn();
    }

    function Minimax(pgState, player) {
        // check if already won
        const winner = hasWon(pgState, CPU) ? CPU : hasWon(pgState, PLAYER) ? PLAYER : null;

        if (winner == CPU) {
            return [1, null];
        } else if (winner == PLAYER) {
            return [-1, null];
        }

        let move, moveScore;
        if (player == CPU) {
            [moveScore, move] = Minimax_Maximize(pgState);
        } else {
            [moveScore, move] = Minimax_Minimize(pgState);
        }

        if (move == null) {
            moveScore = 0;
        }

        // draw
        return [moveScore, move];
    }

    function Minimax_Maximize(pgState) {
        let moveScore = Number.NEGATIVE_INFINITY;
        let move = null;

        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                if (pgState[x][y] == BLANK) {
                    const newPgState = pgState.map(r => r.slice());

                    newPgState[x][y] = CPU;

                    const [newMoveScore, _] = Minimax(newPgState, PLAYER);

                    if (newMoveScore > moveScore) {
                        move = [x, y];
                        moveScore = newMoveScore;
                    }
                }
            }
        }

        return [moveScore, move];
    }

    function Minimax_Minimize(pgState) {
        let moveScore = Number.POSITIVE_INFINITY;
        let move = null;

        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                if (pgState[x][y] == BLANK) {
                    const newPgState = pgState.map(r => r.slice());

                    newPgState[x][y] = PLAYER;

                    const [newMoveScore, _] = Minimax(newPgState, CPU);

                    if (newMoveScore < moveScore) {
                        move = [x, y];
                        moveScore = newMoveScore;
                    }
                }
            }
        }

        return [moveScore, move];
    }


    function markState(row, col, who) {
        if(pgState[row][col] !== BLANK && who !== turn) {
            return;
        }

        pgState[row][col] = who;

        updatePg(row, col, who);
    }

    function drawPg() {
        pgState.forEach(function(row, i) {
            drawPgRow(row, i);
        });
    }

    function drawPgRow(row, rowIndex) {
        row.forEach(function(item, colIndex) {
            var blockElem = document.createElement('div');
            var x = createSVG(['M16,16L112,112', 'M112,16L16,112']);
            var o = createSVG(['M64,16A48,48 0 1,0 64,112A48,48 0 1,0 64,16']);

            x.setAttribute('class', 'xSprite');
            x.querySelectorAll('path').forEach(d => {
                d.setAttribute('class', 'xPath')
            });

            o.setAttribute('class', 'oSprite');
            o.querySelector('path').setAttribute('class', 'oPath');

            blockElem.appendChild(x);
            blockElem.appendChild(o);

            container.appendChild(blockElem);

            blockElem.className = getStatStyle(pgState[rowIndex][colIndex]);

            blockElem.onclick = function() {
                if (turn === PLAYER && pgState[rowIndex][colIndex] === BLANK) {
                    markState(rowIndex, colIndex, PLAYER);
                    passTurn();
                }
            };
        });
    }

    function d3sa() {
        drawPg();
        initialTurn();

        if (turn === CPU) {
            cpuTurn();
        }
    }

    return d3sa;
}
