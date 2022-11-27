const mqtt = require('mqtt')
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const pipe1 = require('../booking-management/filterBooking')

const host = 'e33e41c289ad4ac69ae5ef60f456e9c3.s2.eu.hivemq.cloud'
const port = '8883'

const connectUrl = `mqtts://${host}:${port}`
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'group6_dentistimo',
  password: 'dentistimo123!',
  reconnectPeriod: 1000,
})
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