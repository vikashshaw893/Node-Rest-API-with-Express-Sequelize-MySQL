const env           = require('dotenv').config();
const express       = require("express");
const bodyParser    = require("body-parser");
const cors          = require("cors");

const params        = require("./app/config/params.config")
const db            = require("./app/models");

const app = express();

var corsOptions = {
    origin: params.corsOptionsOriginUrls
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

db.sequelize.sync();

// simple route
app.get("/", (req, res) => {
        res.json({ message: "Welcome to My application." });
    })

require("./app/routes/user.routes")(app);    

// set port, listen for requests
app.listen(params.PORT, () => {
  console.log(`Server is running on port ${params.PORT}.`);
});
