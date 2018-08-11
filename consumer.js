var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user:'root',
    password: 'root',
    database:'takazon'
});

connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    main();
});

var main = function() {
    showInventory();
    inquirer.prompt([
        {
            name: 'id',
            type: 'input',
            message: 'What item would you like to buy? Please answer by item\'s id number. \n',
            validate: function(value) {
                if (isNaN(value) === false) {
                return true;
                }
                return false;
            }
        },
        {
            name: 'quantity',
            type: 'input',
            message: 'How many?',
            validate: function(value) {
                if (isNaN(value) === false) {
                return true;
                }
                return false;
            }
        }
    ]).then(function(answer) {
        var query = 'select id, product_name, stock_quantity from products where ?';
        connection.query(query, { id: answer.id }, function(err, res) {
            if (err) throw err;

            if (res[0].stock_quantity >= answer.quantity) {
                console.log('Purchase is proceeding...');
                // console.log(res[0].stock_quantity);
                updateTable(answer.quantity, res[0].id);
            } else {
                console.log('Sorry, there\'s no sufficient quantity of the item.');
                console.log('The quantity available is: ' + res[0].stock_quantity + '. \n');
                main();
            }
        });
    });

    process.on( 'SIGINT', function() {
        console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
        connection.end();
        process.exit();
    })
};


var updateTable = (quantity, id) => {
    connection.query('select * from products where id = ' + id, function(err, res) {
        if (err) throw err;
        console.log(res);
        var purchase = res[0].price * quantity;
        var newQuan = res[0].stock_quantity - quantity;
        
        connection.query("UPDATE products SET ? WHERE ?", [
            {
                stock_quantity: newQuan
            },
            {
                id: id
            }
        ], function(err, res) {
            if(err) throw err;
            console.log('Update succeeded!');
            // console.log(res);
        })
        return console.log('Your order is proceeded. The total is : $' + purchase +'\nThank you!');
    })
    // connection.end();
}

var idOfProduct = () => {
    var query = 'select id, product_name, from products';
    connection.query(query, function(err, res) {
        if (err) throw err;
        for (i=0; i < res.length; i++) {
            var item = res[i];
            console.log(item.id + ': ' + item.product_name);
            
        };
    });
}

var showInventory = () => {
    var query = 'select id, product_name, price, stock_quantity from products';
    connection.query(query, function(err, res) {
        if (err) throw err;
        // console.log(res);
        console.log('The items available in inventory are: \n');
        for (i=0; i < res.length; i++) {
            var item = res[i];
            console.log(item.id + ': ' + item.product_name + ', ' + item.stock_quantity + ' by ' + '$' + item.price);
        };
    });
}

