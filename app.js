var bodyParser = require('body-parser'),
    express     = require('express'),
    app         = express();

var lottery = require('./lottery.js');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/launch', function(req, res){
  var user = req.body.user_name
  console.log(req.body);
  if (req.body.token === "Wx0KiDc8Ld6nfN04sqokVpT6")
  {
    if (req.body.user_id === 'U4T6C21L3')
      lottery.launchLottery(user, function(result){
        console.log(result);
        res.send(result);
      });
    else
      res.send("you don't have the rights to do that");
  }
});

app.post('/submit', function(req, res){
  if (req.body.token === "Wx0KiDc8Ld6nfN04sqokVpT6")
  {
    var user = req.body.user_name;
    lottery.submitLottery(user, function(result){
      console.log(result);
      res.send(result);
    });
  }
});

app.post('/stop', function(req, res){
  var user = req.body.user_name;
  var nb   = req.body.text;
  if (req.body.token === "Wx0KiDc8Ld6nfN04sqokVpT6")
  {
    if (req.body.user_id === 'U4T6C21L3')
      lottery.stopLottery(nb, function(result){
        console.log(result);
        res.send(result);
      });
    else
      res.send("you don't have the rights to do that");
  }
});

app.post('/count', function(req,res){
    var user = req.body.user_name;
    if (req.body.token === "Wx0KiDc8Ld6nfN04sqokVpT6")
    {
      if (req.body.user_id === 'U4T6C21L3')
        lottery.countSub(function(result){
          console.log(result);
          res.send(result);
        });
      else
        res.send("you don't have the rights to do that");
    }
});
const server = app.listen(3030, function(){
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});
