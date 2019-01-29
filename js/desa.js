
var PLAYER = 1;
var CPU = 2;

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

        updatePg(row, col, who);
    }

    function drawPg() {
        pgState.forEach(function(row, i) {
            drawPgRow(row, i);
        });
    }

    function getStatStyle(who) {
        var className = 'empty';

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
                markState(rowIndex, colIndex, PLAYER);
            };
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
