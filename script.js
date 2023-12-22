const present = document.getElementById('present');
const puzzleImage = new Image();
puzzleImage.src = "./images/n0B7E.0N3U16.jpg"; // Path to your puzzle image

let rows, columns;
if (isMobile()) {
    rows = 5; // Adjust the number of rows for mobile devices
    columns = 5; // Adjust the number of columns for mobile devices
} else {
    rows = 10;
    columns = 10;
}

const puzzlePieces = [];
const blankSpaceSize = 50; // Size of the blank space around the puzzle pieces

let selectedPiece = null;

function generatePuzzlePieces() {
    const puzzleWidth = puzzleImage.width;
    const puzzleHeight = puzzleImage.height;
    const pieceWidth = puzzleWidth / columns / 1.5; // Adjust the factor for smaller pieces
    const pieceHeight = puzzleHeight / rows / 1.5; // Adjust the factor for smaller pieces

    const availableWidth = window.innerWidth - blankSpaceSize * 2;
    const availableHeight = window.innerHeight - blankSpaceSize * 2;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            let xPos, yPos;
            do {
                xPos = blankSpaceSize + Math.random() * availableWidth;
                yPos = blankSpaceSize + Math.random() * availableHeight;
            } while (
                puzzlePieces.some(piece => isOverlap(piece, xPos, yPos, pieceWidth, pieceHeight))
            );

            const piece = createPuzzlePiece(col, row, xPos, yPos, pieceWidth, pieceHeight);
            puzzlePieces.push(piece);
            document.body.appendChild(piece);
        }
    }
}

function createPuzzlePiece(col, row, xPos, yPos, width, height) {
    const piece = document.createElement('div');
    piece.className = 'puzzle-piece';
    piece.style.width = `${width}px`;
    piece.style.height = `${height}px`;
    piece.style.backgroundImage = `url(${puzzleImage.src})`;
    piece.style.backgroundSize = `${puzzleImage.width}px ${puzzleImage.height}px`;
    piece.style.backgroundPosition = `-${col * width}px -${row * height}px`;
    piece.style.position = 'absolute';
    piece.style.transform = `translate(${xPos}px, ${yPos}px)`;

    piece.addEventListener(isMobile() ? 'touchstart' : 'mousedown', (event) => {
        event.preventDefault();
        selectedPiece = piece;
        piece.style.zIndex = '1000'; // Bring the selected piece to the front
        piece.style.opacity = '0.5'; // Set opacity for the selected piece

        const offsetX = isMobile() ? event.touches[0].clientX - piece.getBoundingClientRect().left :
                                      event.clientX - piece.getBoundingClientRect().left;
        const offsetY = isMobile() ? event.touches[0].clientY - piece.getBoundingClientRect().top :
                                      event.clientY - piece.getBoundingClientRect().top;

        const moveHandler = (moveEvent) => {
            moveEvent.preventDefault();
            const x = isMobile() ? moveEvent.touches[0].clientX - offsetX :
                                   moveEvent.clientX - offsetX;
            const y = isMobile() ? moveEvent.touches[0].clientY - offsetY :
                                   moveEvent.clientY - offsetY;

            piece.style.transform = `translate(${x}px, ${y}px)`;
        };

        const upHandler = () => {
            piece.style.opacity = '1'; // Reset opacity after drag
            selectedPiece = null;
            document.removeEventListener(isMobile() ? 'touchmove' : 'mousemove', moveHandler);
            document.removeEventListener(isMobile() ? 'touchend' : 'mouseup', upHandler);
        };

        document.addEventListener(isMobile() ? 'touchmove' : 'mousemove', moveHandler);
        document.addEventListener(isMobile() ? 'touchend' : 'mouseup', upHandler);
    });

    return piece;
}

function isOverlap(piece, xPos, yPos, width, height) {
    const rect1 = { left: xPos, top: yPos, right: xPos + width, bottom: yPos + height };
    const rect2 = piece.getBoundingClientRect();
    return !(rect1.right < rect2.left ||
             rect1.left > rect2.right ||
             rect1.bottom < rect2.top ||
             rect1.top > rect2.bottom);
}

function isMobile() {
    return window.innerWidth < 600; // Adjust the threshold for mobile devices
}

present.addEventListener('click', () => {
    present.style.display = 'none';
    generatePuzzlePieces();
});
