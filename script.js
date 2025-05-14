let t = 0;
let maxT = 100; //можно менять время изгиба дисл до отрыва
let loops = [];
let slider;
function setup() {
  createCanvas(windowWidth, windowHeight);
slider = createSlider(50, 200, 100, 1);
  strokeWeight(2);
  noFill();
slider.position(20, height + 40);    
    Label = createP(`Критическое напряжение сдвига:`);
    Label.position(20, height);
    Label.style('color', '#333');
    Label1 = createP(`Источник Франка-Рида:`);
    Label1.position(20, 0);
    Label1.style('color', '#333');
  }


function draw() {
  background(255);
  let maxT = slider.value();
  let A = createVector(width/2-100, height/2);
  let B = createVector(width/2+100, height/2);
  let center = p5.Vector.lerp(A, B, 0.5); //центральная точка между а и б
  let distance = 200;


  // Дислокация
  drawDislocation(A, B, t);
  t += 1.5; //скорость изгиба дисл
  // Образование петли
  if (t > maxT) 
  {
    let newLoop = [];
    let rx = distance/2;
    let ry = (distance-50)/2;
    for (let a = 0; a < TWO_PI; a += TWO_PI/50) {
      let x = center.x + rx * cos(a);
      let y = center.y + ry * sin(a);
      let pos = createVector(x, y);
      let dir = p5.Vector.sub(pos, center).normalize(); //задается направление движения
      newLoop.push({ pos: pos.copy(), dir: dir.copy() }); //дислокация с сохраненным направлением 
    }
    loops.push(newLoop);
    t = 0;
  }

  // Расширение петель
  for (let loop of loops) {
    beginShape();
    stroke(0, 0, 255);
    noFill();
    for (let p of loop) {
      p.pos.add(p.dir.copy());
      vertex(p.pos.x, p.pos.y);
    }
    endShape(CLOSE);
  }
}

function drawDislocation(A, B, t) {
  let points = [];
  let spiralSteps = 100; // Плавность спиралей
  let arcSteps = 50;


  // Спираль вокруг точки A
  for (let i = 0; i < spiralSteps; i++) {
    let ang = map(i, 0, spiralSteps, PI, PI + TWO_PI); // по часовой
    let r = map(i, 0, spiralSteps, 0, t / 2);
    let x = A.x + r * cos(ang);
    let y = A.y + r * sin(ang);
    points.push(createVector(x, y));
  }

  // Дуга между двумя спиралями
  let arcStart = points[points.length - 1];
  let arcOffset = createVector(t / 2, 0); // смещение от точки В
  let arcEnd = p5.Vector.add(B, arcOffset);

  for (let i = 0; i <= arcSteps; i++) {
    let amt = i / arcSteps;
    let x = lerp(arcStart.x, arcEnd.x, amt);
    let yOffset = sin(amt * PI) * t;
    let y = arcStart.y - yOffset;
    points.push(createVector(x, y));
  }

  // Спираль вокруг точки B
  for (let i = 0; i < spiralSteps; i++) {
    let ang = map(i, 0, spiralSteps, -TWO_PI, 0); // против часовой
    let r = map(i, 0, spiralSteps, t / 2, 0);
    let x = B.x + r * cos(ang);
    let y = B.y + r * sin(ang)+5;
    points.push(createVector(x, y));
  }

  // Объединение точек в кривую
  beginShape();
  stroke(0, 100, 255);
  noFill();
  for (let pt of points) {
    curveVertex(pt.x, pt.y);
  }
  endShape();
  
  // Точки закрепления
  push()
  stroke(0);
  fill(0);
  ellipse(A.x, A.y, 10, 10);
  ellipse(B.x, B.y, 10, 10);
  pop()
}
