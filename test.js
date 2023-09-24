const sqlite3 = require('sqlite3').verbose();
db = new sqlite3.Database('./data/lynx.db', (err) => {
    if (err) {
        console.log(`${err}`);
        
    }
    console.log('Connected to the lynx database.');
});