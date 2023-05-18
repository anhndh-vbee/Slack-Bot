const nodemailer = require('nodemailer');
const cron = require('cron');
const { findAll } = require('../daos/user.dao');
const config = require('../config/config');
const { getWeek } = require('./dateService');

const getInformEmailAndContent = async () => {
  const listUsers = await findAll();
  let emailAndContent = [];
  listUsers.forEach((user) => {
    // [[...], [...]]
    let dayCheckinCheckout = user.days;
    const len = dayCheckinCheckout.length;
    let dayCheckinOfWeek = dayCheckinCheckout.filter(
      (day) => getWeek(day[0]) === getWeek(dayCheckinCheckout[len - 1][0]),
    );
    let content = `
        <h3>List checkin last week</h3>
        <tr>
        <th>Day</th>
        <th>Check in</th>
        <th>Check out</th>
        </tr>
    `;
    // [...]
    dayCheckinOfWeek.forEach((day) => {
      const timeCheckin = day[0];
      const indexTimeCheckout = day.length - 1;

      content += `
      <tr>
        <td>${timeCheckin.getDate()}-${
        timeCheckin.getMonth() + 1
      }-${timeCheckin.getFullYear()}</td>
        <td>${timeCheckin.getHours()}:${timeCheckin.getMinutes()}:${timeCheckin.getSeconds()}</td>
        <td>${day[indexTimeCheckout].getHours()}:${day[
        indexTimeCheckout
      ].getMinutes()}:${day[indexTimeCheckout].getSeconds()}</td>
      </tr>
      `;
    });
    emailAndContent.push([user.email, content]);
  });
  return emailAndContent;
};

const sendMail = async (email, content) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: config.EMAIL,
      pass: config.PASS_EMAIL,
    },
  });

  const info = await transporter.sendMail({
    from: config.EMAIL,
    to: email,
    subject: 'Checkin last week',
    html: `${content}`,
  });

  console.log('Message sent: ', info.messageId);
};

const postSendEmail = async () => {
  const listEmailAndContent = await getInformEmailAndContent();
  listEmailAndContent.forEach((emailAndContent) => {
    sendMail(emailAndContent[0], emailAndContent[1]);
  });
};

const cronJob = new cron.CronJob('00 00 09 * * 0', () => {
  postSendEmail();
});
cronJob.start();
