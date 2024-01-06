const express = require("express");
const bodyParser = require("body-parser");
const firebaseAdmin = require("firebase-admin");

const app = express();
const port = 8080; // Change as needed

// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json"); //AccountKey

const firebaseConfig = {
  credential: firebaseAdmin.credential.cert(serviceAccount),
};
firebaseAdmin.initializeApp(firebaseConfig);
const db = firebaseAdmin.firestore();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files from 'public' directory

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public');

// Routes
app.get("/", (req, res) => {
  // Fetch user info from Firebase
  const userId = "USER_ID"; // Replace with the actual user ID
  db.collection("users")
    .doc(userId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        // Render a template with user info
        res.render("home", { user: userData });
      } else {
        res.send("User not found");
      }
    })
    .catch((error) => {
      res.send("Error fetching user info");
    });
});

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  // Example: Authenticate user using Firebase Authentication
  firebaseAdmin
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // User authenticated successfully
      res.redirect("/");
    })
    .catch((error) => {
      // Handle authentication failure
      res.send("Login Failed");
    });
});

app.route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post((req, res) => {
    const userData = req.body;
    // Save user data to Firebase Firestore
    db.collection("users")
      .add(userData)
      .then((docRef) => {
        res.redirect("/");
      })
      .catch((error) => {
        res.send("Registration Failed");
      });
  });




// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});





