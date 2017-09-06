const inquirer = require('inquirer');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

function customer() {
    
    connection.connect();
    
    connection.query('SELECT * FROM PRODUCTS', function (error, results, fields) {
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
            askCustomerForId();
    
      });
       
    // connection.end();
}

function askCustomerForId(){
    inquirer.prompt([
        {
            name: 'product_id',
            message: 'Please enter the ID of the product you would like to purchase'
            // validate: function (input) {
            //     var done = this.async();
            
            //     setTimeout(function () {
            //     if (typeof input !== 'number') {
            //         done('You need to provide a number');
            //         return;
            //     }
            //     done(null, true);
            //     }, 3000);
            // }
        }

    ]).then( function (answer) {
        askCustomForQuanity(answer.product_id);
    })
}

function askCustomForQuanity(id) {
    inquirer.prompt([
        {
            name: 'quanity',
            message: 'How many would you like to buy?'
        }
    ]).then( function (quanity) {
        
        connection.query('SELECT * FROM PRODUCTS WHERE item_id=' + id, function (error, results, fields) {
            if (error) throw error;
            if (quanity.quanity > results[0].stock_quanity) {
                console.log('Not enough in stock!');
            } else {
                let totalPrice = quanity.quanity * results[0].price;
                console.log("You've purchased " + quanity.quanity + " " + results[0].product_name + "s costing a total of $" + totalPrice);
                updateQuanity(id, results[0].stock_quanity, quanity.quanity);
            }

          });
    });
}

function updateQuanity(id, current_stock, quanity_need) {
    connection.query('UPDATE PRODUCTS SET stock_quanity =' + (current_stock - quanity_need) + ' WHERE item_id =' + id, function (error, results, fields) {
        if (error) throw error;
    });

    connection.end();
}

customer();