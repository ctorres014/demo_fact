import { Wsfev1, PersonaServiceA10 } from "afip-apis";
import { ICredentials, IWsfe } from "../models/session.model";
import moment from "moment";
import { isProdEnvironment } from './common.service';
import {
    IFEParamGetPtosVentaOutput, IFEParamGetTiposDocOutput, IFEParamGetTiposCbteOutput,
    IFEParamGetTiposConceptoOutput, IFEParamGetTiposIvaOutput, IFEParamGetTiposTributosOutput,
    IFEParamGetTiposOpcionalOutput, IFECAEAConsultarOutput, IFECAEASinMovimientoConsultarOutput,
    IFECAEASinMovimientoInformarOutput, IFECompUltimoAutorizadoOutput,
    IFECAEASolicitarOutput, IFECAESolicitarOutput, IFECompConsultarOutput
} from "afip-apis/dist/lib/services/wsdl/wsfe1Service/ServiceSoap12";
import fs from 'fs';
import JsBarcode from 'jsbarcode';
import { Canvas } from "canvas";
import { logger } from './logger.service';
import { IFullInvoice } from "../models/invoice.model";
import { currencyFormat } from './common.service';

const wsfev1: Wsfev1 = new Wsfev1(isProdEnvironment() ? Wsfev1.produccionWSDL : Wsfev1.testWSDL);
const periodo = +moment(new Date()).format("YYYYMM");

export default class Invoice {

    public data: {
        credentials: ICredentials;
        cuit: number;
        invoice?: IWsfe;
    }

    /**
    * Esta operación permite recuperar valores referenciales de códigos de Tipos de Alícuotas.
    * @returns Promise IFEParamGetTiposIvaOutput
    */
    async FEParamGetTiposIva(): Promise<IFEParamGetTiposIvaOutput> {
        return wsfev1.FEParamGetTiposIva(this.getAuth()).then(r => r).catch((e) => { throw e });
    }

    /**
    * Esta operación permite recuperar los puntos de venta asignados a Facturación Electrónica que soporten CAE y CAEA vía Web Services.
    * @returns Promise IFEParamGetPtosVentaOutput
    */
    async FEParamGetPtosVenta(): Promise<IFEParamGetPtosVentaOutput> {
        return wsfev1.FEParamGetPtosVenta(this.getAuth()).then(r => r).catch((e) => { throw e });
    }

    /**
    * Esta operación permite recuperar valores referenciales de códigos de Tipos de Documentos.
    * @returns Promise IFEParamGetTiposDocOutput
    */
    async FEParamGetTiposDoc(): Promise<IFEParamGetTiposDocOutput> {
        return wsfev1.FEParamGetTiposDoc(this.getAuth()).then(r => r).catch((e) => { throw e });
    }

    /**
    * Esta operación permite recuperar valores referenciales de códigos de Tipos de comprobante.
    * @returns Promise IFEParamGetTiposCbteOutput
    */
    async FEParamGetTiposCbte(): Promise<IFEParamGetTiposCbteOutput> {
        return wsfev1.FEParamGetTiposCbte(this.getAuth()).then(r => r).catch((e) => { throw e });
    }

    /**
    * Esta operación permite recuperar valores referenciales de códigos de Tipos de Conceptos.
    * @returns Promise IFEParamGetTiposConceptoOutput
    */
    async FEParamGetTiposConcepto(): Promise<IFEParamGetTiposConceptoOutput> {
        return wsfev1.FEParamGetTiposConcepto(this.getAuth()).then(r => r).catch((e) => { throw e });
    }

    /**
    * Esta operación permite consultar valores referenciales de códigos de Tipos de Tributos.
    * @returns Promise FEParamGetTiposTributos
    */
    async FEParamGetTiposTributos(): Promise<IFEParamGetTiposTributosOutput> {
        return wsfev1.FEParamGetTiposTributos(this.getAuth()).then(r => r).catch((e) => { throw e });
    }

    /**
    * Esta operación permite consultar valores referenciales de códigos de Tipos de datos Opcionales.
    * @returns Promise FEParamGetTiposOpcional
    */
    async FEParamGetTiposOpcional(): Promise<IFEParamGetTiposOpcionalOutput> {
        return wsfev1.FEParamGetTiposOpcional(this.getAuth()).then(r => r).catch((e) => { throw e });
    }

