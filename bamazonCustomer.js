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
            askCustomer();
    
      });
       
    connection.end();
}

function askCustomer(){
    inquirer.prompt([
        {
            name: 'product',
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

    })
}

customer();