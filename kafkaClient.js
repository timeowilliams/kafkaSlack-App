const { Kafka } = require("kafkajs");
require("dotenv").config();
const { KAFKA_USERNAME: username, KAFKA_PASSWORD: password } = process.env;
const sasl =
  username && password ? { username, password, mechanism: "plain" } : null;
const ssl = !!sasl;

//Creating an kafka client instance
//Add ssl,sasl params for prod environment
const kafka = new Kafka({
  clientId: "npm-slack-notifier",
  brokers: [process.env.KAFKA_BOOTSTRAP_SERVER],
});

module.exports = kafka;
