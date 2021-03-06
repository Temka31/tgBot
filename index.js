const token = '';

const Telegraf = require('telegraf');
const axios = require('axios');
const app = new Telegraf(token);
const key = ""
let state = {};

const message = async (type) => {
    const res = await axios.get(`http://www.boredapi.com/api/activity?type=${type}`);
    const engMessage = res.data.activity;
    console.log(res.data)
    const ruMessage = await axios.post(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${key}&text=${engMessage}&lang=ru`)
    if (res.data.link) {
        return `eng: ${engMessage}

ru: ${ruMessage.data.text} 

${res.data.link}`
    }else return `eng: ${engMessage}
    
ru: ${ruMessage.data.text}`
      };

const command = {
    обучение: 'education', развлечения: 'recreational', социальное: 'social', поделки: 'diy',
    благотворительность: 'charity', готовка: 'cooking', отдых: 'relaxation', музыка: 'music', бесполезное: 'busywork'
}

app.start((ctx) => ctx.reply(`Бот подскажет чем заняться когда Вам скучно. Категории занятий доступны по комманде /help`))
app.help((ctx) => ctx.reply(`Доступные команды категорий занятий на двух языках:
/обучение /education
/развлечения /recreational
/социальное /social
/поделки /diy
/благотворительность /charity
/готовка /cooking
/отдых /relaxation
/музыка /music
/бесполезное /busywork`))

app.on('text', ctx => {
    const mes = ctx.message.text.slice(1);
    let type = mes;
    if (/^[а-яё]*$/i.test(type)) {
        type = command[mes];
    }
    if (!!type) {
        message(type).then(mes => {
            return ctx.reply(mes)
          });
    } else return ctx.reply("Не верная команда");
});
app.startPolling();


