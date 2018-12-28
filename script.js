document.addEventListener('DOMContentLoaded', function () {
    var sortTest = new Vue({
        el: '#sortTest',
        data: {
            error: null,
            playing: false,
            colors: ["#295fa7", "#ff7033", "#566573", "#ff8080"],
            colorPick: 1,
            size: 200,
            time: 0,
            drawing: 0,
            inputQuantity: 30,
            sortSpeed: 10,
            array: [],
            arrayLevel: 0,

        },
        computed: {
            context: function () {
                var canvas = document.getElementById("canvas"),
                    context = canvas.getContext("2d");
                return context;
            },
            canvasSize: function () {
                if(window.matchMedia("(orientation: landscape)").matches){
                    canvasSize = document.body.clientWidth * 0.5;
                }else{
                    canvasSize = document.body.clientWidth * 0.9;
                }
                
                console.log(canvasSize);
                return canvasSize;
            },
            elementsNumb: function () {
                numb = parseInt(this.inputQuantity);
                if (numb != NaN && numb > 0) {
                    return numb;
                } else {
                    this.error = 'Введите корректное значение';
                    return 0;
                }
            },
        },
        methods: {
            createRandomArray: function () {
                let {
                    size,
                } = this;

                if (this.array.length != 0) {
                    this.array = [];
                }
                for (var i = 0; i < this.elementsNumb; i++) {

                    this.array.push(Math.round(((this.canvasSize / 2) - size)));

                }
                for (i = 0; i < this.array.length; i++) {

                    this.array[i] = this.array[i] * ((i) * ((0.5 / this.array.length))) + 100;

                }
                this.compareRandom();
                if (size > 0) {
                    this.resetImage();
                }

            },
            resetImage: function () {
                this.context.clearRect(0, 0, this.canvasSize, this.canvasSize);
                this.painting();
            },
            compareRandom: function () {
                let {
                    array
                } = this;
                let j, x;
                for (var i = array.length; i; i--) {
                    j = Math.floor(Math.random() * i);
                    x = array[i - 1];
                    array[i - 1] = array[j];
                    array[j] = x;
                }
            },
            painting: function () {
                let {
                    colors,
                    size,
                    time,
                    array
                } = this;
                this.context.lineWidth = 2 * Math.PI * (size) / array.length;

                for (var i = 0; i < array.length; i++) {
                    this.linePainting(false, i, colors[0]);
                    this.linePainting(false, time - 1, colors[this.colorPick]);
                    this.linePainting(false, time, colors[this.colorPick]);
                }

            },
            linePainting: function (drop, radCord, color) {
                let {
                    array
                } = this;
                if (this.elementsNumb != 0) {
                    this.context.strokeStyle = color;
                    this.context.lineWidth = this.canvasSize * 0.75 / array.length;
                    if (drop) {
                        this.context.beginPath();
                        this.context.moveTo(radCord * (this.canvasSize * 0.9 / array.length) + 30, this.canvasSize / 2 - array[radCord]);
                        this.context.lineTo(radCord * (this.canvasSize * 0.9 / array.length) + 30, this.canvasSize / 2 - array[radCord] - this.canvasSize * 0.8 / array.length);
                        this.context.stroke();
                    } else {
                        this.context.beginPath();
                        this.context.moveTo(radCord * (this.canvasSize * 0.9 / array.length) + 30, this.canvasSize / 2);
                        this.context.lineTo(radCord * (this.canvasSize * 0.9 / array.length) + 30, this.canvasSize / 2 - array[radCord]);
                        this.context.stroke();
                    }
                }

            },
            initSort: function () {
                let {
                    sort
                } = this;
                this.drawing = setInterval(() => {
                    sort();
                }, Math.abs(1/this.sortSpeed));
            },
            sort: function () {
                this.context.clearRect(10, 10, this.canvasSize - 30, this.canvasSize - 30);
                this.context.clearRect(10, 10, this.canvasSize - 30, this.canvasSize - 30);

                if (this.array[this.time] > this.array[this.time + 1]) {
                    this.colorPick = 3;
                } else {
                    this.colorPick = 1;
                }



                if (this.arrayLevel > this.array.length) {
                    this.finish();
                } else {
                    this.painting();
                }

                for (var i = 0; i < this.array.length - 1; i++) {
                    if (this.array[i] <= this.array[i + 1]) {
                        this.arrayLevel++;

                    } else {
                        this.arrayLevel = 0;

                    }
                }
                if (this.time < this.array.length - 1 - this.arrayLevel) {

                    if (this.array[this.time] > this.array[this.time + 1]) {
                        var temp = this.array[this.time + 1];
                        this.array[this.time + 1] = this.array[this.time];
                        this.array[this.time] = temp;
                    }
                    this.time++;

                } else {
                    this.time = 0;
                }

            },
            finish: function () {
                let {
                    colors,
                    size,
                    drawing,
                    array,
                } = this;
                clearInterval(drawing);
                this.context.clearRect(10, 10, this.canvasSize - 20, this.canvasSize - 20);
                this.context.lineWidth = 2 * Math.PI * (size) / array.length;
                for (var i = 0; i < array.length; i++) {
                    this.linePainting(false, i, colors[0], size);
                }
                i = 0;
                var finishDrawing = setInterval(() => {

                    if (i < array.length) {
                        this.linePainting(false, i, colors[1], size);
                    } else {

                        clearInterval(finishDrawing);
                        this.arrayLevel = 0;
                        this.playing = false;
                    }
                    i++;
                }, Math.abs(100/parseInt(this.sortSpeed)));
            },
            startSort: function () {
                if (this.playing === false) {
                    this.playing = true;
                    this.initSort();
                } else {
                    this.playing = false;
                    clearInterval(this.drawing);
                    this.resetImage();
                }
            }
        },
        mounted: function () {
            var canvas = document.getElementById("canvas");
            canvas.height = this.canvasSize;
            canvas.width = this.canvasSize;
            this.createRandomArray();
        }
    });
})