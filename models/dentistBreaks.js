const mongoose = require('mongoose')
const Schema = mongoose.Schema

const breakSchema = new Schema({
  dentistid: { type: Number },
  breakType: { type: String },
  date: { type: String },
  time: { type: String }
})

module.exports = mongoose.model('DentistBreaks', breakSchema)
