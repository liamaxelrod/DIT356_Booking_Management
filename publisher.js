const mqtt = require('mqtt')
const client = mqtt.connect("mqtt://test.mosquitto.org")

function publish_topic(){

    const topic = 'my/test/topic'
    //const topic1 = '/nodejs/albin'
    client.on('connect', () => {
  
      client.publish(topic, 'nodejs mqtt test', { qos: 1, retain: false }, (error) => {
        if (error) {
          console.error(error)
        }
      })
    })
}


module.exports = {publish_topic}