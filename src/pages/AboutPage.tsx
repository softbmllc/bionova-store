import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutPage = () => {
  const { t, i18n } = useTranslation();

  return (
    <section className="bg-white py-24 px-6 shadow-sm" data-aos="fade-up">
      <div className="max-w-2xl mx-auto text-center text-gray-800">
        <h1 className="text-4xl font-bold mb-10 tracking-tight">{t('about.title')}</h1>

        <p className="text-lg leading-relaxed mb-5">
          {t('about.description').split('\n')[0]}
        </p>
        <p className="text-lg leading-relaxed mb-8">
          {t('about.description').split('\n')[1]}
        </p>
        <p className="text-lg leading-relaxed mb-10">{t('about.mission')}</p>

        <div className="text-left mt-12">
          <h2 className="text-xl font-semibold mb-2">{t('about.addressLabel')}</h2>
          <p className="mb-6">
            20200 NW 2nd Ave, STE 108<br />
            Miami Gardens, FL 33169<br />
            {i18n.language === 'es' ? 'Estados Unidos' : 'United States'}
          </p>

          <h2 className="text-xl font-semibold mb-2">{t('about.emailLabel')}</h2>
          <p className="text-blue-600 mb-10">{t('about.email')}</p>
        </div>

        <a
          href="/shop"
          className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-700 transition"
        >
          {t('about.cta')}
        </a>
      </div>
    </section>
  );
};

export default AboutPage;