/**
 * Wraps the Python topic modeler program.
 */
const { execFile } = require('child_process');
const helpers = require('./helpers');
var fs = require('fs');

module.exports = function(bot) {
  /**
   * Takes text as input, returns a JSON object containing topic IDs and their weights.
   * @param {*} text The text to model
   */
  this.analyze = function(msg) {
    var filePath= "/tmp/" + msg.Uuid + ".png"
    return helpers.getFile(bot, msg.Library, msg.Path, filePath).then((filePath)=>{
      return new Promise((resolve,reject) => {
        var command = "tabulo predict " + filePath + " --checkpoint 6aac7a1e8a8e -f /tmp/output.json -d /tmp/output"
        bot.logger.info("Running command: " + command)
        execFile(command,{maxBuffer: 1024000,cwd: __dirname+"/.."},(err,stdout,stderr) => {
          if(err) {
            bot.logger.error("subprocess stderr:", stderr + '\n' + err);
            return reject(err);
          }
          bot.logger.info("tabulo returned. " + stdout)
          //open ../output.json
          var obj = JSON.parse(fs.readFileSync('/tmp/output.json', 'utf8'));
          // Parse stdout as JSON. Will throw an error on failure. 
          var response = JSON.parse(obj);
          bot.logger.info(response); 
          // delete the file       
          helpers.deleteFile(filePath); 
          helpers.deleteFile("/tmp/output/*"); 
          // return probability
          return resolve(response); 
        })
      })
    }).catch(function(err){
      bot.logger.error(err)
    })

  }

  this.initialize = function(){
  }
  


}