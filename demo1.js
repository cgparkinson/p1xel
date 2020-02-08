// Need to focus on the engine. All demos will be one pixel, with controls,
// with delays, with colors. Solve these problems first. (Colors solved already.)

function changeSquareColor(demo, color) {
    console.log("changing " + demo + " to color " + color)
    document.getElementById(demo).style.backgroundColor = color;
}


function loseLife(demo1) {
    demo1.lives--;
}

function success(demo1) {
    demo1.color = "green";
    demo1.timeline.clear();
    waitToGoOrange(demo1);
}

function waitToGoOrange(demo1) {
    // go orange
    console.log("go orange")
    rand_time = 1000
    demo1.nextClick = loseLife;
    
    demo1.timeline.add(new TimelineEvent(
        name="test123",
        fn=function () {
            demo1.color = "orange";
            demo1.nextClick = success;
        },
        delay=rand_time
    ))
}

class TimelineEvent {
    constructor(name, fn, delay) {
        this.name = name;
        this.fn = fn;
        this.delay = delay;
    }
}

class Timeline {
    constructor() {
        this.timeline = [];
    }
    clear() {
        this.timeline = [];
    }
    add(elt) {
        this.timeline.push(elt);
    }
    refresh(demo1, delta) {
        this.timeline = this.timeline.filter((elt) => {
            console.log(elt);
            console.log("processing " + elt.name)
            elt.delay -= delta;
            if (elt.delay <= 0) {
                // remove and execute
                console.log("<0")
                elt.fn(demo1)
            }
            return (elt.delay > 0)
        });
    }
}

class Demo1 {
    constructor() {
        console.log("constructing")
        this.lives = 3;
        this.busy = false;
        this.color = "lightgray";
        this.activecolor = "lightgray";
        this.nextClick = waitToGoOrange;
        this.timeline = new Timeline();
    }
}

var demo1;
function getDemo1() {
    if (!demo1) {
        console.log("initialise")
        // initialise
        demo1 = new Demo1();
        const fps = 60;
        const delta = 1000/fps;
        function refresh() {
            if (demo1.color != demo1.activecolor) {
                changeSquareColor("demo1", demo1.color);
                demo1.activecolor = demo1.color;
            }
            demo1.timeline.refresh(demo1, delta);
        }
        var t = setInterval(refresh, delta);
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
