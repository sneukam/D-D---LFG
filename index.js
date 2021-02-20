/*************************************************************************

		Welcome
		
*************************************************************************/

/* 
	Please see the README.md file for this website.
	This is the backend Node server
	This will serve up web pages, receives POST requests & updates db, and tracks users that are logged-in via Sessions framework.
*/

/*************************************************************************

		Node Server
		
*************************************************************************/

// Create the Server
var express = require('express');
var path = require("path");
const app = express();		// changed from var to const based on student code on Piazza to help with home.js problem.
var handlebars = require('express-handlebars').create(); //.create({defultLayout:'main.handlebars'});

// Required for POST requests (auto detects which parser to use)
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//var html_path = "/cs340/data_bases_team_project";
app.use(express.static(path.join(__dirname, ""))); // a student gave me this to help serve JS file.
//console.log("default dirname =" + __dirname);
//console.log(__dirname + html_path);
//app.engine('html', require('ejs').renderFile);

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

/*
// Set engine and port
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
*/
app.set('port', 6735);

/*************************************************************************

		MySQL Connection
		
*************************************************************************/

// Connect to DB
var mysql = require('mysql');
var pool = mysql.createPool({
  host: 'classmysql.engr.oregonstate.edu',
  user: 'cs340_neukams',
  password: 'oregonstate303',
  database: 'cs340_neukams'
});

// insert message if DB connection successful ?

/*************************************************************************

		Sessions
		
*************************************************************************/


/*************************************************************************

		GET Request Handlers
		(Page Requests)
		
*************************************************************************/

// GET - Base Domain - Serve Login
app.get('/',function(req,res,next){
	
	// If user is logged in (Sessions)
		// If user is type=DM, redirect to Create Campaigns
		// If user is type=Player, redirect to Available Campaigns
	
	// If not logged in, serve up Login page
	//var context = {};
	/*
	pool.query("SELECT id, name, reps, weight, date_format(date, '%Y-%m-%d') as date, unit FROM todo", function(err, rows, fields){
	if(err){
	  next(err);
	  return;
	}
	context.results = rows; 
	*/
	console.log('serving login.html');
	//res.render('login.html', context);
	//res.render('login.html');
	res.sendFile('login.html', {root : __dirname});
});

// GET - Login
app.get('/login',function(req,res,next){
	console.log('serving login.html');
	res.sendFile('login.html', {root : __dirname});
});

// GET - Signup
app.get('/signup',function(req,res,next){
	console.log('serving signup.html');
	res.sendFile('signup.html', {root : __dirname});
});

// GET - Characters
app.get('/characters',function(req,res,next){
	console.log('serving characters.html');
	res.sendFile('characters.html', {root : __dirname});
});

// GET - Create Campaign
app.get('/create-campaign',function(req,res,next){
	console.log('serving campaigns.html');
	res.sendFile('create-campaign.html', {root : __dirname});
});

// GET - Available Campaigns
app.get('/available-campaigns',function(req,res,next){
	console.log('serving campaigns.html');
	res.sendFile('available-campaigns.html', {root : __dirname});
});

// GET - Availability
app.get('/availability',function(req,res,next){
	console.log('serving availability.html');
	res.sendFile('availability.html', {root : __dirname});
});

// GET - Account
app.get('/account',function(req,res,next){
	console.log('serving account.html');
	res.sendFile('account.html', {root : __dirname});
});

/*************************************************************************

		POST Request Handlers
		(Update data)
		
*************************************************************************/

/* The below app.post section was copy-pasted from a 290 assignment. Use as a template.
// Update Account Information
app.post('/account', function(req,res){
  
  
  // capture parameters in Body
  var qParamsBody = [];
  for (var p in req.body){
    qParamsBody.push({'name':p,'value':req.body[p]})
  }
  console.log(qParamsBody);
  console.log(req.body);
  var context = {};
  context.body = qParamsBody;
  
  // capture parameters in URL
  var qParamsURL = [];
  for (var p in req.query){
    qParamsURL.push({'name':p,'value':req.query[p]})
  }
  console.log(qParamsURL);
  console.log(req.query);
  context.url = qParamsURL;
  
  // render page
  res.render('post-request.handlebars', context);
}); */

