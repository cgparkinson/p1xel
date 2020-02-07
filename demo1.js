// Need to focus on the engine. All demos will be one pixel, with controls,
// with delays, with colors. Solve these problems first. (Colors solved already.)

function changeSquareColor(demo, color) {
    console.log("changing " + demo + " to color " + color)
    document.getElementById(demo).style.backgroundColor = color;
}

async function waitToComplete(time_ms, callback) {

    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve("done!"), time_ms)
    });

    let result = await promise; // wait until the promise resolves (*)

    callback(); // "done!"
}

function waitToGoRed(demo1) {
    // go orange
    console.log("go red")
    rand_time = 1000
    waitToComplete(rand_time, function () {
        demo1.color = "red";
        demo1.nextClick = null;
    })
}

function waitToGoOrange(demo1) {
    // go orange
    console.log("go orange")
    rand_time = 1000
    waitToComplete(rand_time, function () {
        demo1.color = "orange";
        demo1.nextClick = waitToGoRed;
    })
}

class Demo1 {
    constructor() {
        console.log("constructing")
        this.lives = 3;
        this.busy = false;
        this.color = "lightgray";
        this.activecolor = "lightgray";
        this.nextClick = waitToGoOrange;//function () { alert("how did u do that"); };
    }
}

function getDemo1() {
    if (!demo1) {
        console.log("initialise")
        // initialise
        var demo1 = new Demo1();
        function refresh() {
            if (demo1.color != demo1.activecolor) {
                changeSquareColor("demo1", demo1.color);
                demo1.activecolor = demo1.color;
            }
        }
        var t = setInterval(refresh, 50);
        return demo1;
    } else {
        console.log("already have demo1");
        return demo1;
    }
}

function clickDemo1() {
    console.log("click received")
    
    demo1 = getDemo1();
    demo1.nextClick(demo1);
}