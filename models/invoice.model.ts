interface IHeader {
    razonSocial: string;
    direccionComercial: string;
    condicionIva: string;
    ptoVenta: number;
    compNumero?: number;
    fechaCreacion: string;
    cuit: number;
    ingresosBrutos: string;
    fechaInicioActividades: string;
    email: string;
}

interface IBody {
    razonSocial: string;
    cuit: number;
    iva: string;
    direccion: string;
    email: string;
}

interface IDetail {
    cantidad: number;
    descripcion: string;
    importeNeto: number;
    total: number;
}

export interface ITotal {
    importeNeto: number;
    importeIva?: number;
    total: number;
    subtotal: number;
    importeIntereses: number;
    porcentajeIntereses: number;
}

interface IFooter {
    totals: ITotal;
    taxes?: null;
    CAE?: string;
    fechaVencCAE?: string;
    codigoCAECompleto?: string;
}

export interface IFullInvoice {
    header: IHeader;
    body: IBody;
    details: Array<IDetail>,
    footer: IFooter;
}


export const INVOICE_TYPE_B = 6;
export const INVOICE_TYPE_DOC_CUIT = 80;
export const INVOICE_TYPE_DOC_DNI = 96;
export const INVOICE_CONCEPT_PRODUCTS = 1;
export const INVOICE_IVA_21 = 5;
export const INVOICE_IVA_0 = 3;
export const INVOICE_MON_PES = 'PES';
export const INVOICE_MON_COTIZ = 1;
export const INVOICE_TRIBUTO_OTRO = 99;

