const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const path = require("path");
const uniqid = require("uniqid");
const User = require("../models/User");
const Todo = require("../models/Todo");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    if (!validator.isEmail(req.body.email)) {
      res.status(400).json({ message: "Email is Invalid" });
      return;
    }
    const user = await User.findOne({
      email: req.body.email,
    });

    if (user == null) {
      res.status(401).json({ message: "Invalid email" });
    } else {
      const match = await bcrypt.compare(req.body.password, user.password);

      if (!match) {
        res.status(400).json({ message: "Invalid credentials" });
      } else {
        const resUser = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        };
        const token = jwt.sign(resUser, "my-secret-key-jamesbond-007", {
          expiresIn: 5 * 60 * 1000,
        });
        res.status(200).json({
          message: "User login Successful for first time",
          token: `Bearer ${token}`,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader != undefined) {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

const verifyTokenParam = (req, res, next) => {
  const bearerHeader = req.params.token;
  if (typeof bearerHeader != undefined) {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

router.get("/logout", verifyToken, (req, res) => {
  jwt.verify(req.token, "my-secret-key-jamesbond-007", (err, authData) => {
    if (err) {
      res.status(401).json({ error: "Unauthorized" });
    } else {
      res.status(200).json({ message: "Logout sucess" });
    }
  });
});

router.get("/dashboard", verifyToken, async (req, res) => {
  jwt.verify(
    req.token,
    "my-secret-key-jamesbond-007",
    async (err, authData) => {
      if (err) {
        res.sendFile(path.join(__dirname, "../UI/pages/login.html"));
      } else {
        const resData = {
          user: authData,
          todos: await Todo.find({ user: authData.email, isCompleted: false }),
        };
        res.render("dashboard.ejs", resData);
      }
    }
  );
});

router.get("/dashboard/:token", verifyTokenParam, async (req, res) => {
  jwt.verify(
    req.token,
    "my-secret-key-jamesbond-007",
    async (err, authData) => {
      if (err) {
        res.sendFile(path.join(__dirname, "../UI/pages/login.html"));
      } else {
        const resData = {
          user: authData,
          todos: await Todo.find({ user: authData.email, isCompleted: false }),
        };
        res.render("dashboard.ejs", resData);
      }
    }
  );
});

router.get("/userdetails", verifyToken, (req, res) => {
  try {
    jwt.verify(req.token, "my-secret-key-jamesbond-007", (err, authData) => {
      if (err) {
        res.status(401).json({ error: "Unauthorized" });
      } else {
        res.status(200).json(authData);
      }
    });
  } catch (error) {
    console.error(error);
  }
});

router.post("/addTodo", verifyToken, async (req, res) => {
  try {
    jwt.verify(
      req.token,
      "my-secret-key-jamesbond-007",
      async (err, authData) => {
        if (err) {
          res.status(401).json({ error: "Unauthorized" });
        } else {
          const todo = new Todo({
            user: authData.email,
            todo: req.body.todo,
            todoId:
              uniqid() +
              uniqid.process() +
              uniqid.time() +
              new Date().toString(),
          });
          await todo.save();
          res.status(200).json({ message: "Success" });
        }
      }
    );
  } catch (error) {
    console.error(error);
  }
});

router.delete("/deleteTodo/:id", verifyToken, async (req, res) => {
  try {
    jwt.verify(
      req.token,
      "my-secret-key-jamesbond-007",
      async (err, authData) => {
        if (err) {
          res.status(401).json({ error: "Unauthorized" });
        } else {
          await Todo.findOneAndDelete({ todoId: req.params.id });
          res.status(200).json({ message: "Success" });
        }
      }
    );
  } catch (error) {
    console.error(error);
  }
});

router.get("/completeTodo/:id", verifyToken, async (req, res) => {
  try {
    jwt.verify(
      req.token,
      "my-secret-key-jamesbond-007",
      async (err, authData) => {
        if (err) {
          res.status(401).json({ error: "Unauthorized" });
        } else {
          await Todo.findOneAndUpdate(
            { todoId: req.params.id },
            { isCompleted: true }
          );
          res.status(200).json({ message: "Success" });
        }
      }
    );
  } catch (error) {
    console.error(error);
  }
});

router.patch("/updateTodo/:id", verifyToken, async (req, res) => {
  try {
    jwt.verify(
      req.token,
      "my-secret-key-jamesbond-007",
      async (err, authData) => {
        if (err) {
          res.status(401).json({ error: "Unauthorized" });
        } else {
          await Todo.findOneAndUpdate(
            { todoId: req.params.id },
            { todo: req.body.todo }
          );
          res.status(200).json({ message: "Success" });
        }
      }
    );
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
