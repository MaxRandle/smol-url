const express = require("express"); // http request handler
const cors = require("cors"); // cross-origin resource sharing
const morgan = require("morgan"); // logging
const helmet = require("helmet"); // basic security
const yup = require("yup"); // schema & validation
const monk = require("monk"); // mongodb client
const { nanoid } = require("nanoid"); // generate strings
require("dotenv").config(); // access local environment

// constants
const __prod__ = process.env.NODE_ENV === "production"; // production boolean
const PORT = process.env.PORT; // server port
const URL_LENGTH = 5; // length of generated smols
const DATABASE_URI = process.env.MONGODB_URI; // uri of database
const SELF_URL = __prod__
  ? process.env.SELF_URL
  : process.env.SELF_URL + ":" + PORT;

// db connection
const db = monk(DATABASE_URI, () => {
  console.log("database connection successful");
});
const smolUrls = db.get("smolUrls"); // get database collection 'smolUrls'
smolUrls.createIndex("smol", { unique: true }); // so we can look up records by smol

// middleware
const app = express();
app.use(helmet());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

// serve the static html
app.use(express.static("build"));
app.use("/error", express.static("build"));

// redirect to url
app.get("/:smol", async (req, res) => {
  const { smol } = req.params;
  try {
    const smolUrl = await smolUrls.findOne({ smol });
    if (smolUrl) {
      res.redirect(smolUrl.url);
    } else {
      res.redirect(`${SELF_URL}error`);
    }
  } catch (error) {
    res.send(error.message);
  }
});

// create the smolUrl schema
const smolUrlSchema = yup.object().shape({
  smol: yup
    .string()
    .trim()
    .matches(/[\w\-]/i),
  url: yup.string().trim().url().required(),
});

// create a smol url
app.post("/url", async (req, res, next) => {
  let { smol, url } = req.body;
  try {
    // validate the smolUrl against the schema
    await smolUrlSchema.validate({ smol, url });
    if (!smol) {
      smol = nanoid(URL_LENGTH);
    }
    smol = smol.toLowerCase();
    const newSmolUrl = { url, smol };
    const created = await smolUrls.insert(newSmolUrl);
    res.json({ ...created, link: SELF_URL + smol });
    // res.send();
  } catch (error) {
    // catch the duplicate smol error
    if (error.message.startsWith("E11000")) {
      error.message = "smol already in use";
    }
    next(error); // jump to the error handler
  }
});

// error handler
app.use((error, req, res, next) => {
  if (error.status) {
    res.status(error.status);
  } else {
    res.status(500);
  }
  res.json({
    message: error.message, // return the error message
    // if not in production return the error stack
    stack: __prod__ ? "no error stack in prod :(" : error.stack,
  });
});

app.listen(PORT, () => {
  console.log("Server listening over port", PORT);
});
