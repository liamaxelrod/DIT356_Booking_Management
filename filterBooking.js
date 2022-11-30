module.exports = {filterTopic}
const mongoose = require('mongoose');
const dentistOffices = require('../booking-management/models/dentistOffice')
const newAppointment = require('../booking-management/models/booking')


//Send to another filter 
function filterTopic(topic, message){
    message = JSON.parse(message)
    const appointment = new newAppointment(message);
    if(topic == 'Booking/newBooking'){
        
        messageFilter(topic, message)
    }else{
        console.log("Doesn't work")
    }
}

//To check if it doesn include something specific 
function messageFilter(topic, message){
    if(message.time == "14:00"){
        console.log(message.time)
    }else{
        console.log("Not working")
    }
  console.log("It works!")
}

//To check if it includes something specific  
function filterMakeAppointment(topic, message){
    appointment.save((err) => {
        if (err) return handleError(err);
        // saved!
      });
    console.log("The appointment has been made!")
}

//Print the message
function messageFilter3(topic, message){
        console.log("It is working perfectly")
}
