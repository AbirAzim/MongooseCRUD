const fs = require('fs');

fs.readFile('data/products.json', 'utf8', (data, err) => {
    if (!err) {
        console.log(JSON.parse(data));
    } else console.log(err);
})