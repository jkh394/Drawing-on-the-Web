let level;
let score = 0;
let time = 0;
let dropGimbap1;
let dropGimbap2;
let dropGimbap3;
let runTimer;
let start = document.querySelector('#start');
let recipeBtn = document.querySelector('#recipeBtn');
let check = document.querySelector('#check');
let finish = document.querySelector('#finish');
let finalScore = document.querySelector('#finalScore');
let bgm = document.querySelector('#bgm');

function createGimbap() {
  let body = document.querySelector('body');

  //create scene div
  let sceneDiv = document.createElement('div');
  sceneDiv.id = 'scene';

  //create cylinder base div
  let cylinderBase = document.createElement('div');
  cylinderBase.id = "cylinderBase";

  //create top circle div
  let topCircle = document.createElement('div');
  topCircle.classList.add('top');
  topCircle.classList.add('circle');

  //create bottom circle div
  let bottomCircle = document.createElement('div');
  bottomCircle.classList.add('bottom');
  bottomCircle.classList.add('circle');

  //create cylinder side div
  let side = document.createElement('div');
  side.classList.add('side');

  //create cylinder side face div 0
  let face0 = document.createElement('div');
  face0.classList.add('face0');

  //create cylinder side face div 1
  let face1 = document.createElement('div');
  face1.classList.add('face1');

  //create cylinder side face div 2
  let face2 = document.createElement('div');
  face2.classList.add('face2');

  //create cylinder side face div 3
  let face3 = document.createElement('div');
  face3.classList.add('face3');

  side.appendChild(face0);
  side.appendChild(face1);
  side.appendChild(face2);
  side.appendChild(face3);

  cylinderBase.appendChild(topCircle);
  cylinderBase.appendChild(bottomCircle);
  cylinderBase.appendChild(side);

  sceneDiv.appendChild(cylinderBase);
  body.appendChild(sceneDiv);

  return sceneDiv;
}

function browserPosition(sceneDiv) {
  let width = window.innerWidth;
  let startY = parseInt(Math.random() * width) - 50;
  sceneDiv.style.left = startY + 'px';
}

function removeGimbap(sceneDiv) {
  let body = document.querySelector('body');
  if (body.contains(sceneDiv)) {
    body.removeChild(sceneDiv);
  }
}
  
function dropGimbap(level) {
  let sceneDiv = createGimbap();
  let start = browserPosition(sceneDiv);

  sceneDiv.addEventListener('click', function() {
    removeGimbap(sceneDiv);
    score += 1;
    finishGame();
  })

  let movement = [
    {transform: 'translateY(-100%)'},
    {transform: 'translateY(500%)'},
  ];

  if (level === "hard") {
    let timing = {duration: 2000, iterations: 1};
    sceneDiv.animate(
      movement,
      timing
    )
    setTimeout(function() {
      removeGimbap(sceneDiv);
    }, 3000);
  } else if (level === "medium") {
    let timing = {duration: 3000, iterations: 1};
    sceneDiv.animate(
      movement,
      timing
    )
    setTimeout(function() {
      removeGimbap(sceneDiv);
    }, 4000);

  } else {
    let timing = {duration: 5000, iterations: 1};
    sceneDiv.animate(
      movement,
      timing
    )
    setTimeout(function() {
      removeGimbap(sceneDiv);
    }, 6000);
  }
}

function timer() {
  time += 1;
}

function finishGame() {
  if (score >= 5) {
    console.log('finished');
    clearInterval(dropGimbap1);
    clearInterval(dropGimbap2);
    clearInterval(dropGimbap3);
    clearInterval(runTimer);
    finalScore.innerHTML = '<h1 class="nonModal">' + time + ' secs</h1'
    finish.style.display = "block";
    recipeBtn.style.display = "block";
    check.style.display = "block";
    time = 0;
    score = 0;
  }
}

function startGame() {
  dropGimbap1 = setInterval(function() {
    dropGimbap(level);
  }, 2500);
  dropGimbap2 = setInterval(function() {
    dropGimbap(level);
  }, 1500);
  dropGimbap3 = setInterval(function() {
    dropGimbap(level);
  }, 3500);
  runTimer = setInterval(timer, 1000);
}

document.querySelector('#easy').addEventListener('click', function(){
  level = "easy";
  start.style.display = "none";
  recipeBtn.style.display = "none";
  check.style.display = "none";
  bgm.style.display = "none";
  startGame();
})
document.querySelector('#medium').addEventListener('click', function(){
  level = "medium";
  start.style.display = "none";
  recipeBtn.style.display = "none";
  check.style.display = "none";
  bgm.style.display = "none";
  startGame();
})
document.querySelector('#hard').addEventListener('click', function(){
  level = "hard";
  start.style.display = "none";
  recipeBtn.style.display = "none";
  check.style.display = "none";
  bgm.style.display = "none";
  startGame();
})
document.querySelector('#playAgain').addEventListener('click', function(){
  finish.style.display = "none";
  start.style.display = "block";
  bgm.style.display = "block";
})

//for viewing recipe
const modal = document.querySelector("#recipeModal");
const modalHeader = document.querySelector(".header");
const modalTitle = document.querySelector(".food");
const calories = document.querySelector(".fa-clock-o");
const servings = document.querySelector(".fa-users");
const ingredients = document.querySelector(".scroll");
const span = document.getElementsByClassName("close")[0];
let recipe;
let accessData = async () => {
  let url = 'https://api.edamam.com/search?q=gimbap&app_id=8bc2b701&app_key=2f930722e956f023a9f795eb20028706';
  let response = await fetch(url);
  if (response.ok) {
    let json = await response.json();
    recipe = json.hits[0].recipe;
    modal.style.display = "block";
    modalHeader.style.background = 'url("' + recipe.image + '") no-repeat bottom';
    modalHeader.style.backgroundSize = 'cover';
    let title = recipe.label.replace("ä", "a");
    modalTitle.innerHTML = title;
    calories.innerHTML = parseInt(recipe.calories / recipe.yield) + " calories";
    servings.innerHTML = recipe.yield + " servings";
    recipe.ingredientLines.forEach(line => {
      let ingredient = document.createElement('li');
      ingredient.innerHTML = line;
      ingredients.appendChild(ingredient);
    })
  } else {
    console.log('Error: ' + response.status);
  }
}
recipeBtn.addEventListener('click', function(e) {
  accessData();
})
span.addEventListener('click', function(e) {
  modal.style.display = "none";
})
window.addEventListener('click', function(e) {
  if (e.target == modal) {
    modal.style.display = "none";
  }
})