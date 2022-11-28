var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dentistOfficeSchema = new Schema({
    id: {type: Number }, 
    name: {type: String},
    owner: {type: String},
    dentists: {type: Number},
    address: {type: String},
    city: {type: String},
    coordinate: {
        longitude: Number,
        latitude:  Number
      },
    openinghours: {
        monday: {String},
        tuesday: {String},
        wednesday: {String},
        thursday: {String},
        friday: {String}
    }
});


module.exports = mongoose.model('dentistOffices', dentistOfficeSchema);

