import * as fs from "fs";
import { LoginTicket, ILoginTicketResponse, LoginCmsSoap } from "afip-apis";
import moment from "moment";
import { isProdEnvironment } from './common.service';
import { configurations } from '../config/config';
import { logger } from './logger.service';
export default class CacheLogin {
    private static instance: CacheLogin;
    private loginTicket: LoginTicket;
    private wsaaUrl = isProdEnvironment() ? LoginCmsSoap.produccionWSDL : LoginCmsSoap.testWSDL;

    constructor() {
        this.loginTicket = new LoginTicket();
        this.checkFolder(configurations.cache);
    }

    public static get Instance(): CacheLogin {
        if (!CacheLogin.instance) {
            CacheLogin.instance = new CacheLogin();
        }
        return CacheLogin.instance;
    }

    private checkFolder(pathToCheck: string) {
        if (fs.existsSync(pathToCheck)) { return; }
        fs.mkdirSync(pathToCheck);
    }

    private async login(serviceId: string): Promise<ILoginTicketResponse> {
        return this.loginTicket.wsaaLogin(serviceId, this.wsaaUrl, configurations.certificates.file, configurations.certificates.key)
            .then(ticket => {
                try {
                    fs.writeFileSync(`${configurations.cache}${serviceId}-ticket.json`, JSON.stringify(ticket));
                    return Promise.resolve(ticket);
                } catch (e) {
                    logger.log({ level: 'error', message: e });
                    return Promise.reject(e);
                }
            });
    }

    private resolveCache(ticket: ILoginTicketResponse, resolve: Function) {
        if (ticket && moment(ticket.header.expirationTime).isSameOrAfter(moment())) {
            return resolve(ticket);
        }
    }

    private getCacheFromFile(serviceId: string, resolve: Function) {
        const ticketPath = `${configurations.cache}${serviceId}-ticket.json`;
        let ticket: ILoginTicketResponse;
        if (fs.existsSync(ticketPath)) {
            try {
                ticket = JSON.parse(fs.readFileSync(ticketPath, "utf8"));
                this.resolveCache(ticket, resolve);
            } catch (e) {
                logger.log({ level: 'error', message: e });
                throw e;
            }
        }
    }

    /**
     * Devuelve el ticket de autenticacion
     * @param serviceId identificador del servicio
     * @returns Promise con el ticket
     */
    public getTicket(serviceId: string = configurations.services.wsfe): Promise<ILoginTicketResponse> {
        return new Promise<ILoginTicketResponse>((resolve: Function, reject: Function) => {
            this.getCacheFromFile(serviceId, resolve);
            return this.login(serviceId)
                .then(ticket => resolve(ticket))
                .catch(e => {
                    logger.log({ level: 'error', message: e });
                    return reject(e);
                });
        });
    }
}
