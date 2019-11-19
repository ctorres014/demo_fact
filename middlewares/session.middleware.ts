import CacheLogin from '../services/cache-login.service';
import { logger } from '../services/logger.service';

const cacheLogin = CacheLogin.Instance;

export const session = (req, res, next) => {
    const ticket = cacheLogin.getTicket();
    ticket.then(({ credentials }) => {
        res.locals.credentials = credentials;
        next();
    }).catch((e) => {
        logger.log({ level: 'error', message: e})
        res.status(401).json({ ok: false, message: 'ERROR', e })
    });
};
