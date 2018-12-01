'use strict';
const firebase = require('firebase')
const line = require('@line/bot-sdk');
const express = require('express');
var mysql = require('mysql');
// const  = rerquie('./fiel')
// var firebase = require("firebase");
// create LINE SDK config from env variables

const config = {
  channelAccessToken: '04nqposzjVH7ltLUhkw+Jzki5xcCAYaLWRN2m39+xBS+ZpwTRL20klqB5ZAHLW45z1jcqQQZe1riADpQ6/3oadwaVqpB9Lxl7PscFkDOrV6+8hNhObUc+W0VMlCsUJqim4N4zn2L/Y5vrWIuaEFz8wdB04t89/1O/w1cDnyilFU=',
  channelSecret: '0e60e3f972ed101f0ac07ecf3c22a74a',
};
var con = mysql.createConnection({
  host: "119.59.120.32",
  user: "gooruapp_queue",
  password: "GFhPccLkV4",
  database: "gooruapp_queue"
});

con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM changeinfo", function (err, result, fields) {
    if (err) throw err;
    // console.log(result);
  });
});

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err.originalError.response.data,'err');
      res.status(500).end();
    });
});

// event handler
async function handleEvent(event) {
  // if (event.type !== 'message' || event.message.type !== 'text') {
  //   // ignore non-text-message event
  //   return Promise.resolve(null);
  // }

  // create a echoing text message
  let echo = {};
  var data = event.message.text.split(" ")
  // console.log(data) 
  console.log(event.source.userId)
  if (event.message.text === 'กี่โมง') {
    echo = { type: 'text', text: 'เที่ยง' };
    
  } 
  else if (event.message.text === String(data))
  {
    echo = { type: 'text',text: 'goin'};
  }
  else if (data[0] === 'Booking'){
    await Booking(data[1],event.source.userId, function(result){
      console.log('resultja ', result);

      return client.replyMessage(event.replyToken, { type: 'text', text: result });
    });          
    // console.log("this is : " + x)   

    // handleText(event.message, event.replyToken, event.source);
    
  }
  else {
    echo = {type: 'text', text: event.message.text + "ok"};
  }

  // use reply API
  
  return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});

async function Booking(data,userId, callback){
  con.query("SELECT * FROM changeinfo where changeNo='"+data+"';", function (err, result, fields) {
    if(result){
      console.log('in result')
        con.query("INSERT INTO capdata (id,changeNo,status,reqdate,lineid,queue,capdate) VALUES ('','"+data+"','1','','"+userId+",'','')", function (err, result2,fields) {
        if(err){
          console.log('err in insert')
        }
      });
      
    }
    console.log('result in booking', result[0])
    return callback(result[0]);
    // resulttest = result[0].email
    // console.log('resulttest',resulttest)
    // console.log(result[0])
    // console.log(result[0].queue)
    
    // if(result==='') {return 1;}
    // else {      
    //   return 0;
    // }
  });
}
async function xx(data,x)
{
  var x = await Booking(data);
  await test(x);
}
function test(x)
{
  if (x==1)
  {
    echo = {type: 'text', text: 'No CRNumber'};
  }
  else{
    echo = {type: 'text', text: 'Queue reserved'};
  }
}
// setTimeout(function(){
    //   con.query("INSERT INTO capdata (id,changeno,status,reqdate,lineid,queue,capdate) VALUES ('','"+data+"','1','','"+line+"','','')", function (err, result2,fields) {
    //     // if (err) throw err;
    //     console.log(result2);
    //   });
    // }, 2000);