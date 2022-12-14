module.exports = { filterTopic }
// const mongoose = require('mongoose')
// const dentistOffices = require('../booking-management/models/dentistOffice')
const Breaks = require('../models/dentistBreaks')
const Booking = require('../models/booking')
const publisher = require('../publisher')

// Send to another filter
function filterTopic (topic, message) {
  message = JSON.parse(message)
  if (topic === 'dentistimo/dentist/breaks') {
    checkAvailabilityFilter(topic, message)
  } else if (topic === 'dentistimo/booking/lunch') {
    console.log(message)
  } else if (topic === 'dentistimo/dentist-appointment/get-all-appointments') {
    getAppointmentsDentist(message)
  } else if (topic === 'dentistimo/dentist-appointment/get-all-appointments-day') {
    getAppointmentsDentistDay(message)
  } else {
    console.log('Unable to read topic')
  }
}

// This filter will check the availability, similarly to the booking appointment
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

// This function will save the break in the database depending on the breakType, 'break' || 'lunch'
function saveBreak (topic, message) {
  if (message.breakType === 'break') {
    const breakFika = new Breaks(message)
    breakFika.save((_err) => {
      // saved!
    })
  } else if (message.breakType === 'lunch') {
    const breakFika = new Breaks(message)
    breakFika.save((_err) => {
      // saved!
    })
  } else {
    console.log('Does not work, throw error')
  }
  // Publish message
  publisher.publishBreakFika(topic, message)
}

async function getAppointmentsDentist (message) {
  try {
    // Find bookings with dentisid as identifier
    const filter = { dentistid: message.dentistid }
    const getAppointments = await Booking.find(filter)
    if (getAppointments.length) {
      publisher.publishAllDentistAppointments(getAppointments)
    } else {
      console.log('Could not find any appointments')
    }
  } catch (e) {
    console.log(e.message)
  }
}

// Get all appointments for a dentist a certain day
async function getAppointmentsDentistDay (message) {
  try {
    const AppointmentsDay = await Booking.find({ dentistid: message.dentistid, date: message.date })
    if (AppointmentsDay.length) {
      publisher.publishAllDentistAppointments(AppointmentsDay)
    } else {
      console.log('Could not find any appointments that day')
    }
  } catch (e) {
    console.log(e.message)
  }
}
