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
// function checkAvailabilityFilter (topic, message) {
//   async function checkAvailability (topic, message) {
//     try {
//       const checkDate = message.date
//       const checkTime = message.time
//       const checkDentist = message.dentistid
//       // Find booking with date, time and dentist as identifier
//       Booking.findOne({ date: checkDate, time: checkTime, dentistid: checkDentist }, function (checkDate, checkTime, checkDentist) {
//         if (checkDate == null && checkTime == null && checkDentist == null) {
//           saveBreak(topic, message)
//         } else {
//           console.log('It is not available')
//         }
//       })
//     } catch (e) {
//       console.log(e.message)
//     }
//   }
//   if (message.date === '' || null) {
//     console.log('No date')
//   } else {
//     checkAvailability(topic, message)
//   }
// }

function checkAvailabilityFilter (topic, message) {
  if (message.date === '' || null) {
    console.log('No date')
  } else {
    checkBreaksFilter(topic, message)
  }
}

// async function checkAvailability (topic, message) {
//   try {
//     const checkBreak = message.break
//     const checkDate = message.date
//     const checkTime = message.time
//     const checkDentist = message.dentistid
//     // Find booking with date, time and dentist as identifier
//     Booking.findOne({ date: checkDate, time: checkTime, dentistid: checkDentist, break: checkBreak }, function (checkDate, checkTime, checkDentist, checkBreak) {
//       if (checkDate == null && checkTime == null && checkDentist == null && checkBreak == null) {
//         saveBreak(topic, message)
//       } else {
//         console.log('It is not available')
//       }
//     })
//   } catch (e) {
//     console.log(e.message)
//   }
// }

// function filterMakeAppointment (topic, message) {
//   const userIdInput = message.userid
//   let keyCount = 0
//   // Looking in the database for the userId, to count how many appointments this user has made
//   Booking.find({ userid: userIdInput }, function (_err, userIdInput) {
//     if (userIdInput != null) {
//       keyCount = Object.keys(userIdInput).length
//       if (keyCount < 2) {
//         saveAppointment(topic, message)
//       } else {
//         console.log('Too many bookings')
//       }
//     } else {
//       console.log('It is not available')
//     }
//   })
// }

async function checkBreaksFilter (topic, message) {
  try {
    const dentistId = message.dentistid
    const checkDate = message.date
    const DentistFika = message.fika
    const DentistLunch = message.lunch
    let fikaCount = 0
    let lunchCount = 0

    // Check for and add fika breaks
    if (message.fika != null) {
      Booking.find({ dentistid: dentistId, fika: DentistFika, date: checkDate }, function (_err, DentistFika) {
        fikaCount = Object.keys(DentistFika).length
        if (DentistFika != null) {
          if (fikaCount < 1) {
            saveBreak(topic, message)
          } else {
            console.log('There is a already a registered fika break this day')
          }
        }
      })
    }
    // Check for and add lunch breaks
    if (message.lunch != null) {
      Booking.find({ dentistid: dentistId, lunch: DentistLunch, date: checkDate }, function (_err, DentistLunch) {
        lunchCount = Object.keys(DentistLunch).length
        if (DentistLunch != null) {
          if (lunchCount < 1) {
            saveBreak(topic, message)
            const nextThirty = LunchFilter(topic, message)
            saveBreak(topic, nextThirty)
          } else {
            console.log('There is a already a registered lunch break this day')
          }
        }
      })
    }
  } catch (e) {
    console.log(e.message)
  }
}

// Adding another break of 30 minuts for the lunch
function LunchFilter (topic, message) {
  const incomingLunch = message.time
  console.log(incomingLunch)
  const nextHalfHour = incomingLunch.replace(':00', ':30')
  message.time = nextHalfHour
  return message
}

// This function will save the break in the database depending on the breakType, 'break' || 'lunch'
function saveBreak (topic, message) {
  console.log(message)
  if (message.fika != null) {
    const breakFika = new Booking(message)
    breakFika.save((_err) => {
      // saved!
    })
  } else if (message.lunch != null) {
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
