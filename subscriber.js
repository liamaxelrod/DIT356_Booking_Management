module.exports = {subscribe_topic}

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
    const topic1 = 'dentistimo/booking/create-booking'
    const topic2 = 'dentistimo/booking/delete-booking'
    

    //Dentist Office topics:
    const office_topic = 'dentistimo/dentist-office/fetch-all'
    
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
      client.subscribe([office_topic], () => {
        console.log(`Subscribe to topic '${office_topic}'`)
        console.log(clientId)
      })
    })
}

client.on('message', (topic, payload) => {
    //console.log('Received Message:', topic, payload.toString())
    if(topic == 'my/test/topic'){
      console.log(message)
    }else if(topic == 'dentistimo/booking/create-booking'){
      pipe1.filterTopic(topic, payload)
    }else if(topic == 'dentistimo/booking/delete-booking'){
      //console.log(message)
      pipe1.filterTopic(topic, payload)
    }else if(topic == 'dentistimo/dentist-office/fetch-all'){
      //console.log(message)
      pipe1.filterTopic(topic, payload)
    }else{
      console.log("funkar ej")
    }
  
  })