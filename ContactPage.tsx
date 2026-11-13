import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowLeft } from 'lucide-react';

interface ContactPageProps {
  onBackToHome: () => void;
}

// أيقونة Gmail بألوان Google الرسمية (الأحمر، الأزرق، الأخضر، الأصفر)
const GmailIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    {/* العمود الأيسر - أزرق */}
    <path
      fill="#4285F4"
      d="M2.5 6.5v11.5c0 1.38 1.12 2.5 2.5 2.5h2V11.2L2.5 6.5z"
    />
    {/* العمود الأيمن - أخضر */}
    <path
      fill="#34A853"
      d="M21.5 6.5v11.5c0 1.38-1.12 2.5-2.5 2.5h-2V11.2l4.5-4.7z"
    />
    {/* السقف وثنية الظرف - أحمر */}
    <path
      fill="#EA4335"
      d="M12 13.5l9.5-7V5c0-1.88-2.07-3-3.6-2l-5.9 4.2-5.9-4.2C4.57 2 2.5 3.12 2.5 5v1.5l9.5 7z"
    />
    {/* الزاوية العلوية اليسرى - أصفر */}
    <path
      fill="#FBBC05"
      d="M2.5 6.5l4.5 3.5V5L2.5 6.5z"
    />
    {/* الزاوية العلوية اليمنى - أخضر غامق */}
    <path
      fill="#188038"
      d="M21.5 6.5l-4.5 3.5V5l4.5 1.5z"
    />
  </svg>
);

// أيقونة Instagram الرسمية
const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

// أيقونة WhatsApp الرسمية
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.888 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export const ContactPage: React.FC<ContactPageProps> = ({ onBackToHome }) => {
  // حالة الفورم
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // محاكاة إرسال الرسالة بنجاح
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      message: '',
    });
    setIsSubmitted(false);
  };

  return (
    <div className="w-full min-h-screen bg-white text-[#111827] pt-28 sm:pt-36 pb-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* زر الرجوع للخلف */}
        <div className="mb-6">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center space-x-2 text-xs font-medium text-neutral-500 hover:text-black transition-colors min-h-[44px] py-2 px-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to home</span>
          </button>
        </div>

        {/* الهيدر الرئيسي */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-[42px] font-bold text-neutral-900 tracking-tight mb-3 sm:mb-4">
            Contact Us
          </h1>
          <p className="text-neutral-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Our customer service team is available to assist you with order inquiries, size and fit advice, or styling questions.
          </p>
        </motion.div>

        {/* خانات التواصل الثلاث: Gmail + WhatsApp + Instagram بألوانها الرسمية المعتمدة */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10 sm:mb-12"
        >
          {/* خانة الإيميل مع لوجو Gmail الرسمي بألوانه الأصلية */}
          <a
            href="mailto:contact@fremkys.com"
            className="group bg-[#F8F9FA] hover:bg-neutral-100/90 rounded-2xl p-6 text-center transition-all duration-300 flex flex-col items-center justify-center border border-transparent hover:border-neutral-200 shadow-sm"
          >
            <div className="w-12 h-12 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
              <GmailIcon className="w-6 h-6" />
            </div>
            <span className="text-xs text-neutral-500 font-medium mb-1">Email</span>
            <span className="text-sm font-semibold text-neutral-900 group-hover:text-black transition-colors break-all">
              contact@fremkys.com
            </span>
          </a>

          {/* خانة الواتساب مع لوجو WhatsApp الرسمي الأخضر */}
          <a
            href="https://wa.me/213774296525"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-[#F8F9FA] hover:bg-neutral-100/90 rounded-2xl p-6 text-center transition-all duration-300 flex flex-col items-center justify-center border border-transparent hover:border-neutral-200 shadow-sm"
          >
            <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 group-hover:shadow-md group-hover:shadow-emerald-500/30 transition-all duration-300">
              <WhatsAppIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-neutral-500 font-medium mb-1">WhatsApp</span>
            <span className="text-sm font-semibold text-neutral-900 group-hover:text-black transition-colors">
              +213 774 29 65 25
            </span>
          </a>

          {/* خانة الانستقرام مع لوجو Instagram بتدرج ألوانه الشهير */}
          <a
            href="https://instagram.com/fremkys.boutique"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-[#F8F9FA] hover:bg-neutral-100/90 rounded-2xl p-6 text-center transition-all duration-300 flex flex-col items-center justify-center border border-transparent hover:border-neutral-200 shadow-sm"
          >
            <div 
              style={{
                background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)'
              }}
              className="w-12 h-12 rounded-full text-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 group-hover:shadow-md group-hover:shadow-pink-500/30 transition-all duration-300"
            >
              <InstagramIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-neutral-500 font-medium mb-1">Instagram</span>
            <span className="text-sm font-semibold text-neutral-900 group-hover:text-black transition-colors">
              @fremkys.boutique
            </span>
          </a>
        </motion.div>

        {/* كارد الفورم Send us a message */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-10 shadow-sm max-w-xl mx-auto"
        >
          <h2 className="text-base sm:text-lg font-semibold text-neutral-900 mb-6 text-center">
            Send us a message
          </h2>

          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="submitted-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-8 text-center"
              >
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Message Sent</h3>
                <p className="text-sm text-neutral-600 mb-6 max-w-sm mx-auto">
                  Thank you for contacting us. Our team will review your message and reply as soon as possible.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center justify-center px-6 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form key="form-state" onSubmit={handleSubmit} className="space-y-4">
                {/* الصف الأول: First Name و Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label 
                      htmlFor="firstName" 
                      className="block text-xs sm:text-sm font-medium text-neutral-800 mb-1.5"
                    >
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-base sm:text-sm rounded-lg border border-gray-200 bg-white text-neutral-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
                    />
                  </div>

                  <div>
                    <label 
                      htmlFor="lastName" 
                      className="block text-xs sm:text-sm font-medium text-neutral-800 mb-1.5"
                    >
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-base sm:text-sm rounded-lg border border-gray-200 bg-white text-neutral-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
                    />
                  </div>
                </div>

                {/* الصف الثاني: Email */}
                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-xs sm:text-sm font-medium text-neutral-800 mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-base sm:text-sm rounded-lg border border-gray-200 bg-white text-neutral-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
                  />
                </div>

                {/* الصف الثالث: Message */}
                <div>
                  <label 
                    htmlFor="message" 
                    className="block text-xs sm:text-sm font-medium text-neutral-800 mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-base sm:text-sm rounded-lg border border-gray-200 bg-white text-neutral-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors resize-none"
                  />
                </div>

                {/* زر الإرسال: Send Message */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full min-h-[48px] bg-[#111827] hover:bg-black text-white py-3 px-6 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm flex items-center justify-center space-x-2 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span>Send Message</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  );
};
