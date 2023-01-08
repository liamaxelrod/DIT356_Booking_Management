
module.exports = { errorPublisher, publishAvailableAppointments, publishDeletedBooking, publishBookingDate, publishBreakFika, publishAllOffices, publishOneOffice, publishAllDentistAppointments, publishAllDentistAppointmentsDay, publishAllUserAppointmentsDay, publishFilteredOffices, publishAllUserAppointments, publishDeletedBreak }

const mqtt = require('mqtt')
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const host = 'broker.emqx.io'
const port = '1883'

const connectUrl = `mqtt://${host}:${port}`
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000
})

// Post deleted bookings
function publishDeletedBooking (topic, idToken) {
  topic = `${topic}/${idToken}`
  const pubMessage = 'Booking has succesfully been removed'
  client.publish(topic, pubMessage, { qos: 1, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
}

// Publish message when a successfull booking has been made
function publishBookingDate (topic, message) {
  topic = `${'dentistimo/booking/succesful-booking'}/${message.idToken}`
  let pubMessage
  if (message !== null) {
    pubMessage = ('Successful booking' + 'Date: ' + message.date + 'Time: ' + message.time + 'Reason: ' + message.visitReason)
  } else {
    pubMessage = 'Booking unavailable'
  }
  client.publish(topic, (JSON.stringify(pubMessage)), { qos: 1, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
}

// This method will publish breaks to the frontend and topic will differ depending on break or lunch in the 'breakType' attribute
function publishBreakFika (topic, message) {
  let breakTopic = ''
  if (message.appointmentType === 'fika') {
    breakTopic = `${'dentistimo/dentist/fika-booked'}/${message.idToken}`
  } else if (message.appointmentType === 'lunch') {
    breakTopic = `${'dentistimo/dentist/lunch-booked'}/${message.idToken}`
  }
  const pubMessage = ('Successful break registered: ' + { dentistid: message.dentistid, appointmentType: message.appointmentType, date: message.date, time: message.time })
  client.publish(breakTopic, (JSON.stringify(pubMessage)), { qos: 1, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
}

// Publish all available dentist offices
function publishAllOffices (message) {
  const dentistTopic = `${'dentistimo/dentist-office/get-all'}/${message.idToken}`
  client.publish(dentistTopic, JSON.stringify(message), { qos: 1, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
}

// Publisher to publish information of one office
function publishOneOffice (idToken, message) {
  const foundOfficeTopic = `${'dentistimo/dentist-office/one-office'}/${idToken}`
  client.publish(foundOfficeTopic, JSON.stringify(message), { qos: 1, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
}

// Publisher for all offices that a user wants to see after choosing a time interval
function publishFilteredOffices (message, payload) {
  const idToken = payload.idToken
  const filteredOfficeTopic = `${'dentistimo/dentist-office/filtered-office'}/${idToken}`
  client.publish(filteredOfficeTopic, (JSON.stringify(message)), { qos: 0, retain: false }, (error) => { // try qos 1, qos 0 works but sends a lot of messages
    if (error) {
      console.error(error)
    }
  })
}

// Publisher all appointments belonging to a dentist
function publishAllDentistAppointments (message, idToken) {
  const foundAppointments = `${'dentistimo/dentist-appointment/all-appointments'}/${idToken}`
  client.publish(foundAppointments, JSON.stringify(message), { qos: 1, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
}

// Publish all appointments a certain dentist have a booked a certaain day
function publishAllDentistAppointmentsDay (idToken, message) {
  const foundAppointments = `${'dentistimo/dentist-appointment/all-appointments-day'}/${idToken}`
  client.publish(foundAppointments, JSON.stringify(message), { qos: 1, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
}

// Publish all appointments a user have a certain day.
function publishAllUserAppointmentsDay (message, idToken) {
  const foundAppointments = `${'dentistimo/user-appointment/all-appointments-day'}/${idToken}`
  client.publish(foundAppointments, JSON.stringify(message), { qos: 1, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
}

// Publish all appointments for a user.
function publishAllUserAppointments (message, idToken) {
  const foundAppointments = `${'dentistimo/user-appointment/all-appointments'}/${idToken}`
  client.publish(foundAppointments, JSON.stringify(message), { qos: 1, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
}

// Post deleted bookings
function publishDeletedBreak (message, idToken) {
  const deletedAppointments = `${'dentistimo/booking/deleted-break'}/${idToken}`
  const pubMessage = 'The break has succesfully been removed'
  client.publish(deletedAppointments, pubMessage.toString(), { qos: 1, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
}

// Publisher for all availabale appointments
function publishAvailableAppointments (message, payload) {
  const idToken = payload.idToken
  const foundAppointments = `${'dentistimo/dentist/free-appointments'}/${idToken}`
  client.publish(foundAppointments, JSON.stringify(message), { qos: 2, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
}

// Publish all appointments a certain dentist have a booked a certaain day
function errorPublisher (idToken, message) {
  const publishError = `${'dentistimo/error'}/${idToken}`
  client.publish(publishError, JSON.stringify(message), { qos: 1, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
}
