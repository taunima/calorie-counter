// These are variables that are used for the this file so that it can be called throughout the file as well. It grabs the id's from the HTML file so it can do this within the JavaScript file as well.
const daily = document.getElementById('daily')
const breakfast = document.getElementById('breakfast')
const lunch = document.getElementById('lunch')
const dinner = document.getElementById('dinner')
const snacks = document.getElementById('snacks')
const sub = document.getElementById('sub-section')

// This is used to give the current date. 
const today = new Date().toISOString().split('T')[0]

// This is to give a base of the calories as a goal. It has to be placed here so that it can be used throughout the functions and not break the code. 
let goalCalories = 0

// Each function is used to grab data from the database and python file to put into the HTML file. It is displayed each function is called at the end of the file. This function is used to get the foods nutritional values for each of the sections and also getting the calories you are consuming daily. But this function is different as it is being called with another function so it needs to be called after both function can run at the same time.
function getFoods() {
    // This fetch is going to the join query of get_daily_log so that it can grab the info that is needed for the sections and saving the data to the database. But this fetch call is also different to the other fetch calls as it is showing the current date as it is being set up in the beginning of the file. The reason it needs to include the full form is because the getFoods function rebuilds each section every time it is ran. Anything that was in the HTML originally get wiped and needs to be restored here.
    fetch(`http://127.0.0.1:5000/get_daily_log?date=${today}`)
        .then(response => response.json())
        .then(data => {
            // This is to reset the innerHTML so that it can be used when the user is adding food and each of the forms that is being filled out will be added and saved. This is happening in each section as it is needed and that it can also work with the delete functionality as well.
            breakfast.innerHTML = `
            <h2>Breakfast</h2>
            <button onclick="showForm('breakfast-form')"> Add Food </button>
            <div id="breakfast-form" style="display:none">
                <input type="text" id="breakfast-food-name" placeholder="Food Name "> 
                <input type="number" id="breakfast-calories" placeholder="Calories ">
                <input type="number" id="breakfast-total-carbs" placeholder="Total Carbs ">
                <input type="number" id="breakfast-total-fats" placeholder="Total Fats ">
                <input type="number" id="breakfast-total-protein" placeholder="Total Protein ">
                <input type="number" id="breakfast-serving-size" placeholder="Serving Size ">
                <input type="number" id="breakfast-serving-size-amounts" placeholder="Amount of Serving Sizes ">
                <button onclick="addFood('breakfast')">Save</button>
            </div>`
            lunch.innerHTML = `
            <h2>Lunch</h2>
            <button onclick="showForm('lunch-form')"> Add Food </button>
            <div id="lunch-form" style="display:none">
                <input type="text" id="lunch-food-name" placeholder="Food Name ">
                <input type="number" id="lunch-calories" placeholder="Calories ">
                <input type="number" id="lunch-total-carbs" placeholder="Total Carbs ">
                <input type="number" id="lunch-total-fats" placeholder="Total Fats ">
                <input type="number" id="lunch-total-protein" placeholder="Total Protein ">
                <input type="number" id="lunch-serving-size" placeholder="Serving Size ">
                <input type="number" id="lunch-serving-size-amounts" placeholder="Amoung of Serving Sizes ">
                <button onclick="addFood('lunch')">Save</button>
            </div>`
            dinner.innerHTML = `
            <h2>Dinner</h2>
            <button onclick="showForm('dinner-form')"> Add Food </button>
            <div id="dinner-form" style="display:none">
                <input type="text" id="dinner-food-name" placeholder="Food Name: ">
                <input type="number" id="dinner-calories" placeholder="Calories: ">
                <input type="number" id="dinner-total-carbs" placeholder="Total Carbs: ">
                <input type="number" id="dinner-total-fats" placeholder="Total Fats: ">
                <input type="number" id="dinner-total-protein" placeholder="Total Protein: ">
                <input type="number" id="dinner-serving-size" placeholder="Serving Size: ">
                <input type="number" id="dinner-serving-size-amounts" placeholder="Amount of Serving Sizes: ">
                <button onclick="addFood('dinner')">Save</button>
            </div>`
            snacks.innerHTML = `
            <h2>Snacks</h2>
            <button onclick="showForm('snacks-form')"> Add Food </button>
            <div id="snacks-form" style="display:none">
                <input type="text" id="snacks-food-name" placeholder="Food Name: ">
                <input type="number" id="snacks-calories" placeholder="Calories: ">
                <input type="number" id="snacks-total-carbs" placeholder="Total Carbs: ">
                <input type="number" id="snacks-total-fats" placeholder="Total Fats: ">
                <input type="number" id="snacks-total-protein" placeholder="Total Protein: ">
                <input type="number" id="snacks-serving-size" placeholder="Serving Size: ">
                <input type="number" id="snacks-serving-size-amounts" placeholder="Amount of Serving Sizes: ">
                <button onclick="addFood('snacks')">Save</button>
            </div>`
            let totalConsumed = 0
            let totalCarbs = 0
            let totalFats = 0
            let totalProtein = 0
            console.log(data)
                data.forEach(food => {
                    totalConsumed += food.calories
                    totalCarbs += food.total_carbs
                    totalFats += food.total_fat
                    totalProtein += food.total_protein
                    // These have been modified so that the saved foods can be deleted if needed.
                    if (food.meal_type === 'breakfast') {
                        breakfast.innerHTML += `<p>${food.food_name} - ${food.calories} calories <button onclick="deleteFood(${food.id})">Delete</button></p>`
                    } else if (food.meal_type === 'lunch') {
                        lunch.innerHTML += `<p>${food.food_name} - ${food.calories} calories <button onclick="deleteFood(${food.id})">Delete</button></p>`
                    } else if (food.meal_type === 'dinner') {
                        dinner.innerHTML += `<p>${food.food_name} - ${food.calories} calories <button onclick="deleteFood(${food.id})">Delete</button></p>`
                    } else if (food.meal_type === 'snacks') {
                        snacks.innerHTML += `<p>${food.food_name} - ${food.calories} calories <button onclick="deleteFood(${food.id})">Delete</button></p>`
                    }
                })
                // This is to get that remaining variable so that it can give the remaining calories of the calories that are consumed on that day. 
                const remaining = goalCalories - totalConsumed
                document.getElementById('daily').innerHTML = `Calories Remain: ${remaining}`
                document.getElementById('total-carbs').innerHTML = `Amount of Carbs: ${totalCarbs} g`
                document.getElementById('total-fats').innerHTML = `Amount of Fats: ${totalFats} g`
                document.getElementById('total-protein').innerHTML = `Amount of Protein ${totalProtein} g`
            })
}

