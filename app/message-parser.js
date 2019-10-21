"use strict";
const RabbitClient = require('@menome/botframework/rabbitmq');
const helpers = require("./helpers");

module.exports = function(bot) {
  var outQueue = new RabbitClient(bot.config.get('rabbit_outgoing'));
  outQueue.connect();

  // First ingestion point.
  this.handleMessage = function(msg) {
    return processMessage(msg).then((resultStr) => {
      var newRoute = helpers.getNextRoutingKey(resultStr, bot);

      if(newRoute === false || newRoute === undefined) {
        return bot.logger.info("No next routing key.");
      }

      if(typeof newRoute === "string") {
        bot.logger.info("Next routing key is '%s'", newRoute)
        return outQueue.publishMessage(msg, "fileProcessingMessage", {routingKey: newRoute});
      }
      else if(Array.isArray(newRoute)) {
        bot.logger.info("Next routing keys are '%s'", newRoute.join(', '))
        newRoute.forEach((rkey) => {
          return outQueue.publishMessage(msg, "fileProcessingMessage", {routingKey: rkey});
        })
      }
    }).catch((err) => {
      bot.logger.error(err);
    })
  }

  //////////////////////////////
  // Internal/Helper functions

  function processMessage(msg) {
    //get bucket location and extraction type, send it to correct python process
    bot.logger.info("Processing message: " + msg.Uuid);
      return bot.td.analyze(msg).then((data) => {
        if(!data) return false;
        var harvesterMessage = {
          'NodeType': 'Card',
          'Priority':2,
          'ConformedDimensions': {
            'Uuid': msg.Uuid
          },
          'SourceSystem': 'tableDetector',
          'Properties': {
            'TableProbability':JSON.stringify(data)

          },
          'Connections': []
        }
        var sent = outQueue.publishMessage(harvesterMessage, "harvesterMessage", {
          routingKey: 'syncevents.harvester.updates.tableDetector', 
          exchange: 'syncevents'
        })
        
        if(sent === true)
          bot.logger.info("Sent extraction to refinery.")

        return sent;
      });
  }
}