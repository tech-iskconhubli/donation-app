# Donation Campaign App

A Next.js application for managing donation campaigns with integrated Razorpay payment processing.

## Features

- **Responsive Design**: Works on desktop and mobile devices
- **Donation Form**: Complete form with validation for donor information
- **Payment Integration**: Razorpay integration for secure payments
- **Admin Panel**: Configure campaign header, image, and details
- **Indian Mobile Validation**: Proper validation for Indian mobile numbers
- **Tax Exemption**: Option for 80G tax exemption
- **Prasadam Delivery**: Option for home-delivered prasadam
- **Contact Information**: Display of organization contact details

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd donation-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   - Copy `.env.local` and update with your Razorpay keys
   - Get your Razorpay keys from [Razorpay Dashboard](https://dashboard.razorpay.com/)

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Configuration

### Razorpay Setup

1. Sign up for a Razorpay account at [https://razorpay.com/](https://razorpay.com/)
2. Get your API keys from the dashboard
3. Update the `.env.local` file with your keys:
   ```
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_SECRET=your_secret_key
   ```

### Admin Configuration

1. Visit `/admin` to configure campaign settings
2. Update the campaign header, image URL, and details
3. Changes are saved locally and will persist during the session

## Project Structure

```
donation-app/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── page.tsx          # Admin page
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Main page
│   ├── components/
│   │   ├── AdminPage.tsx         # Admin configuration component
│   │   ├── ContactInfo.tsx       # Contact information component
│   │   ├── DonationForm.tsx      # Donation form component
│   │   └── MainLayout.tsx        # Main layout component
│   ├── data/
│   │   └── campaignConfig.ts     # Campaign configuration store
│   └── lib/
│       └── razorpay.ts           # Razorpay integration
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── .env.local
```

## Components

### DonationForm
- Handles donor information collection
- Validates Indian mobile numbers
- Integrates with Razorpay for payments
- Supports custom donation amounts

### AdminPage
- Allows configuration of campaign details
- Real-time preview of images
- Persistent configuration storage

### ContactInfo
- Displays organization contact information
- Shows timings in a structured table format

## Payment Flow

1. User fills out the donation form
2. Form validation ensures all required fields are complete
3. Razorpay payment gateway is initialized
4. Payment is processed securely through Razorpay
5. Success/failure callbacks handle the payment result

## Validation Rules

- **Full Name**: Required field
- **Email**: Required with email format validation
- **Phone**: Required with Indian mobile number regex (10 digits starting with 6-9)
- **Seva**: Required dropdown selection
- **Donation Amount**: Required, either preset or custom amount

## Contact Information

**Address**: KSFC, Hubballi-Dharwad Road, Besides, Rayapur, Hubballi, Karnataka 580009

**Phone**: 9066106171

**Timings**:
- Weekdays: Morning 9:30am to 1pm, Evening 4:15pm to 8pm
- Sundays: Morning 9:30am to 1:30pm, Evening 4:15pm to 8pm

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js applications.

## Environment Variables

```
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret_key
```

## Security Notes

- Never commit your actual Razorpay keys to version control
- Use test keys for development
- Use live keys only in production
- Implement proper server-side validation for production use

## License

This project is licensed under the MIT License.
