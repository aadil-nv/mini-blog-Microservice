const express = require("express");
const app = express();
const dotenv = require("dotenv");
const amqp = require("amqplib");
const colors = require("colors");
const postRouter = require("./Routes/postRouter");
const connectDB = require("./config/db");
const { addComment } = require("./Controller/postController"); 

dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(express.json());
connectDB();

app.get("/", (req, res) => {
  console.log("Server is started");
  res.send("Server is running");
});

app.use("/api/post/", postRouter);

async function startConsumer() {
  try {
    const connection = await amqp.connect(
      process.env.RABBITMQ_URL || "amqp://localhost"
    );
    const channel = await connection.createChannel();
    const queue = "postServiceQueue";

    await channel.assertQueue(queue, { durable: false });

    console.log(`Listening for messages on queue: ${queue}`.bgGreen);

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const commentData = JSON.parse(msg.content.toString());

        console.log(`Received comment: ${JSON.stringify(commentData)}`.bgBlue);

        await addComment(commentData);

        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error(`Error in RabbitMQ Consumer: ${error.message}`.red);
  }
}

startConsumer();


app.listen(PORT, () => {
  console.log(
    `Post-server is started on http://localhost:${PORT}`.bold.bgYellow
  );
});
