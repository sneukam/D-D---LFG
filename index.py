from flask import Flask, render_template, json
import os
# import database.db_connector as db    # not sure why 'database' is there.
import db_connector as db

# Flask
app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0     # tells the browser to pull a refresh from the server if 0 seconds have passed.

# Database Connection
db_connection = db.connect_to_database()

# Routes
@app.route('/')
def root():
    return render_template("login.html")

@app.route('/login')
def login():
    #TODO: Test credentials, create session
    return render_template("login.html")

@app.route('/sign-up')
def signup():
    return render_template("signup.html")

@app.route('/characters')
def signup():
    return render_template("characters.html")

@app.route('/create-campaign')
def create_campaign():
    return render_template("create-campaign.html")

@app.route('/available-campaigns')
def available_campaign():
    return render_template("available-campaign.html")

@app.route('/availability')
def availability():
    return render_template("availability.html")

@app.route('/account')
def account():
    return render_template("account.html")

@app.route('/logout')
def logout():
    # TODO: erase their session
    return render_template("login.html")

# TODO: CREATE + READ Operations

# TODO: POST: Sign Up page - Create new user

# TODO: POST: Login page - Redirect to new page if the credentials are correct, collect/distribute session cookies.

# TODO: GET: Account page - serve w/ data

# TODO: GET: 404 page not found





# TODO: UPDATE + DELETE Operations
# ...



@app.route('/bsg-people')
def bsg_people():
    query = "SELECT * FROM bsg_people;"
    cursor = db.execute_query(db_connection=db_connection, query=query)
    results = cursor.fetchall()
    return render_template("bsg.j2", bsg_people=results)

# Listener

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 6735))
    app.run(port=port, debug=True)