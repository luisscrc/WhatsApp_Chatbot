// Invocamos el lector de qr code
const qrcode = require('qrcode-terminal');
const { Client, Buttons, List, MessageMedia } = require('whatsapp-web.js'); // Cambio en Buttons
const client = new Client({puppeteer: {executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',}});
// Entonces habilitamos al usuario a acceder al servicio de lectura del qr code
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});
// Después de eso, indica que todo está bien
client.on('ready', () => {
    console.log('¡Listo! WhatsApp conectado correctamente.');
});
// E inicia todo para hacer nuestra magia =)
client.initialize();
const delay = ms => new Promise(res => setTimeout(res, ms)); // Función que usamos para crear el delay entre una acción y otra

// Base del Proyecto
client.on('message', async msg => {
    if (msg.body.match(/(que onda|buenos días|Buenos Días|buenos dias|información|yo quiero|como funciona|Que tal|hola|Hola|más información|imagenes|Buenas tardes|buenas tardes|buenos días|Buenos Días|audios|iptv)/i) && msg.from.endsWith('@c.us')) 
    {
        const chat = await msg.getChat();
        const contact = await msg.getContact(); // Obteniendo el contacto
        const name = contact.pushname; // Obteniendo el nombre del contacto
        await client.sendMessage(msg.from,'¡Hola! '+ name.split(" ")[0] + ', bienvenid@ a SISCOM ELECTRONICS, por favor dime, ¿Hoy en qué podemos ayudarte?'); // Primera mensaje de texto
        await delay(3000); // delay de 3 segundos
        await chat.sendStateTyping(); // Simulación de que está escribiendo
        await delay(3000); // Delay de 3 segundos
        await client.sendMessage(msg.from, '0) Catálogo \n1) Cotización de productos. \n2) Número de cuenta. \n3) Escoge la sucursal más cercana.');

            if (msg.body !== null && msg.body === '1' && msg.from.endsWith('@c.us')){
                await chat.sendStateTyping(); // Simulación de que está escribiendo
                await client.sendMessage(msg.from, 'Has escogido la cotización de productos, dime qué categoría buscas.');
                await delay(3000); // delay de 3 segundos   
            }

            else if (msg.body !== null && msg.body === '2' && msg.from.endsWith('@c.us')){
                await chat.sendStateTyping(); // Simulación de que está escribiendo
                await client.sendMessage(msg.from, 'Has escogido la consulta de número de cuenta. :)');
                await delay(3000); // delay de 3 segundos   
            }

            else if (msg.body !== null && msg.body === '3' && msg.from.endsWith('@c.us')){
                await chat.sendStateTyping(); // Simulación de que está escribiendo
                await client.sendMessage(msg.from, 'Has escogido redirección de tienda. :)');
                await delay(3000); // delay de 3 segundos 
            }
            else if(msg.body !== null && msg.body === '0' && msg.from.endsWith('@c.us')) { 
                await chat.sendStateTyping(); // Simulación de que está escribiendo
                await client.sendMessage(msg.from, 'Este es nuestro catálogo, te invito a consultarlo. :)');
                await delay(3000); // delay de 3 segundos
                const doc1 = MessageMedia.fromFilePath('./catalogo.pdf'); // pdf para ser enviado
                await client.sendMessage(msg.from, doc1); // Enviando el pdf
            }    
            else {
                await chat.sendStateTyping(); // Simulación de que está escribiendo
                await client.sendMessage(msg.from, 'Prueba de nuevo :)');
                await delay(3000); // delay de 3 segundos
            }   
    await delay(3000); // delay de 3 segundos
    await chat.sendStateTyping(); // Simulación de que está escribiendo
    await delay(3000); // Delay de 3 segundos
    await client.sendMessage(msg.from, 'Muchas gracias por consultar este chatbot, estaremos siempre dispuestos a ayudarte en tus proyectos.');
    }
});