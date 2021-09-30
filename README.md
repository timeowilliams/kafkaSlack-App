 Plan: Create a mini event-driven application

To start the application: 
1. Install Docker onto your machine
2. From the app's directory in your terminal, enter docker-compose up (this will allow you to pull the latest image of Zookeeper and Kafka(hosted from Confluent))
3. Run npm install
4. Open up seperate terminal windows: 
    1. In the first window, start up your producer with node server.js
    2. In the second window, start up your consumer with node consumer.js
    3. Finally, issue a CURL POST command from another window or your computer's main terminal directed at the server port in your server.js. 

    Here's an example: 
    curl -XPOST \
    -H "Content-Type: application/json" \                  
    -H "x-npm-signature: sha256=5a158e8a360b6010ee59e4ca3946e792171776274ea2045f6c065ad85d318325" \
    -d '{"event":"package:publish","name":"@kafkajs/zstd","version":"1.0.0","hookOwner":{"username":"timeo"},"payload":{"name":"@kafkajs/zstd"},"change":{"version":"1.0.0"},"time":1603444214995}' \
    http://localhost:3000/hook

5. Witness the event-driven architecture!
# kafkaSlack-App
