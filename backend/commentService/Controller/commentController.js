const amqp = require('amqplib');
const asyncHandler = require('express-async-handler');
const Comments = require('../Models/commentModel'); // Adjust the path as necessary

const addComment = asyncHandler(async (req, res) => {
  const { content, user, postId } = req.body;
  const userId = req.user.id;

  if (!content) {
    return res.status(400).json({ message: "Comment content is required" });
  }

  if (!user) {
    return res.status(400).json({ message: "User is required" });
  }

  if (!postId) {
    return res.status(400).json({ message: "Post ID is required" });
  }

  const comment = new Comments({
    content,
    user: userId,
    postId
  });

  const savedComment = await comment.save();

  // Connect to RabbitMQ
  const connection = await amqp.connect('amqp://localhost'); // Adjust the URL as necessary
  const channel = await connection.createChannel();
  const queue = 'postServiceQueue'; // Queue name

  // Send comment data to RabbitMQ queue
  channel.sendToQueue(queue, Buffer.from(JSON.stringify({
    comment: savedComment,
    postId: postId
  })));

  // Close the connection
  setTimeout(() => {
    connection.close();
  }, 500);

  res.status(201).json({
    message: "Comment added successfully",
    comment: savedComment,
    postId: postId
  });
});

module.exports = { addComment };
