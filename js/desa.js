
var PLAYER = 1;
var CPU = 2;

function desa(container) {
    var pgState = [
        [0, 2, 0],
        [0, 0, 0],
        [0, 0, 0]
    ]

    function markState(row, col, who) {
        if(pgState[row][col] !== 0 || who !== PLAYER) {
            return;
        }

        pgState[row][col] = who;

        drawPg();
    }

    function drawPg() {
        var fc = container.firstChild;

        while( fc ) {
            container.removeChild( fc );
            fc = container.firstChild;
        }

        pgState.forEach(function(row, i) {
            drawPgRow(row, i);
        });
    }

    function drawPgRow(row, rowIndex) {
        row.forEach(function(item, colIndex) {
            var blockElem = this.blockElem = document.createElement('div');
            var className = 'empty';

            switch(item) {
                case 1:
                    className += ' player';
                break;
                case 2:
                    className += ' cpu';
                break;
            }

            blockElem.className = className;

            blockElem.onclick = function() {
                markState(rowIndex, colIndex, PLAYER);
            };

            container.appendChild(blockElem);
        });
    }

    function d3sa() {
        drawPg();
    }

    Object.assign(d3sa, {
        drawPg
    })

    return d3sa;
}
