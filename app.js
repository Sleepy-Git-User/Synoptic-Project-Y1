const express = require("express"); //Routing
const mailer = require("nodemailer"); //Mailing
const bodyParser = require("body-parser"); //Body parser for parsing form input
const fs = require("fs"); //File system
const app = express();

const transporter = mailer.createTransport({
  service: "Gmail",
  auth: {
    user: "-",
    pass: "-",
  },
});

//View Engine
app.set("view engine", "ejs");
//Setting 'public' as the static folder
app.use("/", express.static("public"));
//Output from the form is in JSON format so that you can do req.body.fname etc
app.use(bodyParser.json());
//Allow results from the form to be converted in to JSON.* (Reference = https://stackoverflow.com/questions/55558402/what-is-the-meaning-of-bodyparser-urlencoded-extended-true-and-bodypar)
app.use(bodyParser.urlencoded({ extended: false }));

const page_directory = __dirname + "/public/documents/";

//Routes for all the pages
app.get("/", function (req, res) {
  res.sendFile(page_directory + "index.html");
});
app.get("/logIn", function (req, res) {
  res.sendFile(page_directory + "logIn.html");
});
app.get("/p2", function (req, res) {
  res.sendFile(page_directory + "p2.html");
});
app.get("/p3", function (req, res) {
  res.sendFile(page_directory + "p3.html");
});
app.get("/p4", function (req, res) {
  res.sendFile(page_directory + "p4.html");
});
app.get("/p5", function (req, res) {
  res.sendFile(page_directory + "p5.html");
});
app.get("/p6", function (req, res) {
  res.sendFile(page_directory + "p6.html");
});
app.post("/submit", async function (req, res) {
  //Checks that the submission is populated
  if (
    req.body.fname.length <= 0 ||
    req.body.lname.length <= 0 ||
    req.body.email.length <= 0
  ) {
    //Resends webpage if theres an error
    res.sendFile(page_directory + "-");
  } else {
    //Submission was populated correctly
    //Add submission to Submissions.json
    fs.appendFile(
      "Submissions.json",
      JSON.stringify(req.body) + "\n",
      (err) => {
        if (err) {
          console.log(err);
          //Letting the user know there was an error
          res.send("Error saving your submission. Please try again later.");
        }
      }
    );

    await transporter.sendMail({
      from: '"Climate Change" <climatechangewebdev2@gmail.com>', // sender address
      to: req.body.email, //Email address that was submitted
      subject: "Thank you for signing up!", //Subject
      text: "Thank you for signing up today! Its up to all of us to make a difference. We will get back to you shortly.", // plain text body
      html:
        "<h1>" +
        req.body.fname +
        " " +
        req.body.lname +
        " thank you for signing up! We will get back to you shortly!</h1>",
    });
    //Render confirmation page
    res.render("confirmation", {
      response: req.body,
    });
  }
});
//Catches any incorrect url's that the user searches for
app.get("/*", function (req, res) {
  res.sendFile(page_directory + "Error.html");
});

//Runs app on port 1337
app.listen(1337, (err) => {
  console.log("server running on port 1337");
});
