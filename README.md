# PriceWise

**PriceWise** is a Next.js application for tracking Amazon product prices and notifying users via email when prices drop or reach specified thresholds. This tool regularly scrapes Amazon to update product details and maintains a history of price changes for each product.

## Features

- **Amazon Product Scraper**: Retrieves current product details and prices from Amazon.
- **Price History Tracking**: Tracks highest, lowest, and average prices for each product.
- **Automated Email Notifications**: Alerts users when specific price conditions are met.
- **Database Integration**: Uses MongoDB to store product data, price history, and user preferences.
- **Styled with Tailwind CSS**: Uses Tailwind CSS for a clean, responsive UI.

## Technologies Used

- **Next.js** and **TypeScript**: Framework for building server-rendered React applications with TypeScript.
- **Mongoose**: Object modeling for MongoDB and Node.js.
- **Nodemailer**: SMTP email handling for notifications.
- **Bright Data**: Web scraping and data extraction.
- **Tailwind CSS**: Utility-first CSS framework for styling.

## Getting Started

### Prerequisites

- **Node.js** and **npm**: Ensure Node.js and npm are installed. [Download Node.js](https://nodejs.org/)
- **MongoDB**: A MongoDB database to store product and user data.
- **Bright Data Account**: Credentials for Bright Data, used for scraping Amazon.
- **Email Account**: SMTP credentials for sending email notifications.

### Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/your-username/pricewise.git
    cd pricewise
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Set up environment variables**:

   Create a `.env` file in the root directory or copy the example file:

   ```bash
   cp .env.example .env
   ```

   Then, configure the following variables in `.env`:

    ```plaintext
    # Bright Data credentials for scraping
    BRIGHT_DATA_USERNAME=your_username
    BRIGHT_DATA_PASSWORD=your_password

    # MongoDB connection
    MONGODB_URI=your_mongodb_uri

    # Email SMTP credentials
    AUTH=your_email
    PASSWORD=your_email_password
    ```

### Running the Project

1. Start the Next.js development server:

    ```bash
    npm run dev
    ```

2. Open your browser and go to `http://localhost:3000`.

## Project Structure

- `lib/models/product.model.ts`: Mongoose model for the `Product` schema.
- `lib/mongoose.ts`: MongoDB connection utility.
- `lib/nodemailer.ts`: Email utility functions, including `generateEmailBody` and `sendEmail`.
- `lib/scraper.ts`: Product scraping logic for fetching Amazon details.
- `lib/utils.ts`: Helper functions for price calculations and notification types.
- `app/api/cron/route.ts`: API endpoint that handles GET requests, updates product data, and triggers notifications.

## API Reference

### `GET /api/cron`

This endpoint triggers the following workflow:

1. **Scrape**: Fetches updated details and prices for each product in the database.
2. **Update**: Adds the new data to the product's price history and updates summary statistics.
3. **Notify**: Sends an email to users if price conditions (e.g., price drop) are met.

#### Example Response

```json
{
  "message": "Products updated and notifications sent successfully."
}
```

## Notifications

The application uses a helper function, `getEmailNotifType`, to determine when notifications should be sent based on price changes. Notifications are sent via email if the product meets specific conditions such as:

- Price dropping below a threshold.
- New lowest or highest recorded price.

### Email Content

Emails are generated using `generateEmailBody`, which includes:

- Product title and URL
- Notification type (e.g., price drop)
- Relevant price information

## Styling with Tailwind CSS

The application uses **Tailwind CSS** for styling, providing a responsive and clean UI. To adjust styling, modify the `tailwind.config.js` and `globals.css` files.

## Environment Variables

All sensitive information is stored in environment variables. An example `.env.example` file is provided.

- **BRIGHT_DATA_USERNAME** and **BRIGHT_DATA_PASSWORD**: Bright Data credentials for Amazon scraping.
- **MONGODB_URI**: Connection string for MongoDB.
- **AUTH** and **PASSWORD**: Email credentials for sending notifications.

## Feedback

If you have any feedback, please reach me at [muhammedhanish11@gmail.com](mailto:muhammedhanish11@gmail.com) or connect with me on [LinkedIn](https://www.linkedin.com/in/muhdhanish/).

## Support

Show your support by 🌟 starring the project!!