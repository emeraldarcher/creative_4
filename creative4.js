// BASE SETUP
// =============================================================================
"use strict";

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');
var cors = require('cors');
var https = require('https');
var path = require('path');
var fs = require('fs');
var mortgageCalculator = require('mortgage-calculator');

// configure app
app.use(morgan('dev')); // log requests to the console

// CORS
app.use(cors());

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 3015; // set our port

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html', { root: path.join(__dirname, './public') });
});

// on routes that end in /mortgage
// ----------------------------------------------------
router.route('/api/mortgage')
	.post(function(req, res) {
		var deposit = parseInt(req.body.initialDeposit);
		var income = parseInt(req.body.monthlyIncome);
		var interest = parseInt(req.body.interest);
		var term = parseInt(req.body.term);
		var expenses = parseInt(req.body.monthlyExpenses);

		var options = {
                        "initialDeposit": deposit,
                        "monthlyIncome": income,
                        "interest": interest,
                        "term": term,
                        "monthlyExpenses": expenses
                }

		var info = mortgageCalculator.calculateMortgage(options);

		res.json(info);
	});

app.use('/', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
