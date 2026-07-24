export default function TermsPage() {
  return (
    <div className="min-h-screen py-20 px-4" style={{ background: '#0B0B1A' }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white mb-4">Terms of Service</h1>
          <p className="text-[#9CA3AF]">Last updated: July 2026</p>
        </div>

        <div className="card space-y-6">
          {[
            {
              title: '1. Acceptance of Terms',
              content: 'By accessing and using BOASTLIB, you accept and agree to be bound by the terms and provisions of this agreement. BOASTLIB provides social media marketing services including followers, likes, views, and engagement across various platforms.',
            },
            {
              title: '2. Services',
              content: 'BOASTLIB provides social media marketing (SMM) services. All services are delivered by third-party providers. Delivery times may vary. We do not guarantee that social media platforms will not remove purchased engagement as platforms periodically purge inactive or inauthentic accounts.',
            },
            {
              title: '3. Payment Policy',
              content: 'All payments are processed securely. Funds added to your wallet are non-refundable once orders have been placed. Failed or undelivered orders will be refunded to your BOASTLIB wallet balance. We do not issue cash refunds.',
            },
            {
              title: '4. Refill Policy',
              content: 'Services marked with refill guarantee will be refilled if followers/likes drop within the stated refill period. Refill requests must be submitted through the dashboard. Refills are subject to availability.',
            },
            {
              title: '5. Prohibited Use',
              content: 'You may not use BOASTLIB for any illegal purposes or to violate any laws. You may not use our services to harm, threaten, or harass others. We reserve the right to suspend accounts that violate these terms.',
            },
            {
              title: '6. Account Responsibility',
              content: 'You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. BOASTLIB will not be liable for any loss resulting from unauthorized account access.',
            },
            {
              title: '7. Limitation of Liability',
              content: 'BOASTLIB provides services "as is" without warranty of any kind. We are not responsible for any social media account restrictions, bans, or penalties that may result from using our services. Use at your own risk.',
            },
            {
              title: '8. Changes to Terms',
              content: 'BOASTLIB reserves the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.',
            },
            {
              title: '9. Contact',
              content: 'For questions about these terms, contact us at support@boastlib.com or via Telegram/WhatsApp support.',
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
