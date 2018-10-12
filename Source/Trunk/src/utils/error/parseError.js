/**
 * Created by Taobao dev team 27/1/2018
 */
import Localize from './Localize'

export const parseErrors = errors => {
    const submitErrors = {};
    if (errors.details) {
        const {messages} = errors.details;
        Object.keys(messages).map(field => {
            submitErrors[field] = (Localize.t(messages[field][0]));

            return 0;
        });
    }
    if (Object.keys(submitErrors).length === 0) {
        submitErrors['_error'] = Localize.t(errors.message)
    }
    return submitErrors;
};