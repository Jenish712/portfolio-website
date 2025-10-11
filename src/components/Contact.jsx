import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input, Textarea } from "./ui/input";
import { Section } from "./ui/section";
import { motion } from "framer-motion";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_name: 'Portfolio Owner', // You can customize this
        },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('EmailJS error:', error);
      setStatus('error');
      setErrorMessage('Failed to send message. Please try again or contact me directly.');
    }
  };

  return (
    <Section id="contact" title="Get In Touch" icon={Send}>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border">
            <CardHeader>
              <CardTitle className="text-center text-emerald-700 dark:text-emerald-300">
                Let's Work Together
              </CardTitle>
              <p className="text-muted-foreground text-center mt-2">
                Have a project in mind or just want to chat? I'd love to hear from you!
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name *
                  </label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                    className=""
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email *
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                    className=""
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell me about your project or just say hello!"
                    className="resize-vertical"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : status === 'success' ? (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Message
                    </>
                  )}
                </Button>

                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/60 p-4 rounded-lg"
                  >
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">{errorMessage}</span>
                  </motion.div>
                )}

                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/60 p-4 rounded-lg"
                  >
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">Thank you! Your message has been sent successfully. I'll get back to you soon!</span>
                  </motion.div>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Section>
  );
};

export default Contact;
