const sqlite3 = require('sqlite3').verbose();
let db = null

function connect() {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database('./data/lynx.db', (err) => {
            if (err) {
                console.error(err.message);
                reject(err)
            }
            console.log('Connected to the etneca database.');
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

async function addIncomingMessage(data) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO incoming(app_id, message, incoming_timestamp) VALUES(?,?,?)`    
        const params = [data.app_id, data.message, data.incoming_timestamp]
        db.run(sql, params, function (err) {
            if (err) {
                console.error(err.message);
                reject(err)
            }
            // get the last insert id
            resolve(this.lastID)
        });
    });
}


async function addOutgoingMessage(data) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO outgoing(app_id, message, outgoing_timestamp) VALUES(?,?,?)`
        const params = [data.app_id, data.message, data.outgoing_timestamp]
        db.run(sql, params, function (err) {
            if (err) {
                console.error(err.message);
                reject(err)
            }
            // get the last insert id
            resolve(this.lastID)
        });
    });
}

// GET incoming message by timestamp
async function getIncomingMessage(appId, searchTimestamp) {
    return new Promise((resolve, reject) => {
        sql = `SELECT * FROM incoming WHERE app_id = ? and incoming_timestamp >= ?`
        db.all(sql, [appId, searchTimestamp], (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows)
            console.log(rows);
            
        });
    });
}

// GET outgoing message by timestamp
async function getOutgoingMessage() {
    return new Promise((resolve, reject) => {
        sql = `SELECT * FROM outgoing WHERE sent_timestamp is NULL`
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows)
        });
    });
}
//function get satellite Sat ID
async function checkInSatellite() {
    return new Promise((resolve, reject) => {
        const sql = `SELECT sat_id FROM satellite WHERE id =(SELECT MAX(id) FROM satellite)`
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }   
            var message = resolve(rows)
            console.log(rows);
            
        });
    });
}
//function set Sat ID
async function addSatellite(satID) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO satellite(sat_id) VALUES('${satID}')`
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
            }   
            var message = resolve(rows)
            console.log(rows);
            
        });
    });
}
async function setSentTimestamp(message) {    
    return new Promise((resolve, reject) => {
        const sql = `UPDATE outgoing SET sent_timestamp = ? WHERE id = ?`
        console.log(JSON.stringify(message));
        const params = [Date.now(), message.id]
        db.run(sql, params, function (err) {
            if (err) {
                console.error(err.message);
                reject(err)
            }
            // get the last insert id
            resolve(this.changes)
        });
    });
}
// set VMS message
async function setVMSMessage(vms){
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO vms(date,vms_message) VALUES(${vms.date},'${vms.message}')`
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
            }   
            var message = resolve(rows)
            console.log(rows);
            
        });
    });
}

module.exports = {
    checkInSatellite,
    addIncomingMessage,
    addOutgoingMessage,
    getIncomingMessage,
    getOutgoingMessage,
    setSentTimestamp,
    addSatellite,
    setVMSMessage,
    connect,
    close
}