/*
// GET - RESET TABLE
app.get('/reset-table',function(req,res,next){
	
	// drop the table
  var context = {};
  pool.query("DROP TABLE IF EXISTS todo", function(err){
    var createString = "CREATE TABLE todo(" +
    "id INT PRIMARY KEY AUTO_INCREMENT," +
    "name VARCHAR(255) NOT NULL," +
	"reps INTEGER," +
	"weight INTEGER," +
    "date DATE," +
    "unit VARCHAR(255))";
    pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home.handlebars',context);
    })
  });
  console.log("table reset successfully");
});

// GET - INSERT TEST
app.get('/insert-test',function(req,res,next){
	
  // Insert dummy values with a fixed string
  pool.query("INSERT INTO todo (name, reps, weight, date, unit) VALUES ('heavy weights', 5, 50, '2020-12-21', 'lbs')", function(err, result){
	var contextt = {};
    if(err){
      next(err);
      return;
    }
	// we inserted some data??
	contextt.inserted = "inserted some data?";
  });
  
  // insert dummy values with an array
  var contextt = {};
  var data = ['lighter weights', 20, 10, '2005-11-05', 'lbs'];
  pool.query("INSERT INTO todo (name, reps, weight, date, unit) VALUES (?, ?, ?, ?, ?)", data, function(err, result){
    if(err){
      next(err);
      return;
    }
  });
  contextt.inserted = "inserted some data with an array?";
  res.render('home.handlebars',contextt);
  console.log("insert successful?");
});

// POST - INSERT
app.post('/insert', function(req,res){
  
  // debugging
  console.log('post request received');
  console.log('post request body:');
  console.log(req.body);
  
  // insert into db
  var data = [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.unit];
  pool.query("INSERT INTO todo (name, reps, weight, date, unit) VALUES (?, ?, ?, ?, ?)", data, function(err, result){
    if(err){
      next(err);
      return;
    }
	else {
		console.log('insertion successful')
		console.log('inserted: ');
		console.log(data);
	};
  });
  
  // return all data
  var context = {};
  pool.query('SELECT * FROM todo', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    res.render('home.handlebars', context);
  });
});

// POST - DELETE
app.post('/delete', function(req,res){
  
  // debugging
  console.log('post request received');
  console.log('post request body:');
  console.log(req.body);
  
  // insert into db
  pool.query("DELETE FROM todo WHERE id = (?)", req.body.id, function(err, result){
    if(err){
      next(err);
	  console.log('deletion not successful');
      return;
    }
	else {
		console.log('deletion successful')
		console.log('deleted id: ' + req.body.id);
	};
  });
  
  // return all data
  var context = {};
  pool.query('SELECT * FROM todo', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    res.render('home.handlebars', context);
  });  
});

// GET - EDIT PAGE
app.get('/edit',function(req,res,next){
	
  // get id from GET Request
  console.log('req = ');
  console.log(req);
  console.log(req.query);
  var id = req.query.q;
  console.log('id = ' + id);
    
  // load the edit page w/ db entry
  var context = {};
  pool.query("SELECT * FROM todo WHERE id = (?)", [id], function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
	context.results = rows;
	console.log('manually printing results object to console');
	console.log(context.results);
	console.log('rendering the load-edit page');
	res.render('edit.handlebars',context);
  });
});

// GET - EDIT DATA
app.get('/get-edit',function(req,res,next){
	
  // get id from GET Request
  console.log('req = ');
  console.log(req);
  console.log(req.query);
  var id = req.query.q;
  console.log('id = ' + id);
    
  // load the edit page w/ db entry
  var context = {};
  pool.query("SELECT id, name, reps, weight, date_format(date, '%Y-%m-%d') as date, unit FROM todo WHERE id = (?)", [id], function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
	context.results = rows;
	console.log('manually printing results object to console');
	console.log(context.results);
	res.send(context);
  });
});

// POST - EDIT/UPDATE
app.post('/edit', function(req,res,next){
  
  // debugging
  console.log('post /edit request received');
  console.log('post /edit request body:');
  console.log(req.body);
  
  // UPDATE into db
  var data_to_update = [req.body.name, Number(req.body.reps), Number(req.body.weight), req.body.date, req.body.unit, req.body.id]
  console.log(data_to_update)
  pool.query("UPDATE todo SET name=?, reps=?, weight=?, date=?, unit=? WHERE id=? ", data_to_update, function(err, result){
    if(err){
      next(err);
      return;
    }
	console.log('update successful');
	console.log('updated id: ' + req.body.id);
	// res.send('0'); // send any response.
	res.render('edit.handlebars',{}); // Try this one too.
  });
});

*/

/*************************************************************************

		Error Handling
		
*************************************************************************/

app.use(function(req,res){
  res.status(404);
  res.sendFile('404-page-not-found.html', {root : __dirname});
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  //res.render('500.handlebars');
  console.log('500 error');
});


/*************************************************************************

		Server Startup Message
		
*************************************************************************/

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
