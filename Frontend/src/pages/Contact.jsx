import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send to backend
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 md:py-12 px-4 sm:px-6">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4">Contact Us</h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 px-2">
          We're here to help! Get in touch with our support team
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Get in Touch</h2>
          
          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            <div className="flex items-start">
              <div className="text-xl sm:text-2xl mr-3 sm:mr-4 flex-shrink-0">📧</div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Email</h3>
                <p className="text-gray-600 text-sm sm:text-base break-words">singhsachin4636@gmail.com</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="text-xl sm:text-2xl mr-3 sm:mr-4 flex-shrink-0">📞</div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Phone</h3>
                <p className="text-gray-600 text-sm sm:text-base">+91 7898168568</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="text-xl sm:text-2xl mr-3 sm:mr-4 flex-shrink-0">📍</div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Address</h3>
                <p className="text-gray-600 text-sm sm:text-base">123 Health Street<br />Medical City, Rewa, madhya pradesh</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="text-xl sm:text-2xl mr-3 sm:mr-4 flex-shrink-0">🕒</div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Business Hours</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 10:00 AM - 4:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Send us a Message</h2>
          
          {submitted && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded mb-4 text-sm sm:text-base">
              Thank you! Your message has been sent. We'll get back to you soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

