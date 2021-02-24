from flask import Flask, session, render_template, json, redirect, abort
import os
# import database.db_connector as db    # not sure why 'database' is there.
import db_connector as db

# Clear Gunicorn log file
# this will erase any startup log lines that gunicorn has already writtne.
# if guinicorn is starting up successfully, ^ this is a non issue.
# if the webpage(s) are non-response, and the log file is empty, you may want to remove this line.
open('logs/gunicorn.log', 'w').close()

# Flask
app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0     # tells the browser to pull a refresh from the server if 0 seconds have passed.
app.secret_key = os.environ.get("FLASKSECRETKEY")

# Flask-Session
# SESSION_TYPE = 'null'
SESSION_PERMANENT = True        # keeping the default value
SESSION_USE_SIGNER = True       # keeping the default value
PERMANENT_SESSION_LIFETIME = (86400 * 1)  # 86400 = num seconds in 24 hours
SESSION_COOKIE_DOMAIN = 'flip3.engr.oregonstate.edu:6735'
SESSION_COOKIE_SECURE = False  # flip3 servers use http, confirming we will be sending cookies via unsecured http protocol.

"""
app.config.from_object(__name__)
Session(app)
^^^ got this from an example that had other outdated code in it.
"""

# Database Connection
db_connection = db.connect_to_database()

# Routes
@app.route('/', methods = ['GET'])
def root():
    return redirect(location='/login', code=302)

@app.route('/login', methods = ['GET'])
def login():
    #TODO: If user is already logged in...
    return render_template("login.html")

@app.route('/login', methods = ['POST'])
def authenticate():
    #TODO: Test credentials, create session
    print("/login POST request received")
    return "received the POST request on the login page"

@app.route('/sign-up')
def signup():
    return render_template("signup.html")

@app.route('/characters')
def characters():
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