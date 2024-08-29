const qrcode = require('qrcode-terminal'); // intento 1 de condicional 
const { Client, MessageMedia } = require('whatsapp-web.js');

const client = new Client({
    puppeteer: {
        executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    },
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('¡Listo! WhatsApp conectado correctamente.');
});

const sendDelayedMessage = async (chatId, messages) => {
    for (const message of messages) {
        await client.sendPresenceAvailable();
        await client.sendMessage(chatId, message);
        await new Promise(res => setTimeout(res, 1500)); // Delay de 1.5 segundos entre mensajes
    }
};

client.on('message', async msg => {
    const chat = await msg.getChat();
    const contact = await msg.getContact();
    const name = contact.pushname || 'allí';

    const greetings = ['que onda', 'buenos días', 'buenos dias', 'información', 'yo quiero', 'como funciona', 'que tal', 'hola', 'más información', 'imágenes', 'buenas tardes', 'audios', 'iptv'];
    const zero = '0';
    const one = '1';
    const two = '2';
    const three = '3';
    const messageContent = msg.body.toLowerCase();

    if (greetings.some(greet => messageContent.includes(greet)) && msg.from.endsWith('@c.us')) {
        await sendDelayedMessage(msg.from, [
            `¡Hola, ${name.split(" ")[0]}! Bienvenid@ a SISCOM ELECTRONICS. ¿En qué podemos ayudarte hoy?`,
            'Por favor, selecciona una de las siguientes opciones enviando el número correspondiente:\n\n0) Ver catálogo\n1) Cotización de productos\n2) Número de cuenta bancaria\n3) Sucursales cercanas'
        ]);
    // esperar a que el cliente responda con un número
    } else if (msg.from.endsWith('@c.us')) {
        console.log('Else if.'); // Mensaje de prueba
        switch (messageContent) {
            case zero:
                try {
                    console.log('zero try'); // Mensaje de prueba
                    const catalog = MessageMedia.fromFilePath('./catalogo.pdf');
                    await client.sendMessage(msg.from, catalog, { caption: 'Aquí tienes nuestro catálogo actualizado. ¡Échale un vistazo!' });
                } catch (error) {
                    console.log('zero catch'); // Mensaje de prueba
                    await client.sendMessage(msg.from, 'Lo siento, hubo un error al enviar el catálogo. Por favor, intenta nuevamente más tarde.');
                    console.error('Error al enviar el catálogo:', error);
                }
                break;
            case one:
                console.log('one'); // Mensaje de prueba
                await sendDelayedMessage(msg.from, [
                    'Has elegido *Cotización de productos*.',
                    'Por favor, indícanos la categoría del producto que buscas.'
                ]);
                break;
            case two:
                console.log('two'); // Mensaje de prueba
                await sendDelayedMessage(msg.from, [
                    'Has elegido *Número de cuenta bancaria*.',
                    'Nuestro número de cuenta es: 1234-5678-9012-3456. Banco XYZ.'
                ]);
                break;
            case three:
                console.log('three'); // Mensaje de prueba
                await sendDelayedMessage(msg.from, [
                    'Has elegido *Sucursales cercanas*.',
                    'Por favor, comparte tu ubicación para ayudarte a encontrar la sucursal más cercana.'
                ]);
                break;
            default:
                await sendDelayedMessage(msg.from, [
                    'Lo siento, no he entendido tu solicitud.',
                    'Por favor, elige una opción válida o escribe "Hola" para ver el menú principal.'
                ]);
                break;
        }
    } 
});

client.initialize();
