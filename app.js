const searchMeal = document.querySelector('.topbar');
const resultHeading = document.querySelector('.results__heading');
const resultMeal = document.querySelector('.results__meals');
const resultSingleMeal = document.querySelector('.results__singlemeal');

searchMeal.addEventListener('submit', (e) => {
    e.preventDefault()
    if(e.submitter.classList.contains('topbar__submit')) {
        getMeals()
    }

    if(e.submitter.classList.contains('topbar__random')) {
        randomMeal()
    }
})

resultMeal.addEventListener('click', getMealById)

resultSingleMeal.addEventListener('click', (e) => {
    if(e.target.classList.contains('results__singlemeal')) {
        resultSingleMeal.classList.remove('results__singlemeal--active')
        document.body.classList.remove('blockScroll')
    }

    if(e.target.classList.contains('singlemeal__close')) {
        e.target.parentElement.remove()
        resultSingleMeal.classList.remove('results__singlemeal--active')
        document.body.classList.remove('blockScroll')
    }
})

// // ! Test
// document.addEventListener('DOMContentLoaded', () => {
//     getMeals ()
// })
async function randomMeal () {
    const url = `https://www.themealdb.com/api/json/v1/1/random.php`
    try {
        const request = await fetch(url)
        const data = await request.json()
        return formatSingleMeal(data.meals[0])
    } catch (error) {
        console.log(error);
    }
    // getMealByIdAPI()
}


function getMealById (e) {
    if(e.target.classList.contains('meal__info')) {
        getMealByIdAPI(Number(e.target.id))
    }
}

async function getMealByIdAPI (idMeal) {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`
    try {
        const request = await fetch(url)
        const data = await request.json()
        return formatSingleMeal(data.meals[0])
    } catch (error) {
        console.log(error);
    }
}

function formatSingleMeal (meal) {
    console.log(meal);
    const instructions = []
    for (let i = 1; i < 20; i++) {
        if(meal[`strIngredient${i}`]) {
            instructions.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`)
        }
    }
    const singleMeal = document.querySelector('.results__singlemeal');
    resultSingleMeal.classList.add('results__singlemeal--active')
    document.body.classList.add('blockScroll')

    singleMeal.innerHTML = `
        <div class="singlemeal">
            <h2 class="singlemeal__title">${meal.strMeal}</h2>
            <div class="singlemeal__image">
                <img class="singlemeal__img" src="${meal.strMealThumb}">
            </div>
            
            <div class="singlemeal__tags">
                <p  class="singlemeal__tag">${meal.strCategory}</p>
                <p  class="singlemeal__tag">${meal.strArea}</p>
            </div>

            <div class="singlemeal__info">
                <h4 class="singlemeal__subtitle">About</h4>
                <p class="singlemeal__description">${meal.strInstructions}</p>
            </div>
            
            <div class="singlemeal__ingredients">
                <h4 class="singlemeal__subtitle">Ingredients</h4>
                <ul class="singlemeal__list">
                    ${instructions.map(ing => `<li class="singlemeal__item">${ing}</li>`).join('')}
                </ul>
                </div>
            <div class="singlemeal__close fas fa-times"></div>
               
        </div>
    `
}

async function getMeals () {
    const term = document.querySelector('.topbar__input').value
    // const term = 'beef'
    if(!term) return alert('Type something to find.') 

    const data = await getMealsAPI(term)
    addToDocument(data)

}

// TODO: Animar las imágenes luego de cargar completamente (sin utilizar).
function animateImages () {
    const images = document.querySelectorAll('.meal__img');
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.classList.add('border')
        })
    })
}

function addToDocument (meals) {
    const term = document.querySelector('.topbar__input').value
    resultHeading.innerHTML = `<h3 class="heading__title">Search results for <span>${term}</span>:</h3>`
    
    if(meals === null) {
        resultMeal.innerHTML = ''
        resultHeading.innerHTML = `<p class="heading__title">There are no search results. <span class="highlight">Try again!</span></p>`
    } else  {
        resultMeal.innerHTML = meals.map(meal => `
        <div class="meal">
            <div class="meal__image">
                <img class="meal__img" load="lazy" src="${meal.strMealThumb}" alt="${meal.strMeal}"></img>
            </div>
            
            <div class="meal__info" id="${meal.idMeal}">
                <h3 class="meal__title">${meal.strMeal}</h3>
            </div>
        </div>   
    `)
    .join('')
    }
}

async function getMealsAPI (term) {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
    try {
        const request = await fetch(url)
        const data = await request.json()
        return data.meals
    } catch (error) {
        console.log(error);
    }
}

