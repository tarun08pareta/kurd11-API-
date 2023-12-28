const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const upload = require("../middlewares/uplode");   // profile picture ke liye
const usercontrollers = require("../controllers/user.controller");   // profile
const express = require('express');
const router = express.Router();


module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });

    // profile picture uploade ke liye
    module.exports = function (app) {
      router.post('/store', upload.array('profilePicture'), usercontrollers.store);
      // Define other routes using `router.post`, `router.get`, etc.
    
      app.use('/api/auth', router); // Mount the router under '/api/auth'
    };
  
    app.get("/api/test/all", controller.allAccess);
  
    app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);
  
    app.get(
      "/api/test/mod",
      [authJwt.verifyToken, authJwt.isModerator],
      controller.moderatorBoard
    );
  
    app.get(
      "/api/test/admin",
      [authJwt.verifyToken, authJwt.isAdmin],
      controller.adminBoard
    );
  };
  module.exports = router;// profile