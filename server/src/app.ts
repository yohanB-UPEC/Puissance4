import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import UserRoutes from "./Routes/Users";
import MatchMakingRoutes from "./Routes/Matchmaking";

const app = express();
const port = 3000;

app.use(cors({
  origin: ["http://localhost:3001"],
  credentials: true,
}));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use("/", UserRoutes);
app.use("/", MatchMakingRoutes);


app.listen(port, () => {
  console.log(`server is listening on http://localhost:${port}....`);
});
