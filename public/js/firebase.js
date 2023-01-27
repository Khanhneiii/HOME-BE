import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";

import { getDatabase, ref, onValue,get, push, update, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

let livingLight = document.getElementById('living-room-light')
let bedLight = document.getElementById('bed-room-light')
let kitchenLight = document.getElementById('kitchen-light')

let bedFan = document.getElementById('bed-room-fan')
let kitchenFan = document.getElementById('kitchen-fan')

let progressBarTemp = document.querySelector(".circular-progress-temperature");
      let valueContainerTemp = document.querySelector(".value-container-temperature");

      let progressValueTemp
      let progressEndValueTemp
      let speed = 50;


      
      let progressBarHumid = document.querySelector(".circular-progress-humidity");
      let valueContainerHumid = document.querySelector(".value-container-humidity");

      let progressValueHumid
      let progressEndValueHumid


      let HumidityProgress
      let TemperatureProgress



let motionText = document.getElementById('motion-text')
let gasText = document.getElementById('gas-text')

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
  const app = initializeApp(firebaseConfig);
  // const analytics = getAnalytics(app);

  const RTDB = getDatabase(app)

const lightRef = ref(RTDB,'Lights')
const fanRef = ref(RTDB,'Fans')
const sensorRef = ref(RTDB,'Sensor')
const alarmRef = ref(RTDB,'Alarms')

// get(lightRef)
// .then(snapshot => {
//   if (snapshot.exists()) {
//     console.log(snapshot.val());
//   } else {
//     console.log("No data available");
//   }
// }).catch((error) => {
//   console.error(error);
// })



function updateLightStatus(light) {
  get(lightRef)
  .then(snapshot => {
    if (snapshot.exists()) {
      let lightData = snapshot.val();
      console.log(lightData)
      let idxData = 'Kitchen'
      if (livingLight === light) {
        idxData = 'LivingRoom'
      }
      else if (bedLight === light) {
        idxData = 'BedRoom'
      }
      if (light.checked) {
        lightData[idxData] = true;
      }
      else {
        lightData[idxData] = false;
      }
      update(lightRef,lightData)
      .then(console.log('Updated'))
      .catch(err => console.log(err))
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  })
}

function updateFanStatus(fan) {
  get(fanRef)
  .then(snapshot => {
    if (snapshot.exists()) {
      let fanData = snapshot.val();
      console.log(fanData)
      let idxData = 'Kitchen'
      if (bedFan === fan) {
        idxData = 'BedRoom'
      }
      if (fan.checked) {
        fanData[idxData] = true;
      }
      else {
        fanData[idxData] = false;
      }
      update(fanRef,fanData)
      .then(console.log('Updated'))
      .catch(err => console.log(err))
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  })
}

onValue(sensorRef,(snapshoot) => {
    if (snapshoot.exists())
    {  
      const sensorVal = snapshoot.val()

      console.log(sensorVal)

      

      progressBarTemp = document.querySelector(".circular-progress-temperature");
      let valueContainerTemp = document.querySelector(".value-container-temperature");

      progressValueTemp = Number(valueContainerTemp.textContent);
      progressEndValueTemp = sensorVal['Temperature'];
      speed = 50;

      console.log((progressEndValueTemp))

      
      progressBarHumid = document.querySelector(".circular-progress-humidity");
      valueContainerHumid = document.querySelector(".value-container-humidity");

      progressValueHumid = Number(valueContainerHumid.textContent)
      progressEndValueHumid = sensorVal['Humidity']
      


        console.log(progressEndValueHumid)


        if (!TemperatureProgress) {
          TemperatureProgress = setInterval(() => {
            if (progressValueTemp < progressEndValueTemp)
                {progressValueTemp++;}
            else {
              progressValueTemp--
            }
            console.log(progressValueTemp)
            valueContainerTemp.textContent = `${progressValueTemp}`;
            progressBarTemp.style.background = `conic-gradient(
                #4d5bf9 ${progressValueTemp * 3.6}deg,
                #cadcff ${progressValueTemp * 3.6}deg
            )`;
            if (progressValueTemp == progressEndValueTemp) {
              clearInterval(TemperatureProgress);
              TemperatureProgress = 0
            }
          }, speed);
        }

        if (!HumidityProgress) {
          HumidityProgress = setInterval(() => {
            if (progressValueHumid < progressEndValueHumid)
                {progressValueHumid++;}
            else {
              progressValueHumid--
            }
            console.log(progressValueHumid)
            valueContainerHumid.textContent = `${progressValueHumid}`;
            progressBarHumid.style.background = `conic-gradient(
                #4d5bf9 ${progressValueHumid * 3.6}deg,
                #cadcff ${progressValueHumid * 3.6}deg
            )`;
            if (progressValueHumid == progressEndValueHumid) {
              clearInterval(HumidityProgress);
              HumidityProgress = 0
            }
          }, speed);
        }
    }
})

onValue(alarmRef,(snapshoot) => {
  if (snapshoot.exists()) {
    const Alarm = snapshoot.val()
    if (Alarm['Motion']) {
      motionText.textContent = 'Status: Detected'
      motionText.style.color = 'red'
      alert("Hello\nHow are you?");
    }
    else {
      motionText.textContent = 'Status: None'
      motionText.style.color = 'green'
    }

    if (Alarm['Gas']) {
      gasText.textContent = 'Status: Detected'
      gasText.style.color = 'red'
      alert("Hello\nHow are you?");
    }
    else {
      gasText.textContent = 'Status: None'
      gasText.style.color = 'green'
    }
    console.log(Alarm)
  }
})


onValue(lightRef,(snapshoot) => {
    if (snapshoot.exists()) {
        const lightVal = snapshoot.val()
        console.log(lightVal)

        if (lightVal.BedRoom) {
          bedLight.checked = true;
        }

        if (lightVal.LivingRoom) {
          livingLight.checked = true;
        }

        if (lightVal.Kitchen) {
          kitchenLight.checked = true;
        }

    }
})

onValue(fanRef,(snapshoot) => {
  if (snapshoot.exists()) {
      const fanVal = snapshoot.val()
      console.log(fanVal)

      if (fanVal.BedRoom) {
        bedFan.checked = true;
      }

      // if (fanVal.LivingRoom) {
      //   living.checked = true;
      // }

      if (fanVal.Kitchen) {
        kitchenFan.checked = true;
      }

  }
})

livingLight.addEventListener('change',() => updateLightStatus(livingLight))

bedLight.addEventListener('change',() => updateLightStatus(bedLight))

kitchenLight.addEventListener('change',() => updateLightStatus(kitchenLight))

bedFan.addEventListener('change',() => updateFanStatus(bedFan))

kitchenFan.addEventListener('change',() => updateFanStatus(kitchenFan))