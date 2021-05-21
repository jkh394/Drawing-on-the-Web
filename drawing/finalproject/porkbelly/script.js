let grill = document.querySelector('#grill2');
let body = document.querySelector('body');
let raw = document.querySelector(".raw");

//check location of pork belly
function locatePorkBelly(porkBelly) {
  grill.offsetBottom = grill.offsetTop + window.scrollY;
  grill.offsetRight =  grill.offsetLeft - 369;
  porkBelly.offsetBottom = porkBelly.offsetTop + porkBelly.offsetHeight;
  porkBelly.offsetRight = porkBelly.offsetLeft + porkBelly.offsetWidth;
  
  let circle = {
    x: body.offsetWidth / 2,
    y: body.offsetHeight / 2,
    r: 225
  }

  console.log(circle.x);

  let x = porkBelly.pageX;
  let y = porkBelly.pageY - grill.getBoundingClientRect().top;

  let dx = x - circle.x;
  dy = y - circle.y,
  dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < circle.r) {
    return true;
  } else {
    return false;
  }
}

//for clicking & dragging raw pork belly
let activeItem = null;
let active = false;

raw.addEventListener("touchstart", dragStart, false);
raw.addEventListener("touchend", dragEnd, false);
raw.addEventListener("touchmove", drag, false);

raw.addEventListener("mousedown", dragStart, false);
raw.addEventListener("mouseup", dragEnd, false);
raw.addEventListener("mousemove", drag, false);

function dragStart(e) {
  if (e.target !== e.currentTarget) {
      e.preventDefault();
      active = true;

      // this is the item we are interacting with
      activeItem = e.target;

      if (activeItem !== null) {
          if (!activeItem.xOffset) {
              activeItem.xOffset = 0;
          }

          if (!activeItem.yOffset) {
              activeItem.yOffset = 0;
          }

          if (e.type === "touchstart") {
              activeItem.initialX = e.touches[0].clientX - activeItem.xOffset;
              activeItem.initialY = e.touches[0].clientY - activeItem.yOffset;
          } else {
              activeItem.initialX = e.clientX - activeItem.xOffset;
              activeItem.initialY = e.clientY - activeItem.yOffset;
          }
      }
  }
}

function dragEnd(e) {
  if (activeItem !== null) {
      activeItem.initialX = activeItem.currentX;
      activeItem.initialY = activeItem.currentY;
  }

  active = false;
  activeItem = null;
  console.log('drag end');
  console.log(locatePorkBelly(e))
  if (locatePorkBelly(e) === true && e.target.src.includes('/media/raw.png')) {
    console.log('cooking...');
    e.target.previousElementSibling.play();
    setTimeout(function(){cookedPorkBelly(e)}, 3000);
  } else if (e.target.src.includes('/media/cooked.png') && locatePorkBelly(e) === false) {
    e.target.dataset.status = "done";
    e.target.previousElementSibling.pause();
  }
}

function drag(e) {
  if (active) {
      if (e.type === "touchmove") {
          e.preventDefault();

          activeItem.currentX = e.touches[0].clientX - activeItem.initialX;
          activeItem.currentY = e.touches[0].clientY - activeItem.initialY;
      } else {
          activeItem.currentX = e.clientX - activeItem.initialX;
          activeItem.currentY = e.clientY - activeItem.initialY;
      }

      activeItem.xOffset = activeItem.currentX;
      activeItem.yOffset = activeItem.currentY;

      setTranslate(activeItem.currentX, activeItem.currentY, activeItem);
  }
}

function setTranslate(xPos, yPos, el) {
  el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}

function timer(porkBelly) {
  let current = parseInt(porkBelly.target.dataset.time);
  current += 1;
  porkBelly.target.dataset.time = current;
  if (current < 200) {
    timer(porkBelly);
  } else {
    burntPorkBelly(porkBelly);
  }
}

function burntPorkBelly(porkBelly) {
  if (locatePorkBelly(porkBelly) === true && porkBelly.target.dataset.time >= 200 && porkBelly.target.dataset.status !== "done") {
    porkBelly.target.src = './media/burnt.png';
    porkBelly.target.previousElementSibling.pause();
  } else {
    console.log("don't burn me!");
  }
}

function cookedPorkBelly(porkBelly) {
  porkBelly.target.src = './media/cooked.png';
  setTimeout(function(){timer(porkBelly)}, 3000);
}

//for viewing recipe
const modal = document.querySelector("#recipeModal");
const modalHeader = document.querySelector(".header");
const modalTitle = document.querySelector(".food");
const calories = document.querySelector(".fa-clock-o");
const servings = document.querySelector(".fa-users");
const ingredients = document.querySelector(".scroll");
const recipeBtn = document.querySelector('#recipeBtn');
const span = document.getElementsByClassName("close")[0];
let recipe;
let accessData = async () => {
  let url = 'https://api.edamam.com/search?q=Bo%20Ss%C3%A4m%20Grilled%20Pork&app_id=8bc2b701&app_key=2f930722e956f023a9f795eb20028706';
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