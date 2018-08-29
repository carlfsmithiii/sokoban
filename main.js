const gameNode = document.getElementById("game-field");
const boxCount = 7;

/*
 *  KEY FOR MAP
 *    'W' is a wall
 *    ' ' is an open space
 *    'O' is an initially open storage location
 *    'B' is a starting position of a box/crate
 *    'X' is a storage location with a box already on it
 *    'S' is the player's starting position 
 */
const initialMap = [
  "  WWWWW ",
  "WWW   W ",
  "WOSB  W ",
  "WWW BOW ",
  "WOWWB W ",
  "W W O WW",
  "WB XBBOW",
  "W   O  W",
  "WWWWWWWW"
];

const currentMap = [
    "  WWWWW ".split(""),
    "WWW   W ".split(""),
    "W  B  W ".split(""),
    "WWW B W ".split(""),
    "WOWWB W ".split(""),
    "W W   WW".split(""),
    "WB BBB W".split(""),
    "W      W".split(""),
    "WWWWWWWW".split("")
];

const gameGridHeight = initialMap.length;
const gameGridWidth = initialMap[0].length;

const direction = {
    down: 1,
    up: -1,
    left: -1,
    right: 1,
    none: 0
};

let currentPosition = {
    row: 2,
    column: 2
}

function initGameView() {
    for (let rowIndex = 0; rowIndex < gameGridHeight; rowIndex++) {
        const rowNode = createDivNodeWithClasses(["row"]);
        gameNode.appendChild(rowNode);

        for (let columnIndex = 0; columnIndex < gameGridWidth; columnIndex++) {
            rowNode.appendChild(initCell[initialMap[rowIndex][columnIndex]](rowIndex, columnIndex));
        }
    }
}

function play() {
    document.addEventListener("keydown", (event) => {
        const keyName = event.key;
        if (keyName == "ArrowDown") {
            downPressed();
        } else if (keyName == "ArrowUp") {
            upPressed();
        } else if (keyName == "ArrowLeft") {
            leftPressed();
        } else if (keyName == "ArrowRight") {
            rightPressed();
        }
        checkWin();
    });
}

function createDivNodeWithClasses(classList) {
    const divNode = document.createElement("div");
    for (let className of classList) {
        divNode.classList.add(className);
    }
    return divNode;
}

function downPressed() {
    tryToMovePlayer(direction.down, direction.none);
}

function upPressed() {
    tryToMovePlayer(direction.up, direction.none);
}

function rightPressed() {
    tryToMovePlayer(direction.none, direction.right);
}  

function leftPressed() {
    tryToMovePlayer(direction.none, direction.left);
}

function tryToMovePlayer(rowShift, columnShift) {
    const newRow = currentPosition.row + rowShift;
    const newColumn = currentPosition.column + columnShift;
    if (isValidPosition(rowShift, columnShift)) {
        if (isBox(rowShift, columnShift)) {
            shiftBox(rowShift, columnShift);
        }
        currentPosition.row = newRow;
        currentPosition.column = newColumn;
        const rowQuery = "[data-row='" + newRow + "']";
        const columnQuery = "[data-column='" + newColumn + "']";
        const nodeMovedTo = document.querySelector(rowQuery + columnQuery);
        const currentPlayer = document.getElementsByClassName("player")[0];
        nodeMovedTo.appendChild(currentPlayer);
    }
}

function isValidPosition(rowShift, columnShift) {
    if (isWall(rowShift, columnShift)) {
        return false;
    }

    if (isBox(rowShift, columnShift)) {
        return (!isBox(rowShift * 2, columnShift * 2)) && (!isWall(rowShift * 2, columnShift * 2));
    }

    return true;
}

function isWall(rowShift, columnShift) {
    if (currentMap[currentPosition.row + rowShift][currentPosition.column + columnShift] == "W") {
        return true;
    }
    return false;
}

function isBox(rowShift, columnShift) {
    if (currentMap[currentPosition.row + rowShift][currentPosition.column + columnShift] == "B") {
        return true;
    }
    return false;    
}

function shiftBox(rowShift, columnShift) {
    const boxRowQuery = "[data-row='" + (currentPosition.row + rowShift) + "']";
    const boxColumnQuery = "[data-column='" + (currentPosition.column + columnShift) + "']";
    const newHomeRowQuery = "[data-row='" + (currentPosition.row + (rowShift * 2)) + "']";
    const newHomeColumnQuery = "[data-column='" + (currentPosition.column + (columnShift * 2)) + "']";
    const box = document.querySelector(boxRowQuery + boxColumnQuery + " .box");
    const newHomeForBox = document.querySelector(newHomeRowQuery + newHomeColumnQuery);
    newHomeForBox.appendChild(box);
    currentMap[currentPosition.row + rowShift][currentPosition.column + columnShift] = " ";
    currentMap[currentPosition.row + rowShift * 2][currentPosition.column + columnShift * 2] = "B";
    if (initialMap[currentPosition.row + rowShift * 2][currentPosition.column + columnShift * 2] == "O" || 
        initialMap[currentPosition.row + rowShift * 2][currentPosition.column + columnShift * 2] == "X") {
        box.classList.add("box-on-storage-location");
    } else {
        box.classList.remove("box-on-storage-location");
    }
}

const initCell = {
    "W": function(rowIndex, columnIndex) {
        return createDivNodeWithClasses(["cell", "wall"]);
    },
    " ": function(rowIndex, columnIndex) {
        const groundCell = createDivNodeWithClasses(["cell", "open-hall"]);
        groundCell.dataset.row = rowIndex;
        groundCell.dataset.column = columnIndex;
        return groundCell;
    },
    "B": function(rowIndex, columnIndex) {
        const groundCell = initCell[" "](rowIndex, columnIndex);
        groundCell.appendChild(createDivNodeWithClasses(["cell", "box"]));
        return groundCell;
    },
    "O": function(rowIndex, columnIndex) {
        const groundCell = initCell[" "](rowIndex, columnIndex);
        groundCell.appendChild(createDivNodeWithClasses(["storage-location"]));
        return groundCell;
    },
    "S": function(rowIndex, columnIndex) {
        const groundCell = initCell[" "](rowIndex, columnIndex);
        groundCell.appendChild(createDivNodeWithClasses(["player"]));
        return groundCell;
    },
    "X": function(rowIndex, columnIndex) {
        const groundCell = initCell[" "](rowIndex, columnIndex);
        groundCell.appendChild(createDivNodeWithClasses(["storage-location"]));
        groundCell.appendChild(createDivNodeWithClasses(["cell", "box", "box-on-storage-location"]));
        return groundCell;
    }
}

function checkWin() {
    if (document.getElementsByClassName("box-on-storage-location").length == boxCount) {
        setTimeout(function() {alert("YOU WIN!");}, 300);
    }
}

initGameView();
play();