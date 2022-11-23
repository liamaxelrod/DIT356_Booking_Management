function filterTopic(topic, message){
    if(topic == 'my/test/topic'){
      console.log("Felix is so fucking good")
    }else{
        console.log("Doesn't work")
    }
}

module.exports = {filterTopic}