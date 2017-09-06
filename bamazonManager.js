const mysql = require('mysql');
const inquirer = require('inquirer');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

function viewProduct() {
    inquirer.prompt([
        {
            name: 'view_inventory',
            message: 'Choose the list you want to view.',
            type: 'list',
            choices: ['View all products', 'View low inventory', 'Add inventory', 'Add new product']
        }
    ]).then( function (inventory) {
        console.log(inventory.view_inventory);
        switch (inventory.view_inventory) {
            case 'View all products':
                viewAllInventory();
            break;
            case 'View low inventory':
                viewLowInventory();
            break;
            case 'Add inventory':
                addInventory();
            break;
            case 'Add new product':
                addProduct();
            break;
        }

    });
}

function printer(error, results) {
    if (error) throw error;
    for (let item in results) {
        console.log(
            'ID:', results[item].item_id,
            '| ', 'Name:', results[item].product_name, 
            '| ', 'Department:', '| ', results[item].department_name, 
            '| ', 'Price:', results[item].price, 
            '| ', 'Stock:', results[item].stock_quanity
        );
        console.log('/--------------------------------------------------------------------------/');
    } 
}

function viewAllInventory() {

    connection.connect();

    connection.query('SELECT * FROM PRODUCTS', function (error, results, fields) {
        printer(error, results);
    });

    connection.end();
}

function viewLowInventory() {

    connection.connect();

    connection.query('SELECT * FROM PRODUCTS WHERE stock_quanity<=3', function (error, results, fields) {
        printer(error, results);
    });  
    
    connection.end();
}

function addProduct() {

    inquirer.prompt([
        {
            name: 'product_name',
            message: 'What is the name of the product?'
        },
        {
            name: 'department_name',
            message: 'What department does the product belong in?'
        },
        {
            name: 'price',
            message: 'What is the price of the product?'
        },
        {
            name: 'inventory',
            message: 'How much of the product will there be?'
        }
    ]).then( function (new_product) {

        connection.connect();

        connection.query(
            "INSERT INTO PRODUCTS SET ?",
            {
                product_name: new_product.product_name,
                department_name: new_product.department_name,
                price: new_product.price,
                stock_quanity: new_product.inventory
            }, 
            function (error, results, fields){
            if (error) throw error;
            console.log('New product added!');
        });

        connection.end();


    });

}

function addInventory() {

    connection.connect();

    connection.query('SELECT * FROM PRODUCTS', function (error, results, fields) {

        inquirer.prompt([
            {
                name: 'product_name',
                message: 'Which product would you like to add inventory for?',
                type: 'list',
                choices: function () {
                    let productList = [];
                    for (let item in results){
                        productList.push(results[item].product_name);
                    }
                    console.log(productList);
                    return productList;
                }
            }
        ]).then( function(choice) {

            connection.query(
                'SELECT stock_quanity FROM PRODUCTS WHERE ?',
                {
                    product_name: choice.product_name
                },
                function (error, results, fields) {
                    if (error) throw error;
                    let currentInventory = results[0].stock_quanity;
                    console.log(currentInventory);

                    inquirer.prompt([
                        {
                            name: 'amount',
                            message: 'How much do you want to add?'
                        }
                    ]).then( function (amount) {
                        let newAmount = parseFloat(currentInventory) + parseFloat(amount.amount);
                        connection.query(
                            'UPDATE PRODUCTS SET stock_quanity=' + newAmount + ' WHERE ?',
                            {
                                product_name: choice.product_name
                            },
                            function (error, results, fields) {
                                if (error) throw error;
                                console.log('Inventory Updated!');
                            }
                        );

                        connection.end();
                    });
                }
            );
        });
    });    
}


viewProduct();