let x = 0;
let y = 50;
let z = 0;
let oldScroll;

function slurpUp() {
    let noodles = document.querySelector("#noodles");
    y = y-3;
    noodles.style.transform = "translate(-20%," + y + "%)";
    let chopstick1 = document.querySelector("#chopstick1");
    chopstick1.style.transform = "rotateZ(" + z + "deg)";
    let chopstick2 = document.querySelector("#chopstick2");
    chopstick2.style.transform = "rotateZ(" + z/2 + "deg)";
    z = z-1;
}

function slurpDown() {
    let noodles = document.querySelector("#noodles");
    y = y+6;
    noodles.style.transform = "translate(-20%," + y + "%)";
    chopstick1.style.transform = "rotateZ(" + z + "deg)";
    let chopstick2 = document.querySelector("#chopstick2");
    chopstick2.style.transform = "rotateZ(" + z/2 + "deg)";
    z = z+2;
}

document.querySelector('#scroll').addEventListener('scroll', function(e) {
    if (this.oldScroll > this.scrollTop) {
        if (y < 50) {
            slurpDown();
        }
    } else {
        slurpUp();
    }
    this.oldScroll = this.scrollTop;
})

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
  let url = 'https://api.edamam.com/search?q=shin%20ramen&app_id=8bc2b701&app_key=2f930722e956f023a9f795eb20028706';
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