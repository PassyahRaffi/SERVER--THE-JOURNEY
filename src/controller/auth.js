const { tb_user } = require("../../models");

const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// input variabel upload server
// const uploadServer = "http://localhost:5000/uploads/";

const cloudinary = require("../utils/cloudinary");

exports.register = async (request, response) => {
  // Joi scheme
  const scheme = joi.object({
    name: joi.string().min(4).required(),
    phone: joi.number().min(6).required(),
    email: joi.string().min(6).required(),
    password: joi.string().min(4).required(),
  });

  // Do Validation & get error object from Schema
  const { error } = scheme.validate(request.body);

  // If error exist send Validation error message
  if (error) {
    return response.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });
  }

  try {
    const existUser = await tb_user.findOne({
      where: {
        email: request.body.email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if (existUser) {
      return response.status(400).send({
        status: "failed",
        message: "Email Already Registered!",
      });
    }

    // Generate salt (random value) with 10 rounds
    const salt = await bcrypt.genSalt(10);
    // Hashing password from request with salt
    const hashedPassword = await bcrypt.hash(request.body.password, salt);

    const newUser = await tb_user.create({
      name: request.body.name,
      phone: request.body.phone,
      email: request.body.email,
      password: hashedPassword,
      image: "default-user.png", /* input here */
    });

    const token = jwt.sign(
      {
        id: tb_user.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        password: newUser.password,
        image: newUser.image, /* input here */
      },
      process.env.JWT_KEY
    );

    response.status(200).send({
      status: "success",
      message: "Register Success!",
      data: {
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        image: newUser.image, /* input here */
        token,
      },
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({
      status: "failed",
      message: "Server Error!",
    });
  }
};

exports.login = async (request, response) => {
  // Validation Schema
  const scheme = joi.object({
    email: joi.string().email().min(6).required(),
    password: joi.string().min(4).required(),
  });

  // Do Validation & get error object from Schema
  const { error } = scheme.validate(request.body);
  // If error exist send Validation error message
  if (error) {
    return response.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });
  }

  try {
    const existUser = await tb_user.findOne({
      where: {
        email: request.body.email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!existUser) {
      return response.status(400).send({
        status: "failed",
        message: "Email Is Not Registered!",
      });
    }

    // Compare password between entered from client and from database
    const isValid = await bcrypt.compare(
      request.body.password,
      existUser.password
    );
    // Check if not valid then return response with status 400 ( Bad Request )
    if (!isValid) {
      return response.status(400).send({
        status: "failed",
        message: "Password Incorrect!",
      });
    }

    const token = jwt.sign({ id: existUser.id, name: existUser.name, email: existUser.email, image: existUser.image }, process.env.JWT_KEY);
    
    const user = {
      id: existUser.id,
      name: existUser.name,
      email: existUser.email,
      phone: existUser.phone,
      image: process.env.USER_PATH + "user-journey/" + existUser.image, /* add here */
      token,
    };

    response.status(200).send({
      status: "succes",
      message: "Login Success!",
      data: { user },
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({
      status: "failed",
      message: "Server Error!",
    });
  }
};

exports.checkAuth = async (request, response) => {
  try {
    const id = request.tb_user.id;

    const dataUser = await tb_user.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    if (!dataUser) {
      return response.status(404).send({
        status: "failed",
        message: "User not Found",
      });
    }

    response.send({
      status: "success",
      data: {
        user: {
          id: dataUser.id,
          name: dataUser.name,
          email: dataUser.email,
          phone: dataUser.phone,
          image: process.env.USER_PATH + "user-journey/" + existUser.image, /* add here */
        },
      },
    });
  } catch (error) {
    console.log(error);
    response.status(500).status({
      status: "failed",
      message: "Server Error!",
    });
  }
};