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
    main();
});

var main = () => {
    inquirer.prompt([
        {
            name: 'command',
            type: 'rawlist',
            message: "Please choose your command",
            choices: [
                'View Products for Sale',
                'View Low Inventory',
                'Add to Inventory',
                'Add New Product'
            ]
        }
    ]).then(function(answer) {
    
        switch(answer.command) {
            case 'View Products for Sale':
            showInventory();
            break;

            case 'View Low Inventory':
            showLowItems();
            break;

            case 'Add to Inventory':
            console.log('add to inventory');
            inquirer.prompt([
                {
                    name: 'id',
                    type: 'input',
                    message: 'Which item would you like to add? Please answer by item\'s id number. \n',
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
                addInventory(answer.id, answer.quantity);
            });
            break;

            case 'Add New Product':
            console.log('add new product');

            inquirer.prompt([
                {
                    name: 'product_name',
                    type: 'input',
                    message: 'What\'s the name of item would you like to add?',
                },
                {
                    name: 'department_name',
                    type: 'input',
                    message: 'Which depatment is this item at?',
                },
                {
                    name: 'price',
                    type: 'input',
                    message: 'How much is it per the item?',
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
                    message: 'How many of this item?',
                    validate: function(value) {
                        if (isNaN(value) === false) {
                        return true;
                        }
                        return false;
                    }
                }
            ]).then(function(answer) {
                addItem(answer.product_name, answer.department_name, answer.price, answer.quantity);
            });
            break;
        }
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

var showLowItems = () => {
    var query = 'select * from products where stock_quantity <= 200';
    connection.query(query, function(err, res) {
        if (err) throw err;
        // console.log(res);
        console.log('The low number item in inventory are: \n');
        for (i=0; i < res.length; i++) {
            var item = res[i];
            console.log(item.id + ': ' + item.product_name + ', ' + item.stock_quantity + '.');
        };
    });
}

var addInventory = (id, quantity) => {
    var query = 'select * from products where id = ' + id;
    connection.query(query, function(err, res) {
        if (err) throw err;
        // console.log(res);
        // console.log(quantity);
        var addition = parseInt(quantity);
        var newQuan = res[0].stock_quantity + addition;
        // console.log(newQuan);
        if(quantity >= 0) {
            connection.query("UPDATE products SET ? WHERE ?", [
                {
                    stock_quantity: newQuan
                },
                {
                    id: id
                }
            ], function(err, res) {
                if(err) throw err;
                console.log('Table is updated!');
                // console.log(res);
            })
        } else {
            console.log('Your input is invalid.');
        }
    }); 
}

var productName = '';
var departmentName ='';
var addItem = (product_name, department_name, price, stock_quantity) => {
    productName = product_name;
    departmentName = department_name;
    var pr = parseFloat(price).toFixed(2)
    // var quan = parseInt(stock_quantity);

    console.log('The item trying to insert is: ' + productName, departmentName, pr, stock_quantity);
    var query = 'insert into products (product_name, department_name, price, stock_quantity) value ("'+productName+'", "'+departmentName+'", '+pr+', '+stock_quantity+')';
    connection.query(query, function(err, res) {
        if (err) throw err;
        // console.log(res);
        // console.log(res.affectedRows);
        console.log('item is inserted w/');
    }); 
}
