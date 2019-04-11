var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",
    password: "potpourrigizmo",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;

    console.log("connect as id: " + connection.threadId);
    managerPrompt();
})

function managerPrompt() {
    inquirer
        .prompt({
            name: "managerFunction",
            type: "list",
            message: "Greetings Boss. What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add More Inventory", "Add New Product", "Exit"]
        })
        .then(function (answer) {
            // each of the choices will link to a different function, switch statement to route
            switch (answer.managerFunction) {
                case "View Products for Sale":
                    displayInventory()
                    break;
                case "View Low Inventory":
                    lowInventory()
                    break;
                case "Add More Inventory":
                    resupply()
                    break;
                case "Add New Product":
                    createProduct()
                    break;
                case "Exit":
                    endConnection()
                    break;
            }
        })
}

function displayInventory() {
    // query the database to display all of the products and their info
    connection.query(`SELECT id, product_name, price, stock_quantity FROM products`, function(err, res) {
        if (err) throw err;
        // run through the results and display them to the console
        res.forEach(function(product) {
            console.log(`
------------------------------------------------------------------------------------------
ID: ${product.id} | ${product.product_name} | Price: ${product.price} | Quantity ${product.stock_quantity}`)
        })
    })
    endConnection();
}



function endConnection() {
    connection.end();
}