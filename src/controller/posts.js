const { tb_post, tb_user } = require("../../models");
const cloudinary = require("../utils/cloudinary");

exports.getAllPost = async (request, response) => {
  try {
    let data = await tb_post.findAll({
      include: [
        {
          model: tb_user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
      ],
    });

    data = JSON.parse(JSON.stringify(data));

    data = data.map((item) => {
      return {
        ...item,
        thumbnail: process.env.FILE_PATH + item.thumbnail,
      };
    });

    response.send({
      status: "success",
      message: "Get All Posts Success!",
      data: {
        posts: data,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Get All Post Error!",
    });
  }
};

exports.getPost = async (request, response) => {
  try {
    let { id } = request.params;
    let data = await tb_post.findOne({
      where: {
        id,
      },
      include: [
        {
          model: tb_user,
          as: "user",
        },
      ],
    });

    data = JSON.parse(JSON.stringify(data));
    data = {
      ...data,
      thumbnail: process.env.FILE_PATH + data.thumbnail,
    };

    response.send({
      status: "success",
      data,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.addPost = async (request, response) => {
  try {
    // const { id } = request.params;
    let user = request.tb_user.id;
    let findUser = await tb_user.findOne({
      where: {
        id: user,
      },
    });

    findUser = JSON.parse(JSON.stringify(findUser));
    findUser = {
      ...findUser,
    };

    const result = await cloudinary.uploader.upload(request.file.path, {
      folder: "Blog_files",
      use_filename: true,
      unique_filename: true,
    });

    let newPost = await tb_post.create({
      title: request.body.title,
      description: request.body.description,
      thumbnail: result.public_id,
      idUser: user,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

    newPost = JSON.parse(JSON.stringify(newPost));
    newPost = {
      ...newPost,
      ...findUser,
      thumbnail: process.env.FILE_PATH + newPost.thumbnail,
    };

    response.send({
      status: "Success",
      newPost,
    });
  } catch (error) {
    console.log(error);
    response.send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.editPost = async (request, response) => {
  try {
    const { id } = request.params;
    const newData = request.body;
    await tb_post.update(newData, {
      where: {
        id,
      },
    });
    response.send({
      status: "success",
      message: "update post succes",
    });
  } catch (error) {
    console.log(error);
    response.send({
      status: "server error",
    });
  }
};

exports.detailPost = async (request, response) => {
  try {
    const { id } = request.params;
    let detail = await tb_post.findOne({
      where: {
        id,
      },
      include: [
        {
          model: tb_user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password", "email"],
          },
        },
      ],
    });

    detail = JSON.parse(JSON.stringify(detail));
    detail = {
      ...detail,
      thumbnail: process.env.FILE_PATH + detail.thumbnail,
    };

    if (!detail) {
      response.status(404).send({
        status: "Failed",
        message: "Post Not Found!",
      });
    } else {
      response.send({
        status: "success",
        message: "Get Detail Post Success!",
        detail,
      });
    }
  } catch (error) {
    console.log(error);
    response.send({
      status: "server error",
    });
  }
};

exports.deletePost = async (request, response) => {
  try {
    const { id } = request.params;

    const post = await tb_post.findOne({
      where: {
        id,
        idUser: req.tb_user.id,
      },
    });

    let thumbnailFile = "uploads/" + post.thumbnail;

    // Delete thumbnail file
    if (post.image !== "default-user.png") {
      fs.unlink(thumbnailFile, (err) => {
        if (err) console.log(err);
        else console.log("\nDeleted file: " + thumbnailFile);
      });
    }

    await tb_post.destroy({
      where: {
        id,
      },
    });
    response.send({
      status: "succees",
      message: `Deleted Post Id: ${id}`,
      data: {
        id,
      },
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({
      status: "failed",
      message: "Delete Post Error!",
    });
  }
};

exports.getPostUser = async (request, response) => {
  try {
    const { id } = request.params;
    let data = await tb_post.findAll({
      where: {
        idUser: id,
      },
      include: [
        {
          model: tb_user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
      ],
    });

    data = JSON.parse(JSON.stringify(data));

    data = data.map((item) => {
      return {
        ...item,
        thumbnail: process.env.FILE_PATH + item.thumbnail,
      };
    });

    response.send({
      status: "success",
      message: "Get User Post Success!",
      data: {
        posts: data,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Get Post User Error!",
    });
  }
};
