import { validationResult } from "express-validator";
import PersonModel from "../models/Person.js";

export const createPerson = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, phoneNumber, email, dateOfBirth, passport } = req.body;
    const person = await PersonModel.create({
      fullName,
      phoneNumber,
      email,
      dateOfBirth,
      passport,
    });

    res.json(person);
  } catch (error) {
    if (error.code === 11000) {
      let message = "";
      if (error.keyPattern.email) {
        message = "Электронная почта уже используется";
      } else if (error.keyPattern.phoneNumber) {
        message = "Номер телефона уже используется";
      }

      res.setHeader("Access-Control-Allow-Origin", "*"); // Or set specific allowed origins
      res.setHeader("Access-Control-Allow-Methods", "POST");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      return res.status(400).json({ message });
    }
    console.error(error);
    res.status(500).json({ message: "Не удалось создать запись о человеке" });
  }
};

export const getPersons = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const skip = (page - 1) * pageSize;

    const totalPersons = await PersonModel.countDocuments();

    const persons = await PersonModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .exec();

    res.json({
      persons,
      totalPages: Math.ceil(totalPersons / pageSize),
      currentPage: page,
      totalPersons,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить записи",
    });
  }
};

export const updatePerson = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { personId } = req.params;
    const { fullName, phoneNumber, email, dateOfBirth, passport } = req.body;

    let person = await PersonModel.findById(personId);
    if (!person) {
      return res.status(404).json({ message: "Человек не найден" });
    }

    if (email && email !== person.email) {
      const existingPersonWithEmail = await PersonModel.findOne({ email });
      if (existingPersonWithEmail && existingPersonWithEmail._id != personId) {
        return res
          .status(405)
          .json({ message: "Электронная почта уже используется" });
      }
    }
    if (phoneNumber && phoneNumber !== person.phoneNumber) {
      const existingPersonWithPhoneNumber = await PersonModel.findOne({
        phoneNumber,
      });
      if (
        existingPersonWithPhoneNumber &&
        existingPersonWithPhoneNumber._id != personId
      ) {
        return res
          .status(406)
          .json({ message: "Номер телефона уже используется" });
      }
    }

    person = await PersonModel.findByIdAndUpdate(
      personId,
      { fullName, phoneNumber, email, dateOfBirth, passport },
      { new: true }
    );

    res.json(person);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Не удалось обновить запись о человеке" });
  }
};

export const deletePerson = async (req, res) => {
  try {
    const { personId } = req.params;

    const deletedPerson = await PersonModel.findByIdAndDelete(personId).exec();

    if (!deletedPerson) {
      return res.status(404).json({
        message: "Человек не найден",
      });
    }

    res.json({ message: "Человек успешно удален" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Не удалось удалить запись о человеке",
    });
  }
};
