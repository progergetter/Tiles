"use strict";

class tile {
  static existingColors = [];

  constructor() {
    this.id = this.getRandId();
    this.color = this.getRandColor();
  }

  getRandId() {
    return Math.floor(Math.random() * 10000) + 1;
  }

  getRandColor() {
    let color =
      "#" + (((1 << 24) * Math.random()) | 0).toString(16).padStart(6, "0");
    while (tile.existingColors.includes(color))
      color =
        "#" + (((1 << 24) * Math.random()) | 0).toString(16).padStart(6, "0");
    return color;
  }
}

const shuffle = function (arr) {
  let currentIndex = arr.length,
    randomIndex;
  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [arr[currentIndex], arr[randomIndex]] = [
      arr[randomIndex],
      arr[currentIndex],
    ];
  }
  return arr;
};

const tiles = [];
let n = 36;

let score = 0;

for (let i = 0; i < n; i += 2) {
  tiles[i] = tiles[i + 1] = new tile();
}

shuffle(tiles);

const table = document.createElement("table");

table.style.position = "absolute";
table.style.top = "50%";
table.style.left = "50%";
table.style.transform = "translate(-50%, -50%)";

const columns = document.createElement("colgroup");
columns.span = Math.sqrt(n);

table.append(columns);

let selected;
let counter = 0;

for (let i = 0; i < Math.sqrt(n); i++) {
  let row = document.createElement("tr");
  for (let j = 0; j < Math.sqrt(n); j++) {
    let currObj = createTags(tiles[counter]);
    tiles[counter].div = currObj[0];
    tiles[counter].span = currObj[1];
    counter++;
    row.append(currObj[0]);
  }
  table.append(row);
}

const resolution = function () {
  return `h: ${window.height}, w: ${window.width}`;
};

window.onload = function () {
  document.getElementById("main").classList.toggle("loading-mask");
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function createTags(object) {
  let div = document.createElement("td");
  div.classList.toggle("cover");
  div.style.backgroundColor = tiles[counter].color;
  div.style.width = "20em";
  div.style.border = "thin dotted black";
  div.style.borderRadius = "10px";
  div.style.height = "0.5em";
  div.style.textAlign = "center";
  object.index = counter;
  object.id = tiles[counter].id;
  let span = document.createElement("span");
  span.style.color = object.color <= "#808080" ? "white" : "black";
  // span.innerHTML = String(tiles[counter].color);
  div.addEventListener("click", operateClick, false);
  div.id = "tdr" + counter;
  div.object = object;
  div.innerT = span;
  // span.innerHTML = object.id;
  span.id = "showOnHover" + counter;
  div.append(span);
  return [div, span];
}

async function operateClick(event) {
  let obj = event.target;
  let counter = document.getElementById("counter");
  counter.innerHTML = `Count: ${++score}`;
  if (selected === undefined) {
    obj.classList.toggle("cover");
    selected = [obj, obj.object.id];
    obj.classList.toggle("blocker");
  } else if (selected[1] === obj.object.id) {
    obj.classList.toggle("cover");

    table.classList.toggle("blocker");
    await sleep(1500);
    table.classList.toggle("blocker");

    obj.classList.toggle("hiddenFound");
    selected[0].classList.toggle("hiddenFound");
    selected = undefined;
  } else {
    const table = document.getElementById("main");
    obj.classList.toggle("cover");
    // selected[0].classList.toggle("cover");
    table.classList.toggle("blocker");
    await sleep(1500);
    table.classList.toggle("blocker");
    obj.classList.toggle("cover");
    selected[0].classList.toggle("cover");
    selected[0].classList.remove("blocker");
    selected = undefined;
  }
}

document.getElementById("main").append(table);
