module.exports = { filterTopic }
// const mongoose = require('mongoose')
// const dentistOffices = require('../booking-management/models/dentistOffice')
// const Office = require('../models/dentistOffice')

// Send to another filter
function filterTopic (topic, message) {
  if (topic === 'dentistimo/dentist-office/fetch-availability') {
    checkAvailabilityFilter(topic, message)
  } else {
    console.log('Unable to read topic')
  }
}

// This filter will check the availability, similarly to the booking appointment
function checkAvailabilityFilter (topic, message) {
  const start = Date.parse(message.from)
  console.log(start)
  // const end = Date.parse(message.to)
  const d = '15 Dec 2022 13:00:00 GMT'
  console.log(d)
  console.log(start)
  console.log(d >= start.valueOf())
  console.log('break')
  // Find booking with date, time and dentist as identifier
  // Office.find() {
  // })
}

// function sendPublish (topic, message) {

// }
