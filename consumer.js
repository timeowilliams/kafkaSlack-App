const kafka = require("./kafkaClient");
require("dotenv").config();
const { IncomingWebhook } = require("@slack/webhook");
const slack = new IncomingWebhook(process.env.SLACK_INCOMING_WEBHOOK_URL);
const consumer = kafka.consumer({
  groupId: process.env.GROUP_ID,
});

const main = async () => {
  await consumer.connect()
  .then(()=> console.log('Consumer connected'))

  await consumer
    .subscribe({
      topic: process.env.TOPIC,
      fromBeginning: true,
    })
    .then(()=> console.log(`Consumer subscribed to ${process.env.TOPIC}`))
    .catch((err) => console.log("Error in subscribing", err));


  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("topic is", topic);
      console.log("Received this message", {
        topic,
        partition,
        key: message.key.toString(),
        value: message.value.toString(),
      });

      // Remember that we need to deserialize the message value back into a Javascript object
      // by using JSON.parse on the stringified value.
      //const { package, version } = JSON.parse(message.value.toString());

      const text = `Moving to Brooklyn eh?`;
      await slack.send({
        text,
        username: "Timeo Williams",
      });
    },
  });
};

main().catch(async (error) => {
  console.error(error);
  try {
    await consumer.disconnect();
  } catch (e) {
    console.error("Failed to gracefully disconnect consumer", e);
  }
  process.exit(1);
});
