// const db = require('../models/database');
const models = require('../models/models');

const printData = async () => {
  const users = await models.user.findAll();
  users.map((user) => { console.log('a user : ', user.get({ plain: true })); });

  const rooms = await models.room.findAll();
  rooms.map((room) => { console.log('a room : ', room.get({ plain: true })); });

  const instruments = await models.instrument.findAll();
  instruments.map((instrument) => { console.log('an instrument : ', instrument.get({ plain: true })); });

  const reservations = await models.reservation.findAll();
  reservations.map((reservation) => { console.log('a reservation : ', reservation.get({ plain: true })); });

  const user = await models.user.findById(1);
  console.log('user selected: ', user.get({ plain: true }));
  const userInstruments = await user.getInstruments();
  console.log('user instruments: ', userInstruments[0].get({ plain: true }));
  userInstruments.map((userInstrument) => { console.log('an instrument of ', user.getDataValue('fullName'), ' : ', userInstrument.get('name')); });
};

module.exports = printData;
