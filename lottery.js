var mongoose  = require("mongoose");
var Schema    = mongoose.Schema;

mongoose.connect('mongodb://localhost/test');
var lotterySchema = new Schema({
  isActive: {type: Boolean, default: true},
  date: { type: Date, default: Date.now },
  subscriber: [{body: String, _id: false}],
  winner: [{body: String}]
});

var lottery = mongoose.model('lottery', lotterySchema);

function launchLottery(username){
    var ret;
    lottery.findOne({'isActive': true}, function(err, result){
      if (err) {console.log(err)}
      if (result){
        console.log(result);
        ret = "There is already a lottery ongoing please finish it before anything else";
      }
      else {
        var newLottery = new lottery();
        newLottery.save();
        console.log("new lottery");
        ret = {
          response_type: 'in_channel',
          text: "@channel La lotterie commence tapez `!lottery` pour vous inscrire (no spam please) !!"
        };
      }
    });
}

function submitLottery(username){
  var newSub = {body: username};
  var signedIn = false;
  var ret;
  lottery.findOne({'isActive': true}, function(err, result){
    if (err) {console.log(err)}
    if (result){
      result.subscriber.forEach(function(sub){
        if (sub.body == username)
        {
          ret = "Tu es deja inscris !";
          signedIn = true;
        }
      });
        if (signedIn !== true)
        {
          result.subscriber.addToSet(newSub);
          result.save();
          ret = "Tu es bien inscris a la lotterie !";
        }
      console.log(result);
      }
    else {
      ret = "Aucune lotterie en cours !";
    }
  });
  return ret;
}

function stopLottery(query, username){
  var ret;
   var nb = parseInt(query, 10);
   var winners = [];
   var announceWinner = ":404: The winners are ";
   if (nb === 1)
    announceWinner = ":404: The winner is ";
   lottery.findOne({'isActive': true}, function(err, result){
      if (err){console.log(err)}
      else{
          console.log("Stopping the lottery and rambling for winner");
          for(var i=1; i <= nb; i++)
          {
            var tmp = result.subscriber[Math.floor(Math.random() * result.subscriber.length)];
            while (winners.indexOf(tmp) > -1)
              var tmp = result.subscriber[Math.floor(Math.random() * result.subscriber.length)];
            announceWinner += tmp.body +" ";
            winners.push(tmp);
            result.winner.addToSet(tmp);
          }
          result.isActive = false;
          result.save();
          announceWinner += "! BRAVO :404:";
          console.log(result);
          if (nb > 0)
          {
            console.log(announceWinner);
            ret = {
              response_type: 'in_channel',
              text: announceWinner
            };
          }
          else
            ret = "0 winner";
      }
   });
   return ret;
}

module.exports = {
  launchLottery: launchLottery ,
  stopLottery: stopLottery ,
  submitLottery: submitLottery
};
