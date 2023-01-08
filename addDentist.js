module.exports = { addDentist }
const Office = require('../booking-management/models/dentistOffice')

// Function to add a dentist to a specific office
async function addDentist (topic, payload) {
  const userInfo = JSON.parse(payload.toString())
  console.log(userInfo)
  const { officeId, dentistId } = userInfo
  const findOffice = await Office.findOne({ id: officeId })
  if (findOffice.dentists > findOffice.listDentists.length) {
    findOffice.listDentists.push(dentistId)
    findOffice.save()
  } else {
    console.log('Error')
  }
}
