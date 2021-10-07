const db = require("../models/db.model");
const nodemailer = require("nodemailer");
const { issueJwt } = require("../config/jwt");
const { user } = require("../models/db.model");
const User = db.user;
const Op = db.Sequelize.Op;

async function mail(req, code) {
  const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "emsdemo04@gmail.com",
      pass: "",
    },
  });

  let mailDetails = {
    from: "emsdemo04@gmail.com",
    to: req.body.email,
    subject: "Test mail",
    text: `Account varification code ${code}`,
  };

  transport.sendMail(mailDetails, function (err, data) {
    if (err) {
      console.log("Error Occurs");
    } else {
      console.log("Email sent successfully");
      console.log("Your Code is:", code);
    }
  });
}

module.exports.addUser = async (req, res) => {
  try {
    var code = Math.floor(Math.random() * 10000) + 1;

    let { username, email, password } = req.body;
    let user = {
      username: username,
      email: email,
      password: password,
      code: code,
    };

    let userCreate = await User.create(user);
    let confirm = await mail(req, code);

    res.status(200).json({
      success: true,
      message: "user added successfully",
      code: code,
    });
    console.log("User added successfully");
  } catch (err) {
    return res.json({
      success: false,
      message: err.TypeError,
    });
  }
};

module.exports.varify = async (req, res) => {
  try {
    let { email, code } = req.body;
    let user = {
      email: email,
      code: code,
    };
    let userVarify = await User.findAll({
      where: { [Op.and]: [{ email: email }, { code: code }] },
    });

    if (userVarify.length > 0) {
      let userUpdate = await User.update(
        { isActive: "1" },
        {
          where: { email: email },
        }
      );
      res.status(200).json({
        success: true,
        message: "User data varified successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User id not found",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

module.exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = {
      email: email,
      password: password,
    };
    let login = await User.findAll({
      where: { [Op.and]: [{ email: email }, { password: password }] },
    });

    if (login.length > 0) {
      let token = await issueJwt(login[0].dataValues);
      res.status(200).json({
        success: true,
        message: "user login successfully",
        token: token,
      });
      console.log("user LoggedIn SuccessFully!");
    } else {
      res.status(404).json({
        success: false,
        message: "User id not found",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "error",
    });
  }
};

module.exports.editUser = async (req, res) => {
  try {
    let { id } = req.body;

    let userFind = await User.findAll({ where: { id: id } });

    if (userFind.length > 0) {
      let userUpdate = await User.update(req.body, { where: { id: id } });

      if (userUpdate[0] == 1) {
        res.status(200).json({
          success: true,
          message: "User data updated successfully",
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Something went wrong",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "User id not found",
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    let { id } = req.body;
    let userfindOne = await User.findAll({ where: { id: id } });
    if (userfindOne.length > 0) {
      let userDelete = await User.destroy({ where: { id: id } });
      if (userDelete == 1) {
        res.status(200).json({
          success: true,
          message: "User data delete successfully",
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Something went wrong",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "User id not found",
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};
