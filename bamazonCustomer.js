var mysql = require("mysql");
var inquirer = require("inquirer");
var totalCost;

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",
    password: "potpourrigizmo",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start();
});

function start() {
    connection.query("SELECT id, product_name, price FROM products", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(`
------------------------------------------------------------------------------------------
ID: ${res[i].id} | ${res[i].product_name} | Price: ${res[i].price}`)}
    userPrompt();
    })
}

function userPrompt() {
    inquirer
      .prompt([
          {
          name: "id",
          type: "input",
          message: "Which id number would you like to purchase?",
          validate: function(value) {
              if (isNaN(value) === false) {
                  return true;
              }
              return false;
          }},
          {
          name: "quantity",
          type: "input",
          message: "How many would you like to buy?",
          validate: function(value) {
              if (isNaN(value) === false) {
                  return true;
              }
              return false;
          }
        }
    ])
    .then(function(answer) {
        connection.query(`SELECT id, product_name, price, stock_quantity FROM products WHERE id = ${answer.id}`, function(err, res) {
            if (err) throw err;
        
        if (parseInt(res[0].stock_quantity) >= parseInt(answer.quantity)) {
            totalCost = answer.quantity * res[0].price
            console.log(`
Congratulations. You've purchased ${answer.quantity} ${res[0].product_name}(s). Your total is $${totalCost}`)
        }
        else {
            console.log(`
Insufficient Quantity. We only have ${res[0].stock_quantity} ${res[0].product_name} in stock.`);
            userPrompt();
        }
    })
    })
}