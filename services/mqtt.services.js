// connect mqtt server
const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://localhost:1883', {
    username: 'minisong',
    password: 'qwe789'
})
// valiables

//connect to mqtt broker & subscribe
client.on('connect', function () {
    console.log('MQTT client connected')
    // catch devices permission
    setInterval(() => {
        messagePublished = false
        client.subscribe('Lynx/permission')
    
    }, 1000);
})
//connection error
client.on('error', function (error) {
    console.log(error)
})
// Receive message
client.on('message', function (topic, message) {
    
})