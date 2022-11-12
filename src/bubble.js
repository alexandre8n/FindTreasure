const bubblePointers = { 1: "TL", 2: "TR", 3: "BR", 4: "BL" };
const foundPointCorrections = { T: +1, B: -1, L: +1, R: -1 };
var basePoints = {
  TL: { x: 0, y: 0 },
  TR: { x: 0, y: 0 },
  BR: { x: 0, y: 0 },
  BL: { x: 0, y: 0 },
};
var pointerCorrection = {
  TR: { x: +1, y: -1 },
  BR: { x: +1, y: +1 },
  BL: { x: -1, y: +1 },
  TL: { x: -1, y: -1 },
};

class Bubble {
  ctx = null;
  config = {
    radius: 20,
    lineWidth: 2,
    timeoutInMs: 3000,
  };
  lastBubbleRect = { x: -1, y: -1, width: -1, height: -1 };
  bubbleTimeout = null;
  bublePointer = ""; // possible: TL, TR, BR, BL
  constructor(ctx, config) {
    this.ctx = ctx;
    if (config != null) {
      this.config = config;
    }
  }
  clear() {
    const delta = this.config.radius + this.config.lineWidth;
    ctx.clearRect(
      this.lastBubbleRect.x,
      this.lastBubbleRect.y,
      this.lastBubbleRect.width + delta,
      this.lastBubbleRect.height + delta
    );
    clearTimeout(this.bubbleTimeout);
  }

  showFound(x, y, text) {
    const quadrant = this.getQuadrant(x, y);
    this.bublePointer = bubblePointers[quadrant];
    const topORbottom = foundPointCorrections[this.bublePointer[0]];
    const leftORright = foundPointCorrections[this.bublePointer[1]];
    const x1 = x + leftORright * 50;
    const y1 = y + topORbottom * 50;
    this.draw(x1, y1, text, true);
  }

  getQuadrant(x, y) {
    //  quadrant numbers
    //   1         2
    //   4         3
    var sizeWidth = ctx.canvas.clientWidth;
    var sizeHeight = ctx.canvas.clientHeight;
    var quadrantNo = x < sizeWidth / 2 ? 14 : 23;
    quadrantNo =
      y < sizeHeight / 2 ? Math.floor(quadrantNo / 10) : quadrantNo % 10;
    return quadrantNo;
  }

  draw(x, y, text, found = false) {
    const radius = this.config.radius;
    if (this.lastBubbleRect.width > 0) {
      this.clear();
    }
    var sizeWidth = ctx.canvas.clientWidth;
    var sizeHeight = ctx.canvas.clientHeight;

    var quadrantNo = this.getQuadrant(x, y);

    const w = ctx.measureText(text).width + 40;
    var h = found ? 100 : 50;
    var delta = radius / 2;
    var pointerAr = [];
    var pointer = "TL";
    if (quadrantNo === 1) {
      x += delta;
      y += delta;
    } else if (quadrantNo === 2) {
      x -= delta + w;
      y += delta;
      pointer = "TR";
    } else if (quadrantNo === 3) {
      x -= delta + w;
      y -= delta + h;
      pointer = "BR";
    } else if (quadrantNo === 4) {
      //[  ]
      //[* ]
      x += delta;
      y -= delta + h;
      pointer = "BL";
    }
    if (found) {
      pointer = this.bublePointer;
    }

    //var
    var r = x + w;
    var b = y + h;
    this.lastBubbleRect = { x: x - delta, y: y - delta, width: w, height: h };

    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.strokeStyle = "black";
    ctx.lineWidth = "" + this.config.lineWidth;
    ctx.moveTo(x + radius, y);

    ctx.lineTo(r - radius, y);
    if (pointer === "TR") {
      ctx.quadraticCurveTo(r, y, r + delta, y - delta);
      ctx.lineTo(r, y + radius);
    } else {
      ctx.quadraticCurveTo(r, y, r, y + radius);
    }
    ctx.lineTo(r, y + h - radius);
    if (pointer === "BR") {
      ctx.quadraticCurveTo(r, b, r + delta, b + delta);
      ctx.lineTo(r - radius, b);
    } else {
      ctx.quadraticCurveTo(r, b, r - radius, b);
    }

    ctx.lineTo(x + radius, b);
    if (pointer === "BL") {
      ctx.quadraticCurveTo(x, b, x - delta, b + delta);
      ctx.lineTo(x, b - radius);
    } else {
      ctx.quadraticCurveTo(x, b, x, b - radius);
    }
    ctx.lineTo(x, y + radius);
    if (pointer === "TL") {
      ctx.quadraticCurveTo(x, y, x - delta, y - delta);
      ctx.closePath();
    } else {
      ctx.quadraticCurveTo(x, y, x + radius, y);
    }

    if (found) {
      ctx.fillStyle = "blue";
    }
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "yellow";
    ctx.fillText(text, x + 20, y + 30);
    var myClear = () => {
      this.clear();
    };

    if (found) {
      this.bubbleTimeout = null;
      //this.bubbleTimeout = setTimeout(myClear, 5000);
    } else {
      this.bubbleTimeout = setTimeout(myClear, this.config.timeoutInMs);
    }
  }

