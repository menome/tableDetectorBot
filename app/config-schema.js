/**
 * Copyright (c) 2017 Menome Technologies Inc.
 * Configuration for the bot
 */
"use strict";

module.exports = {
  rabbit_outgoing: {
    url: {
      doc: "The URL of the rabbitmq endpoint. ",
      format: String,
      default: "amqp://rabbitmq:rabbitmq@rabbit:5672?heartbeat=3600",
      env: "RABBIT_OUTGOING_URL",
      sensitive: true
    },
    routingKey: {
      doc: "The URL of the rabbitmq endpoint. ",
      format: String,
      default: "syncevents.harvester.updates.example",
      env: "RABBIT_OUTGOING_ROUTING_KEY"
    },
    exchange: {
      doc: "The RMQ Exchange we're connecting to",
      format: String,
      default: "syncevents",
      env: "RABBIT_OUTGOING_EXCHANGE"
    },
    exchangeType: {
      doc: "The type of RMQ exchange we're creating",
      format: ["topic","fanout"],
      default: "topic",
      env: "RABBIT_OUTGOING_EXCHANGE_TYPE"
    },
    prefetch: {
      doc: "Number of items we can be processing concurrently",
      format: Number,
      default: 5,
      env: "RABBIT_OUTGOING_PREFETCH" 
    }
  },
  downstream_actions: { // Tells us where to put stuff based on 
    doc: "Key/value pairs. keys are string-type result codes. Values are the next routing key to push the message to, or false to end the processing.",
    default: { success: false, error: false},
    format: function check(routing) {
      Object.keys(routing).forEach((key) => {
        if(typeof routing[key] !== 'string' && routing[key] !== false && !Array.isArray(routing[key]))
          throw new Error("Routing keys must be strings, or 'false'.")
      })
    }
  }//,
  // textract: {
  //   access_key_id: {
  //     doc: "your access key id",
  //     format: String,
  //     default:'',
  //     env: "ACCESS_KEY_ID" 
  //   },
  //   secret_access_key:{
  //     doc:"the secret access key",
  //     format: String,
  //     default:"",
  //     env:"SECRET_ACCESS_KEY"
  //   },
  //   aws_region:{
  //     doc:"the region to connect to",
  //     format: String,
  //     default:"us_east_2",
  //     env:"AWS_REGION"
  //   },
  //   default_output_format:{
  //     doc:"the default return format",
  //     format: String,
  //     default:"json",
  //     env:"DEFAULT_OUTPUT_FORMAT"
  //   },
  //   mount:{
  //     doc:"location to download files to",
  //     format: String,
  //     default:"../uploads/",
  //     env:"MOUNT"
  //   }
  // }

}