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
async function createRequestToPairTable() {
    return new Promise((resolve, reject) => {
        const sql = `CREATE TABLE ask_pair(device_id VARCHAR(255) NOT NULL, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, response VARCHAR(15))`
        // const params = [data.app_id, data.message, data.incoming_timestamp]
        db.run(sql, function (err, rows) {
            if (err) {
                console.error(err.message);
                reject(err)
            }
            resolve(rows)

        });
    });
}
//Create Table device
async function createDeviceTable() {
    return new Promise((resolve, reject) => {
        const sql = `CREATE TABLE devices(device_id VARCHAR(255) NOT NULL, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)`
        // const params = [data.app_id, data.message, data.incoming_timestamp]
        db.run(sql, function (err, rows) {
            if (err) {
                console.error(err.message);
                reject(err)
            }
            resolve(rows)

        });
    });
}
// Create table data
async function createDataTable() {
    return new Promise((resolve, reject) => {
        const sql = `CREATE TABLE data(device_id VARCHAR(255) NOT NULL,timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, data VARCHAR(60))`
        // const params = [data.app_id, data.message, data.incoming_timestamp]
        db.run(sql, function (err, rows) {
            if (err) {
                console.error(err.message);
                reject(err)
            }
            resolve(rows)

        });
    });
}

// Insert Table ask_pair
async function insertRequestToPair(data) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO ask_pair(device_id, timestamp) VALUES(?,?)`
        const params = [data.id, data.timestamp]
        db.run(sql, params, function (err) {
            if (err) {
                console.error(err.message);
                reject(err)
            }
            resolve(true)
        });
    });
}
// Insert Table devices
async function insertDevice(data) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO devices(device_id, timestamp) VALUES(?,?)`
        const params = [data.id, data.timestamp]
        db.run(sql, params, function (err) {
            if (err) {
                console.error(err.message);
                reject(err)
            }
            resolve(true)
        });
    });
}

// Insert Table data
async function insertData(data) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO data(device_id, timestamp,data) VALUES(?,?,?)`
        const params = [data.id, data.timestamp, data.data]
        db.run(sql, params, function (err) {
            if (err) {
                console.error(err.message);
                reject(err)
            }
            resolve(true)
        });
    });
}

// Select all: user get devices that ask to pair
async function getRequestToPair() {
    return new Promise((resolve, reject) => {
        const sql = `SELECT device_id, timestamp FROM ask_pair WHERE response IS NULL`
        db.all(sql, function (err, rows) {
            if (err) {
                console.error(err.message);
                reject(err)
            }
            resolve(rows)
            //console.log(rows);
        });
    });
}
// Select response not null: get devices id that had response back
async function getDeviceHasResponse() {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM ask_pair WHERE response IS NOT NULL`
        db.all(sql, function (err, rows) {
            if (err) {
                console.error(err.message);
                reject(err)
            }
            resolve(rows)
            //console.log(rows);
        });
    });
}

// Select response not null: get devices id that had response back
async function checkPairDevice(id) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT COUNT(*) FROM devices WHERE device_id = ?`
        const params = [id]
        db.run(sql, params, function (err, rows) {
            if (err) {
                console.error(err.message);
                return false
            }
            resolve(rows)
            console.log(typeof rows);

        });
    });
}

// Select response not null: get devices id that had response back
async function getDataDevice(id) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM data WHERE device_id = ? ORDER BY timestamp DESC LIMIT 1`
        const params = [id]
        db.all(sql, params, function (err, rows) {
            if (err) {
                console.error(err.message);
                return false
            }
            resolve(rows)
            console.log(rows);

        });
    });
}

// GET data from device
async function getDevice() {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM devices `
        db.all(sql, function (err, rows) {
            if (err) {
                console.error(err.message);
                reject(err)
            }
            resolve(rows)
            //console.log(rows);
        });
    });
}

// GET data from device
async function getDataFromDevice(device, timestamp) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM data WHERE device_id = ? AND timestamp >= ?`
        const params = [device, timestamp]
        db.all(sql, params, function (err, rows) {
            if (err) {
                console.error(err.message);
                reject(err)
            }
            resolve(rows)
            //console.log(rows);
        });
    });
}

// Update statement: user response back
async function updateResponse(data) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE ask_pair SET response = ? WHERE device_id = ?`
        const params = [data.response, data.device_id]
        db.run(sql, params, function (err, rows) {
            if (err) {
                console.error(err.message);
                reject(err)
            }
            resolve(rows)
            //console.log(rows);
        });
    });
}
// Delete statement: when we already send response to device
async function deleteSentResponse(device_id) {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM ask_pair WHERE device_id ='${device_id}'`
        db.run(sql, function (err, rows) {
            if (err) {
                console.error(err.message);
                reject(err)
            }
            resolve(rows)
            //console.log(rows);
        });
    });
}

async function clearTable(table) {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM ${table}`
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows)
            //console.log(rows);

        });
    });
}
async function deleteTable(table) {
    return new Promise((resolve, reject) => {
        const sql = `DROP TABLE ${table}`
        db.run(sql, function (err, rows) {
            if (err) {
                reject(err);
            }
            resolve()
            console.log("Dropsuccesfully");
        });
    });
}
// const table_name = 'ask_pair'
// const id = 'temp2'
// connect()
// getDataDevice(id)
// close()
module.exports = {
    getDataDevice,
    getDataFromDevice,
    checkPairDevice,
    connect,
    close,
    createRequestToPairTable,
    insertRequestToPair,
    getRequestToPair,
    updateResponse,
    getDeviceHasResponse,
    deleteSentResponse,
    getDevice,
    insertDevice,
    insertData,

}