module.exports = { filterTopic }
const Booking = require('../models/booking')
const publisher = require('../publisher')

// Send to another filter
function filterTopic (topic, message) {
  if (topic === 'dentistimo/dentist/breaks') {
    availabilityFilter(topic, message)
  } else if (topic === 'dentistimo/dentist-appointment/get-all-appointments') {
    getAppointmentsDentist(message)
  } else if (topic === 'dentistimo/dentist-appointment/get-all-appointments-day') {
    getAppointmentsDentistDay(topic, message)
  } else if (topic === 'dentistimo/booking/delete-break') {
    deleteFilter(message)
  } else {
    console.log('Unable to read topic')
  }
}

function availabilityFilter (topic, message) {
  if (message.date === '' || null) {
    console.log('No date')
  } else {
    checkAvailability(topic, message)
  }
}

async function checkAvailability (topic, message) {
  try {
    const checkDate = message.date
    const checkTime = message.time
    const checkDentist = message.dentistid
    // If LunchCheck returns null, abort booking
    if (message.appointmentType === 'lunch') {
      const lunchCheck = await LunchControl(topic, message)
      if (lunchCheck === null) {
        return null
      }
    }
    // Find booking with date, time and dentist as identifier
    Booking.findOne({ date: checkDate, time: checkTime, dentistid: checkDentist }, function (_err, checkDate, checkTime, checkDentist) {
      if (checkDate == null && checkTime == null && checkDentist == null) {
        checkBreaksFilter(topic, message)
      } else {
        console.log('It is not available')
      }
    })
  } catch (e) {
    console.log(e.message)
  }
}

// Check if there is a registred lunch break or fika break for a dentist a specific day.
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
            // books fika break
            saveBreak(topic, message)
          } else {
            console.log('There is a already a registered fika break this day')
          }
        }
      }
      // Check for and add lunch breaks
      if (message.appointmentType === 'lunch') {
        if (type != null) {
          lunchCount = Object.keys(type).length
          if (lunchCount < 1) {
            // books first half hour of the lunch
            saveBreak(topic, message)
            const nextThirty = LunchFilter(topic, message)
            // books the second half hour of the lunch
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
  const incLunchMessage = message.time
  let nextHalfHour = null
  // If a lunch break is registered at a whole hour, send message to book next thirty minutes.
  if (incLunchMessage.includes('00')) {
    nextHalfHour = incLunchMessage.replace(':00', ':30')
    message.time = nextHalfHour
  } else {
    // If a lunch break is registered at the middle of the hour, make copy of message to be the next thirty minutes for booking.
    let wholeHour
    // Converting message to book next whole hour after the previous half hour.
    wholeHour = incLunchMessage.substring(0, 2)
    wholeHour = parseInt(wholeHour)
    wholeHour = wholeHour + 1
    wholeHour = wholeHour.toString()
    wholeHour = wholeHour.concat(':00')
    message.time = wholeHour
  }
  return message
}

// Checks if the next thirty minutes past the made booking for lunch is available or not.
async function LunchControl (topic, message) {
  try {
    const checkDentist = message.dentistid
    const checkDate = message.date
    const messageCopy = message
    const newTime = messageCopy.time
    let finalTime = null

    if (newTime.includes('00')) {
      finalTime = newTime.replace(':00', ':30')
    } else {
      finalTime = newTime.replace(':30', ':00')
      let wholeHour
      wholeHour = newTime.substring(0, 2)
      wholeHour = parseInt(wholeHour)
      wholeHour = wholeHour + 1
      wholeHour = wholeHour.toString()
      wholeHour = wholeHour.concat(':00')
      finalTime = wholeHour
    }

    // Find booking with date, time and dentist as identifier
    const bookingSearch = await Booking.findOne({ date: checkDate, time: finalTime, dentistid: checkDentist })
    if (bookingSearch === null) {
      console.log('Available')
    } else {
      console.log('Not available')
      return null
    }
  } catch (e) {
    console.log(e.message)
  }
}

// Delete booking filter
function deleteFilter (message) {
  console.log(message.dentistid)
  if (message.dentistid != null) {
    deleteBreak(message)
  } else {
    console.log('Message does not include dentistid')
  }
}

async function deleteBreak (message) {
  try {
    // Delete booking with issuance as identifier
    const findBooking = await Booking.findOne({ dentistid: message.dentistid, date: message.date, time: message.time })
    if (findBooking != null) {
      await Booking.deleteOne({ dentistid: message.dentistid, date: message.date, time: message.time })
      const deletedBreakTopic = 'dentistimo/booking/deleted-break'
      publisher.publishDeletedBreak(deletedBreakTopic)
    } else {
      console.log('Could not find a registered break')
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
async function getAppointmentsDentistDay (topic, message) {
  try {
    const idToken = message.idToken
    if (message.dentistid != null && message.date != null) {
      const AppointmentsDay = await Booking.find({ dentistid: message.dentistid, date: message.date })
      // Checks that the query response is not empty
      if (AppointmentsDay.length) {
        publisher.publishAllDentistAppointmentsDay(idToken, AppointmentsDay)
      } else {
        console.log('Could not find any appointments that day')
      }
    }
  } catch (e) {
    console.log(e.message)
  }
}
