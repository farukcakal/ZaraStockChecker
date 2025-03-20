# Zara Stock Checker & SMS Notifier

Zara Stock Checker & SMS Notifier is a Node.js-based application designed to monitor the stock status of specific Zara products and notify users via SMS when the desired sizes are available. This project leverages Puppeteer for web scraping and an XML-based SMS API for notifications.

## Features

- **Stock Monitoring**: Scrapes stock availability from Zara product pages using Puppeteer.
- **SMS Notifications**: Sends real-time SMS notifications via an XML-based SMS API.
- **Logging**: Logs stock status and errors to a `log.txt` file for tracking and debugging.
- **Multi-Recipient Support**: Sends notifications to multiple phone numbers.

## Technologies Used

- **Node.js**: Backend runtime environment.
- **Puppeteer**: Headless browser for web scraping.
- **Puppeteer Stealth Plugin**: Bypasses bot detection mechanisms.
- **Axios**: HTTP client for API requests.
- **XMLBuilder**: Generates XML payloads for the SMS API.
- **dotenv**: Manages environment variables.

## Installation

Follow these steps to set up and run the project:

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/farukcakal/ZaraStockChecker.git
    ```

2. **Navigate to the Project Directory**:
    ```bash
    cd zara-stock-checker
    ```

3. **Install Dependencies**:
    ```bash
    npm install
    ```

4. **Configure Environment Variables**:
    Create a `.env` file in the root directory and add the following variables:
    ```properties
    PORT=3000
    SMS_URL=https://smsgw.mutlucell.com/smsgw-ws/sndblkex
    USERNAME=YOUR_USERNAME
    PASSWORD=YOUR_PASSWORD
    ORIGINATOR=YOUR_ORIGINATOR
    PHONE_NUMBERS=+1234567890,+0987654321
    ```

5. **Run the Application**:
    ```bash
    npm start
    ```

## Usage

To check the stock status and send SMS notifications, visit the following endpoint in your browser or use a tool like Postman:

```
http://localhost:3000/check-stock
```

The application will:
1. Visit each product page.
2. Check the stock status for the specified sizes.
3. Send an SMS notification with the stock status to the configured phone numbers.
4. Log the results to `log.txt`.

## Product Configuration

You can customize the products and sizes to be tracked by modifying the `products` array in [`app.js`](app.js):

```javascript
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
```

## How It Works

1. Puppeteer launches a headless Chrome browser.
2. Visits each product page and simulates user interactions to check stock availability.
3. Logs the stock status to `log.txt`.
4. Sends an SMS notification with the stock status to the configured phone numbers.

## Logging

All actions and errors are logged in the `log.txt` file, including:
- Stock status for each product and size.
- Errors encountered during stock checks or SMS sending.

## Known Issues

- **Bot Detection**: Some websites may block Puppeteer. The Stealth Plugin is used to mitigate this issue.
- **Sandbox Restrictions**: If the `--no-sandbox` argument causes issues, you may need to run the script with elevated privileges.

## Future Improvements

- Add support for Telegram or WhatsApp notifications as an alternative to SMS.
- Implement a scheduling system to check stock at regular intervals.
- Enhance error handling and retry mechanisms for failed SMS deliveries.

## License

This project is licensed under the [MIT License](LICENSE).

---

Enjoy seamless stock tracking and never miss out on your favorite Zara items! 😊
