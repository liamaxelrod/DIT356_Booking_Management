const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookingSchema = new Schema({
  userid: { type: Number },
  requestid: { type: Number },
  dentistid: { type: Number },
  issuance: { type: Number },
  dentistOfficeId: { type: Number },
  date: { type: String },
  time: { type: String },
  appointmentType: { type: String },
  visitReason: { type: String }
})

module.exports = mongoose.model('booking', bookingSchema)
