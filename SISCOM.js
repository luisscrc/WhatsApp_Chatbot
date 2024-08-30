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

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});


client.on('ready', () => {
    console.log('Listo! su WhatsApp conectado de manera correcta!');

const sendDelayedMessage = async (chatId, messages) => {
        for (const message of messages) {
            await client.sendPresenceAvailable();
            await client.sendMessage(chatId, message);
            await new Promise(res => setTimeout(res, 1500)); // Delay de 1.5 segundos entre mensajes
        }
    };
  
    client.on('message', async (message) => {
        const chat =  message.getChat();
        const contact =  message.getContact();
        const img1 = MessageMedia.fromFilePath('./Logo_normal.png'); // archivo en imagen también puede ser jpeg
        const name1 = contact.pushname || '';
        if ((message.body.toLowerCase() === 'Atención'|| message.body === 'Hola'|| message.body === 'hola'|| message.body === 'Quiero hacer un pedido'|| message.body === 'Quiero hacer una orden'|| message.body === 'Hacer pedido') && message.from.endsWith('@c.us')) {
            await client.sendMessage(message.from, img1, {caption: 'Siscom'}); //Enviando a imagenlet options = '';
            await sendDelayedMessage(message.from, [
                `¡Hola, ${name1.split(" ")[0]}! Bienvenid@ a SISCOM ELECTRONICS. Comencemos escogiendo ¿Qué sucursal está más cercana?`,
            ]);
            await delay(3000); //delay de 3 segundos
            let options = '';
            for (const [key, value] of Object.entries(menu)) {
            options += `${key}. ${value.name} \n`;
            }
        await delay(3000); //Delay de 3 segundos
        await client.sendMessage(message.from,`Chat de opciones:\n${options}\nDigíte el número de la opción deseada.`);
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
        await delay(3000); //Delay de 3 segundos
        //await chat.sendStateTyping(); // Simulación que esta escribiendo
        await client.sendMessage(message.from,`Gracias usted escogió ${selectedOption.name}. Por favor comuníquese a  ${selectedOption.price}.`);
        await delay(3000); //Delay de 3 segundos
  
        await client.sendMessage(message.from,'Digite el número de la próxima opción deseada o envie "finalizar" para concluir su visita.');
      } else if (message.body.toLowerCase() === 'finalizar' && !message.fromMe) {
        if (!client.order || client.order.items.length === 0) {
          await delay(3000); //Delay de 3 segundos
        
          await client.sendMessage(message.from,'Por favor, escoja una opción de nuestro menú.');
          return;
        }
        await delay(3000); //Delay de 3 segundos
  
        await client.sendMessage(message.from,`Su pedido contiene:`);
        let orderSummary = '';
        for (const item of client.order.items) {
          orderSummary += `${item.name} - R$${item.price}\n`;
        }
        await message.reply(orderSummary);
        await delay(3000); //Delay de 3 segundos
  
        //await client.sendMessage(message.from,`El valor total de su pedido es de R$${client.order.totalPrice}.`);
        await delay(3000); //Delay de 3 segundos
  
        //await client.sendMessage(message.from,'Por favor, me informa su dirección completa y número de la casa *"entre más específico mejor"*');
      } else if (client.order && !message.fromMe) {
        // Recebe o endereço do cliente e confirma o pedido
        client.order.customerAddress = message.body;
        const order = client.order;
        await delay(3000); //Delay de 3 segundos
  
        //await client.sendMessage(message.from,`Gracias! Su pedido será entregado en la dirección ${order.customerAddress}.`);
        await delay(3000); //Delay de 3 segundos
  
        //await client.sendMessage(message.from,'Para el pago, aceptamos Nequi, cartón de crédito e efectivo. Gracias! Ahora es solo esperar su pedido!');
        // Reseta o pedido do cliente
        client.order = null;
      }
    });
  
  });
  client.initialize();
