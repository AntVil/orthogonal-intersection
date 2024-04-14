const RESOLUTION = 800;

window.onload = () => {
    let canvas = document.getElementById("canvas");
    canvas.width = RESOLUTION;
    canvas.height = RESOLUTION;
    let ctxt = canvas.getContext("2d");

    let lines = generateRandomLines(16, 32, 0.05);

    ctxt.setTransform(RESOLUTION, 0, 0, RESOLUTION, 0, 0);

    let [pointIntersections, lineIntersections] = computeIntersections(lines);

    render(ctxt, lines, pointIntersections, lineIntersections);
}

function generateRandomLines(count, gridResolution, minLength) {
    let result = [];
    for(let i=0;i<count;i++) {
        if(Math.random() < 0.5) {
            // horizontal
            let x1 = Math.floor(gridResolution * Math.random() + 1.5) / (gridResolution + 2);
            let x2 = Math.floor(gridResolution * Math.random() + 1.5) / (gridResolution + 2);
            let y = Math.floor(gridResolution * Math.random() + 1.5) / (gridResolution + 2);

            if(Math.abs(x2 - x1) < minLength) {
                continue
            }

            if(x1 < x2) {
                result.push([x1, y, x2, y]);
            } else {
                result.push([x2, y, x1, y]);
            }
        } else {
            // vertical
            let x = Math.floor(gridResolution * Math.random() + 1.5) / (gridResolution + 2);
            let y1 = Math.floor(gridResolution * Math.random() + 1.5) / (gridResolution + 2);
            let y2 = Math.floor(gridResolution * Math.random() + 1.5) / (gridResolution + 2);

            if(Math.abs(y2 - y1) < minLength) {
                continue
            }

            if(y1 < y2) {
                result.push([x, y1, x, y2]);
            } else {
                result.push([x, y2, x, y1]);
            }
        }
    }
    return result.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
}

function computeIntersections(lines) {
    let pointIntersections = [];
    let lineIntersections = [];
    let activeLines = [];
    for(let i=0;i<lines.length;i++) {
        // going in reverse order so deleting is easier
        for(let j=activeLines.length-1;j>=0;j--) {
            if(activeLines[j][2] < lines[i][0]) {
                // line is no longer relevant
                activeLines.splice(j, 1);
            } else if(
                activeLines[j][0] <= lines[i][0] &&
                activeLines[j][2] >= lines[i][0] &&
                lines[i][1] <= activeLines[j][1] &&
                lines[i][3] >= activeLines[j][1]
            ) {
                // there is an intersection
                let x1 = lines[i][0]
                let x2 = Math.min(lines[i][2], activeLines[j][2])
                let y1 = activeLines[j][1]
                let y2 = Math.min(activeLines[j][3], lines[i][3])

                if(x1 !== x2 || y1 !== y2) {
                    lineIntersections.push([x1, y1, x2, y2]);
                }else{
                    pointIntersections.push([x1, y1]);
                }
            }
        }

        activeLines.push(lines[i]);
    }

    return [pointIntersections, lineIntersections];

}

function render(ctxt, lines, pointIntersections, lineIntersections) {
    ctxt.lineWidth = 0.015;
    for(let line of lineIntersections) {
        ctxt.strokeStyle = `#FFF`;
        ctxt.beginPath();
        ctxt.moveTo(line[0], line[1]);
        ctxt.lineTo(line[2], line[3]);
        ctxt.stroke();
    }

    ctxt.lineWidth = 0.0075;
    ctxt.strokeStyle = "#000A";
    ctxt.globalAlpha = 0.5;
    for(let i=0;i<lines.length;i++) {
        ctxt.strokeStyle = `hsl(${360 * i / lines.length}deg, 50%, 50%)`;
        ctxt.beginPath();
        ctxt.moveTo(lines[i][0], lines[i][1]);
        ctxt.lineTo(lines[i][2], lines[i][3]);
        ctxt.stroke();
    }
    ctxt.globalAlpha = 1;

    for(let line of lines) {
        ctxt.beginPath();
        ctxt.arc(line[0], line[1], 0.0075, 0, 2 * Math.PI);
        ctxt.fill();

        ctxt.beginPath();
        ctxt.arc(line[2], line[3], 0.0075, 0, 2 * Math.PI);
        ctxt.fill();
    }


    ctxt.lineWidth = 0.002;
    ctxt.strokeStyle = "#FFF";
    for(let point of pointIntersections) {
        ctxt.beginPath();
        ctxt.arc(point[0], point[1], 0.0075, 0, 2 * Math.PI);
        ctxt.stroke();
    }

    for(let line of lineIntersections) {
        ctxt.beginPath();
        ctxt.arc(line[0], line[1], 0.0075, 0, 2 * Math.PI);
        ctxt.stroke();

        ctxt.beginPath();
        ctxt.arc(line[2], line[3], 0.0075, 0, 2 * Math.PI);
        ctxt.stroke();
    }
}
