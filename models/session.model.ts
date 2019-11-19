export interface ICredentials {
    token: string;
    sign: string;
}

interface IFeCabReq {
    CantReg: number;
    PtoVta: number;
    CbteTipo: number;
}

interface IFECAEDetRequest {
    Concepto: number;
    DocTipo: number;
    DocNro: number;
    CbteDesde: number;
    CbteHasta: number;
    CbteFch: string;
    ImpTotal: number;
    ImpTotConc: number;
    ImpNeto: number;
    ImpOpEx: number;
    ImpTrib: number;
    ImpIVA: number;
    FchServDesde: string;
    FchServHasta: string;
    FchVtoPago: string;
    MonId: string;
    MonCotiz: number;
    Tributos?: {
        Tributo: Array<ITributo>;
    };
    Iva?: {
        AlicIva: Array<IAlicIva>;
    };
}

interface ITributo {
    Id: number;
    Desc: string;
    BaseImp: number;
    Alic: number;
    Importe: number;
}

interface IAlicIva {
    Id: number;
    BaseImp: number;
    Importe: number;
}

interface IFeDetReq {
    FECAEDetRequest: Array<IFECAEDetRequest>;
}

export interface IWsfe {
    FeCabReq: IFeCabReq;
    FeDetReq: IFeDetReq;
}
