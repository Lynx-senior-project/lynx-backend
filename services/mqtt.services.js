// connect mqtt server
const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://localhost:1883', {
    username: 'minisong',
    password: 'qwe789'
})

//connect to mqtt broker
client.on('connect', function () {
    console.log('MQTT client connected')
    // catch devices permission
    setInterval(() => {
        messagePublished = false
        client.subscribe('Lynx/permission')
    
    }, 1000);
})