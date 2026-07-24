export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-20 px-4" style={{ background: '#0B0B1A' }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white mb-4">Privacy Policy</h1>
          <p className="text-[#9CA3AF]">Last updated: July 2026</p>
        </div>

        <div className="card space-y-6">
          {[
            {
              title: '1. Information We Collect',
              content: 'We collect information you provide when registering: name, email address, phone number, and country. We also collect usage data including orders placed, payment history, and login activity.',
            },
            {
              title: '2. How We Use Your Information',
              content: 'We use your information to provide and improve our services, process payments, send account notifications, and provide customer support. We do not sell your personal information to third parties.',
            },
            {
              title: '3. Payment Information',
              content: 'Payment processing is handled by DodoPay and PawaPay. We do not store your card details. For mobile money payments, we only store the phone number used for the transaction.',
            },
            {
              title: '4. Data Security',
              content: 'We implement industry-standard security measures including SSL encryption, bcrypt password hashing, and JWT authentication tokens. Your data is stored on secure Railway PostgreSQL servers.',
            },
            {
              title: '5. Cookies',
              content: 'We use essential cookies and localStorage to maintain your login session. We do not use advertising or tracking cookies. You can clear your browser storage at any time to log out.',
            },
            {
              title: '6. Third-Party Services',
              content: 'We use SMM providers to fulfill orders. These providers receive only the social media links required to complete your order. No personal information is shared with providers.',
            },
            {
              title: '7. Data Retention',
              content: 'We retain your account data for as long as your account is active. Order history is retained for two years for accounting purposes. You may request account deletion by contacting support.',
            },
            {
              title: '8. Your Rights',
              content: 'You have the right to access, correct, or delete your personal data. Contact us at support@boastlib.com to exercise these rights. We will respond within 30 days.',
            },
            {
              title: '9. Contact Us',
              content: 'For privacy concerns contact support@boastlib.com. We take privacy seriously and will address your concerns promptly.',
            },
          ].map((section) => (
            <div key={section.title}>
              <h2 className="text-white font-bold text-lg mb-3">{section.title}</h2>
              <p className="text-[#9CA3AF] leading-relaxed text-sm">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a href="/" className="text-[#3B82F6] hover:underline text-sm">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
