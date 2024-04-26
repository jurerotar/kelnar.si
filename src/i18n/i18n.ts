import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enUsLocalization from './translations/en-US.json';

const availableLocales = ['en-US'];

(async () => {
  await i18n.use(initReactI18next).init({
    lng: 'en-US',
    debug: true,
    fallbackLng: 'en-US',
    load: 'currentOnly',
    supportedLngs: availableLocales,
    returnObjects: false,
    resources: {
      'en-US': {
        translation: enUsLocalization,
      },
    },
  });
})();
