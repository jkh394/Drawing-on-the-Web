function createStar() {
  let body = document.querySelector('body');

  //create scene div
  let sceneDiv = document.createElement('div');
  sceneDiv.classList.add('scene');

  //create star div
  let starDiv = document.createElement('div');
  starDiv.classList.add('star');
  starDiv.style.animationName = 'rotate';
  starDiv.style.animationDuration = '1s';
  starDiv.style.animationIterationCount = 'infinite';
  starDiv.style.animationTimingFunction = 'linear';

  //create pyramid div
  let pyramidDiv = document.createElement('div');
  pyramidDiv.classList.add('pyramid');

  //create pyramid inverted div
  let invertedDiv = document.createElement('div');
  invertedDiv.classList.add('pyramid');
  invertedDiv.classList.add('inverted');

  //create 2 bases
  let bases = new Array();
  for (let i = 0; i < 2; i++) {
    let baseDiv = document.createElement('div');
    baseDiv.classList.add('base');
    bases.push(baseDiv);
  }

  //create 4 faces
  let faces = new Array();
  for (let i = 0; i < 8; i++) {
    let faceDiv = document.createElement('div');
    faceDiv.classList.add('face');
    faces.push(faceDiv);
  }
  
  //combine errythang together
  for (let i = 0; i < 4; i++) {
    pyramidDiv.appendChild(faces[i]);
  }
  for (let i = 4; i < 8; i++) {
    invertedDiv.appendChild(faces[i]);
  }
  pyramidDiv.appendChild(bases[0]);
  invertedDiv.appendChild(bases[1]);

  starDiv.appendChild(pyramidDiv);
  starDiv.appendChild(invertedDiv);

  sceneDiv.appendChild(starDiv);

  body.insertBefore(sceneDiv, body.firstElementChild);
  
  return sceneDiv;
}

function browserPosition(sceneDiv) {
  let width = window.innerWidth;
  let startY = parseInt(Math.random() * width) - 50;
  sceneDiv.style.left = startY + 'px';
  sceneDiv.style.top = '-100px';
  sceneDiv.style.transform = 'translate(1000%, 1000%)';
  sceneDiv.style.zIndex = '2';

  if (startY < parseInt(width/2)) {
    return 'left';
  } else {
    return 'right';
  }
}

function wishing() {
  audio.currentTime = 0
  audio.play();

  let sceneDiv = createStar();
  let start = browserPosition(sceneDiv);
  
  if (start === 'left') {
    let movement = [
      {transform: 'translate(-0%, -0%)'},
      {transform: 'translate(1000%, 1000%)'}
    ];
    let timing = {duration: 2500, iterations: 1};
    sceneDiv.animate(
      movement,
      timing
    )
  } else {
    let movement = [
      {transform: 'translate(-0%, 0%)'}, 
      {transform: 'translate(-1000%, 1000%)'},
    ];
    let timing = {duration: 2500, iterations: 1};
    sceneDiv.animate(
      movement,
      timing
    )
  }
}

let audio = document.querySelector('audio');
let btn = document.querySelector('button');
btn.addEventListener('click', wishing);