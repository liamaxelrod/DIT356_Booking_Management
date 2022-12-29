module.exports = { filterTopic }
// const mongoose = require('mongoose')
// const dentistOffices = require('../booking-management/models/dentistOffice')
// const Breaks = require('../models/dentistBreaks')
const Booking = require('../models/booking')
const publisher = require('../publisher')
// const dentistBreaks = require('../models/dentistBreaks')

// Send to another filter
function filterTopic (topic, message) {
  message = JSON.parse(message)
  if (topic === 'dentistimo/dentist/breaks') {
    availabilityFilter(topic, message)
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

async function checkBreaksFilter (topic, message) {
  try {
    const checkDate = message.date
    const checkDentist = message.dentistid
    const type = message.appointmentType
    let fikaCount = 0
    let lunchCount = 0

    // Check for and add fika breaks
    Booking.find({ appointmentType: type, date: checkDate, dentistid: checkDentist }, function (_err, type) {
      if (message.appointmentType === 'fika') {
        if (type != null) {
          fikaCount = Object.keys(type).length
          if (fikaCount < 1) {
            saveBreak(topic, message)
          } else {
            console.log('There is a already a registered fika break this day')
          }
        }
      }
      if (message.appointmentType === 'lunch') {
        if (type != null) {
          lunchCount = Object.keys(type).length
          if (lunchCount < 1) {
            saveBreak(topic, message)
            const nextThirty = LunchFilter(topic, message)
            saveBreak(topic, nextThirty)
          } else {
            console.log('There is a already a registered lunch break this day')
          }
        }
      }
    })
  } catch (e) {
    console.log(e.message)
  }
}

// Adding another break of 30 minuts for the lunch
function LunchFilter (topic, message) {
  const incomingLunch = message.time
  console.log(incomingLunch)
  let nextHalfHour = null
  // If a lunch break is registered at a whole hour
  if (incomingLunch.includes('00')) {
    nextHalfHour = incomingLunch.replace(':00', ':30')
    message.time = nextHalfHour
  } else {
    // If a lunch break is registered at the middle of the hour
    let wholeHour
    wholeHour = incomingLunch.substring(0, 2)
    wholeHour = parseInt(wholeHour)
    wholeHour = wholeHour + 1
    wholeHour = wholeHour.toString()
    wholeHour = wholeHour.concat(':00')
    message.time = wholeHour
  }
  return message
}

function availabilityFilter (topic, message) {
  async function checkAvailability (topic, message) {
    try {
      const checkDate = message.date
      const checkTime = message.time
      const checkDentist = message.dentistid
      // Find booking with date, time and dentist as identifier
      const lunchCheck = await LunchControl(topic, message)
      console.log(lunchCheck)
      if (lunchCheck === null) {
        return null
      } else {
        Booking.findOne({ date: checkDate, time: checkTime, dentistid: checkDentist }, function (_err, checkDate, checkTime, checkDentist) {
          if (checkDate == null && checkTime == null && checkDentist == null) {
            checkBreaksFilter(topic, message)
          } else {
            console.log('It is not available')
            message = null
            publisher.publishBookingDate(topic, message)
          }
        })
      }
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

async function LunchControl (topic, message) {
  try {
    const checkDentist = message.dentistid
    const checkDate = message.date
    // const originalMessage = message
    const messageCopy = message
    const newTime = messageCopy.time
    const finalTime = newTime.replace(':00', ':30')

    // Find booking with date, time and dentist as identifier
    const search = await Booking.findOne({ date: checkDate, time: finalTime, dentistid: checkDentist })
    if (search === null) {
      console.log('Availabe')
    } else {
      console.log('Not Available')
      return null
    }
  } catch (e) {
    console.log(e.message)
  }
}

// This function will save the break in the database depending on the breakType, 'break' || 'lunch'
function saveBreak (topic, message) {
  if (message.appointmentType === 'fika') {
    const breakFika = new Booking(message)
    breakFika.save((_err) => {
      // saved!
    })
  } else if (message.appointmentType === 'lunch') {
    const breakLunch = new Booking(message)
    breakLunch.save((_err) => {
      // saved!
    })
  } else {
    console.log('Does not work, throw error')
  }
  // Publish message
  publisher.publishBreakFika(topic, message)
}

// Get all appointments for a dentist
async function getAppointmentsDentist (message) {
  try {
    if (message.dentistid != null) {
      // Find bookings with dentisid as identifier
      const filter = { dentistid: message.dentistid }
      const getAppointments = await Booking.find(filter)
      // Checks that the query response is not empty
      if (getAppointments.length) {
        publisher.publishAllDentistAppointments(getAppointments)
      } else {
        console.log('Could not find any appointments')
      }
    }
  } catch (e) {
    console.log(e.message)
  }
}

// Get all appointments for a dentist a certain day
async function getAppointmentsDentistDay (message) {
  try {
    if (message.dentistid != null && message.date != null) {
      const AppointmentsDay = await Booking.find({ dentistid: message.dentistid, date: message.date })
      // Checks that the query response is not empty
      if (AppointmentsDay.length) {
        publisher.publishAllDentistAppointmentsDay(AppointmentsDay)
      } else {
        console.log('Could not find any appointments that day')
      }
    }
  } catch (e) {
    console.log(e.message)
  }
}
