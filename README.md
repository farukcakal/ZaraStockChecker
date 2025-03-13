
# Zara Stock Checker & SMS Notifier

This project is a Zara Stock Tracking and SMS Notification System built with Puppeteer. It allows you to monitor the stock status of specific Zara products and sends an SMS notification when the desired sizes are available.

### Features

* Scrapes stock availability from Zara product pages using Puppeteer.
* Sends SMS notifications via an XML-based SMS API.
* Logs stock status and errors to a `log.txt` file.
* Supports multiple phone numbers for notifications.

### Technologies Used

* Node.js
* Puppeteer
* Puppeteer Stealth Plugin
* Axios
* XMLBuilder
* dotenv

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/farukcakal/ZaraStockChecker.git
    ```

2.  Navigate to project directory:

    ```bash
    cd zara-stock-checker
    ```

3.  Install dependencies:

    ```bash
    npm install
    ```

4.  Create a `.env` file in the root directory and configure the following variables:

    ```
    PORT=3000
    SMS_URL=YOUR_SMS_API_URL
    USERNAME=YOUR_SMS_API_USERNAME
    PASSWORD=YOUR_SMS_API_PASSWORD
    ORIGINATOR=YOUR_SENDER_NAME
    PHONE_NUMBERS=+1234567890,+0987654321
    ```

5.  Run the server:

    ```bash
    node index.js
    ```

### Usage

Visit the following endpoint in your browser or via Postman:

`http://localhost:3000/check-stock`

The script will visit each product page, check the stock status for the specified sizes, and send an SMS to the configured phone numbers.

### Product Configuration

You can customize the products and sizes to be tracked in the `products` array:

```javascript
const products = [
  {
    title: 'CEPLİ YELEK ZW COLLECTION',
    url: '[https://www.zara.com/tr/tr/cepli-yelek-zw-collection-p02446797.html](https://www.zara.com/tr/tr/cepli-yelek-zw-collection-p02446797.html)',
    sizes: ['L']
  },
  {
    title: 'KISA İSPANYOL PAÇA PANTOLON ZW KOLEKSİYONU',
    url: '[https://www.zara.com/tr/tr/kisa-ispanyol-paca-pantolon-zw-koleksiyonu-p02514797.html](https://www.zara.com/tr/tr/kisa-ispanyol-paca-pantolon-zw-koleksiyonu-p02514797.html)',
    sizes: ['XL']
  }
];
```

### How It Works
	1.	Puppeteer launches a headless Chrome browser.
	2.	Visits each product page and simulates clicking the size selector button.
	3.	Checks if the specified sizes are available.
	4.	Sends an SMS notification with the stock status to the provided phone numbers.
	5.	Logs the result to log.txt.

### Logging
All actions and errors are logged in the log.txt file for tracking and debugging purposes.

### Known Issues
Puppeteer may be blocked by some websites. The Stealth Plugin is used to bypass bot detection.
You might need to run the script with admin privileges if the --no-sandbox argument is causing issues.

### Future Improvements
Implement Telegram or WhatsApp notifications as an alternative to SMS.
Add a scheduling system to check stock at regular intervals.

### Contact
For support or collaboration, reach out to fcakal07@gmail.com

### License
This project is licensed under the MIT License.


Enjoy stock tracking and never miss out on your favorite Zara items! 😊
