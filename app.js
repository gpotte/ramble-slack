var bodyParser  = require('body-parser'),
    mongoose    = require("mongoose"),
    Schema      = mongoose.Schema,
    express     = require('express'),
    app         = express();

mongoose.connect('mongodb://localhost/bdecrew');
var adminSchema = new Schema({
  admin_id: String
});
var admin   = mongoose.model('admin', adminSchema);

const token = process.env.SLACK_TOKEN;
var lottery = require('./lottery.js');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/launch', function(req, res){
  var user = req.body.user_name
  if (req.body.token === token)
  {
    admin.findOne({'admin_id': req.body.user_id}, (err, exist)=>{
      if (exist)
      {
        lottery.launchLottery(user, function(result){
          console.log(result);
          res.send(result);
        });
      }
      else
        res.send("you don't have the rights to do that");
    });
  }
});

app.post('/submit', function(req, res){
  if (req.body.token === token)
  {
    var user = req.body.user_name;
    lottery.submitLottery(user, function(result){
      console.log(result);
      res.send(result);
    });
  }
});

app.post('/stop', function(req, res){
  var nb   = req.body.text;
  if (req.body.token === token)
  {
    admin.findOne({'admin_id': req.body.user_id}, (err, exist)=>{
      if (exist)
      {
        lottery.stopLottery(nb, function(result){
          console.log(result);
          res.send(result);
        });
      }
      else
        res.send("you don't have the rights to do that");
    });
  }
});

app.post('/count', function(req,res){
    if (req.body.token === token)
    {
      admin.findOne({'admin_id': req.body.user_id}, (err, exist)=>{
        if (exist)
        {
          lottery.countSub(function(result){
            console.log(result);
            res.send(result);
          });
        }
        else
          res.send("you don't have the rights to do that");
      });
    }
});

app.post('/id', function(req, res){
  if (req.body.token === token)
  {
    console.log(req.body.user_id);
    res.send(req.body.user_id);
  }
});

app.post('/admin/new', function(req, res){
  if (req.body.token === token)
  {
    admin.findOne({'admin_id': req.body.user_id}, (err, exist)=>{
      if (exist)
      {
        var newAdmin = new admin({admin_id: req.body.text});
        newAdmin.save();
        res.send(req.body.text + " is now admin");
      }
      else
        res.send("you don't have the rights to do that");
    });
  }
});

const server = app.listen(3030, function(){
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});
