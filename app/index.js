/** 
 * Copyright (C) 2018 Menome Technologies Inc.  
 * 
 * FPP Bot for running table detection
 */
"use strict";
const Bot = require('@menome/botframework');
const config = require("../config/config.json");
const path = require('path');
const configSchema = require("./config-schema");
const messageParser = require("./message-parser");
const tableDetector = require('./tableDetectorWrapper');
// Start the actual bot here.
var bot = new Bot({
  config: {
    "name": "Table Detection bot",
    "desc": ".",
    ...config
  },
  configSchema
});
//Initialize our textract wrapper copy
//################################
bot.td = new tableDetector(bot);
// Listen on the Rabbit bus.
//##########################
var mp = new messageParser(bot);

//toggle listener function
//########################
bot.tr = function(){
  if(bot.connected){
    bot.rabbit.disconnect();
    bot.connected = false;
    bot.logger.info("Discontinued rabbit listener")
  }else if(!bot.connected){
    bot.rabbit.connect();
    bot.connected=true;
  }
}

//connect to rabbit initially
//###########################
bot.rabbit.addListener("tabledetectqueue",mp.handleMessage,"fileProcessingMessage");
bot.connected = true;

//Set up controllers
//##################
// Let our middleware use these.
bot.web.use((req,res,next) => {
  req.tr = bot.tr;
  next();
});
bot.registerControllers(path.join(__dirname + "/controllers"));

//Start the bot
//#############
bot.start();
bot.changeState({state: "idle"});