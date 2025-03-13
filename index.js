const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const products = [
  {
    url: 'https://www.zara.com/tr/tr/cepli-yelek-zw-collection-p02446797.html',
    sizes: ['L']
  },
  {
    url: 'https://www.zara.com/tr/tr/kisa-ispanyol-paca-pantolon-zw-koleksiyonu-p02514797.html',
    sizes: ['XL']
  }
];

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  for (let product of products) {
    //console.log(`${product.url} sayfasına gidiliyor...`);
    await page.goto(product.url, { waitUntil: 'networkidle0' });

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

    //console.log(`${product.url} stok durumu:`, stockStatus);

    await sleep(3000);
  }

  await browser.close();
})();