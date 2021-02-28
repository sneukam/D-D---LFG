from flask import Flask, session, render_template, json, redirect, abort, request
import os
# import database.db_connector as db    # not sure why 'database' is there.
import db_connector as db
import db_queries as queries

# Clear log file (note: Gunicorn startup messages/errors are cleared)
open('logs/gunicorn.log', 'w').close()

# Flask
app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0     # tells the browser to pull a refresh from the server if 0 seconds have passed.

# Flask-Session
app.secret_key = os.environ.get("FLASKSECRETKEY")
app.session_type = 'filesystem'
app.session_permanent = True        # keeping the default value
app.session_user_signer = True      # keeping the default value
app.permanent_session_lifetime = (86400 * 1)  # 86400 = num seconds in 24 hours
app.session_cookie_domain = 'flip3.engr.oregonstate.edu:6735'
app.session_cookie_secure = False

# Supporting Functions
def hash_pw(pwd):
    # return the hashed password
    # https://en.wikipedia.org/wiki/Secure_Hash_Algorithms
    return pwd

def logged_in():
    # returns True if the user is logged in, false otherwise
    #   logged in =
    #       1. Client has a Session cookie (user_id, username, email, player_type)
    #       2. Their session_cookie user_id is in the database

    try:
        db_connection = db.connect_to_database()
        user_id = session['user_id']
        username = session['username']
        query = f"SELECT user_id FROM users WHERE user_id = {user_id} AND username = '{username}';"
        result = db.execute_query(db_connection, query)
        result.fetchall()[0]['user_id'] # if user id does not exist, move to exception clause
    except:
        print("User is not logged in")
        logout_user()
        return False

    try:
        if session['user_id'] and session['username'] and session['email'] and session['player_type']:
            return True
    except:
        return False
    return False

def get_user_homepage():
    # returns the URL for the standard homepage for the given player_type
    try:
        if session['player_type'] == 'Player':
            return "/available-campaigns"
        elif session['player_type'] == 'DM':
            return "/create-campaign"
    except:
        pass
    return False

def logout_user():
    # logs out the user via clearing their session variables. Returns True
    try:
        user_id = session.pop('user_id', None)
        username = session.pop('username', None)
        session.pop('email', None)
        session.pop('player_type', None)
        print(f"User --> id:{user_id}, username:{username}, has been logged out")
        return True
    except:
        pass
    return True

# Routes
@app.route('/',)
def root():
    return redirect(location='/login', code=302)

@app.route('/login')
def login():
    if logged_in():
        return redirect(location=get_user_homepage(), code=302)
    return render_template("login.html")

@app.route('/login', methods=['POST'])
def authenticate():
    # Tests username and password, and logs the user in if they are valid

    # capture credentials
    credentials = request.get_json()
    username = credentials['username']
    pwd = credentials['pwd']

    # TODO: Cleanse the query params.

    # test credentials
    db_connection = db.connect_to_database()
    query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{pwd}'"
    result = db.execute_query(db_connection, query)

    # create session
    try:
        result = result.fetchall()
        session['user_id'] = result[0]['user_id']
        session['username'] = result[0]['username']
        session['email'] = result[0]['email']
        session['player_type'] = result[0]['player_type']
    except:
        return "0"

    return redirect(location='/login', code=302)

@app.route('/sign-up')
def signup():
    if logged_in():
        return redirect(location=get_user_homepage(), code=302)
    return render_template("signup.html")

@app.route('/sign-up/creds', methods=['GET'])
def credential_check():
    """
    Returns values denoting if the username and/or email arguments are already in-use
    """

    username = request.args['username']
    email = request.args['email']

    db_connection = db.connect_to_database()
    username_query = f"SELECT * FROM users WHERE username = '{username}'"
    username_result = db.execute_query(db_connection, username_query)
    email_query = f"SELECT * FROM users WHERE email = '{email}'"
    email_result = db.execute_query(db_connection, email_query)

    # return logic based on if the email/username are or are not unique
    if email_result.rowcount == 0 and username_result.rowcount == 0:
        return "1"  # tells the JS GET handler that these are available for use
    elif email_result.rowcount == 0:
        return "username"
    elif username_result.rowcount == 0:
        return "email"
    else:
        #print("both username and email are not unique (duplicate values already exist for both)")
        #print("test username_result is None")
        return "username and email"

    # this statement should never be hit, had it here for testing purposes, keeping it around for now.
    return "1"

