var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",
    password: "",
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
        connection.query("SELECT * FROM products WHERE ")
        if (res[answer.id].stock_quantity >= answer.quantity) {
            console.log(`
Congratulations. You've purchased ${answer.quantity} ${res[answer.id].product_name}(s)`)
        }
        else {
            console.log(`
Insufficient Quantity. We only have ${res[answer.id].stock_quantity} ${res[answer.id].product_name} in stock.`)
        }
    })
}