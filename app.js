let mqtt = require('mqtt')
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
// Import the functions you need from the SDKs you need

const {initializeApp} = require("firebase/app")
const { getDatabase, ref,set, onValue, update } = require("firebase/database")

const mainRouter = require('./routes/main')

//update variable
let updating = false

const firebaseConfig = {
    apiKey: "AIzaSyC0KeezZB68slMRpvCWTOErT0ndCBx4iJk",
    authDomain: "dht-home-b0439.firebaseapp.com",
    databaseURL: "https://dht-home-b0439-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "dht-home-b0439",
    storageBucket: "dht-home-b0439.appspot.com",
    messagingSenderId: "1030501109314",
    appId: "1:1030501109314:web:adef68673277eb03c6e7db",
    measurementId: "G-2Z930YPYD2"
};

  
  // Initialize Firebase
const FBapp = initializeApp(firebaseConfig);
const RTDB = getDatabase(FBapp);

const lightRef = ref(RTDB,'Lights')
const fanRef = ref(RTDB,'Fans')
const sensorRef = ref(RTDB,'Sensor')
const alarmRef = ref(RTDB,'Alarms')
const cardRef = ref(RTDB,'cards')



let MQTTconfig = {
      port: 1883,
      clientId: "Nodejs"
}
  
const SubTopic = "HomeTopicPub"

const PubTopic = 'HomeTopicSub'

const lightList = ['BedRoom','LivingRoom','Kitchen']

const fanList = ['BedRoom','Kitchen']

const app = express()
  
const db = getDatabase();
  
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views'));
  
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const client = mqtt.connect("mqtt://mqtt.eclipseprojects.io",MQTTconfig)


function publishMessage(Client,type,data) {
    let payload = {}
    payload.type = type
    payload.status = data

    console.log(payload)

    Client.publish(PubTopic,JSON.stringify(payload))
}

client.on('connect', () => {
    console.log('connected')
    client.subscribe(SubTopic)
    // client.publish('HomeTopic','Connected')
    // publishMessage(client,"Connected",true)
})


function setLight(type,room,status){
    let payload = {}
    payload.type = type
    payload.room = room
    payload.status = status
    console.log(payload)
    client.publish(PubTopic,JSON.stringify(payload))
}

// const lightRef = ref(RTDB,'Lights')
// const fanRef = ref(RTDB,'Fans')
// const sensorRef = ref(RTDB,'Sensor')
// const alarmRef = ref(RTDB,'Alarms')


onValue(cardRef,(snapshoot) => {
    if (updating) {
        updating = false
        return
    }
    if (snapshoot.exists()) {
        const cardList = snapshoot.val()
        console.log(cardList)
        let payload = {}

        payload.type = 'card'
        payload.id = cardList

        client.publish(PubTopic,JSON.stringify(payload))
    }
})





client.on('message',(topic,payload) => {
    const payloadString = payload.toString()
    console.log('String: ',payloadString)
    const payloadJSON = JSON.parse(payloadString)
    console.log('Payload: ',payloadJSON)
    // console.log(payloadString)
    let updates = {}
    updating = true
    let Ref
    switch (payloadJSON.type) {
        case 'light':
            updates[`/${payloadJSON.room}`] = payloadJSON.status
            console.log(updates)
            Ref = lightRef 
            break;
        case 'fan':
            updates[`/${payloadJSON.room}`] = payloadJSON.status
            console.log(updates)
            Ref = fanRef
            break;
        case 'card':
            updates = payloadJSON.id
            console.log(updates)
            Ref = cardRef
            break;
        case 'sensor':
            updates['/Temperature'] = payloadJSON.Temperature
            updates['/Humidity'] = payloadJSON.Humidity
            console.log(updates)
            Ref = sensorRef
            break;
    }

    update(Ref,updates)
    .then(updating = false)
    .catch(err => console.log(err))

})



onValue(lightRef,(snapshoot) => {
    if (updating) {
        updating = false
        return
    }
    if (snapshoot.exists()) {
        const lightVal = snapshoot.val();
        console.log(lightVal)

        lightList.forEach(room => {
            console.log(room)
            // console.log(lightVal[room])
            setLight('light',room,lightVal[room])
        });
    }
})


onValue(fanRef,(snapshoot) => {
    if (updating) {
        updating = false
        return
    }
    if (snapshoot.exists()) {
        const fanVal = snapshoot.val();
        console.log(fanVal)

        fanList.forEach(room => {
            console.log(room)
            console.log(fanVal[room])
            setLight('fan',room,fanVal[room])
        });
    }
})


app.listen(8080, () => {
    console.log('Connected')
})