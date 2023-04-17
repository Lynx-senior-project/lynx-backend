const sqlite = require('./sqlite.services')
const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://localhost:1883', {
    username: 'minisong',
    password: 'qwe789'
})
var messagePublished = false;
let serviceInterval = null
let hasResponse = []
const startSevices= async () => {
    await sqlite.connect()
    // sqlite.createRequestToPairTable()
    client.on('connect', function () {
        console.log('MQTT client connected')
        // catch devices permission
    })
    client.on('error', function (error) {
        console.log(error)
    })
    serviceInterval = setInterval(async() => {
        messagePublished = false
        client.subscribe('Lynx/permission')
        
        hasResponse = await sqlite.getDeviceHasResponse()
        if(hasResponse.lenght != 0){
            for(var i=0;i<hasResponse.length;i++){
                console.log(`hasResponse:${i+1}:${hasResponse[i].device_id},${hasResponse[i].response}`);
                var topicResponseDevice = `Lynx/permission/${hasResponse[i].device_id}`
                var messageRespnseDevice = hasResponse[i].response
                publishMessage(topicResponseDevice,messageRespnseDevice)
                if(hasResponse[i].response == 'true'){
                    client.subscribe(`Lynx/${hasResponse[i].device_id}`)
                }
                await sqlite.deleteSentResponse(hasResponse[i].device_id).then(console.log(`✨successfully`))
            }
        }
        
    }, 3000);
    client.on('message', function (topic, message) {
        console.log(`${topic}:${message.toString()}`);
        if(topic == 'Lynx/permission'){
            var stringMessage = message.toString()
            var json = JSON.parse(stringMessage)
            sqlite.insertRequestToPair(json)
        }
    })

}
function subscribeTopic(){

}

function publishMessage(topic,message){
    if (!messagePublished) {
        console.log(`${topic}`);
        client.publish(`${topic}`, message)
        messagePublished = true
    }
}

module.exports = {
    startSevices,
}
