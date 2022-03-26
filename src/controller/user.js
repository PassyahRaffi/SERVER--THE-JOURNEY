const { tb_user } = require("../../models");

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

exports.getUser = async (request, response) => {
  try {
    const { id } = request.params;
    const data = await tb_user.findOne({
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
      where: {
        id,
      },
    });

    if (!data) {
      return response.status(404).send({
        status: "failed",
        message: "User Not Found!",
      });
    }

    response.send({
      status: "success",
      message: "Get User Success!",
      user: data,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({
      status: "failed",
      message: "Server Error!",
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
    const data = await tb_user.update(
      {
        image: request.file.filename,
      },
      {
        where: {
          id,
        },
      }
    );
    console.log(request.file);

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
