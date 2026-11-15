'use client';

import { useEffect, useRef, useState } from 'react';
import { Close, Send, CheckCircle } from '@mui/icons-material';
import { supabase } from '@/lib/supabase';
import { servicesData } from '@/data/services';
import { countryCodes } from '@/data/countryCodes';
import styles from './enquiryModal.module.css';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EnquiryModal({ isOpen, onClose }: EnquiryModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    countryCode: '+91',
    number: '',
    serviceType: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const serviceOptions = servicesData.services.map(service => ({
    id: service.id,
    title: service.title
  }));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    modalRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim() || !formData.number.trim() || !formData.serviceType.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.number.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError('');

    const formattedPhone = `${formData.countryCode} ${formData.number.trim()}`;

    try {
      const { error: insertError } = await supabase
        .from('enquiries')
        .insert([
          {
            name: formData.name,
            phone: formattedPhone,
            service_type: formData.serviceType,
            status: 'new',
            submitted_from: 'popup',
            created_at: new Date().toISOString(),
          },
        ]);

      if (insertError) {
        throw insertError;
      }

      // Success
      setSubmitted(true);
      setFormData({ name: '', countryCode: '+91', number: '', serviceType: '' });
      
      // Close modal after 3 seconds
      setTimeout(() => {
        onClose();
        setSubmitted(false);
      }, 3000);
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className={styles.backdrop} onClick={onClose}></div>

      {/* Modal */}
      <div
        className={styles.modal}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-modal-title"
        tabIndex={-1}
      >
        <div className={styles.modalContent}>
          {/* Header */}
          <div className={styles.modalHeader}>
            <h2 id="enquiry-modal-title">Quick Enquiry</h2>
            <button
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close modal"
            >
              <Close />
            </button>
          </div>

          {submitted ? (
            // Success Message
            <div className={styles.successMessage}>
              <CheckCircle className={styles.successIcon} />
              <h3>Thank You!</h3>
              <p>We've received your enquiry and will contact you soon.</p>
            </div>
          ) : (
            // Form
            <form onSubmit={handleSubmit} className={styles.form}>
              {error && <div className={styles.errorMessage}>{error}</div>}

              {/* Name Field */}
              <div className={styles.formGroup}>
                <label htmlFor="name">Name *</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  disabled={loading}
                />
              </div>

              {/* Phone Number Field */}
              <div className={styles.formGroup}>
                <label htmlFor="number">Phone Number *</label>
                <div className={styles.phoneInputWrapper}>
                  <select
                    id="countryCode"
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className={styles.countryCodeSelect}
                    disabled={loading}
                    aria-label="Country Code"
                  >
                    {countryCodes.map((item) => (
                      <option key={item.code + item.name} value={item.code}>
                        {item.flag} {item.code} ({item.name.slice(0, 10)})
                      </option>
                    ))}
                  </select>
                  <input
                    id="number"
                    type="tel"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Service Type Field */}
              <div className={styles.formGroup}>
                <label htmlFor="serviceType">Service Type *</label>
                <select
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Select a service</option>
                  {serviceOptions.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className={styles.loader}></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className={styles.submitIcon} />
                    Send Enquiry
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
