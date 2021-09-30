/* This is the part of the application 
that receives the webhook 
and publishes the message to Kafka. 
Rather than writing your own HTTP server,
 you will rely on the npm-hook-receiver package, 
 which already does this. All you have to 
 do is configure it and provide the event handling logic. 
 Update server.js to contain the following, 
which will set up npm-hook-receiver and configure the HTTP server 
to listen on port 3000:
*/
const kafka = require("./kafkaClient");
const producer = kafka.producer();
const createHookReceiver = require("npm-hook-receiver");
require("dotenv").config();
const main = async () => {
  await producer.connect().then(() => console.log("Producer is connected"));
  const server = createHookReceiver({
    secret: process.env.HOOK_SECRET, //the secret you've shared with the registry for the hook
    mount: "/hook",
  });

  server.on("package:publish", async (event) => {
    try {
      //Send message to kafka
      const responses = await producer.send({
        topic: process.env.TOPIC,
        messages: [
          {
            // Name of the published package as key, to make sure that we process events in order
            key: event.name,

            // The message value is just bytes to Kafka, so we need to serialize our JavaScript
            // object to a JSON string. Other serialization methods like Avro are available.
            value: JSON.stringify({
              package: event.name,
              version: event.version,
            }),
          },
        ],
      });
      console.log("Produced message!", { responses });
      // await producer.disconnect();
    } catch (error) {
      console.error("Error publishing message", error);
    }
  });

  server.listen(3000, () =>
    console.log("Listening and ready to receive hook events")
  );
};

main().catch((err) => {
  console.error("Error is", err);
  process.exit(1);
});

/*
curl -XPOST \
    -H "Content-Type: application/json" \
    -H "x-npm-signature: sha256=7c0456720f3fdb9b94f5ad5e0c231a61e0fd972230d83eb8cb5062e1eed6ff5c" \
    -d '{"event":"package:publish","name":"@kafkajs/zstd","version":"1.0.0","hookOwner":{"username":"timeo"},"payload":{"name":"@kafkajs/zstd"},"change":{"version":"1.0.0"},"time":1603444214995}' \
    http://localhost:3000/hook

  */
