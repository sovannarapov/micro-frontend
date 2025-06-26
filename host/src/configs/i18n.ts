import { createResolver } from '@nuxt/kit';
import en from '../content/lang/en.json';
import fr from '../content/lang/fr.json';

const { resolve } = createResolver(import.meta.url);
const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en, fr },
};

export default i18n;
