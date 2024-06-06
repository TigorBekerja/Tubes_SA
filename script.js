const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const solveButtonDijkstra = document.getElementById('solveButtonDijkstra');
const solveButtonBruteForce = document.getElementById('solveButtonBruteForce');
const solveButtonGreedy = document.getElementById('solveButtonGreedy');
const stepsElement = document.getElementById('steps');
const easyButton = document.getElementById('easyButton');
const mediumButton = document.getElementById('mediumButton');
const hardButton = document.getElementById('hardButton');

let rows = 20;
let cols = 20;
let tileSize = canvas.width / cols;

let stepsTaken = 0;

const wall = new Image();
wall.src = 'assets/wall.png'
const path = new Image();
path.src = 'assets/road.png'
const finishImage = new Image();
finishImage.src = 'assets/finish.jpg';

const easyMaze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 1, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 0, 1, 1, 1, 1, 1]
];

const mediumMaze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1], 
    [1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1], 
    [0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1],
    [0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1],
    [1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const hardMaze = [
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1],
    [1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1],
    [1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0],
    [1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1],
    [1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1],
    [0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1],
    [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1],
    [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1]
];

const player = {
    x: 10,
    y: 9,
    width: tileSize,
    height: tileSize,
    image: new Image(),
    loaded: false
};

player.image.src = 'assets/nail.png';
player.image.onload = function() {
    player.loaded = true;
    draw();
};

const finishes = {
    easy: [
        { x: 0, y: 1},
        { x: 4, y: 9}
    ],
    medium: [
        { x: 0, y: 2},
        { x: 0, y: 14},
        { x: 18, y: 0},
        { x: 10, y: 19}
    ],
    hard: [
        { x: 1, y: 0},
        { x: 29, y: 6},
        { x: 0, y: 16},
        { x: 29, y: 18},
        { x: 7, y: 29},
        { x: 24, y: 29}
    ]
};

let maze = mediumMaze;
let currentFinish = finishes.medium;

function updateMaze(difficulty) {
    if (difficulty === 'easy') {
        maze = easyMaze;
        rows = 10;
        cols = 10;
        player.x = 4;
        player.y = 4;
        player.image.src = 'assets/bocilkafahmi.png'
        currentFinish = finishes.easy;
    } else if (difficulty === 'medium') {
        maze = mediumMaze;
        rows = 20;
        cols = 20;
        player.x = 10;
        player.y = 9;
        player.image.src = 'assets/nail.png';
        currentFinish = finishes.medium;
    } else if (difficulty === 'hard') {
        maze = hardMaze;
        rows = 30;
        cols = 30;
        player.x = 15;
        player.y = 14;
        player.image.src = 'assets/tigormuda.png'
        currentFinish = finishes.hard;
    }
    player.width = canvas.width / cols
    player.height = canvas.width / cols
    tileSize = canvas.width / cols;
    stepsTaken = 0;
    updateSteps();
    draw();
}

easyButton.addEventListener('click', () => updateMaze('easy'));
mediumButton.addEventListener('click', () => updateMaze('medium'));
hardButton.addEventListener('click', () => updateMaze('hard'));

function drawMaze() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (maze[row][col] === 1) {
                ctx.drawImage(wall, col * tileSize, row * tileSize, tileSize, tileSize);
            } else {
                ctx.drawImage(path, col * tileSize, row * tileSize, tileSize, tileSize);
            }
        }
    }
}

function drawPlayer() {
    if (player.loaded) {
        ctx.drawImage(player.image, player.x * tileSize, player.y * tileSize, player.width, player.height);
    } else {
        ctx.fillStyle = 'blue';
        ctx.fillRect(player.x * tileSize, player.y * tileSize, tileSize, tileSize);
    }
}

