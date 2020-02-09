// Need to focus on the engine. All demos will be one pixel, with controls,
// with delays, with colors. Solve these problems first. (Colors solved already.)

function changeSquareColor(demo, color) {
    console.log("changing " + demo + " to color " + color)
    console.log("lives="+demo1.lives)
    document.getElementById(demo).style.backgroundColor = color;
}


function loseLife(demo1) {
    demo1.color="red";
    demo1.timeline.clear();
    if (demo1.lives > 0) {
        demo1.lives--;
        waitToGoOrange(demo1);
    }
    else {
        demo1.timeline.add(new TimelineEvent(
            name="death",
            fn=function(){
                console.log("dead")
                demo1.reset();
            },
            delay=3000
        ));
    }
}

function success(demo1) {
    demo1.successes++;
    demo1.color = "green";
    demo1.timeline.clear();
    waitToGoOrange(demo1);
}

function waitToGoOrange(demo1) {
    // go orange
    console.log("preparing next flash")
    rand_time = 300 + 1000*Math.random();
    demo1.nextClick = function(demo1) {console.log("bad click");};

    time_until_beige = 150;
    time_until_orange = time_until_beige + rand_time

    demo1.timeline.add(new TimelineEvent(
        name="go_beige",
        fn=function(demo1) {
            demo1.nextClick = function(demo1) {console.log("very bad click");loseLife(demo1);};
            demo1.color = "beige";
        },
        delay=time_until_beige
    ));
    
    demo1.timeline.add(new TimelineEvent(
        name="go_orange",
        fn=function (demo1) {
            demo1.color = "orange";
            demo1.nextClick = success;
            demo1.timeline.add(new TimelineEvent(
                name="faliure",
                fn=function(demo1) {console.log("missed click");loseLife(demo1);},
                delay=100+2000/(demo1.successes+1)
            ))
        },
        delay=time_until_orange
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
        var toExecute = [];
        
        this.timeline = this.timeline.filter((elt) => {
            elt.delay -= delta;
            if (elt.delay <= 0) {
                toExecute.push(elt.fn);
            }
            return (elt.delay > 0);
        });

        toExecute.forEach(fn => fn(demo1));
    }
}

class Demo1 {
    constructor() {
        console.log("constructing")
        this.activecolor = "lightgray";
        this.reset()
    }
    reset() {
        this.successes = 0;
        this.color = "lightgray";
        this.lives = 3;
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
        return demo1;
    }
}

function clickDemo1() {
    demo1 = getDemo1();
    demo1.nextClick(demo1);
}
