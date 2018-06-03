window.onload = function () {

    game.init({
        dotColor: 'black',
        fieldColor: 'red',
        botSnakeColor: 'blue'

    }).start()

}

const game = {

    conf: {
        startingDotCount: 50,
        cols: 100,
        rows: 70,
        speed: 0.1,
        minLimit: 2,
        maxLimit: 3,
        resolution: 10,
        dotColor: '#89aa9e',
        fieldColor: '#193549',
        snakeSpeed: 0.1,
        snakeColor: '#a5ff90',
        botSnakeColor: 'black',
        botSnakeCount: 1,
        botReaction: 0.01,
        bot: {
            dirChangeRand: 0.1,
            dangerLevel: 10
        }

    },

    snake: {
        x: 0,
        y: 0,
        direction: '',
        tail: [],
        path: [],


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

        this.snake = this.createSnake()
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

    closestDanger: function (direction, x, y) {

        start_x = x
        start_y = y
        var coordsToCheck = []
        if (direction == 'up') {

            do {
                y = this.fixYCoord(y - 1)
                coordsToCheck.push({
                    x: x,
                    y: y
                })
            } while (y != start_y)

        } else if (direction == 'down') {

            do {
                y = this.fixYCoord(y + 1)
                coordsToCheck.push({
                    x: x,
                    y: y
                })
            } while (y != start_y)

        } else if (direction == 'right') {

            do {
                x = this.fixXCoord(x + 1)
                coordsToCheck.push({
                    x: x,
                    y: y
                })
            } while (x != start_x)

        } else if (direction == 'left') {

            do {
                x = this.fixXCoord(x - 1)
                coordsToCheck.push({
                    x: x,
                    y: y
                })
            } while (x != start_x)

        }


        for (var i in coordsToCheck) {

            coords = coordsToCheck[i]
            if (!this.isSnakeFree(coords.x, coords.y)) {
                return parseInt(i) + 1
            }

        }

        return 0

    },

    isDangerAhead: function (direction, x, y) {

        // console.log('---------')
        // console.log(direction)
        // console.log(x, y)
        start_x = x
        start_y = y

        var coordsToCheck = []
        for (var i = 0; i < this.conf.bot.dangerLevel; i++) {

            if (direction == 'up') {
                y -= 1
            } else if (direction == 'right') {
                x += 1
            } else if (direction == 'down') {
                y += 1
            } else if (direction == 'left') {
                x -= 1
            }

            coordsToCheck.push({
                x: this.fixXCoord(x),
                y: this.fixYCoord(y)
            })

        }

        // console.log(coordsToCheck);

        for (var i in coordsToCheck) {
            var coord = coordsToCheck[i]

            if (!this.isSnakeFree(coord.x, coord.y)) {

                return parseInt(i) + 1

            }

        }

        return 0

    },

    processBots: function () {

        this.snakes.forEach(snake => {

            if (snake.bot && !snake.directionChanged) {

                if (snake.direction) {

                    x = this.isDangerAhead(snake.direction, snake.x, snake.y)

                    if (x > 0) {

                        // console.log('Starting direction: ' + snake.direction)
                        // console.log('Path: ', snake.path)

                        if (snake.direction == 'up' || snake.direction == 'down') {

                            var danger1 = this.isDangerAhead('right', snake.x, snake.y)
                            var danger2 = this.isDangerAhead('left', snake.x, snake.y)

                            // console.log(danger1)
                            // console.log(danger2)

                            if (danger1 == 0) {
                                snake.direction = 'right'
                                snake.directionChanged = true
                            } else if (danger2 == 0) {
                                snake.direction = 'left'
                                snake.directionChanged = true
                            } else if (danger1 < danger2) {
                                snake.direction = 'left'
                                snake.directionChanged = true
                            } else if (danger1 > danger2) {
                                snake.direction = 'right'
                                snake.directionChanged = true
                            } else {
                                snake.direction = Math.random > 0.5 ? 'right' : 'left'
                                snake.directionChanged = true
                            }

                        } else { // right or left

                            var danger1 = this.isDangerAhead('up', snake.x, snake.y)
                            var danger2 = this.isDangerAhead('down', snake.x, snake.y)

                            if (danger1 == 0) {
                                snake.direction = 'up'
                                snake.directionChanged = true
                            } else if (danger2 == 0) {
                                snake.direction = 'down'
                                snake.directionChanged = true
                            } else if (danger1 < danger2) {
                                snake.direction = 'down'
                                snake.directionChanged = true
                            } else if (danger1 > danger2) {
                                snake.direction = 'up'
                                snake.directionChanged = true
                            } else {
                                snake.direction = Math.random > 0.5 ? 'down' : 'up'
                                snake.directionChanged = true
                            }

                        }

                        // console.log('End direction: ' + snake.direction)

                    } else { // no danger

                        rand = Math.random()
                        if (this.conf.bot.dirChangeRand > rand) {

                            if (snake.direction == 'up' || snake.direction == 'down') {

                                dang1 = this.closestDanger('right', snake.x, snake.y)
                                dang2 = this.closestDanger('left', snake.x, snake.y)

                                if (dang1 == 0 && dang2 == 0) {
                                    snake.direction = Math.random() > 0.5 ? 'right' : 'left'
                                } else if (dang1 > dang2) {
                                    snake.direction = 'right'
                                } else if (dang1 < dang2) {
                                    snake.direction = 'left'
                                } else {
                                    snake.direction = Math.random() > 0.5 ? 'left' : 'right'
                                }

                            } else {

                                dang1 = this.closestDanger('up', snake.x, snake.y)
                                dang2 = this.closestDanger('down', snake.x, snake.y)

                                if (dang1 == 0 && dang2 == 0) {
                                    snake.direction = Math.random() > 0.5 ? 'up' : 'down'
                                } else if (dang1 > dang2) {
                                    snake.direction = 'up'
                                } else if (dang1 < dang2) {
                                    snake.direction = 'down'
                                } else {
                                    snake.direction = Math.random() > 0.5 ? 'up' : 'down'
                                }

                            }

                            snake.directionChanged = true

                        } else {
                            // console.log('no change')
                        }

                    }

                } else {

                    dir = this.rand(1, 4)
                    switch (dir) {
                        case 1:
                            snake.direction = 'right'
                            snake.directionChanged = true
                            break;
                        case 2:
                            snake.direction = 'down'
                            snake.directionChanged = true
                            break;
                        case 3:
                            snake.direction = 'left'
                            snake.directionChanged = true
                            break;

                        case 4:
                            snake.direction = 'up'
                            snake.directionChanged = true
                            break;
                        default:
                            break;
                    }
                }


            }

        });

    },

    changeDirectionIfFree(snake, direction) {

        x = snake.x
        y = snake.y

        switch (direction) {
            case 'up':
                y = y + 1
                break;
            case 'right':
                x = x + 1
                break;
            case 'down':
                y = y - 1
                break;
            case 'left':
                x = x - 1
                break;
        }

        if (this.isSnakeFree(x, y)) {
            snake.direction = direction
            snake.directionChanged = true
            return true
        } else {
            return false
        }

    },

    fixXCoord: function (x) {

        var x = x > this.conf.cols - 1 ? 0 : x
        x = x < 0 ? this.conf.cols - 1 : x

        return x

    },

    fixYCoord: function (y) {

        var y = y < 0 ? this.conf.rows - 1 : y
        y = y > this.conf.rows - 1 ? 0 : y

        return y

    },

    rand: function (from, to) {

        ret = Math.round(from + Math.random() * to)

        return parseInt(ret)

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
                        self.snake.directionChanged = true
                    }
                    break;
                    e.preventDefault()
                case
                arrow.down:
                    if (self.snake.direction != 'up') {
                        self.snake.direction = 'down'
                        self.snake.directionChanged = true
                    }
                    break;
                    e.preventDefault()
                case
                arrow.left:
                    if (self.snake.direction != 'right') {
                        self.snake.direction = 'left'
                        self.snake.directionChanged = true
                    }
                    e.preventDefault()
                    break;
                case
                arrow.right:
                    if (self.snake.direction != 'left') {
                        self.snake.direction = 'right'
                        self.snake.directionChanged = true
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

    isSnakeFree: function (x, y) {

        var key = x.toString() + '|' + y.toString()


        // console.log('-----')
        // console.log(key)
        // console.log(this.tails)
        // console.log('-----')

        return typeof this.tails[key] == 'undefined' || this.tails[key] == 0

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
                snake.y = snake.y > this.conf.rows - 1 ? 0 : snake.y

            }

            var collided = false
            // check if we collide with ourself
            if (!this.isSnakeFree(snake.x, snake.y)) {
                this.deleteSnake(snake)
                collided = true
            } else {

                snake.tail[snake.tail.length] = {
                    x: snake.x,
                    y: snake.y
                }

                snake.path.push({
                    x: snake.x,
                    y: snake.y
                })

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

        snake.directionChanged = false


    },

    // turn into dots
    deleteSnake: function (snake) {

        for (var i in snake.tail) {

            var item = snake.tail[i]
            delete this.tails[item.x + '|' + item.y]
            this.field[item.x][item.y] = 1

        }

        snake.tail = []

    },

    createSnake: function () {
        return {
            x: Math.round(Math.random() * this.conf.cols),
            y: Math.round(Math.random() * this.conf.rows),
            direction: '',
            directionChanged: false,
            tail: [],
            path: []
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