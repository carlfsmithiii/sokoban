const gameNode = document.getElementById("game-field");
let boxCount = 0;
let isGameStillGoing = true;

/*
 *  KEY FOR MAP
 *    'W' is a wall
 *    ' ' is an open space
 *    'O' is an initially open storage location
 *    'B' is a starting position of a box/crate
 *    'X' is a storage location with a box already on it
 *    'S' is the player's starting position 
 */


const firstMap = [
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

const secondMap = [
    "    WWWWW          ",
    "    W   W          ",
    "    WB  W          ",
    "  WWW  BWW         ",
    "  W  B B W         ",
    "WWW W WW W   WWWWWW",
    "W   W WW WWWWW  OOW",
    "W B  B          OOW",
    "WWWWW WWW WSWW  OOW",
    "    W     WWWWWWWWW",
    "    WWWWWWW        "
]

let gameStartingMap  = firstMap;

const updatedMap = [];

let gameGridHeight = gameStartingMap.length;
let gameGridWidth = gameStartingMap[0].length;

const direction = {
    down: 1,
    up: -1,
    left: -1,
    right: 1,
    none: 0
};

const currentPosition = {}

function initGame() {
    gameGridHeight = gameStartingMap.length;
    gameGridWidth = gameStartingMap[0].length;
    initGameView();
    initCurrentMap();
}

function initGameView() {
    for (let rowIndex = 0; rowIndex < gameGridHeight; rowIndex++) {
        const rowNode = createDivNodeWithClasses(["row"]);
        gameNode.appendChild(rowNode)

        for (let columnIndex = 0; columnIndex < gameGridWidth; columnIndex++) {
            const initialMapCellValue = gameStartingMap[rowIndex][columnIndex];
            rowNode.appendChild(initCell[initialMapCellValue](rowIndex, columnIndex));
        }
    }
}

function initCurrentMap() {
    boxCount = 0;
    for (let rowIndex = 0; rowIndex < gameGridHeight; rowIndex++) {
        updatedMap.push([]);
        for (let columnIndex = 0; columnIndex < gameGridWidth; columnIndex++) {
            switch (gameStartingMap[rowIndex][columnIndex]) {
                case 'W':
                    updatedMap[rowIndex].push("W");
                    break;
                case " ":
                case "O":
                    updatedMap[rowIndex].push(" ");
                    break;
                case "S":
                    updatedMap[rowIndex].push(" ");
                    currentPosition.row = rowIndex;
                    currentPosition.column = columnIndex;
                    break;
                case "X":
                case "B":
                    boxCount++;
                    updatedMap[rowIndex].push("B");
                    break;
            }
        }
    }
}

function play() {
    initGame();
    document.addEventListener("keydown", (event) => {
        if (isGameStillGoing) {
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
        }
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
    if (isValidPosition(rowShift, columnShift)) {
        if (isBox(rowShift, columnShift)) {
            shiftBox(rowShift, columnShift);
        }
        movePlayer(currentPosition.row + rowShift, currentPosition.column + columnShift);
    }
}

function movePlayer(newRow, newColumn) {
    currentPosition.row = newRow;
    currentPosition.column = newColumn;
    const rowQuery = "[data-row='" + newRow + "']";
    const columnQuery = "[data-column='" + newColumn + "']";
    const nodeMovedTo = document.querySelector(rowQuery + columnQuery);
    const currentPlayer = document.getElementsByClassName("player")[0];
    nodeMovedTo.appendChild(currentPlayer);
}

function isValidPosition(rowShift, columnShift) {
    if (isWall(rowShift, columnShift)) {
        return false;
    }

    if (isBox(rowShift, columnShift)) {
        return !(isBox(rowShift * 2, columnShift * 2) || isWall(rowShift * 2, columnShift * 2));
    }

    return true;
}

function isWall(rowShift, columnShift) {
    if (updatedMap[currentPosition.row + rowShift][currentPosition.column + columnShift] == "W") {
        return true;
    }
    return false;
}

function isBox(rowShift, columnShift) {
    if (updatedMap[currentPosition.row + rowShift][currentPosition.column + columnShift] == "B") {
        return true;
    }
    return false;    
}

function shiftBox(rowShift, columnShift) {
    const box = getBoxNode(rowShift, columnShift);
    shiftBoxInView(box, rowShift, columnShift);
    shiftBoxInModel(rowShift, columnShift);
}

function shiftBoxInView(box, rowShift, columnShift) {
    const newHomeForBox = getCellNode(rowShift * 2, columnShift * 2);
    newHomeForBox.appendChild(box);
    changeBoxColorIfOnStorage(box, rowShift, columnShift);
}

function changeBoxColorIfOnStorage(box, rowShift, columnShift) {
    if (gameStartingMap[currentPosition.row + rowShift * 2][currentPosition.column + columnShift * 2] == "O" || 
        gameStartingMap[currentPosition.row + rowShift * 2][currentPosition.column + columnShift * 2] == "X") {
        box.classList.add("box-on-storage-location");
    } else {
        box.classList.remove("box-on-storage-location");
    }
}

function shiftBoxInModel(rowShift, columnShift) {
    updatedMap[currentPosition.row + rowShift][currentPosition.column + columnShift] = " ";
    updatedMap[currentPosition.row + rowShift * 2][currentPosition.column + columnShift * 2] = "B";
}

function getBoxNode(rowShift, columnShift) {
    const rowQuery = "[data-row='" + (currentPosition.row + rowShift) + "']"; 
    const columnQuery = "[data-column='" + (currentPosition.column + columnShift) + "']";
    return document.querySelector(rowQuery + columnQuery + " .box");
}

function getCellNode(rowShift, columnShift) {
    const rowQuery = "[data-row='" + (currentPosition.row + rowShift) + "']"; 
    const columnQuery = "[data-column='" + (currentPosition.column + columnShift) + "']";
    return document.querySelector(rowQuery + columnQuery);
}

const initCell = {
    "W": createWall,
    " ": createNonWallCell,
    "B": createCellWithBox,
    "O": createCellWithStorageLocation,
    "S": createPlayersInitialPosition,
    "X": createCellWithBoxAndStorage
}

function createWall() {
    return createDivNodeWithClasses(["cell", "wall"]); 
}

function createNonWallCell(rowIndex, columnIndex) {
    const baseCell = createDivNodeWithClasses(["cell", "open-hall"]);
    baseCell.dataset.row = rowIndex;
    baseCell.dataset.column = columnIndex;
    return baseCell; 
}

function createCellWithBox(rowIndex, columnIndex) {
    const baseCell = createNonWallCell(rowIndex, columnIndex);
    baseCell.appendChild(createDivNodeWithClasses(["cell", "box"]));
    return baseCell; 
} 

function createCellWithStorageLocation(rowIndex, columnIndex) {
    const baseCell = createNonWallCell(rowIndex, columnIndex);
    baseCell.appendChild(createDivNodeWithClasses(["storage-location"]));
    return baseCell;
}

function createPlayersInitialPosition(rowIndex, columnIndex) {
    const baseCell = createNonWallCell(rowIndex, columnIndex);
    baseCell.appendChild(createDivNodeWithClasses(["player"]));
    return baseCell;
}

function createCellWithBoxAndStorage(rowIndex, columnIndex) {
    const baseCell = createNonWallCell(rowIndex, columnIndex);
    baseCell.appendChild(createDivNodeWithClasses(["storage-location"]));
    baseCell.appendChild(createDivNodeWithClasses(["cell", "box", "box-on-storage-location"]));
    return baseCell;
}

function checkWin() {
    if (document.getElementsByClassName("box-on-storage-location").length == boxCount) {
        // isGameStillGoing = false;
        setTimeout(function() {alert("YOU WIN!");}, 100);
        setTimeout(function() {rotateGame();}, 500);
    }
}

function rotateGame() {
    if (gameStartingMap == firstMap) {
        gameStartingMap = secondMap;
    } else {
        gameStartingMap = firstMap;
    }
    document.getElementById("game-field").textContent = "";
    updatedMap.splice(0, updatedMap.length);
    initGame();
}

play();