const { default: test } = require('node:test');
const availabilityFilter = require('../booking-management/filterBooking');

topic = 'dentistimo/booking/create-booking'

const message = {
    "accessToken": x, 
    "userId": 5, 
    "requestId": 50981,
    "dentistId": 687381763,
    "issuance": 10009099191,
    "date": "14.09.22",
    "time": "14:00"
 }
 

test('Checks for an available appointment and makes booking', () => {
    expect(topic,message)

})
