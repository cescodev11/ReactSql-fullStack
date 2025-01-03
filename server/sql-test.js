const mysql = require("mysql2");

// Replace with your actual database credentials
const connection = mysql.createConnection({
  host: "localhost",
  user: "root", // Your MySQL username
  password: "puzzleinspace7", // Your MySQL password
  database: "UserDB", // Replace with your database name
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL!");
  connection.end();
});
