const Sequelize = require('sequelize');

const Op = Sequelize.Op;
const models = require('../models/relations');

// Get the information about all users
async function getAllUsers(req, res, next) {
  try {
    const users = await models.user.findAll({
      include: [models.instrument],
    });
    res.send(users);
  } catch (e) {
    next(e);
  }
}

// Get connected user's information
async function getCurrentUser(req, res, next) {
  try {
    const user = await models.user.findOne({
      where: { login: req.user.user.login },
      include: [models.instrument],
    });
    res.send(user);
  } catch (e) {
    next(e);
  }
}


// Update the phone of the connected user
async function updateCurrentUserPhone(req, res, next) {
  try {
    const user = await models.user.findOne({ where: { login: req.user.user.login } });
    user.telephone = req.body.telephone;
    await user.save();
    res.send(user);
  } catch (e) {
    next(e);
  }
}

// Add the given instrument to the logged user
async function addCurrentUserInstrument(req, res, next) {
  try {
    const user = await models.user.findOne({
      where: { login: req.user.user.login },
    });
    const instrument = await models.instrument.findById(req.body.instrumentId);
    await user.addInstrument(instrument, { through: { } });
    const userInstruments = await models.user.findOne({
      where: { login: req.user.user.login },
      include: [models.instrument],
    });
    res.send(userInstruments);
  } catch (e) {
    next(e);
  }
}

// Add the given instrument to the logged user
async function deleteCurrentUserInstrument(req, res, next) {
  try {
    const user = await models.user.findOne({
      where: { login: req.user.user.login },
      include: [models.instrument],
    });
    const instrument = await models.instrument.findById(req.body.instrumentId);
    await user.removeInstrument(instrument, { through: { } });
    const userInstruments = await models.user.findOne({
      where: { login: req.user.user.login },
      include: [models.instrument],
    });
    res.send(userInstruments);
  } catch (e) {
    next(e);
  }
}

// Get the reservations of the logged user
async function getCurrentUserReservations(req, res, next) {
  try {
    const user = await models.user.findOne({
      where: {
        login: req.user.user.login,
      },
    });
    const reservations = await user.getReservations({
      include: [models.user, models.room],
      where: {
        beginning: {
          [Op.gte]: Date.now(),
        },
      },
    });
    res.send(reservations);
  } catch (e) {
    next(e);
  }
}

/**
 * @api {get} /users/:login GetUser
 * @apiName GetUser
 * @apiGroup Users
 *
 * @apiParam {Sring} login Users VIAREZO OAuth login.
 *
 * @apiSuccess {Object} user The User object.
 * @apiSuccess {String} user.login Login of the User.
 * @apiSuccess {String} user.fullName Fullname of the User.
 * @apiSuccess {String} user.mail Mail of the User.
 * @apiSuccess {String} user.telephone Phone of the User.
 * @apiSuccess {Boolean} user.admin Admin of the User.
 * @apiSuccess {Boolean} user.adherent Adherent of the User.
 * @apiSuccess {Object} user.instrument Instruments of the User.
 */

// Get the information about the user whose login is given in the url
async function getUser(req, res, next) {
  try {
    const user = await models.user.findOne({
      where: { login: req.params.login },
      include: [models.instrument],
    });
    res.send(user);
  } catch (e) {
    next(e);
  }
}

// Update the rights of the user whose login is given in the url
async function updateUserRights(req, res, next) {
  try {
    const user = await models.user.findOne({ where: { login: req.params.login } });
    user.adherent = req.body.adherent;
    user.admin = req.body.admin;
    await user.save();
    res.send(user);
  } catch (e) {
    next(e);
  }
}

// Get a user's reservations
async function getUserReservations(req, res, next) {
  try {
    const user = await models.user.findOne({
      where: {
        login: req.params.login,
      },
    });
    const reservations = await user.getReservations({
      where: {
        beginning: {
          [Op.gte]: Date.now(),
        },
      },
    });
    res.send(reservations);
  } catch (e) {
    next(e);
  }
}


module.exports = {
  getAllUsers,
  getCurrentUser,
  updateCurrentUserPhone,
  addCurrentUserInstrument,
  deleteCurrentUserInstrument,
  getCurrentUserReservations,
  getUser,
  updateUserRights,
  getUserReservations,
};

