const { Client, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const client = new Client();
const delay = ms => new Promise(res => setTimeout(res, ms));

const menu = {
  '1': { name: 'SISCOM UPIITA', price: 5551879821 },
  '2': { name: 'SISCOM ESCOM', price: 5573728921 },
  '3': { name: 'SISCOM ZACATENCO', price: 5564357110 },
  '4': { name: 'SISCOM LINDAVISTA', price: 5564357110 }
};

const opciones = {
  '5': { nombre: 'Ver número de cuenta', dato: 'El número de cuenta es XXXX-XXXX-XXXX-XXXX' },
  '6': { nombre: 'Hablar con un asociado', dato: 'Espere un momento, con gusto le atenderá un agente' },
};

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});


client.on('ready', () => {
    console.log('Listo! su WhatsApp conectado de manera correcta!');

const sendDelayedMessage = async (chatId, messages) => {
        for (const message of messages) {
            await client.sendPresenceAvailable();
            await client.sendMessage(chatId, message);
            await new Promise(res => setTimeout(res, 1000)); // Delay de 1.5 segundos entre mensajes
        }
    };
  
    client.on('message', async (message) => {
        const chat =  message.getChat();
        const contact =  message.getContact();
        const img1 = MessageMedia.fromFilePath('./Logo_normal.png'); // archivo en imagen también puede ser jpeg
        const name1 = contact.pushname || '';
        if ((message.body.toLowerCase() === 'HOLA'|| message.body === 'Hola'|| message.body === 'hola'|| message.body === 'Buenas tardes'|| message.body === 'buenas tardes'|| message.body === 'buenos días') && message.from.endsWith('@c.us')) {
            await sendDelayedMessage(message.from,[
                `¡Hola, ${name1.split(" ")[0]}! Bienvenid@ a *SISCOM ELECTRONICS*. `,
            ]);
            await delay(1000); //delay de 3 segundos
            await client.sendMessage(message.from, img1, {caption: 'Comencemos escogiendo ¿A qué sucursal te quieres comunicar?'}); //Enviando a imagenlet options = '';
            let options = '';
            for (const [key, value] of Object.entries(menu)) {
            options += `${key}. ${value.name} \n`;
            }
        await delay(1000); //Delay de 3 segundos
        await client.sendMessage(message.from,`Chat de opciones:\n${options}\nDigíte el *número* de la opción deseada.`);
        } 
        else if (Object.keys(menu).includes(message.body) && !message.fromMe) {
        const selectedOption = menu[message.body];
        if (!client.order) {
          client.order = {
            items: [],
            totalPrice: 0.0,
            customerAddress: '',
          };
        }
        client.order.items.push(selectedOption);
        client.order.totalPrice += selectedOption.price;
        await delay(1000); //Delay de 3 segundos
        await client.sendMessage(message.from,`Gracias usted escogió ${selectedOption.name}. Por favor comuníquese a  ${selectedOption.price}.`);
        await client.sendMessage(message.from,'De acuerdo, continuemos con su visita. Si desea contactar con otra sucursal digíte el *número* del chat de opciones. Si ya está en el chat donde quiere comunicarse envie *"continuar"* para mostrar las opciones.');
      } else if (message.body.toLowerCase() === 'continuar' && !message.fromMe) {
        if (!client.order || client.order.items.length === 0) {
          await delay(1000); //Delay de 3 segundos
          await client.sendMessage(message.from,'Por favor, escoja una opción de nuestro menú.');
          return;
        }
        await delay(1000); //Delay de 3 segundos
        await client.sendMessage(message.from,`Perfecto, continuemos le presentaré las operaciones del chat:`);
        let operaciones = '';
        for (const [key, value] of Object.entries(opciones)) {
          operaciones += `${key}. ${value.nombre} \n`;
          }
          await delay(1000); //Delay de 3 segundos
          await client.sendMessage(message.from,`Chat de operaciones:\n${operaciones}\nDigíte el *número* de la operación deseada.`);
        await delay(1000); //Delay de 3 segundos
      } 
      else if (Object.keys(opciones).includes(message.body) && !message.fromMe) {
        const selectedOptiones = opciones[message.body];
        await delay(1000); //Delay de 3 segundos
        await client.sendMessage(message.from,`Gracias usted escogió *${selectedOptiones.nombre}*. *${selectedOptiones.dato}*.`);
        await client.sendMessage(message.from,`Si desea una nueva operación digíte el *número*, de lo contrario espere un momento.`);
      }
    });
  
  });
  client.initialize();