  draw2(x, y, w, h, pointer) {
    // Manipulate it again
    ctx.strokeStyle = "black";
    ctx.fillStyle = "red";
    ctx.lineWidth = 3;
    // 4 basic points
    basePoints["TL"] = { x: x, y: y };
    basePoints["TR"] = { x: x + w, y: y };
    basePoints["BR"] = { x: x + w, y: y + h };
    basePoints["BL"] = { x: x, y: y + h };
    ctx.fillRect(x, y, w, h);

    // Different radii for each corner, top-left clockwise to bottom-left

    var curPos = { x: x + radius, y: y };
    ctx.beginPath();
    ctx.moveTo(curPos.x, curPos.y);
    curPos = drawHorLine(curPos, w - 2 * radius);
    curPos = drawCorner(curPos, "TR", pointer);
    curPos = drawVertLine(curPos, h - 2 * radius);
    curPos = drawCorner(curPos, "BR", pointer);
    curPos = drawHorLine(curPos, -w + 2 * radius);
    curPos = drawCorner(curPos, "BL", pointer);
    curPos = drawVertLine(curPos, -h + 2 * radius);
    curPos = drawCorner(curPos, "TL", pointer);
    ctx.stroke();
  }

  drawHorLine(curPos, len) {
    ctx.lineTo(curPos.x + len, curPos.y);
    return { x: curPos.x + len, y: curPos.y };
  }
  drawVertLine(curPos, len) {
    ctx.lineTo(curPos.x, curPos.y + len);
    return { x: curPos.x, y: curPos.y + len };
  }

  drawCorner(curPos, cornerToDraw, pointerCorner) {
    var basicPoint = basePoints[cornerToDraw];
    var delta = radius / 2;
    var directionKoefX = cornerToDraw[0] == "T" ? 1 : -1;
    var directionKoefY = cornerToDraw[1] == "R" ? 1 : -1;
    var pointerKoef = pointerCorrection[pointerCorner];
    const resPoint = {
      x: curPos.x + directionKoefX * radius,
      y: curPos.y + directionKoefY * radius,
    };
    if (cornerToDraw !== pointerCorner) {
      ctx.quadraticCurveTo(basicPoint.x, basicPoint.y, resPoint.x, resPoint.y);
      return resPoint;
    }

    // draw the pointer

    ctx.quadraticCurveTo(
      basicPoint.x,
      basicPoint.y,
      basicPoint.x + pointerKoef.x * delta,
      basicPoint.y + pointerKoef.y * delta
    );
    curPos.x += directionKoefX * radius;
    curPos.y += directionKoefY * radius;
    ctx.lineTo(curPos.x, curPos.y);
    return curPos;
  }
}
