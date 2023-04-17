const sqlite3 = require('sqlite3').verbose();
let db = null
function connect() {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database('.../../data/lynx.db', (err) => {
            if (err) {
                console.error(err.message);
                reject(err)
            }
            console.log('Connected to the lynx database.');
            resolve(db)
        });
    });
}
function close() {
    return new Promise((resolve, reject) => {
        db.close((err) => {
            if (err) {
                console.error(err.message);
                reject(err)
            }
            console.log('Close the database connection.');
            resolve(db)
        });
    });
}
//Create Table ask_pair
async function createRequestToPairTable(){
    return new Promise((resolve, reject) => {
        const sql = `CREATE TABLE ask_pair(device_id VARCHAR(255) NOT NULL, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, response VARCHAR(15))`    
        // const params = [data.app_id, data.message, data.incoming_timestamp]
        db.run(sql, function (err,rows) {
            if (err) {
                console.error(err.message);
                reject(err)
            }
            resolve(rows)
            
        });
    });
}
// INsert Table ask_pair
async function insertRequestToPair(data){
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO ask_pair(device_id, timestamp) VALUES(?,?)`    
        const params = [data.id, data.timestamp]
        db.run(sql, params,function (err) {
            if (err) {
                console.error(err.message);
                reject(err)
            }
            resolve(true)
        });
    });
}
// Select all: user get devices that ask to pair
async function getRequestToPair(){
    return new Promise((resolve, reject) => {
        const sql = `SELECT device_id, timestamp FROM ask_pair WHERE response IS NULL`    
        db.all(sql,function (err,rows) {
            if (err) {
                console.error(err.message);
                reject(err)
            }
            resolve(rows)
            console.log(rows);
        });
    });
}
// Select response not null: get devices id that had response back
async function getDeviceHasResponse(){
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM ask_pair WHERE response IS NOT NULL`    
        db.all(sql,function (err,rows) {
            if (err) {
                console.error(err.message);
                reject(err)
            }
            resolve(rows)
            console.log(rows);
        });
    });
}
// Update statement: user response back
async function updateResponse(data){
    return new Promise((resolve, reject) => {
        const sql = `UPDATE ask_pair SET response = ? WHERE device_id = ?` 
        const params = [data.response, data.device_id]   
        db.run(sql,params,function (err,rows) {
            if (err) {
                console.error(err.message);
                reject(err)
            }
            resolve(rows)
            console.log(rows);
        });
    });
}
// Delete statement: when we already send response to device
async function deleteSentResponse(device_id){
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM ask_pair WHERE device_id ='${device_id}'`   
        db.run(sql,function (err,rows) {
            if (err) {
                console.error(err.message);
                reject(err)
            }
            resolve(rows)
            console.log(rows);
        });
    });
}

async function clearTable(table){
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM ${ask_pair}`
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
            }   
            resolve(rows)
            console.log(rows);
            
        });
    });
}
async function deleteTable(table){
    return new Promise((resolve, reject) => {
        const sql = `DROP TABLE ${table}`    
        db.run(sql, function (err,rows) {
            if (err) {
                reject(err);
            }
            resolve()
            console.log("Dropsuccesfully");
        });
    });
}
const table_name = 'ask_pair'
// connect()
// createRequestToPairTable()
// close()
module.exports = {
    connect,
    close,
    createRequestToPairTable,
    insertRequestToPair,
    getRequestToPair,
    updateResponse,
    getDeviceHasResponse,
    deleteSentResponse,

}