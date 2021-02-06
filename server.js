const env           = require('dotenv').config();
const express       = require("express");
const bodyParser    = require("body-parser");
const cors          = require("cors");

const params        = require("./app/config/params.config")
const db            = require("./app/models");

const app           = express();


class Server {
  
  corsOptions = {
    origin: params.corsOptionsOriginUrls
  };

  constructor() {      
      this.initExpressMiddleWare();
      this.initCustomMiddleware();      
      this.initRoutes();
      this.start();
  }

  initExpressMiddleWare() {

    app.use(cors(this.corsOptions));

    // parse requests of content-type - application/json
    app.use(bodyParser.json());

    // parse requests of content-type - application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));
    
    process.on('uncaughtException', (err) => {
      if (err) console.log(err, err.stack);
    });

  }

  initCustomMiddleware() {

    db.sequelize.sync();

    if (process.platform === "win32") {
        require("readline").createInterface({
            input: process.stdin,
            output: process.stdout
        }).on("SIGINT", () => {
            console.log('SIGINT: Closing DB connection');
            db.close();
        });
    }

    process.on('SIGINT', () => {
        console.log('SIGINT: Closing DB connection');
        db.close();
    });

  }

  initRoutes() {

    // simple route
    app.get("/", (req, res) => {
      res.json({ message: "Welcome to My application." });
    })

    require("./app/routes/user.routes")(app);   

  }

  start() {
    // set port, listen for requests
    app.listen(params.PORT, () => {
      console.log(`Server is running on port ${params.PORT}.`);
    });

  } 

}

let server = new Server();
