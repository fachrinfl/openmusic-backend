/* eslint-disable import/no-unresolved */
require('dotenv').config();
const amqp = require('amqplib');
const MailSender = require('./MailSender');
const Listener = require('./Listener');
const ServiceSong = require('./PlaylistSongsService');

const init = async () => {
  const serviceSong = new ServiceSong();
  const mailSender = new MailSender();
  const listener = new Listener(mailSender, serviceSong);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue('export:songs', {
    durable: true,
  });

  channel.consume('export:songs', listener.listen, { noAck: true });
};

init();
