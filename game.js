window.onload = function () {

    game.start({

    })

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

    },

    field: [],
    canvas: null,
    ctx: null,
    dotCount: 0,
    interval: null,

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

        this.conf = Object.assign(this.conf, conf)

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
                } else {
                    field[x][y] = this.field[x][y]
                }
            }
        }

        this.field = field;
        this.drawField(this.field)
        var endDotCount = this.dotCount

        console.log('Dot count: ' + this.dotCount + " Diff: " + (endDotCount - startDotCount).toFixed())

    },

    drawField: function (field) {

        var dotCount = 0;

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

    filldot: function (field, x, y) {

        field[x][y] = 1
        // this.ctx.fillRect(x, y, 1, 1); // fill in the pixel at (x, y)

    },

    unFillDot: function (field, x, y) {

        field[x][y] = 0
        // this.ctx.clearRect(x, y, 1, 1); // unfill in the pixel at (x, y)

    }

}