var mysql = require("mysql");
var inquirer = require("inquirer");
var currInv;

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
    connection.query(`SELECT id, product_name, price, stock_quantity FROM products`, function (err, res) {
        if (err) throw err;
        // run through the results and display them to the console
        res.forEach(function (product) {
            console.log(`
------------------------------------------------------------------------------------------
ID: ${product.id} | ${product.product_name} | Price: ${product.price} | Quantity ${product.stock_quantity}`)
        })
    })
    // end connection here for now, trying to decide how I want these all to move together
    endConnection();
}

function lowInventory() {
    // query the database for products with inventory less than 5
    connection.query(`SELECT id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5`, function (err, res) {
        if (err) throw err;
        // run through results and display to the console
        res.forEach(function (product) {
            console.log(`
------------------------------------------------------------------------------------------
ID: ${product.id} | ${product.product_name} | Price: ${product.price} | Quantity ${product.stock_quantity}`)
        })
    })
    // and then end the connection here for now while I decide how I want to have them move together
    endConnection();
}

function resupply() {
    connection.query(`SELECT * FROM products`, function (err, response) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "id",
                    type: "input",
                    message: "Which id has low inventory that we should increase?",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "How much would you like to increase the inventory?",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                }
            ])
            .then(function (answer) {
                connection.query(`UPDATE products SET ? WHERE id = ${answer.id}`,
                [
                    {
                        // was having an issue getting this math to work
                        //  because the position of the id I need isn't in it's own id number location in the array
                        stock_quantity: parseInt(response[answer.id - 1].stock_quantity) + parseInt(answer.quantity)
                    },
                ]);
                console.log("Inventory Added!")
                endConnection();
            });
    });
};

function createProduct() {
    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "What is the name of the product you would like to add?"
            },
            {
                name: "dept",
                type: "input",
                message: "Which department is the product a part of?"
            },
            {
                name: "price",
                type: "input",
                message: "What should the price be?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "quantity",
                input: "input",
                message: "How much stock should we start out with?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function(answer) {
            connection.query(`INSERT INTO products (product_name, department_name, price, stock_quantity)
            VALUES("${answer.name}", "${answer.dept}", ${answer.price}, ${answer.quantity})`, function(err, res) {
                if (err) throw err;
                console.log(`New Product Added! ${answer.quantity} units of ${answer.name} at ${answer.price} each!`)
            })
            endConnection();
        });
}


function endConnection() {
    connection.end();
}