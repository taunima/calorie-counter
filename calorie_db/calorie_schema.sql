-- Calorie Counter Schema
-- These are the tables for the values that need to be stored in the database. Each table has a part with the database to be used within the database. 

-- The food values table is the table that is holding the nutritional values of each food item including the calories, macros and serving size info. 
CREATE TABLE IF NOT EXISTS food_values (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    user_id INTEGER,
    total_carbs REAL, 
    total_protein REAL, 
    total_fat REAL,
    calories REAL, 
    serving_size REAL, 
    amounts_of_serving_size REAL, 
    food_name TEXT
);

-- The goals table is holding the goals of the user. 
CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    user_id INTEGER,
    goal_type TEXT,
    daily_calories REAL
);

-- The weight table is the table that holds the weight info of the user. 
CREATE TABLE IF NOT EXISTS weight (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    user_id INTEGER,
    goal_weight REAL,
    current_weight REAL,
    notes TEXT
);

-- The daily_calories table acts as like a food journal for the data. It also uses the other tables to help with this. For example it references the food_values and weight tables to get data for the database without duplicating the data. It is also acting as a link to food items for a specific meal, date, and user.
CREATE TABLE IF NOT EXISTS daily_calories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    user_id INTEGER,
    food_values_id INTEGER,
    weight_id INTEGER,
    serving_amount REAL,
    meal_type TEXT
);