    /**
    * Esta operación permite consultar de CAEA.
    * @returns Promise FECAEAConsultar
    */
    async FECAEAConsultar(): Promise<IFECAEAConsultarOutput> {
        return wsfev1.FECAEAConsultar({ ...this.getAuth(), Periodo: periodo, Orden: 1 }).then(r => r).catch((e) => { throw e });
    }

    /**
    * Esta operación permite consultar CAEA sin movimiento.
    * @returns Promise FECAEASinMovimientoConsultar
    */
    async FECAEASinMovimientoConsultar(): Promise<IFECAEASinMovimientoConsultarOutput> {
        return wsfev1.FECAEASinMovimientoConsultar({ ...this.getAuth(), CAEA: "", PtoVta: 1 }).then(r => r).catch((e) => { throw e });
    }

    /**
    * Esta operación permite informar CAEA sin movimiento.
    * @returns Promise FECAEASinMovimientoInformar
    */
    async FECAEASinMovimientoInformar(): Promise<IFECAEASinMovimientoInformarOutput> {
        return wsfev1.FECAEASinMovimientoInformar({ ...this.getAuth(), CAEA: "", PtoVta: 1 }).then(r => r).catch((e) => { throw e });
    }

    /**
    * Esta operación permite recuperar el ultimo valor de comprobante registrado.
    * @returns Promise FECompUltimoAutorizado
    */
    async FECompUltimoAutorizado(ptoVta, cbteTipo): Promise<IFECompUltimoAutorizadoOutput> {
        return wsfev1.FECompUltimoAutorizado({ ...this.getAuth(), PtoVta: ptoVta, CbteTipo: cbteTipo }).then(r => r).catch((e) => { throw e });
    }

    /**
    * Esta operación permite la obtención de CAEA.
    * @returns Promise FECAEASolicitar
    */
    async FECAEASolicitar(): Promise<IFECAEASolicitarOutput> {
        return wsfev1.FECAEASolicitar({ ...this.getAuth(), Orden: 1, Periodo: periodo }).then((r) => {
            if (r.FECAEASolicitarResult && r.FECAEASolicitarResult.Errors) {
                logger.log({ level: 'error', message: JSON.stringify(r.FECAEASolicitarResult.Errors) });
                throw r.FECAEASolicitarResult.Errors;
            }
            return r;
        }).catch((e) => {
            logger.log({ level: 'error', message: e });
            throw e;
        });
    }

    /**
    * Esta operación permite la autorización de comprobantes electrónicos por CAE.
    * @param compUltimoAutorizado IFECompUltimoAutorizadoOutput
    * @returns Promise FECAESolicitar
    */
    async FECAESolicitar(compUltimoAutorizado: IFECompUltimoAutorizadoOutput): Promise<IFECAESolicitarOutput> {
        try {
            let { FECAEDetRequest } = this.data.invoice.FeDetReq;
            FECAEDetRequest[0].CbteDesde = Number(compUltimoAutorizado.FECompUltimoAutorizadoResult.CbteNro) + 1;
            FECAEDetRequest[0].CbteHasta = Number(FECAEDetRequest[0].CbteDesde);
            return wsfev1.FECAESolicitar({ ...this.getAuth(), FeCAEReq: this.data.invoice }).then((r) => {
                if (r.FECAESolicitarResult && r.FECAESolicitarResult.Errors) {
                    logger.log({ level: 'error', message: JSON.stringify(r.FECAESolicitarResult.Errors) });
                    throw r.FECAESolicitarResult.Errors;
                }
                return r;
            }).catch((e) => {
                logger.log({ level: 'error', message: e });
                throw e;
            });
        } catch (e) {
            logger.log({ level: 'error', message: e });
            throw e;
        }
    }

    /**
    * Esta operación permite consultar comprobantes Emitidos y su código.
    * @param caeSolicitar IFECAESolicitarOutput
    * @returns Promise FECompConsultar
    */
    async FECompConsultar(cbteTipo: number, ptoVta: number, cbteNro: number): Promise<IFECompConsultarOutput> {
        return wsfev1.FECompConsultar({ ...this.getAuth(), FeCompConsReq: { CbteTipo: cbteTipo, PtoVta: ptoVta, CbteNro: cbteNro } })
            .then((r) => {
                if (r.FECompConsultarResult && r.FECompConsultarResult.Errors) {
                    logger.log({ level: 'error', message: JSON.stringify(r.FECompConsultarResult.Errors) });
                    throw r.FECompConsultarResult.Errors;
                }
                return r;
            }).catch((e) => {
                logger.log({ level: 'error', message: e });
                throw e
            });
    }

