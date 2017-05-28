var bodyParser = require('body-parser'),
    express     = require('express'),
    app         = express();

var lottery = require('./lottery.js');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/launch', function(req, res){
  var user = req.body.user_name;
  if (req.body.token === "Wx0KiDc8Ld6nfN04sqokVpT6")
  {
    if (user === "rocket-gpotte")
      res.send(lottery.launchLottery(user));
    else
      res.send("you don't have the rights to do that");
  }
});

app.post('/submit', function(req, res){
  if (req.body.token === "Wx0KiDc8Ld6nfN04sqokVpT6")
  {
    var user = req.body.user_name;
    res.send(lottery.submitLottery(user));
  }
});

app.post('/stop', function(req, res){
  var user = req.body.user_name;
  var nb   = req.body.text;
  if (req.body.token === "Wx0KiDc8Ld6nfN04sqokVpT6")
  {
  res.send(  lottery.stopLottery(nb, username));
  else
    res.send("you don't have the rights to do that");
  }
});

const server = app.listen(3030, function(){
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});
