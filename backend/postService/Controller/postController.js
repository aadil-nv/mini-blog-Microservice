const asynchandler = require("express-async-handler");
const Posts = require("../Models/postModel");

const postBlog = asynchandler(async (req,res) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  if (!title || !content) {
    return res.status(400).json({
      message:
        !title && !content
          ? "Title and content are required"
          : !title
          ? "Title is required"
          : "Content is required",
    });
  }

  try {
    const newPost = await Posts.create({
      title,
      content,
      author: userId,
    });

    res.status(201).json({
      message: "Post created successfully",
      postId:newPost._id,
      post: newPost,
      userId:userId
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating post",
      error: error.message,
    });
  }
});

 const getPost = asynchandler(async (req,res)=>{
    const {id}= req.params
    const postData = await Posts.findById(id)

    if(!postData){
        res.status(404).json({message:"Post not found "})
    }

    res.status(302).json({
        message:"Post found successfully",
        postContent:postData
    })
    
 })


const addComment = asynchandler(async (commentData) => {
    const { postId, comment } = commentData;
  
    console.log("Post ID:", postId);
    console.log("Comment Data:", comment);
  

    const post = await Posts.findById(postId);  
     console.log("post");
     
    if (!post) {
      console.log("post not found");
      
    }
  
    post.comments.push({
      content: comment.content,
      user: comment.user,
      createdAt: new Date(),
    });
  
  
    const updatedPost = await post.save();
  
    return {
        message: "Comment added in post successfully",
        updatedPost,
    };
});

const getAllPost= asynchandler (async (req,res)=>{
  console.log("hitting data ");
  
  const postData = await Posts.find()
  if(postData){
    res.status(200).json({message:"All posts available",postData})
  }
})



module.exports = {
  postBlog,
  getPost,
  addComment,
  getAllPost
};
