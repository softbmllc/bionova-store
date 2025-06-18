import { useTranslation } from 'react-i18next';

export default function AboutPreview() {
  const { t } = useTranslation();

  return (
    <section className="bg-gray-50 py-20 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <p className="text-xs md:text-sm text-gray-600 uppercase tracking-widest mb-5">{t('about.subtitle')}</p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          {t('about.headline')}
        </h2>
        <p className="text-base md:text-lg text-gray-600 leading-relaxed">
          {t('about.preview')}
        </p>
        <div className="mt-8">
          <a
            href="/about"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md transition"
          >
            {t('about.cta')}
          </a>
        </div>
      </div>
    </section>
  );
}