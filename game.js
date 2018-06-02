window.onload = function () {

    game.init({
        // dotColor: 'black',
        // fieldColor: 'red'

    }).start()

}

const game = {

    conf: {
        startingDotCount: 50,
        cols: 100,
        rows: 75,
        speed: 0.05,
        minLimit: 2,
        maxLimit: 3,
        resolution: 10,
        dotColor: '#89aa9e',
        fieldColor: '#193549',
        snakeSpeed: 0.05,
        snakeColor: '#a5ff90',
        botSnakeColor: 'black',
        botSnakeCount: 2,
        botReaction: 0.1

    },

    snake: {
        x: 0,
        y: 0,
        direction: '',
        tail: []
    },

    snakes: [],
    tails: [],
    field: [],
    canvas: null,
    ctx: null,
    snakeCtx: null,
    dotCount: 0,
    interval: null,

    init: function (conf) {

        this.conf = Object.assign(this.conf, conf)

        this.canvas = document.getElementById("field");
        this.ctx = this.canvas.getContext("2d");

        this.canvas.style.backgroundColor = this.conf.fieldColor

        this.canvas.setAttribute('width', this.conf.cols * this.conf.resolution)
        this.canvas.setAttribute('height', this.conf.rows * this.conf.resolution)

        var dots = []

        // fill field
        for (var x = 0; x < this.conf.cols; x++) {
            if (typeof this.field[x] == 'undefined') this.field[x] = []
            for (var y = 0; y < this.conf.rows; y++) {
                if (typeof this.field[x][y] == 'undefined') this.field[x][y] = Math.round(Math.random())
            }
        }



        this.drawField(this.field)

        this.wireEvents()

        // create bot snakes
        for (var i = 0; i < this.conf.botSnakeCount; i++) {
            snake = this.createSnake()
            snake.bot = 1
            this.snakes.push(snake)
        }

        this.snakes.push(this.snake)

        return this

    },

    start: function (conf) {

        const self = this

        this.interval = setInterval(function () {
            self.runFrame()
        }, self.conf.speed * 1000)

        this.snakeInterval = setInterval(function () {
            self.moveSnakes()
        }, self.conf.snakeSpeed * 1000)

        this.snakeInterval = setInterval(function () {
            self.processBots()
        }, self.conf.botReaction * 1000)

    },

    processBots: function () {

        this.snakes.forEach(snake => {

            if (snake.bot) {

                if (snake.direction) {

                    if (snake.direction == 'right') {

                        var x = this.fixXCoord(snake.x + 1);
                        if (!this.isSnakeFree(x, snake.y)) {

                            var y = this.fixYCoord(snake.y + 1)
                            if (this.isSnakeFree(x, y)) { // up
                                snake.direction = 'up'
                            } else { // down
                                snake.direction = 'down'
                            }

                        } else {
                            if (this.rand(1, 10) > 7) {

                                if (this.rand(0, 1)) {
                                    snake.direction = 'up'
                                } else {
                                    snake.direction = 'down'
                                }

                            }
                        }

                    } else if (snake.direction == 'left') {

                        var x = this.fixXCoord(snake.x - 1);
                        if (!this.isSnakeFree(x, snake.y)) {

                            var y = this.fixYCoord(snake.y + 1)
                            if (this.isSnakeFree(x, y)) { // up
                                snake.direction = 'up'
                            } else { // down
                                snake.direction = 'down'
                            }

                        } else {
                            if (this.rand(1, 10) > 7) {

                                if (this.rand(0, 1)) {
                                    snake.direction = 'up'
                                } else {
                                    snake.direction = 'down'
                                }

                            }
                        }

                    } else if (snake.direction == 'down') {

                        var y = this.fixYCoord(snake.y - 1)
                        if (!this.isSnakeFree(snake.x, y)) {

                            var x = this.fixXCoord(snake.x + 1)
                            if (this.isSnakeFree(x, y)) {
                                snake.direction = 'right'
                            } else {
                                snake.direction = 'left'
                            }

                        } else {
                            if (this.rand(1, 10) > 7) {

                                if (this.rand(0, 1)) {
                                    snake.direction = 'right'
                                } else {
                                    snake.direction = 'left'
                                }

                            }
                        }

                    } else if (snake.direction == 'up') {

                        var y = this.fixYCoord(snake.y + 1)
                        if (!this.isSnakeFree(snake.x, y)) {

                            var x = this.fixXCoord(snake.x + 1)
                            if (this.isSnakeFree(x, y)) {
                                snake.direction = 'right'
                            } else {
                                snake.direction = 'left'
                            }

                        } else {
                            if (this.rand(1, 10) > 7) {

                                if (this.rand(0, 1)) {
                                    snake.direction = 'right'
                                } else {
                                    snake.direction = 'left'
                                }

                            }
                        }

                    }


                } else {

                    dir = this.rand(1, 4)
                    switch (dir) {
                        case 1:
                            snake.direction = 'right'
                            break;
                        case 2:
                            snake.direction = 'down'
                            break;
                        case 3:
                            snake.direction = 'left'
                            break;

                        case 4:
                            snake.direction = 'up'
                            break;
                        default:
                            break;
                    }
                }


            }

        });

    },

    fixXCoord: function (x) {

        var x = x > this.conf.cols - 1 ? 0 : x
        x = x < 0 ? this.conf.cols - 1 : x

        return x

    },

    fixYCoord: function (y) {

        var y = y < 0 ? this.conf.rows - 1 : y
        y = y > this.conf.rows ? 0 : y

        return y

    },

    rand: function (from, to) {
        return Math.round(from + Math.random() * to)
    },

    wireEvents: function () {

        const self = this

        document.onkeydown = function (e) {

            var keyCode = e.keyCode || e.which,
                arrow = {
                    left: 37,
                    up: 38,
                    right: 39,
                    down: 40
                }

            switch (keyCode) {
                case
                arrow.up:
                    if (self.snake.direction != 'down') {
                        self.snake.direction = 'up'
                    }
                    break;
                    e.preventDefault()
                case
                arrow.down:
                    if (self.snake.direction != 'up') {
                        self.snake.direction = 'down'
                    }
                    break;
                    e.preventDefault()
                case
                arrow.left:
                    if (self.snake.direction != 'right') {
                        self.snake.direction = 'left'
                    }
                    e.preventDefault()
                    break;
                case
                arrow.right:
                    if (self.snake.direction != 'left') {
                        self.snake.direction = 'right'
                    }
                    e.preventDefault()
                    break;
            }
        };

    },

    pause: function () {
        clearInterval(this.interval)
    },

    resume: function () {

        const self = this
        this.interval = setInterval(function () {
            self.runFrame()
        }, this.conf.speed * 1000)

    },

    changeSpeed: function (speed) {
        this.conf.speed = speed
        this.pause()
        this.resume()
    },

    reset: function () {

        this.pause()
        this.start()

    },

    countNeighbours(grid, x, y) {

        var sum = 0

        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {

                var col = (x + i + this.conf.cols) % this.conf.cols
                var row = (y + j + this.conf.rows) % this.conf.rows

                sum += grid[col][row]

                // if (typeof grid[x + i] != 'undefined' && typeof grid[x + i][y + j] != 'undefined') {
                //     sum += grid[x + i][y + j]
                // }

            }
        }

        return sum - grid[x][y]
    },

    isSnakeFree: function name(x, y) {

        return this.tails[x + '|' + y]

    },

    runFrame: function () {

        var startDotCount = this.dotCount

        var field = []

        for (var x = 0; x < this.conf.cols; x++) {
            for (var y = 0; y < this.conf.rows; y++) {

                var count = this.countNeighbours(this.field, x, y)

                if (typeof field[x] == 'undefined') field[x] = []

                if (!this.field[x][y] && count == this.conf.maxLimit) {
                    field[x][y] = 1
                } else if (this.field[x][y] && (count < this.conf.minLimit || count > this.conf.maxLimit)) {
                    field[x][y] = 0
                } else {
                    field[x][y] = this.field[x][y]
                }
            }
        }

        this.field = field;
        this.drawField(this.field)

        // draw snakes
        this.drawSnakes()

        var endDotCount = this.dotCount

        // console.log('Dot count: ' + this.dotCount + " Diff: " + (endDotCount - startDotCount).toFixed())

    },

    drawSnakes: function () {

        this.snakes.forEach(snake => {
            this.drawSnake(snake)
        });

    },

    drawSnake: function (snake) {

        for (var i in snake.tail) {
            var item = snake.tail[i]
            this.drawSnakeDot(snake, item.x, item.y)
        }

    },

    moveSnakes: function () {

        this.snakes.forEach(element => {

            this.moveSnake(element)

        });

    },

    moveSnake: function (snake) {

        // move snake
        if (snake.direction) {

            if (snake.direction == 'right') {

                snake.x += 1;
                snake.x = snake.x > this.conf.cols - 1 ? 0 : snake.x

            } else if (snake.direction == 'left') {

                snake.x -= 1;
                snake.x = snake.x < 0 ? this.conf.cols - 1 : snake.x

            } else if (snake.direction == 'up') {
                snake.y -= 1;
                snake.y = snake.y < 0 ? this.conf.rows - 1 : snake.y


            } else if (snake.direction == 'down') {

                snake.y += 1;
                snake.y = snake.y > this.conf.rows ? 0 : snake.y

            }

            var collided = false
            // check if we collide with ourself
            for (var i in snake.tail) {
                var item = snake.tail[i]

                if (item.x == snake.x && item.y == snake.y) {

                    this.deleteSnake(snake)
                    collided = true
                    break
                }

            }

            if (!collided) {

                snake.tail[snake.tail.length] = {
                    x: snake.x,
                    y: snake.y
                }

                this.tails[snake.x + '|' + snake.y] = 1

                if (this.field[snake.x][snake.y]) { // i ate smthing

                } else { // i moved
                    item = snake.tail.shift()
                    delete this.tails[item.x + '|' + item.y]
                }

            }

        }

        // draw snake

        // draw head

        this.field[snake.x][snake.y] = 1;
        this.drawSnakeDot(snake, snake.x, snake.y)

        // draw tail
        for (var i in snake.tail) {

            var item = snake.tail[i]
            this.drawSnakeDot(snake, item.x, item.y)

        }


    },

    // turn into dots
    deleteSnake: function (snake) {

        for (var i in snake.tail) {

            var item = snake.tail[i]
            this.field[item.x][item.y] = 1

        }

        snake.tail = []

    },

    createSnake: function () {
        return {
            x: Math.round(Math.random() * this.conf.cols),
            y: Math.round(Math.random() * this.conf.rows),
            direction: '',
            tail: [],

        }
    },

    drawField: function (field) {

        var dotCount = 0;
        this.ctx.fillStyle = this.conf.dotColor

        for (var x in field) {
            for (var y in field[x]) {

                if (field[x][y]) {
                    this.ctx.fillRect(x * this.conf.resolution, y * this.conf.resolution, 1 * this.conf.resolution, 1 * this.conf.resolution); // fill in the pixel at (x, y)
                    dotCount++;
                } else {
                    this.ctx.clearRect(x * this.conf.resolution, y * this.conf.resolution, 1 * this.conf.resolution, 1 * this.conf.resolution); // unfill in the pixel at (x, y)
                }

            }
        }

        this.dotCount = dotCount

    },

    removeTailItem: function (x, y) {

        for (var i in this.snake.tail) {

            var item = this.snake.tail[i]



        }



    },

    drawSnakeDot: function (snake, x, y) {

        color = snake.bot ? this.conf.botSnakeColor : this.conf.snakeColor
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x * this.conf.resolution, y * this.conf.resolution, 1 * this.conf.resolution, 1 * this.conf.resolution)

    },

    filldot: function (field, x, y) {

        field[x][y] = 1
        // this.ctx.fillRect(x, y, 1, 1); // fill in the pixel at (x, y)

    },

    unFillDot: function (field, x, y) {

        field[x][y] = 0
        // this.ctx.clearRect(x, y, 1, 1); // unfill in the pixel at (x, y)

    }

}