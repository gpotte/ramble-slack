var mongoose  = require("mongoose");
var Schema    = mongoose.Schema;

mongoose.connect('mongodb://localhost/bdecrew');
var lotterySchema = new Schema({
  isActive: {type: Boolean, default: true},
  date: { type: Date, default: Date.now },
  subscriber: [{body: String, _id: false}],
  winner: [{body: String}]
});

var lottery = mongoose.model('lottery', lotterySchema);

function launchLottery(username, callback){
    var ret;
    lottery.findOne({'isActive': true}, function(err, result){
      if (err) {console.log(err)}
      if (result){
        console.log(result);
         callback("There is already a lottery ongoing please finish it before anything else");
      }
      else {
        var newLottery = new lottery();
        newLottery.save()
        console.log("new lottery");
        ret = {
           response_type: 'in_channel',
           text: ":404: La loterie commence tapez `/lottery` pour vous inscrire!! :404:"
        }
        callback(ret);
      }
    });
}

function submitLottery(username, callback){
  var newSub = {body: username};
  var signedIn = false;
  var ret;
  lottery.findOne({'isActive': true}, function(err, result){
    if (err) {console.log(err)}
    if (result){
      result.subscriber.forEach(function(sub){
        if (sub.body == username)
        {
          ret = ":404: Tu es deja inscris " + username + "! :404:";
          signedIn = true;
        }
      });
        if (signedIn !== true)
        {
          result.subscriber.addToSet(newSub);
          result.save();
          ret = ":404: Tu es bien inscris a la loterie " + username + "! :404:";
        }
      console.log(result);
      }
    else {
      ret = ":404: Aucune loterie en cours ! :404:";
    }
    callback(ret);
  });
}

function stopLottery(query, callback){
   var ret = {
     response_type: 'in_channel',
     text: "lottery stopped"
   };
   var nb = parseInt(query, 10);
   var winners = [];
   var announceWinner = ":404: The winners are ";

  lottery.findOne({'isActive': true}, function(err, result){
    if (err){console.log(err)}
    if (result) {
      console.log("Stopping the lottery and rambling for winner");
      if (nb !== NaN)
      {
        if (nb === 1 || result.subscriber.length === 1)
         announceWinner = ":404: The winner is ";
        for(var i=1; i <= nb && i <= result.subscriber.length; i++)
        {
          var tmp = result.subscriber[Math.floor(Math.random() * result.subscriber.length)];
          while (winners.indexOf(tmp) > -1)
            var tmp = result.subscriber[Math.floor(Math.random() * result.subscriber.length)];
          announceWinner += tmp.body +" ";
          winners.push(tmp);
          result.winner.addToSet(tmp);
        }
      }
      result.isActive = false;
      result.save();
      announceWinner += "! BRAVO :404:";
      console.log(result);
      if (nb !== NaN && nb > 0 && result.subscriber.length > 0)
      {
        console.log(announceWinner);
        ret = {
          response_type: 'in_channel',
          text: announceWinner
        };
      }
    }
    callback(ret);
   });
}

function countSub(callback){
  lottery.findOne({'isActive': true}, function(err, result){
    if (err){console.log(err)}
    if (result)
      callback(result.subscriber.length + " inscris");
    else {
      callback("no lottery going on");
    }
  });
}

module.exports = {
  launchLottery: launchLottery ,
  stopLottery: stopLottery ,
  submitLottery: submitLottery,
  countSub : countSub
};
