import express from 'express';
import Invoice from '../services/invoice.service';
import { ICredentials } from '../models/session.model';
import { IFECompConsultarOutput } from 'afip-apis/dist/lib/services/wsdl/wsfe1Service/ServiceSoap12';
import pdf from 'html-pdf';
import { IFullInvoice } from '../models/invoice.model';
import { WsfeDto, FullInvoiceDto } from '../models/dto/wsfe.dto';
import { logger } from '../services/logger.service';
import EmailService from '../services/email.service';
import { configurations } from '../config/config';
import PadronA10 from '../services/padronA10.service'

const SERVER_ERROR_MSG = 'Ocurrio un error al tratar de conectarse con el servidor del afip.';
const DEFAULT_ERROR_MSG = 'Ocurrio un error al tratar de procesar la solicitud.';

export const router = express.Router();

const wsfev1 = new Invoice();
const padronA10 = new PadronA10();
const emailService = new EmailService();

router.post('/', async (req, res, next) => {
    if (await wsfev1.serverStatus()) {
        try {
            return createInvoice(res, res.locals.credentials, req.body);
        } catch (e) {
            logger.log({ level: 'error', message: e });
            throw e;
        }
    } else {
        logger.log({ level: 'error', message: SERVER_ERROR_MSG });
        res.status(500).json({ ok: false, message: SERVER_ERROR_MSG });
    }
});

router.get('/getLastInvoice/:ptoVta/:cbteTipo/:cuit', async (req, res) => {
    requestHandler(res, getLastInvoice(req, res.locals.credentials));
});

router.get('/getInvoiceById/:ptoVta/:cbteTipo/:cbteNro/:cuit', async (req, res) => {
    requestHandler(res, getInvoiceById(req, res.locals.credentials));
});

router.get('/:cuitRepresentada/:idPersona', async (req, res) => {
    requestHandler(res, getPersona(req));
});

const requestHandler = async (res, promise: Promise<any>) => {
    if (await wsfev1.serverStatus()) {
        try {
            res.status(200).json({ ok: true, message: 'OK', voucher: await promise });
        } catch (error) {
            res.status(400).json({ ok: false, message: DEFAULT_ERROR_MSG, error });
        }
    } else {
        res.status(500).json({ ok: false, message: SERVER_ERROR_MSG });
    }
};

const getInvoiceById = async ({ params }, credentials: ICredentials): Promise<IFECompConsultarOutput> => {
    const { ptoVta, cbteTipo, cuit, cbteNro } = params;
    wsfev1.data = { credentials, cuit: Number(cuit) };
    return await wsfev1.FECompConsultar(cbteTipo, ptoVta, cbteNro);
};

const getLastInvoice = async ({ params }, credentials: ICredentials): Promise<IFECompConsultarOutput> => {
    const { ptoVta, cbteTipo, cuit } = params;
    wsfev1.data = { credentials, cuit: Number(cuit) };
    const lastAuthorizedVoucher = await wsfev1.FECompUltimoAutorizado(ptoVta, cbteTipo);
    const { CbteTipo, PtoVta, CbteNro } = lastAuthorizedVoucher.FECompUltimoAutorizadoResult;
    return await wsfev1.FECompConsultar(CbteTipo, PtoVta, CbteNro);
};

const createInvoice = async (res, credentials: ICredentials, fullInvoice: IFullInvoice) => {
    const invoice = WsfeDto(fullInvoice);
    wsfev1.data = { credentials, cuit: fullInvoice.header.cuit, invoice };
    const { PtoVta, CbteTipo } = invoice.FeCabReq;
    const lastAuthorizedInvoice = await wsfev1.FECompUltimoAutorizado(PtoVta, CbteTipo);
    const {FECAESolicitarResult} = await wsfev1.FECAESolicitar(lastAuthorizedInvoice);
    const FECAEDetResponse: any = FECAESolicitarResult.FeDetResp.FECAEDetResponse;
    if (!FECAEDetResponse.CAE && !FECAEDetResponse.CAEFchVto) {
        logger.log({ level: 'error', message: JSON.stringify(FECAESolicitarResult) });
        res.status(400).json({ ok: false, message: DEFAULT_ERROR_MSG, FECAESolicitarResult });
        return;
    }
 
    await preparePdfInvoice(res, FullInvoiceDto(FECAEDetResponse, FECAESolicitarResult.FeCabResp,  fullInvoice));
};

const preparePdfInvoice = async (res, fullInvoice: IFullInvoice) => {
    try {
        const { format } = configurations.pdf.options;
        const to = `${fullInvoice.body.email}, ${fullInvoice.header.email}`;
        const template = wsfev1.getInvoiceTemplate(fullInvoice);
        const createPdf = pdf.create(template, { format });
        createPdf.toBuffer((err, buffer) => sendEmail(res, buffer, to));
    } catch (e) {
        logger.log({ level: 'error', message: e });
        throw e;
    }
};

const sendEmail = async (res, buffer: Buffer, to: string) => {
    await emailService.sendEmail(buffer, to)
        .then(() => res.status(200).json({ ok: true, message: 'OK', }))
        .catch(e => res.status(400).json({ ok: false, message: e }));
};

const getPersona = async ({ params }) => {
    const { cuitRepresentada, idPersona } = params;
    return await padronA10.getPersona(cuitRepresentada, idPersona);
};
