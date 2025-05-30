export default function OptIn() {
  return (
    <main className="max-w-2xl mx-auto p-8 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">SMS Opt-In Consent</h1>
      <p className="mb-4">
        By entering your emergency contact information and phone number into the Syren app, you consent to receive SMS alerts related to your health status and emergency situations.
      </p>
      <p className="mb-4">
        These messages may include vital signs alerts, fall detection warnings, or notifications to call for help. Message frequency depends on your activity and health events.
      </p>
      <p className="mb-4">
        Message and data rates may apply. You can opt out anytime by replying STOP.
      </p>
      <p>
        For help, reply HELP or contact support at support@syrenapp.com.
      </p>
    </main>
  );
}
