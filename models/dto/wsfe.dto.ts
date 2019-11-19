import { IWsfe } from '../../models/session.model';
import { IFullInvoice, INVOICE_TYPE_B, INVOICE_CONCEPT_PRODUCTS, INVOICE_TYPE_DOC_CUIT, INVOICE_MON_PES, INVOICE_MON_COTIZ, INVOICE_IVA_0, INVOICE_TRIBUTO_OTRO, INVOICE_TYPE_DOC_DNI } from '../invoice.model';
import moment = require('moment');
import { getVerificationCode } from '../../services/common.service';

export const WsfeDto = (invoice: IFullInvoice): IWsfe => {
    const { importeNeto = 0, importeIva = 0, total = 0, importeIntereses = 0, porcentajeIntereses = 0 } = invoice.footer.totals;
    const { cuit } = invoice.body;
    return  {
        FeCabReq: {
            CantReg: 1,
            PtoVta: invoice.header.ptoVenta,
            CbteTipo: INVOICE_TYPE_B
        },
        FeDetReq: {
            FECAEDetRequest: [{
                Concepto: INVOICE_CONCEPT_PRODUCTS,
                DocTipo: INVOICE_TYPE_DOC_DNI,
                DocNro: cuit,
                CbteDesde: 1,
                CbteHasta: 1,
                CbteFch: moment(new Date()).format("YYYYMMDD"),
                ImpTotal: total,
                ImpTotConc: 0,
                ImpNeto: importeNeto,
                ImpOpEx: 0,
                ImpTrib: importeIntereses,
                ImpIVA: importeIva,
                MonId: INVOICE_MON_PES,
                MonCotiz: INVOICE_MON_COTIZ,
                FchServDesde: '',
                FchServHasta: '',
                FchVtoPago: '',
                Iva: {
                    AlicIva: [
                        {
                            Id: INVOICE_IVA_0,
                            BaseImp: importeNeto,
                            Importe: importeIva
                        },
                    ]
                },
                Tributos: {
                    Tributo: [{
                        Id: INVOICE_TRIBUTO_OTRO,
                        Desc: 'Intereses',
                        BaseImp: importeNeto,
                        Alic: porcentajeIntereses,
                        Importe: importeIntereses
                    }]
                }
            }]
        }
    };
};

export const FullInvoiceDto = ({ CAE, CAEFchVto, CbteDesde }, {CbteTipo, PtoVta}, fullInvoice: IFullInvoice): IFullInvoice => {
    const fullCode = `${fullInvoice.header.cuit}${CbteTipo.padStart(3, '0')}${PtoVta.padStart(5, '0')}${CAE}${CAEFchVto}`
    return {
        ...fullInvoice,
        header: {
            ...fullInvoice.header,
            compNumero: CbteDesde,
        },
        footer: {
            ...fullInvoice.footer,
            CAE,
            fechaVencCAE: CAEFchVto,
            codigoCAECompleto: `${fullCode}${getVerificationCode(fullCode)}`
        }
    };
};
