window.onload = function () {

    game.init({}).start()

}

const game = {

    conf: {
        startingDotCount: 50,
        cols: 100,
        rows: 75,
        speed: 0.1,
        minLimit: 2,
        maxLimit: 3,
        resolution: 10,
        dotColor: 'black',

        snakeSpeed: 0.05,
        snakeColor: 'yellow',

    },

    snake: {
        x: 0,
        y: 0,
        direction: '',
        tail: []
    },
    field: [],
    canvas: null,
    ctx: null,
    snakeCtx: null,
    dotCount: 0,
    interval: null,

    init: function (conf) {

        this.conf = Object.assign(this.conf, conf)

        this.wireEvents()

        return this

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
                case
                arrow.down:
                    if (self.snake.direction != 'up') {
                        self.snake.direction = 'down'
                    }
                    break;
                case
                arrow.left:
                    if (self.snake.direction != 'right') {
                        self.snake.direction = 'left'
                    }
                    break;
                case
                arrow.right:
                    if (self.snake.direction != 'left') {
                        self.snake.direction = 'right'
                    }
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

    start: function (conf) {

        this.canvas = document.getElementById("field");
        this.ctx = this.canvas.getContext("2d");

        this.canvas.setAttribute('width', this.conf.cols * this.conf.resolution)
        this.canvas.setAttribute('height', this.conf.rows * this.conf.resolution)

        const self = this

        var dots = []

        // fill field
        for (var x = 0; x < this.conf.cols; x++) {
            if (typeof this.field[x] == 'undefined') this.field[x] = []
            for (var y = 0; y < this.conf.rows; y++) {
                if (typeof this.field[x][y] == 'undefined') this.field[x][y] = Math.round(Math.random())
            }
        }

        // for (var i = 1; i <= this.conf.startingDotCount; i++) {

        //     var x = Math.floor(Math.random() * Math.floor(this.conf.cols) + 1)
        //     var y = Math.floor(Math.random() * Math.floor(this.conf.rows) + 1)

        //     x = x > 0 ? x : 1;
        //     y = y > 0 ? y : 1;

        //     x = x > this.conf.cols ? this.conf.cols : x;
        //     y = y > this.conf.rows ? this.conf.rows : y;

        //     this.filldot(this.field, x, y)

        // }

        this.drawField(this.field)

        this.interval = setInterval(function () {
            self.runFrame()
        }, self.conf.speed * 1000)

        this.snakeInterval = setInterval(function () {
            self.moveSnake()
        }, self.conf.snakeSpeed * 1000)
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
                    // check if there is snake part, if so, remove

                    var broke = false;
                    for (var i in this.snake.tail) {
                        var item = this.snake.tail[i]

                        if (broke || (item.x == x && item.y == y)) {
                            // delete this.snake.tail[i]
                            //broke = true
                        }

                    }


                } else {
                    field[x][y] = this.field[x][y]
                }
            }
        }

        this.field = field;
        this.drawField(this.field)

        // draw snake
        for (var i in this.snake.tail) {

            var item = this.snake.tail[i]
            this.drawSnakeDot(item.x, item.y)

        }

        var endDotCount = this.dotCount

        // console.log('Dot count: ' + this.dotCount + " Diff: " + (endDotCount - startDotCount).toFixed())

    },

    moveSnake: function () {

        // move snake
        if (this.snake.direction) {

            if (this.snake.direction == 'right') {

                this.snake.x += 1;
                this.snake.x = this.snake.x > this.conf.cols ? 0 : this.snake.x

            } else if (this.snake.direction == 'left') {

                this.snake.x -= 1;
                this.snake.x = this.snake.x < 0 ? this.conf.cols : this.snake.x

            } else if (this.snake.direction == 'up') {
                this.snake.y -= 1;
                this.snake.y = this.snake.y < 0 ? this.conf.rows : this.snake.y


            } else if (this.snake.direction == 'down') {

                this.snake.y += 1;
                this.snake.y = this.snake.y > this.conf.rows ? 0 : this.snake.y

            }

            //delete this.snake.tail[this.snake.tail.length]

            var collided = false
            // check if we collide with ourself
            for (var i in this.snake.tail) {
                var item = this.snake.tail[i]

                if (item.x == this.snake.x && item.y == this.snake.y) {
                    this.snake.tail = []
                    collided = true
                    break
                }

            }

            if (!collided) {

                this.snake.tail[this.snake.tail.length] = {
                    x: this.snake.x,
                    y: this.snake.y
                }

                if (this.field[this.snake.x][this.snake.y]) { // i ate smthing

                } else { // i moved
                    this.snake.tail.shift()
                }

            }

        }

        // draw snake

        // draw head

        this.field[this.snake.x][this.snake.y] = 1;
        this.drawSnakeDot(this.snake.x, this.snake.y)

        // draw tail
        for (var i in this.snake.tail) {

            var item = this.snake.tail[i]
            this.drawSnakeDot(item.x, item.y)

        }

        console.log('Tail: ' + this.snake.tail.length)

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

    drawSnakeDot: function (x, y) {

        color = this.conf.snakeColor
        this.ctx.fillStyle = 'yellow';
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