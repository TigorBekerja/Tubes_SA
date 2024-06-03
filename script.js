const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const solveButtonDijkstra = document.getElementById('solveButtonDijkstra');
const solveButtonBruteForce = document.getElementById('solveButtonBruteForce');
const solveButtonGreedy = document.getElementById('solveButtonGreedy');
const stepsElement = document.getElementById('steps');
const easyButton = document.getElementById('easyButton');
const mediumButton = document.getElementById('mediumButton');
const hardButton = document.getElementById('hardButton');

let rows = 25;
let cols = 25;
let tileSize = canvas.width / cols;

let stepsTaken = 0;

const easyMaze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
    [0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1], 
    [1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1], 
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1], 
    [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1], 
    [1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1], 
    [1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1], 
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1], 
    [1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1], 
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1], 
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1], 
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1]
];

const mediumMaze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1], 
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1], 
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0], 
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1], 
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1], 
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1], 
    [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1], 
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1], 
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1], 
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1], 
    [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1], 
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1], 
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1], 
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
    [0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1], 
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1], 
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1], 
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1], 
    [1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1], 
    [1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1], 
    [1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1], 
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1]
];

const hardMaze = [
    // Labirin 45x45 yang Anda buat
];

const player = {
    x: 13,
    y: 14,
    width: 32, // Lebar gambar pemain
    height: 32, // Tinggi gambar pemain
    image: new Image(), // Element gambar pemain
    loaded: false // Apakah gambar sudah dimuat atau belum
};

player.image.src = 'D:\\Downloads\\nail.png'; // Ganti 'path_to_your_image.png' dengan lokasi file gambar Anda
player.image.onload = function() {
    player.loaded = true;
    alert('udah ke load!')
    draw();
};

const finishes = {
    easy:
    [
        { x: 0, y: 3, color: 'green' },
        { x: 10, y: 14, color: 'green' },
    ],
    medium: 
    [
        { x: 9, y: 0, color: 'green' },
        { x: 0, y: 16, color: 'green' },
        { x: 24, y: 4, color: 'green' },
        { x: 18, y: 24, color: 'green' }
    ],
    hard: { x: 43, y: 43, color: 'green' }  // Finish point for hardMaze
};

let maze = mediumMaze;
let currentFinish = finishes.medium;

function updateMaze(difficulty) {
    if (difficulty === 'easy') {
        maze = easyMaze;
        rows = 15;
        cols = 15;
        player.x = 8
        player.y = 8
        currentFinish = finishes.easy;
    } else if (difficulty === 'medium') {
        maze = mediumMaze;
        rows = 25;
        cols = 25;
        player.x = 13
        player.y = 14
        currentFinish = finishes.medium;
    } else if (difficulty === 'hard') {
        maze = hardMaze;
        rows = 45;
        cols = 45;
        currentFinish = finishes.hard;
    }
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
                ctx.fillStyle = 'black';
            } else {
                ctx.fillStyle = 'white';
            }
            ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
        }
    }
}

function drawPlayer() {
    if (player.loaded) {
        ctx.drawImage(player.image, player.x * tileSize, player.y * tileSize, player.width, player.height);
    } else {
        // Jika gambar belum dimuat, Anda bisa menampilkan pemain sebagai persegi biru sementara
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x * tileSize, player.y * tileSize, tileSize, tileSize);
    }
}

function drawFinishes() {
    if (Array.isArray(currentFinish)) {
        currentFinish.forEach(finish => {
            ctx.fillStyle = finish.color;
            ctx.fillRect(finish.x * tileSize, finish.y * tileSize, tileSize, tileSize);
        });
    } else {
        ctx.fillStyle = currentFinish.color;
        ctx.fillRect(currentFinish.x * tileSize, currentFinish.y * tileSize, tileSize, tileSize);
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
        if (Array.isArray(currentFinish)) {
            if (currentFinish.some(finish => player.x === finish.x && player.y === finish.y)) {
                alert('Congratulations! You reached a finish!');
                stepsTaken = 0;
                if (rows == 15) {
                    player.x = 8
                    player.y = 8
                } else if (rows = 25) {
                    player.x = 13
                    player.y = 14
                }
            }
        } else if (player.x === currentFinish.x && player.y === currentFinish.y) {
            alert('Congratulations! You reached the finish!');
            stepsTaken = 0;
            if (rows == 15) {
                player.x = 8
                player.y = 8
            } else if (rows == 25) {
                player.x = 13
                player.y = 14
            }
        }
    }
    draw();
}

function moveAlongPath(path) {
    let index = 0;
    const interval = setInterval(() => {
        if (index < path.length) {
            player.x = path[index][0];
            player.y = path[index][1];
            stepsTaken++;
            updateSteps();
            draw();
            index++;
        } else {
            clearInterval(interval);
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
    path.reverse();

    return path;
}


function bruteForce() {
    const directions = [
        [1, 0], [-1, 0], [0, 1], [0, -1]
    ];

    function dfs(x, y, visited, path) {
        if (currentFinish.some(finish => finish.x === x && finish.y === y)) {
            return path;
        }

        visited[y][x] = true;

        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;

            if (nx >= 0 && ny >= 0 && nx < cols && ny < rows && !visited[ny][nx] && maze[ny][nx] === 0) {
                const newPath = dfs(nx, ny, visited, [...path, [nx, ny]]);
                if (newPath) return newPath;
            }
        }

        visited[y][x] = false;
        return null;
    }

    const visited = Array(rows).fill(null).map(() => Array(cols).fill(false));
    const path = dfs(player.x, player.y, visited, [[player.x, player.y]]);
    return path || [];
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
    path.reverse();

    return path;
}

solveButtonDijkstra.addEventListener('click', () => {
    stepsTaken = 0;
    const path = dijkstra();
    moveAlongPath(path);
});

solveButtonBruteForce.addEventListener('click', () => {
    stepsTaken = 0;
    const path = bruteForce();
    moveAlongPath(path);
});

solveButtonGreedy.addEventListener('click', () => {
    stepsTaken = 0;
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