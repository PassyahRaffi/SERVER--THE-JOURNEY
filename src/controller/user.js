const { tb_user } = require("../../models");
const jwt_decode = require('jwt-decode');

const cloudinary = require("../utils/cloudinary");

exports.addUsers = async (request, response) => {
  try {
    await tb_user.create(request.body);

    response.send({
      status: "success",
      message: "Add User Finished",
    });
  } catch (error) {
    console.log(error);
    response.send({
      status: "failed",
      message: "Server Error!",
    });
  }
};

exports.getUsers = async (request, response) => {
  try {
    const users = await tb_user.findAll({
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    response.send({
      status: "success",
      data: {
        users,
      },
    });
  } catch (error) {
    console.log(error);
    response.send({
      status: "failed",
      message: "Server Error!",
    });
  }
};

// exports.getUser = async (request, response) => {
//   try {
//     const { id } = request.params;
//     const data = await tb_user.findOne({
//       attributes: {
//         exclude: ["password", "createdAt", "updatedAt"],
//       },
//       where: {
//         id,
//       },
//     });

//     if (!data) {
//       return response.status(404).send({
//         status: "failed",
//         message: "User Not Found!",
//       });
//     }

//     response.send({
//       status: "success",
//       message: "Get User Success!",
//       user: data,
//     });
//   } catch (error) {
//     console.log(error);
//     response.status(500).send({
//       status: "failed",
//       message: "Server Error!",
//     });
//   }
// };

exports.getUser = async (request, response) => {
  try {
    const token = request.header("Authorization")
    let decoded = jwt_decode(token)

    const data = await tb_user.findOne({
      where: {
        id: decoded.id,
      },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    response.send({
      status: "Success",
      data: {
        email: data.email,
        name: data.name,
        image: process.env.USER_PATH + data.image,
      },
    });
  } catch (error) {
    console.log(error);
    response.send({
      status: "Failed",
      message: "Server Error",
    });
  }
};

exports.deleteUser = async (request, response) => {
  try {
    const { id } = request.params;

    await tb_user.destroy({
      where: {
        id,
      },
    });

    response.send({
      status: "success",
      message: `Delete User Id: ${id} Success!`,
    });
  } catch (error) {
    console.log(error);
    response.send({
      status: "failed",
      message: "Server Error!",
    });
  }
};

// exports change data user
exports.updateUser = async (request, response) => {
  try {
    const { id } = request.params;

    await tb_user.update(request.body, {
      where: {
        id,
      },
    });

    response.send({
      status: "success",
      message: `Update User Id: ${id} Success!`,
      data: request.body,
    });
  } catch (error) {
    console.log(error);
    response.send({
      status: "failed",
      message: "Server Error!",
    });
  }
};

// exports change image
exports.updateUserImage = async (request, response) => {
  try {
    const { id } = request.params;
    let decoded = jwt_decode(token)

    const oldFile = await tb_user.findOne({
      where: {
        id: decoded.id
      }
    })

    // let imageFile = "uploads/" + oldFile.image
    if ( oldFile.image !== "default.png" ) {
      cloudinary.uploader.destroy(oldFile.image, function (result) {
        console.log(result);
      });
    }

    const result = await cloudinary.uploader.upload(request.file.path, {
      folder: "APP-THE-JOURNEY",
      use_filename: true,
      unique_filename: true,
    });

    const data = await tb_user.update(
      {
        image: result.public_id,
      },
      {
        where: {
          id: decoded.id
        },
      }
    );

    response.status(200).send({
      status: "Success",
      message: `Image User with Id: ${id} Updated`,
      data,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({
      status: "Failed",
      message: "Server Error",
    });
  }
};