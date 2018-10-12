import i18n from 'i18next';
import {reactI18nextModule} from 'react-i18next';

i18n.use(reactI18nextModule)
    .init({
        preload : ['en','vi'],
        resources : {
            en : {
                translation : require('./locals/en/en.json')
            },
            vi : {
                translation: require('./locals/vn/vn.json')
            }
        },
        react: {
            wait: true
        }
    });

i18n.on('languageChanged', () => {
    document.location.reload();
});
export default i18n;