    /**
    * Esta operación permite consultar el estadio del servidor.
    * @returns Promise boolean
    */
    async serverStatus(): Promise<boolean> {
        return wsfev1.FEDummy()
            .then(({ FEDummyResult }) =>
                FEDummyResult &&
                FEDummyResult.AppServer === "OK" &&
                FEDummyResult.DbServer === "OK" &&
                FEDummyResult.AuthServer === "OK")
            .catch((e) => { throw e });
    }

    getInvoiceTemplate(fullInvoice: IFullInvoice) {
        try {
            const details = this.processInvoiceDetailTemplate(fullInvoice);
            const content = this.processInvoiceContentTemplate(fullInvoice, details);
            return this.processInvoiceTemplate(content);
        } catch (e) {
            logger.log({ level: 'error', message: e });
            throw e;
        }
    }

    private processInvoiceDetailTemplate({ details }) {
        const invoiceDetailTemplate = fs.readFileSync('./public/template/invoice_details_template.html', 'utf8');
        let _details = '';
        for (const item of details) {
            _details += invoiceDetailTemplate
                .replace('{cantidad}', item.cantidad.toString())
                .replace('{descripcion}', item.descripcion)
                .replace('{importeNeto}', currencyFormat(item.importeNeto))
                .replace('{total}', currencyFormat(item.total))
        }
        return _details;
    }

    private processInvoiceContentTemplate({ header, body, footer }, details) {
        let address: any = header.direccionComercial.split(",");
        let street: string = address[0];
        let state: string = address[1];
        let country: string = address[2];

        let invoiceTemplate = fs.readFileSync('./public/template/invoice_content_template.html', 'utf8');
        invoiceTemplate = invoiceTemplate
            .replace(/{razonSocial}/g, header.razonSocial)
            .replace('{ptoVenta}', header.ptoVenta.toString().padStart(5, '0'))
            .replace('{compNumero}', header.compNumero.toString().padStart(8, '0'))
            .replace('{fechaCreacion}', header.fechaCreacion)
            .replace('{direccionComercial}', street)
            .replace('{direccionComercial2}', `${state}, ${country}`)
            .replace('{cuit}', header.cuit.toString())
            .replace('{ingresosBrutos}', header.ingresosBrutos)
            .replace('{fechaInicioActividades}', header.fechaInicioActividades)
            .replace('{condicionIva}', header.condicionIva)
            .replace('{cuitDestiono}', body.cuit.toString())
            .replace('{razonSocialDestino}', body.razonSocial)
            .replace('{direccion}', body.direccion)
            .replace('{condicionIvaDestino}', body.iva)
            .replace('{subtotal}', currencyFormat(footer.totals.subtotal))
            .replace('{intereses}', currencyFormat(footer.totals.importeIntereses))
            .replace('{importeTotal}', currencyFormat(footer.totals.total))
            .replace('{CAE}', footer.CAE)
            .replace('{fechaVencCAE}', footer.fechaVencCAE)
            .replace('{codigoCAECompleto}', footer.codigoCAECompleto);

        invoiceTemplate = invoiceTemplate.replace('{details}', details);
        invoiceTemplate = invoiceTemplate.replace('{barcode}', this.generateBarcode(footer.codigoCAECompleto));
        return invoiceTemplate;
    }

    private processInvoiceTemplate(invoiceContent) {

        const baseTemplate = fs.readFileSync('./public/template/invoice_base_template.html', 'utf8');
        const original = baseTemplate.replace('{base}', invoiceContent)
        const duplicado = baseTemplate.replace('{base}', invoiceContent)
        const triplicado = baseTemplate.replace('{base}', invoiceContent)

        return `${original.replace('{tipo}', 'ORIGINAL')}
                ${duplicado.replace('{tipo}', 'DUPLICADO')}
                ${triplicado.replace('{tipo}', 'TRIPLICADO')}`;
    }

    private generateBarcode(code: string) {
        const canvas = new Canvas(100, 100);
        JsBarcode(canvas, code);
        return Buffer.from(canvas.toBuffer() as ArrayBuffer).toString('base64');
    }

    private getAuth() {
        const { credentials, cuit } = this.data;
        return {
            Auth: {
                Token: credentials.token,
                Sign: credentials.sign,
                Cuit: cuit
            }
        }
    }
}