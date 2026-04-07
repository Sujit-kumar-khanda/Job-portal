export default function JobNewsletter() {
  return (
    <section className="py-16 bg-indigo-50 text-gray-900">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4 text-indigo-600">
          Get Job Alerts in Your Inbox
        </h2>
        <p className="mb-8 text-gray-600">
          Subscribe to receive the latest job updates every week.
        </p>

        <form className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-3 rounded-lg border border-gray-300 w-full sm:w-2/3 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm transition"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 shadow-md transition"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
