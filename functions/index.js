// video #1 that describes firebase and expressJs
// https://www.youtube.com/watch?v=iIVlRZIo2-c
// video #1 Authentication, one of twenty-four courses (note: index=<course number>)
// https://www.youtube.com/watch?v=aN1LnNq4z54&list=PL4cUxeGkcC9jUPIes_B8vRjn1_GaplOPQ&index=1


const functions = require("firebase-functions");

const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
admin.initializeApp();

const app = express();
app.use(cors({origin: true}));

app.post("/", async (req, res) => {
  const user = req.body;
  await admin.firestore().collection("users").add(user);
  res.status(201).send();
});

app.get("/", async (req, res) => {
  const snapshot = await
  admin.firestore().collection("users").get();
  const users = [];
  snapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();

    users.push({id, ...data});
  });

  res.status(200).send(JSON.stringify(users));
});


app.get("/:id", async (req, res) => {
  const snapshot = await
  admin.firestore().collection("users").doc(req.params.id).get();
  const userId = snapshot.id;
  const userData = snapshot.data();
  res.status(200).send(JSON.stringify({id: userId, userData}));
});

app.put("/:id", async (req, res) => {
  const body = req.body;
  await
  admin.firestore().collection("users").doc(req.params.id).update(body);
  res.status(200).send();
});

app.delete("/:id", async (req, res) => {
  await
  admin.firestore().collection("users").doc(req.params.id).delete();
  res.status(200).send();
});

exports.user= functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send(agenda);
});

const agenda = {
  "isAgenda": true,
  "body": "Board of Officers",
  "updated": "getDate()",
  "scheduled": "1953-04-20T16:20:00-08:00",
  "adjourned": "",
  "callToOrder": "",
  "location": "Location: Webinar...instructions and link Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "title": "Regular Meeting",
  "members": [],
  "joint": [],
  "inAttendance": 0,
  "agendaItems": [],
};
