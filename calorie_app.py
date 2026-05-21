# The beginning of this is to connect everything together of the backend to the frontend. The Flask is creating that door of the backend so that it can make that connection. The cors is to make that connection easier between connections of the different paths (For example it can connect from 5000 and 5500).
from flask import Flask, request, jsonify
from flask_cors import CORS
# The sqlite3 is grabbing data from the database and be used from the sql tables throughout the backend and frontend. It is able to also use that data in the sql and database of the app. The os is the operating system that can be used on specific an system that the app is being used on. For mine on apple it is needed whereas on other os's it could be left without using it. But I am pretty sure it is needed so that it can be used across all different ones. The BASE_DIR is used as a directive for the os path way for the file to be to be used on the HTML and JavaScript.
import sqlite3
import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# These allow the app to be fired up and be used across different paths like 5000 and 5500.
app = Flask(__name__)
CORS(app)

# This is to show the route of the home page of the app.
@app.route('/')
def home_page():
    return "Calorie Counter Home Page"

# This route is to retreive the data of the food_values table and be able to be used/displayed on the HTML through the rest of the backend and frontend. The POST methods are used for receiveing the data from the FRONTEND through the BACKEND, and sends it to the database.
@app.route('/add_food', methods=['POST'])
def add_food():
    # These are the data points that can be used from the database, through the BACKEND, and sent to the FRONTEND. 
    data = request.get_json()
    user_id = data.get('user_id')
    food_name = data.get('food_name')
    calories = data.get('calories')
    serving_size = data.get('serving_size')
    amounts_of_serving_size = data.get('amounts_of_serving_size')
    total_carbs = data.get('total_carbs')
    total_fat = data.get('total_fat')
    total_protein = data.get('total_protein')

    # This is all to build connetion to the database through the BACKEND, send to the FRONTEND, cursor is used to make sure the connection can be used from the database and aligns with data points on the FRONTEND and BACKEND sides. It does this and then committs the connection and closes it. After that it sends a message through json to let us know the food has been sent correctly and it done. This is done for all of the POST routes and their respective tables so that each can be used for each POST and GET routes.
    connection = sqlite3.connect(os.path.join(BASE_DIR, 'calorie_db', 'calorie_counter.db'))
    cursor = connection.cursor()
    cursor.execute("INSERT INTO food_values (user_id, food_name, calories, total_carbs, total_fat, total_protein, serving_size, amounts_of_serving_size) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (user_id, food_name, calories, total_carbs, total_fat, total_protein, serving_size, amounts_of_serving_size))
    connection.commit()
    connection.close()

    return jsonify({"message": "Food item added successfully!", "food_id": cursor.lastrowid})

# This route is grabbing from the food_values table as well but it is now getting the data from the Frontend, sent through the backend and back to the database so that it can be used in the database. The GET methods are used to retreive data from the database and send it to the FRONTEND.
@app.route('/get_food', methods=['GET'])
def get_food():
    # The GET route has a slightly different connection then the POST route as it is now organizing the data into rows from the food_values table from the sql file. It then grabs all the data from the database and sends it to the FRONTEND. It then closes the connection and returns the json of the food_values table to the database through the BACKEND. 
    connection = sqlite3.connect(os.path.join(BASE_DIR, 'calorie_db', 'calorie_counter.db'))
    connection.row_factory = sqlite3.Row
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM food_values")
    rows = cursor.fetchall()
    food_items = [dict(row) for row in rows]
    connection.close()

    return jsonify(food_items)

# This POST route is retrieving from the goals table and doing the same from the food_values POST route but just from the goals table instead of the food_values.
@app.route('/add_goals', methods=['POST'])
def add_goals():
    # This is the same use as what I said in the POST for add_food, but for goals.
    data = request.get_json()
    date = data.get('date')
    user_id = data.get('user_id')
    goal_type = data.get('goal_type')
    daily_calories = data.get('daily_calories')

    # Again but for this connection it is for the goals table.
    connection = sqlite3.connect(os.path.join(BASE_DIR, 'calorie_db', 'calorie_counter.db'))
    cursor = connection.cursor()
    cursor.execute("INSERT INTO goals (date, user_id, goal_type, daily_calories) VALUES (?, ?, ?, ?)", (date, user_id, goal_type, daily_calories))
    connection.commit()
    connection.close()

    return jsonify({"message": "Goal has been added!"})

# This GET route is sending data to the database of the goals table, the same as the food_values GET route but connects to the goals table and database instead of the food_values table.
@app.route('/get_goals', methods=['GET'])
def get_goals():
    # Agains same here, but for goals table.
    connection = sqlite3.connect(os.path.join(BASE_DIR, 'calorie_db', 'calorie_counter.db'))
    connection.row_factory = sqlite3.Row
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM goals")
    rows = cursor.fetchall()
    goals = [dict(row) for row in rows]
    connection.close()

    return jsonify(goals)

# Again the same here for this POST function but for the weight table.
@app.route('/add_weight', methods=['POST'])
def add_weight():
    # Again the same thing, but for weight.
    data = request.get_json()
    date = data.get('date')
    user_id = data.get('user_id')
    goal_weight = data.get('goal_weight')
    current_weight = data.get('current_weight')
    notes = data.get('notes')

    # Again the same, but for the table weight.
    connection = sqlite3.connect(os.path.join(BASE_DIR, 'calorie_db', 'calorie_counter.db'))
    cursor = connection.cursor()
    cursor.execute("INSERT INTO weight (user_id, date, goal_weight, current_weight, notes) VALUES (?, ?, ? ,? , ?)", (user_id, date, goal_weight, current_weight, notes))
    connection.commit()
    connection.close()

    return jsonify({"message": "Weight has been added!"})

# Same thing as before but for weight.
@app.route('/get_weight', methods=['GET'])
def get_weight():
    # Again for the same as before, but for weight table.
    connection = sqlite3.connect(os.path.join(BASE_DIR, 'calorie_db', 'calorie_counter.db'))
    connection.row_factory = sqlite3.Row
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM weight")
    rows = cursor.fetchall()
    weight = [dict(row) for row in rows]
    connection.close()

    return jsonify(weight)

# Same thing as before, but for calories.
@app.route('/add_calories', methods=['POST'])
def add_calories():
    # Same thing, but for the daily_calories table.
    data = request.get_json()
    date = data.get('date')
    user_id = data.get('user_id')
    meal_type = data.get('meal_type')
    serving_amount = data.get('serving_amount')
    food_values_id = data.get('food_values_id')
    weight_id = data.get('weight_id')

    # Again the same thing but for calories.
    connection = sqlite3.connect(os.path.join(BASE_DIR, 'calorie_db', 'calorie_counter.db'))
    cursor = connection.cursor()
    cursor.execute("INSERT INTO daily_calories (date, user_id, meal_type, food_values_id, weight_id, serving_amount) VALUES (?, ?, ?, ?, ?, ?)", (date, user_id, meal_type, food_values_id, weight_id, serving_amount))
    connection.commit()
    connection.close()

    return jsonify({"message": "Calories has been added."})

# Same here again, but for calories table.
@app.route('/get_calories', methods=['GET'])
def get_calories():
    # Same thing here, but for the calories table.
    connection = sqlite3.connect(os.path.join(BASE_DIR, 'calorie_db', 'calorie_counter.db'))
    connection.row_factory = sqlite3.Row
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM daily_calories")
    rows = cursor.fetchall()
    daily_calories = [dict(row) for row in rows]
    connection.close()

    return jsonify(daily_calories)

# This is different even though it is a GET route.
@app.route('/get_daily_log', methods=['GET'])
def get_daily_log():
    # This is grabbing the current date instead of hardcoding the date in everyday. It will now be used in this GET route so that it can be used in the FRONTEND when appropriate. This connection is doing the same but here it is using that connection to turn into the rows so that it can be organized with that cursor acting as the tool, like it is across the other routes as well. But this one is different as it is using a JOIN from 2 tables. Those tables are the food_values and daily_calories because the purpose of this is to find the total calorie count with the knowing the foods that have been eaten that day as well. Other then that it closes the same as well with the fetch call being used to grab all of the rows of both tables. But in the other GET routes it is only one table that is being fetched.
    date = request.args.get('date')
    connection = sqlite3.connect(os.path.join(BASE_DIR, 'calorie_db', 'calorie_counter.db'))
    connection.row_factory = sqlite3.Row
    cursor = connection.cursor()
    cursor.execute("""SELECT food_values.food_name, food_values.calories, food_values.total_carbs, food_values.total_fat, food_values.total_protein, daily_calories.meal_type
                   FROM daily_calories
                   JOIN food_values ON daily_calories.food_values_id = food_values.id
                   WHERE daily_calories.date = ?""", (date,))
    rows = cursor.fetchall()
    daily_log = [dict(row) for row in rows]
    connection.close()

    return jsonify(daily_log)

# This creates the database tables from the schema file if they don't already exist in the file. The routes are defined by @app.route decorators above each of the functions. 
def initialize_db():
    connection = sqlite3.connect(os.path.join(BASE_DIR,'calorie_db', 'calorie_counter.db'))
    cursor = connection.cursor()
    # This with is opeing the path for the BASE_DIR to be used wiht the database and schema as well. It does this to be read and executed for all of the routes. It closes so that the routes can be used.
    with open (os.path.join(BASE_DIR, 'calorie_db', 'calorie_schema.sql'), 'r') as f:
        schema = f.read()
        cursor.executescript(schema)
    connection.close()

# This is actually the entry point that starts everything. It does this by running initialize_db to first set up the tables and then starts the Flask server with app.run(debug=True).
if __name__ == '__main__':
    initialize_db()
    app.run(debug=True)