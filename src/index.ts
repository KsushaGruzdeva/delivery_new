import bodyParser from "body-parser";
import cookie from "cookie-parser";
import cors from "cors";
import express from "express";
import path from "path";

import { router } from "./controllers";
import { connect } from "./db/connect";
import { TokenPayload } from "./types/token";

declare global {
  namespace Express {
    interface Request {
      tokenData?: TokenPayload
    }
  }
}

const app = express();
const PORT = 4000;

app.set("view engine", "ejs");

app.use(
  cors({
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookie());
app.use("/assets", express.static(path.join(__dirname, "../assets")));
app.use(router);

(async () => {
  await connect();
  app.listen(PORT, () => console.log(`Server started at http://127.0.0.1:${PORT}...`));
})();
