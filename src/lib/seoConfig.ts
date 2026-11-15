// SEO Configuration for REHAS Website
// https://www.rehas.in

import { Metadata } from 'next';

export const siteConfig = {
  name: 'REHAS',
  domain: 'https://www.rehas.in',
  description: 'Bridging ancient cosmic wisdom with modern wellness for a better tomorrow.',
  author: 'REHAS',
  logo: 'https://www.rehas.in/logo.png',
  ogImage: 'https://www.rehas.in/og-image.jpg',
  twitter: '@REHAS',
};

export const createMetadata = (
  title: string,
  description: string,
  keywords: string[],
  path: string = '',
  ogImage?: string
): Metadata => {
  const url = path ? `${siteConfig.domain}${path}` : siteConfig.domain;
  
  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage || siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage || siteConfig.ogImage],
      creator: siteConfig.twitter,
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    },
  };
};

// Schema.org Structured Data Helpers
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://www.rehas.in/#organization',
  name: 'REHAS',
  alternateName: 'REHAS Wellness',
  url: siteConfig.domain,
  logo: siteConfig.logo,
  description: siteConfig.description,
  founder: {
    '@type': 'Person',
    name: 'Rudra Aabhi Singh',
    jobTitle: 'Founder & Spiritual Visionary',
  },
  sameAs: [
    'https://www.facebook.com/rehas',
    'https://www.twitter.com/rehas',
    'https://www.instagram.com/rehas',
    'https://www.linkedin.com/company/rehas',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    email: 'contact@rehas.in',
    telephone: '+91-9517973153',
    availableLanguage: ['English', 'Hindi'],
    areaServed: 'Worldwide',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Chanakya Nagar Road, Agam Kua',
    addressLocality: 'Patna',
    addressRegion: 'Bihar',
    postalCode: '800007',
    addressCountry: 'IN',
  },
};

export const breadcrumbSchema = (items: { name: string; url: string }[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'HealthAndBeautyBusiness'],
  '@id': 'https://www.rehas.in/#localbusiness',
  name: 'REHAS - Vedic Astrology, Healing & Wellness Center',
  image: siteConfig.logo,
  description: siteConfig.description,
  url: siteConfig.domain,
  telephone: '+91-9517973153',
  email: 'contact@rehas.in',
  priceRange: '₹₹',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Chanakya Nagar Road, Agam Kua',
    addressLocality: 'Patna',
    addressRegion: 'Bihar',
    postalCode: '800007',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 25.5941,
    longitude: 85.1376,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:00',
      closes: '21:00',
    },
  ],
  sameAs: [
    'https://www.facebook.com/rehas',
    'https://www.twitter.com/rehas',
    'https://www.instagram.com/rehas',
  ],
};

export const serviceSchema = (
  name: string,
  description: string,
  priceRange: string = '$$'
) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  description,
  provider: {
    '@type': 'Organization',
    name: 'REHAS',
    url: siteConfig.domain,
  },
  areaServed: {
    '@type': 'Country',
    name: 'IN',
  },
  priceRange,
});

export const FAQSchema = (
  faqs: Array<{ question: string; answer: string }>
) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});
