import { body } from "express-validator";

export const createPersonValidation = [
  body("fullName", "Введите ФИО").isLength({ min: 3 }).isString(),
  body("phoneNumber", "Введите корректный номер телефона").isMobilePhone(
    "any",
    { strictMode: false }
  ),
  body("email", "Введите корректный адрес электронной почты").isEmail(),
  body("dateOfBirth", "Введите корректную дату рождения").isISO8601(),
  body("passport", "Введите серию и номер паспорта")
    .isLength({ min: 5, max: 20 })
    .isString()
    .custom((value) => {
      const passportPattern = /^[A-Z0-9]+$/;
      if (!passportPattern.test(value)) {
        throw new Error(
          "Серия и номер паспорта должны содержать только латинские буквы и цифры в верхнем регистре"
        );
      }
      return true;
    }),
];

export const updatePersonValidation = [
  body("fullName", "Введите ФИО").optional().isLength({ min: 3 }).isString(),
  body("phoneNumber", "Введите корректный номер телефона")
    .optional()
    .isMobilePhone("any", { strictMode: false }),
  body("email", "Введите корректный адрес электронной почты")
    .optional()
    .isEmail(),
  body("dateOfBirth", "Введите корректную дату рождения")
    .optional()
    .isISO8601(),
  body("passport", "Введите серию и номер паспорта")
    .optional()
    .isLength({ min: 5, max: 20 })
    .isString()
    .custom((value) => {
      const passportPattern = /^[A-Z0-9]+$/;
      if (!passportPattern.test(value)) {
        throw new Error(
          "Серия и номер паспорта должны содержать только латинские буквы и цифры в верхнем регистре"
        );
      }
      return true;
    }),
];
