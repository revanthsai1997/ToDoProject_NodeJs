const express = require("express");
const nodeCache = require("node-cache");
const path = require('path');
const uniqid = require('uniqid');
const User = require("../models/User");
const Todo = require("../models/Todo");

const router = express.Router();
const myCache = new nodeCache();

router.post("/login", async (req, res) => {
  try {
    if (
      req.session.user &&
      myCache.get("loggedinUser") != null &&
      req.body.email == myCache.get("loggedinUser").email
    ) {
      console.log("from cache");
      res.status(200).json({ message: "User login Successful from cache" });
    } else {
      myCache.del("loggedinUser");
      const user = await User.findOne({
        email: req.body.email,
        password: req.body.password,
      });
      if (user == null)
        res.status(401).json({ error: "Invalid email or password" });
      else {
        let userSession = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        };
        req.session.user = userSession;
        myCache.set("loggedinUser", userSession,1*60*60*1000);
        res
          .status(200)
          .json({ message: "User login Successful for first time" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  myCache.close();
  res.status(200).json({ message: "Logout successfull" });
});

router.get("/dashboard", async(req, res) => {
  if (await req.session.user) {
    // res.status(200).json({ message: "Authenticated", user: req.session.user });
    const resData={
      user:req.session.user,
      todos:await Todo.find({user:req.session.user.email, isCompleted:false})
    };
    res.render('dashboard.ejs',resData);
  } else {
    res.sendFile(path.join(__dirname,'../UI/pages/login.html'));
    // res.status(401).json({ error: "Unauthorized" });
  }
});

router.get('/userdetails', (req, res) => {
  try{
    if(req.session.user.email == myCache.get('loggedinUser').email)
      res.status(200).json(myCache.get('loggedinUser'));
    else
      res.status(401).json({ error: "Unauthorized" });
  }catch(error){
    console.error(error);
  }
});

router.post('/addTodo', async (req, res) => {
  try{
    console.log(myCache.get('loggedinUser'));
    if(myCache.get('loggedinUser'))
    {
      const todo = new Todo({
        user: myCache.get('loggedinUser').email,
        todo: req.body.todo,
        todoId: uniqid()+uniqid.process()+uniqid.time()+ (new Date().toString())
      });
      await todo.save();
      res.status(200).json({message:"Success"});
    }
    else
      res.status(401).json({ error: "Unauthorized" });
  }catch(error){
    console.error(error);
  }
});

router.delete('/deleteTodo/:id', async (req, res) => {
  try{
    if(myCache.get('loggedinUser'))
    {
      await Todo.findOneAndDelete({todoId:req.params.id});
      res.status(200).json({message:"Success"});
    }
    else
      res.status(401).json({ error: "Unauthorized" });
  }catch(error){
    console.error(error);
  }
});

router.get('/completeTodo/:id', async (req, res) => {
  try{
    if(myCache.get('loggedinUser'))
    {
      await Todo.findOneAndUpdate({todoId:req.params.id},{isCompleted:true});
      res.status(200).json({message:"Success"});
    }
    else
      res.status(401).json({ error: "Unauthorized" });
  }catch(error){
    console.error(error);
  }
});

router.patch('/updateTodo/:id', async (req, res) => {
  try{
    if(myCache.get('loggedinUser'))
    {
      await Todo.findOneAndUpdate({todoId:req.params.id},{todo:req.body.todo});
      res.status(200).json({message:"Success"});
    }
    else
      res.status(401).json({ error: "Unauthorized" });
  }catch(error){
    console.error(error);
  }
});

module.exports = router;
