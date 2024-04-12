import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import {
  createPerson,
  deletePerson,
  getPersons,
  updatePerson,
} from "./controllers/PersonController.js";
import {
  createPersonValidation,
  updatePersonValidation,
} from "./validations.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";

mongoose
  .connect("mongodb://localhost:27017/data")
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

const app = express();

app.use(express.json());

app.use(cors());

app.get("/api/person", getPersons);
app.post(
  "/api/person",
  createPersonValidation,
  handleValidationErrors,
  createPerson
);
app.put(
  "/api/person/:personId",
  updatePersonValidation,
  handleValidationErrors,
  updatePerson
);
app.delete("/api/person/:personId", deletePerson);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});