// This function is doing the actual function of adding the the food within the forms and gets the nutritional values. It also calculates the calories as well of what is being consumed as well. But in this function it is going in sequence as it has 2 fetch calls. 
function addFood(meal) {
    const foodName = document.getElementById(`${meal}-food-name`).value
    const calories = document.getElementById(`${meal}-calories`).value
    const totalCarbs = document.getElementById(`${meal}-total-carbs`).value
    const totalFats = document.getElementById(`${meal}-total-fats`).value
    const totalProtein = document.getElementById(`${meal}-total-protein`).value
    const servingSize = document.getElementById(`${meal}-serving-size`).value
    const servingSizeAmounts= document.getElementById(`${meal}-serving-size-amounts`).value

    // This fetch is displaying the info that is being added to the database and also displayed as well. It is grabbing from the python file and in turn it is sending data to the database as it is doing all of this.
    fetch('http://127.0.0.1:5000/add_food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            user_id: 1,
            food_name: foodName,
            calories: calories,
            total_carbs: totalCarbs,
            total_fat: totalFats,
            total_protein: totalProtein,
            serving_size: servingSize,
            amounts_of_serving_size: servingSizeAmounts,
            meal_type: meal
        })
    })
    .then(response => response.json())
    .then(data => {
        
        // This fetch call is going to grab data from the add_calories as it is posting calories of the data. It is the second part of the sequence that is calling the data from the calories data. This is needed so that it can grab the data from this, so it can connect to the first sequence and show in the HTML as the correct forms and order. 
        const foodId = data.food_id
        return fetch('http://127.0.0.1:5000/add_calories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                user_id: 1,
                food_values_id: foodId,
                weight_id: 1,
                serving_amount: 1,
                meal_type: meal,
                date: today
            })
        })
    })
    // This is needed so that it can be the next part of the data and also close the function that as called. Once it closes it then calls the function that is needed to end the function. 
    .then(response => response.json())
    .then(data => {
        console.log(data)
        getFoods()
    })
}

// This function is grabbing the goals data and showing them on the HTML. But it is also sending and grabbing the data from the database. 
function getGoals() {
    // This fetch is grabbing from the get_goals call. 
    fetch('http://127.0.0.1:5000/get_goals')
    .then(response => response.json())
    .then(data => {
        const goal = data[0]
        goalCalories = goal.daily_calories
        document.getElementById('goal-type').innerHTML = `Goal Type: ${goal.goal_type}`
        document.getElementById('daily').innerHTML = `Calorie limit: ${goal.daily_calories}`
        getFoods()
    })
}
getGoals()

// This function is grabbing the weight data and putting them in the appropriate spots as well. 
function getWeight() {
    fetch('http://127.0.0.1:5000/get_weight')
    .then(response => response.json())
    .then(data => {
        const weight = data[0]
        document.getElementById('current-weight').innerHTML = `Current Weight: ${weight.current_weight}`
        document.getElementById('goal-weight').innerHTML = `Goal Weight: ${weight.goal_weight}`
        document.getElementById('notes').innerHTML = 
        `Notes: ${weight.notes}`})
}
getWeight()

// This is to connect the showForm call to this function so that it can show the display. When the button 'Add Food' is pressed it will change the display from no display to then showing the forms so that the user can input the data it wants to input. After the all of the forms are filled in and the user is ready to press the save button the forms are returned back to no display because getFoods resets the innerHTML of each section which removes the form entirely.
function showForm(formId) {
    document.getElementById(formId).style.display = 'block'
}

// This function does the actual fetch call to the python file so that it can be used on the frontend.
function deleteFood(id) {
    fetch(`http://127.0.0.1:5000/delete_calories/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        getFoods()
    })
}