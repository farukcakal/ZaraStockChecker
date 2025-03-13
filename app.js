const express = require('express');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const axios = require('axios');
const xmlbuilder = require('xmlbuilder');
const fs = require('fs');

require('dotenv').config();
puppeteer.use(StealthPlugin());

const SMS_URL = process.env.SMS_URL;
const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const originator = process.env.ORIGINATOR;

const app = express();
app.use(express.json());

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const products = [
  {
    title: 'CEPLİ YELEK ZW COLLECTION',
    url: 'https://www.zara.com/tr/tr/cepli-yelek-zw-collection-p02446797.html',
    sizes: ['L']
  },
  {
    title: 'KISA İSPANYOL PAÇA PANTOLON ZW KOLEKSİYONU',
    url: 'https://www.zara.com/tr/tr/kisa-ispanyol-paca-pantolon-zw-koleksiyonu-p02514797.html',
    sizes: ['XL']
  }
];

const logToFile = (message, data = '') => {
  const timestamp = new Date().toLocaleString('tr-TR', {
    timeZone: 'Europe/Istanbul',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).replace(',', '');

  const logMessage = `[${timestamp}] ${message} ${data}\n`;
  fs.appendFileSync('log.txt', logMessage);
};

const sendSMS = async (message, phoneNumbers) => {
  try {
    const smsPacket = xmlbuilder.create('smspack')
      .att('ka', username)
      .att('pwd', password)
      .att('org', originator)
      .ele('mesaj')
      .ele('metin').txt(message).up()
      .ele('nums').txt(phoneNumbers.join(',')).up()
      .end({ pretty: true });

    const response = await axios.post(SMS_URL, smsPacket, {
      headers: {
        'Content-Type': 'text/xml; charset=UTF-8'
      }
    });

    logToFile('SMS gönderim sonucu:', response.data);
    return response.data;
  } catch (error) {
    logToFile('SMS gönderme hatası:', error);
    throw error;
  }
};

app.get('/check-stock', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    let messageContent = "";

    for (let product of products) {
      await page.goto(product.url, { waitUntil: 'networkidle0' });
      logToFile(`URL ziyaret edildi: ${product.url}`);
      await sleep(3000);

      const addToCartButtonSelector = 'button.zds-button.product-detail-size-selector-std-actions__button.zds-button--secondary.zds-button--large';
      await page.waitForSelector(addToCartButtonSelector);
      await page.click(addToCartButtonSelector);

      await sleep(3000);

      const stockStatus = await page.evaluate((sizes) => {
        const result = {};
        const sizeItems = document.querySelectorAll('.size-selector-sizes__size');

        for (let item of sizeItems) {
          const sizeLabel = item.querySelector('.size-selector-sizes-size__label')?.innerText;

          if (sizes.includes(sizeLabel)) {
            const isDisabled = item.classList.contains('size-selector-sizes__size--disabled');
            result[sizeLabel] = isDisabled ? 'Stokta yok' : 'Stokta var';
          }
        }

        return result;
      }, product.sizes);

      logToFile(`${product.url} stok durumu:`, JSON.stringify(stockStatus));

      for (let size in stockStatus) {
        messageContent += `${product.title} ürünü, beden: ${size} - ${stockStatus[size]}\n`;
      }

      await sleep(3000);
    }

    await browser.close();

    // PHONE_NUMBERS değişkenini .env dosyasından alıyoruz ve diziye dönüştürüyoruz
    const phoneNumbers = process.env.PHONE_NUMBERS.split(',');
    await sendSMS(messageContent, phoneNumbers);

    res.status(200).send({ message: 'Stok kontrolü tamamlandı ve SMS gönderildi.' });
  } catch (error) {
    logToFile('Stok kontrolü veya SMS gönderimi hatası:', error);
    res.status(500).send({ message: 'Bir hata oluştu.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});