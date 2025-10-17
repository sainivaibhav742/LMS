# LMS (Learning Management System)

A comprehensive Learning Management System built with Next.js, Tailwind CSS, and integrated payment gateways (Stripe, PayPal, Razorpay).

## Features

### 🎓 Student Dashboard
- Course enrollment and progress tracking
- Quiz participation and certificate generation
- Payment processing for courses
- Discussion forums and announcements
- Bookmark management and notifications

### 👨‍🏫 Instructor Dashboard
- Course creation and management
- Student analytics and performance tracking
- Marketplace integration for course sales

### 🛠️ Admin Dashboard
- User management (students, instructors)
- Course and payment oversight
- Marketplace administration

### 💳 Payment Integration
- Stripe payment processing
- PayPal integration
- Razorpay support for international payments

## Tech Stack

- **Frontend**: Next.js 13, React 18, Tailwind CSS
- **Payment Gateways**: Stripe, PayPal, Razorpay
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS with PostCSS and Autoprefixer

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sainivaibhav742/LMS.git
cd LMS
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables file (`.env.local`):
```env
# Add your payment gateway keys and other environment variables here
STRIPE_PUBLIC_KEY=your_stripe_public_key
PAYPAL_CLIENT_ID=your_paypal_client_id
RAZORPAY_KEY_ID=your_razorpay_key_id
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
├── components/          # Reusable React components
│   ├── Header.js       # Main header component
│   ├── Sidebar.js      # Navigation sidebar
│   └── PaymentModal.js # Payment processing modal
├── pages/              # Next.js pages and API routes
│   ├── _app.js         # App wrapper
│   ├── index.js        # Home page
│   ├── login.js        # Authentication page
│   ├── admin/          # Admin dashboard pages
│   ├── instructor/     # Instructor dashboard pages
│   ├── student/        # Student dashboard pages
│   └── api/            # API routes
├── styles/             # Global styles
│   └── globals.css     # Global CSS with Tailwind
├── .gitignore          # Git ignore rules
├── next.config.js      # Next.js configuration
├── package.json        # Dependencies and scripts
├── postcss.config.js   # PostCSS configuration
├── README.md           # Project documentation
└── tailwind.config.js  # Tailwind CSS configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@lms.com or join our Discord community.
