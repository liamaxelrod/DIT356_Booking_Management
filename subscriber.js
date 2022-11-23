const mqtt = require('mqtt')
const client = mqtt.connect("mqtt://test.mosquitto.org")
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const pipe1 = require('../booking-management/pipe')

function subscribe_topic(){

    const topic = 'my/test/topic'
    const topic1 = '/nodejs/albin'
    
    client.on('connect', () => {
      console.log('Connected')
      client.subscribe([topic], () => {
        console.log(`Subscribe to topic '${topic}'`)
        console.log(clientId)
      })
      client.subscribe([topic1], () => {
        console.log(`Subscribe to topic '${topic1}'`)
        console.log(clientId)
      })
    })
}

client.on('message', (topic, payload) => {
    console.log('Received Message:', topic, payload.toString())
    var message = payload.toString()
      if(topic == 'my/test/topic'){
      pipe1.filterTopic(topic, message)
    }else if(topic1 == '/nodejs/albin'){
      console.log(message)
    }else{
      console.log("funkar ej")
    }
  
    // function messageFilter(topic, message){
    //     if(message.includes("2022/12/20") ){
    //         console.log(topic, "Available!!!")
    //     }else if(message == "Erik"){
    //         console.log(topic, "Erik owes Albin Julmuuuuust!")
    //     }
    // }
  })

module.exports = {subscribe_topic}