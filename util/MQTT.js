const mqtt = require('mqtt')

let MQTTconfig = {
    port: 1883,
    clientId: "Nodejs"
}



const client = mqtt.connect("mqtt://mqtt.eclipseprojects.io",MQTTconfig)

const topicHome = 'Home'

client.on('connect',() => {
    client.subscribe(topicHome,(err) => {
        console.log(err)
    })

    client.publish(topicHome,'Connected')
})