@app.route('/sign-up', methods=['POST'])
def new_user():
    # Creates a new user with the provided username, pwd, and email
    # Assumes credentials have been checked via the /sign-up/creds route handler.

    print("POST request to create user received")

    # capture user credentials
    credentials = request.get_json()
    username = credentials['username']
    pwd = credentials['pwd']
    email = credentials['email']
    player_type = credentials['player_type']

    # TODO: Cleanse the query params.

    # create a new user
    db_connection = db.connect_to_database()
    query = f"INSERT INTO users(username, password, email, player_type) " \
            f"VALUES('{username}', '{pwd}', '{email}', '{player_type}');"
    result = db.execute_query(db_connection, query)

    # get the newly created user's id
    query = f"SELECT user_id FROM users WHERE username = '{username}' AND email = '{email}'"
    result = db.execute_query(db_connection, query)
    user_id = result.fetchall()[0]['user_id']

    # set the user's session cookie
    session['user_id'] = user_id
    session['username'] = username
    session['email'] = email
    session['player_type'] = player_type

    # redirect to correct page based on their player_type
    if session['player_type'] == 'DM':
        return redirect(location='/create-campaign', code=302)
    elif session['player_type'] == 'Player':
        return redirect(location='/available-campaigns', code=302)

    # this line should not execute.
    return redirect(location='/login', code=302)

@app.route('/characters')
def characters():
    if not logged_in():
        return redirect(location='/login', code=302)
    return render_template("characters.html")

@app.route('/create-campaign')
def create_campaign():
    if not logged_in():
        return redirect(location='/login', code=302)

    return render_template("create-campaign.html")

@app.route('/available-campaigns')
def available_campaign():
    if not logged_in():
        return redirect(location='/login', code=302)

    db_connection = db.connect_to_database()

    # get available campaigns
    if session['player_type'] == 'DM':
        query = queries.view_open_campaigns()
    elif session['player_type'] == 'Player':
        query = queries.view_campaigns_matching_user_availability(session['user_id'])

    # return page with data
    result = db.execute_query(db_connection, query)
    return render_template("available-campaigns.html", available_campaigns=result.fetchall())

@app.route('/available-campaigns', methods=['POST'])
def join_or_leave_campaign():
    """
    adds or removes a user to/from a campaign
    """
    if not logged_in():
        return redirect(location='/login', code=302)

    db_connection = db.connect_to_database()

    # execute query (join or leave)
    campaign = request.get_json()
    if campaign['action'] == 'Join':
        #TODO: update JS and this handler to handle the character_id if a user chooses.
        query = queries.join_campaign(session['user_id'], campaign['id'], character_id='Null')
    elif campaign['action'] == 'Leave':
        query = queries.leave_campaign(session['user_id'], campaign['id'])
    else:
        return json.dumps({"error": "no action or incorrect action specified"}), 500
    db.execute_query(db_connection, query)

    # JS will automatically reload the page on a success response
    return "1"

@app.route('/availability')
def availability():
    """
    Serves the My Availability page
    """
    print("hit the @/'availability' handler")
    if not logged_in():
        return redirect(location='/login', code=302)

    # Retrieve user's availability data
    db_connection = db.connect_to_database()
    query_signed_up_for = queries.view_campaigns_user_signed_up_for(session['user_id'])
    query_my_availability = queries.view_my_availability(session['user_id'])
    result_signed_up_for = db.execute_query(db_connection, query_signed_up_for)
    result_my_availability = db.execute_query(db_connection, query_my_availability)

    # error checking - can delete all this
    result_temp_my_availability = db.execute_query(db_connection, query_my_availability)
    print(result_temp_my_availability.fetchall())

    return render_template("availability.html", available_campaigns=result_signed_up_for.fetchall(), \
                           my_availability=result_my_availability.fetchall()[0])

@app.route('/availability', methods=['POST'])
def update_availability():
    """
    Updates a user's availability
        and removes them from any Open campaigns where they are now unavailable to play on that day
    POST request accepts a JSON object with the user's updated availability:
        ex: {monday:1, tuesday:0, wednesday:1, ...}
    """
    print("hit the @/'availability' POST handler")
    if not logged_in():
        return redirect(location='/login', code=302)

    user_availability = request.get_json()
    print('user availability = ')
    print(user_availability)

    # execute queries
    db_connection = db.connect_to_database()
    query_update_availability = \
        queries.update_my_availability(session['user_id'], user_availability)
    query_del_campaign_participation = \
        queries.delete_user_from_campaign_if_availability_removed(session['user_id'])
    db.execute_query(db_connection, query_update_availability)
    db.execute_query(db_connection, query_del_campaign_participation)

    return "1"

@app.route('/account')
def account():
    if not logged_in():
        return redirect(location='/login', code=302)

    return render_template("account.html")

@app.route('/logout')
def logout():
    logout_user()
    return redirect(location='/login', code=302)


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
    db_connection = db.connect_to_database()
    cursor = db.execute_query(db_connection=db_connection, query=query)
    results = cursor.fetchall()
    return render_template("bsg.j2", bsg_people=results)

# Listener

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 6735))
    app.run(port=port, debug=True, threaded=True)