import {  PersonaServiceA10 } from "afip-apis";
import CacheLogin from './cache-login.service';
import { IgetPersonaOutput } from "afip-apis/dist/lib/services/wsdl/PersonaServiceA10/PersonaServiceA10Port";
import { configurations } from '../config/config';
import { isProdEnvironment } from "./common.service";
import { logger } from './logger.service';

const cacheLogin = CacheLogin.Instance;
const personaServiceA10 = new PersonaServiceA10(isProdEnvironment() ? PersonaServiceA10.produccionWSDL : PersonaServiceA10.testWSDL);

export default class PersonaA10 {
    async getPersona(cuitRepresentada: number, idPersona: number): Promise<IgetPersonaOutput> {
        const ticket = await cacheLogin.getTicket(configurations.services.padronA10);
        return await personaServiceA10.getPersona({
            token: ticket.credentials.token,
            sign: ticket.credentials.sign,
            cuitRepresentada,
            idPersona
        }).then(r => r)
          .catch(e => {
            logger.log({ level: 'error', message: JSON.stringify(e) });
            return null;
        });
    }
}
