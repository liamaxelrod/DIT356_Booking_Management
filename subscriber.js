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
    const topic2 = 'dentistimo/booking/delete-booking'
    
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
      client.subscribe([topic2], () => {
        console.log(`Subscribe to topic '${topic2}'`)
        console.log(clientId)
      })
    })
}

client.on('message', (topic, payload) => {
    console.log('Received Message:', topic, payload.toString())
    var message = payload.toString()
      if(topic == 'my/test/topic'){
      pipe1.filterTopic(topic, message)
    }else if(topic == '/nodejs/albin'){
      console.log(message)
    }else if(topic == 'dentistimo/booking/delete-booking'){
      console.log(message)
      pipe1.filterTopic(topic, message)
    }else{
      console.log("funkar ej")
    }
  
  })

module.exports = {subscribe_topic}