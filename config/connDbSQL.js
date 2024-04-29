const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "testnodedb",
});

const connSqlDB = () => {
  connection.connect((err, result) => {
    if (err) {
      console.log(err);
    }

    console.log("SQL database connected on localhost!");
    
  });
};

module.exports = { connection, connSqlDB };
