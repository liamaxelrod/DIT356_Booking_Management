module.exports = { filterTopic }
// const mongoose = require('mongoose')
// const dentistOffices = require('../booking-management/models/dentistOffice')
const Breaks = require('./models/dentistBreaks')
const Booking = require('../booking-management/models/booking')
const publisher = require('./publisher')

// Send to another filter
function filterTopic (topic, message) {
  message = JSON.parse(message)
  if (topic === 'dentistimo/dentist/breaks') {
    checkAvailabilityFilter(topic, message)
  } else if (topic === 'dentistimo/booking/lunch') {
    console.log(message)
  } else {
    console.log('Unable to read topic')
  }
}

function checkAvailabilityFilter (topic, message) {
  async function checkAvailability (topic, message) {
    try {
      const checkDate = message.date
      const checkTime = message.time
      const checkDentist = message.dentistid
      // Find booking with date, time and dentist as identifier
      Booking.findOne({ date: checkDate, time: checkTime, dentistid: checkDentist }, function (checkDate, checkTime, checkDentist) {
        if (checkDate == null && checkTime == null && checkDentist == null) {
          saveBreak(topic, message)
        } else {
          console.log('It is not available')
        }
      })
    } catch (e) {
      console.log(e.message)
    }
  }
  if (message.date === '' || null) {
    console.log('No date')
  } else {
    checkAvailability(topic, message)
  }
}

// This function will save the appointment in the database
function saveBreak (topic, message) {
  const breakFika = new Breaks(message)
  breakFika.save((_err) => {

    // saved!
  })
  // Publish message
  publisher.publishBreakFika(topic, message)
}