function drawFinishes() {
    if (Array.isArray(currentFinish)) {
        currentFinish.forEach(finish => {
            ctx.drawImage(finishImage, finish.x * tileSize, finish.y * tileSize, tileSize, tileSize);
        });
    } else {
        ctx.drawImage(finishImage, finish.x * tileSize, finish.y * tileSize, tileSize, tileSize);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    drawFinishes();
    drawPlayer();
}

function updateSteps() {
    stepsElement.textContent = stepsTaken;
}

function movePlayer(dx, dy) {
    const newX = player.x + dx;
    const newY = player.y + dy;
    if (maze[newY][newX] === 0) {
        player.x = newX;
        player.y = newY;
        stepsTaken++;
        updateSteps();
        draw();
        if (Array.isArray(currentFinish)) {
            if (currentFinish.some(finish => player.x === finish.x && player.y === finish.y)) {
                updateSteps();
                draw();  // Draw player at the finish before alert
                setTimeout(() => {
                    alert('Congratulations! You reached a finish!');
                    stepsTaken = 0;
                    if (rows === 10) {
                        updateMaze('easy');
                    } else if (rows === 20) {
                        updateMaze('medium');
                    } else if (rows === 30) {
                        updateMaze('hard');
                    }
                }, 100);  // Slight delay to ensure the player is drawn
            }
        }
    }
}

function moveAlongPath(path) {
    let index = 0;
    const interval = setInterval(() => {
        if (index < path.length) {
            player.x = path[index][0];
            player.y = path[index][1];
            if (index > 0) {
                stepsTaken++;
            }
            updateSteps();
            draw();
            index++;
        } else {
            clearInterval(interval);
            if (currentFinish.some(finish => player.x === finish.x && player.y === finish.y)) {
                updateSteps();
                draw(); 
                setTimeout(() => {
                    alert('Congratulations! You reached a finish!');
                    stepsTaken = 0;
                    if (rows === 10) {
                        updateMaze('easy');
                    } else if (rows === 20) {
                        updateMaze('medium');
                    } else if (rows === 30) {
                        updateMaze('hard');
                    }
                }, 100);  // Slight delay to ensure the player is drawn
            }
        }
    }, 100);
}

function dijkstra() {
    const distances = Array(rows).fill(null).map(() => Array(cols).fill(Infinity));
    const visited = Array(rows).fill(null).map(() => Array(cols).fill(false));
    const previous = Array(rows).fill(null).map(() => Array(cols).fill(null));

    distances[player.y][player.x] = 0;
    const pq = [[player.x, player.y]];

    const directions = [
        [1, 0], [-1, 0], [0, 1], [0, -1]
    ];

    while (pq.length > 0) {
        pq.sort((a, b) => distances[a[1]][a[0]] - distances[b[1]][b[0]]);
        const [currentX, currentY] = pq.shift();
        visited[currentY][currentX] = true;

        for (const [dx, dy] of directions) {
            const nx = currentX + dx;
            const ny = currentY + dy;

            if (nx >= 0 && ny >= 0 && nx < cols && ny < rows && !visited[ny][nx] && maze[ny][nx] === 0) {
                const alt = distances[currentY][currentX] + 1;
                if (alt < distances[ny][nx]) {
                    distances[ny][nx] = alt;
                    previous[ny][nx] = [currentX, currentY];
                    pq.push([nx, ny]);
                }
            }
        }
    }

    let finish = currentFinish.find(finish => previous[finish.y][finish.x] !== null);
    if (!finish) return [];

    const path = [];
    let [cx, cy] = [finish.x, finish.y];
    while (previous[cy][cx] !== null) {
        path.push([cx, cy]);
        [cx, cy] = previous[cy][cx];
    }
    path.push([player.x, player.y]);
    path.reverse();

    return path;
}

function bruteForce() {
    const directions = [
        [1, 0], [-1, 0], [0, 1], [0, -1]
    ];

    function dfs(x, y, visited, path) {
        if (currentFinish.some(finish => finish.x === x && finish.y === y)) {
            allPaths.push([...path, [x, y]]);
            return;
        }

        visited[y][x] = true;

        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;

            if (nx >= 0 && ny >= 0 && nx < cols && ny < rows && !visited[ny][nx] && maze[ny][nx] === 0) {
                dfs(nx, ny, visited, [...path, [x, y]]);
            }
        }

        visited[y][x] = false;
    }

    const allPaths = [];
    const visited = Array(rows).fill(null).map(() => Array(cols).fill(false));
    dfs(player.x, player.y, visited, []);

    if (allPaths.length === 0) return [];

    // Find the shortest path
    let bestPath = allPaths[0];
    for (const path of allPaths) {
        if (path.length < bestPath.length) {
            bestPath = path;
        }
    }

    return bestPath;
}

function greedy() {
    const directions = [
        [1, 0], [-1, 0], [0, 1], [0, -1]
    ];

    function heuristic(x, y) {
        return Math.min(...currentFinish.map(finish => Math.abs(x - finish.x) + Math.abs(y - finish.y)));
    }

    const pq = [[player.x, player.y]];
    const visited = Array(rows).fill(null).map(() => Array(cols).fill(false));
    const previous = Array(rows).fill(null).map(() => Array(cols).fill(null));

    while (pq.length > 0) {
        pq.sort((a, b) => heuristic(a[0], a[1]) - heuristic(b[0], b[1]));
        const [currentX, currentY] = pq.shift();
        visited[currentY][currentX] = true;

        if (currentFinish.some(finish => finish.x === currentX && finish.y === currentY)) break;

        for (const [dx, dy] of directions) {
            const nx = currentX + dx;
            const ny = currentY + dy;

            if (nx >= 0 && ny >= 0 && nx < cols && ny < rows && !visited[ny][nx] && maze[ny][nx] === 0) {
                previous[ny][nx] = [currentX, currentY];
                pq.push([nx, ny]);
            }
        }
    }

    let finish = currentFinish.find(finish => previous[finish.y][finish.x] !== null);
    if (!finish) return [];

    const path = [];
    let [cx, cy] = [finish.x, finish.y];
    while (previous[cy][cx] !== null) {
        path.push([cx, cy]);
        [cx, cy] = previous[cy][cx];
    }
    path.push([player.x, player.y]); // Include the initial position
    path.reverse();

    return path;
}

solveButtonDijkstra.addEventListener('click', () => {
    const path = dijkstra();
    moveAlongPath(path);
});

solveButtonBruteForce.addEventListener('click', () => {
    const path = bruteForce();
    moveAlongPath(path);
});

solveButtonGreedy.addEventListener('click', () => {
    const path = greedy();
    moveAlongPath(path);
});

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            movePlayer(0, -1);
            break;
        case 'ArrowDown':
            movePlayer(0, 1);
            break;
        case 'ArrowLeft':
            movePlayer(-1, 0);
            break;
        case 'ArrowRight':
            movePlayer(1, 0);
            break;
    }
});

draw();
