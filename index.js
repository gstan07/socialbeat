// require ('newrelic');
var express = require('express');
var app = express();
var path = require('path');



// app.get('/', function (req, res) {
//   res.send('Hello World!')
// })

app.use(express.static(path.join(__dirname, 'public')));


app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});