const mqtt = require('mqtt')
const host = 'e33e41c289ad4ac69ae5ef60f456e9c3.s2.eu.hivemq.cloud'
const port = '8883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtts://${host}:${port}`
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'group6_dentistimo',
  password: 'dentistimo123!',
  reconnectPeriod: 1000,
})

const topic = 'my/test/topic'

function publish_topic(){

    //const topic1 = '/nodejs/albin'
    client.on('connect', () => {
      client.publish(topic, 'nodejs mqtt test', { qos: 1, retain: false }, (error) => {
        if (error) {
          console.error(error)
        }
      })
    })

}

//Post deleted bookings
function publishDeletedBooking(topic) {
  const pubMessage = "Booking has succesfully been removed";
  client.publish(topic, pubMessage, { qos: 1, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
}

//Post if found bookings
function publishBookingDate(topic) {
  const pubMessage = "Booking has succesfully been found";
  client.publish(topic, pubMessage, { qos: 1, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
}


module.exports = {publish_topic, publishDeletedBooking, publishBookingDate}