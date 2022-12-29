module.exports = { addDentist }
const Office = require('../booking-management/models/dentistOffice')
async function addDentist (payload) {
  const userInfo = JSON.parse(payload.toString())
  const { officeId, dentistId } = userInfo
  const findOffice = await Office.findOne({ id: officeId })
  if (findOffice.dentists > findOffice.listDentists.length) {
    findOffice.listDentists.push(dentistId)
    findOffice.save()
  } else {
    console.log('Error')
  }
}
