import Invoice from './invoice.service';
import moment = require('moment');
import { IFECompUltimoAutorizadoOutput } from 'afip-apis/dist/lib/services/wsdl/wsfe1Service/ServiceSoap12';

jest.mock('afip-apis', () => {
  return {
    Wsfev1: jest.fn().mockImplementation(() => {
      return {
        FEDummy: jest.fn()
          .mockResolvedValueOnce({
            FEDummyResult: {
              AppServer: 'OK',
              DbServer: 'OK',
              AuthServer: 'OK'
            }
          })
          .mockResolvedValueOnce({
            FEDummyResult: {
              AppServer: '',
              DbServer: '',
              AuthServer: ''
            }
          })
          .mockRejectedValueOnce({}),
        FEParamGetTiposIva: jest.fn()
          .mockResolvedValueOnce({ data: {} })
          .mockRejectedValueOnce({}),
        FEParamGetPtosVenta: jest.fn()
          .mockResolvedValueOnce({ data: {} })
          .mockRejectedValueOnce({}),
        FEParamGetTiposDoc: jest.fn()
          .mockResolvedValueOnce({ data: {} })
          .mockRejectedValueOnce({}),
        FEParamGetTiposCbte: jest.fn()
          .mockResolvedValueOnce({ data: {} })
          .mockRejectedValueOnce({}),
        FEParamGetTiposConcepto: jest.fn()
          .mockResolvedValueOnce({ data: {} })
          .mockRejectedValueOnce({}),
        FECAEASinMovimientoConsultar: jest.fn()
          .mockResolvedValueOnce({ data: {} })
          .mockRejectedValueOnce({}),
        FEParamGetTiposTributos: jest.fn()
          .mockResolvedValueOnce({ data: {} })
          .mockRejectedValueOnce({}),
        FEParamGetTiposOpcional: jest.fn()
          .mockResolvedValueOnce({ data: {} })
          .mockRejectedValueOnce({}),
        FECAEAConsultar: jest.fn()
          .mockResolvedValueOnce({ data: {} })
          .mockRejectedValueOnce({}),
        FECAEASinMovimientoInformar: jest.fn()
          .mockResolvedValueOnce({ data: {} })
          .mockRejectedValueOnce({}),
        FECompUltimoAutorizado: jest.fn()
          .mockResolvedValueOnce({ data: {} })
          .mockRejectedValueOnce({}),
        FECAEASolicitar: jest.fn()
          .mockResolvedValueOnce({ data: {} })
          .mockRejectedValueOnce({}),
        FECAESolicitar: jest.fn()
          .mockResolvedValueOnce({ data: {} })
          .mockRejectedValueOnce({}),
        FECompConsultar: jest.fn()
          .mockResolvedValueOnce({ data: {} })
          .mockRejectedValueOnce({}),
      }
    })
  }
});

jest.mock('./logger.service', () => {
  return {
    logger: {
      log: jest.fn()
    }
  }
});

const fecha = moment(new Date()).format('YYYYMMDD');

const comprobante = {
  FeCabReq: {
    CantReg: 1,
    PtoVta: 1,
    CbteTipo: 6 // Factura B
  },
  FeDetReq: {
    FECAEDetRequest: [{
      Concepto: 1, // Productos
      DocTipo: 80,
      DocNro: 27223856964,
      CbteDesde: 1,
      CbteHasta: 1,
      CbteFch: fecha,
      ImpTotal: 184.05,
      ImpTotConc: 0,
      ImpNeto: 150,
      ImpOpEx: 0,
      ImpTrib: 7.8,
      ImpIVA: 26.25,
      FchServDesde: '',
      FchServHasta: '',
      FchVtoPago: '',
      MonId: 'PES',
      MonCotiz: 1,
      Tributos: {
        Tributo: [
          {
            Id: 99,
            Desc: 'Impuesto Municipal Matanza',
            BaseImp: 150,
            Alic: 5.2,
            Importe: 7.8
          }
        ]
      },
      Iva: {
        AlicIva: [
          {
            Id: 5,
            BaseImp: 100,
            Importe: 21
          },
          {
            Id: 4,
            BaseImp: 50,
            Importe: 5.25
          }]
      },
    }]
  }
};

describe('Invoice service ', () => {
  jest.enableAutomock();
  let invoice = new Invoice();

  beforeEach(() => {
    invoice.data = {
      credentials: {
        token: '',
        sign: ''
      },
      cuit: 12323212,
      invoice: comprobante
    };
  });

  it('should validate serverStatus - OK', async () => {
    const result = await invoice.serverStatus();
    expect(result).toBeTruthy();
  });

  it('should validate serverStatus - DOWN', async () => {
    const result = await invoice.serverStatus();
    expect(result).toBeFalsy();
  });

  it('should validate serverStatus request error', async () => {
    await invoice.serverStatus().catch((e) => {
      expect(e).toEqual({});
    });
  });

  it('should validate FEParamGetTiposIva - OK', async () => {
    const result = await invoice.FEParamGetTiposIva();
    expect(result).not.toBeNull()
  });

  it('should validate FEParamGetTiposIva request error', async () => {
    await invoice.FEParamGetTiposIva().catch((e) => {
      expect(e).toEqual({});
    });
  });

  it('should validate FEParamGetPtosVenta - OK', async () => {
    const result = await invoice.FEParamGetPtosVenta();
    expect(result).not.toBeNull()
  });

  it('should validate FEParamGetPtosVenta request error', async () => {
    await invoice.FEParamGetPtosVenta().catch((e) => {
      expect(e).toEqual({});
    });
  });

  it('should validate FEParamGetTiposDoc - OK', async () => {
    const result = await invoice.FEParamGetTiposDoc();
    expect(result).not.toBeNull()
  });

  it('should validate FEParamGetTiposDoc request error', async () => {
    await invoice.FEParamGetTiposDoc().catch((e) => {
      expect(e).toEqual({});
    });
  });

  it('should validate FEParamGetTiposCbte - OK', async () => {
    const result = await invoice.FEParamGetTiposCbte();
    expect(result).not.toBeNull()
  });

  it('should validate FEParamGetTiposCbte request error', async () => {
    await invoice.FEParamGetTiposCbte().catch((e) => {
      expect(e).toEqual({});
    });
  });

  it('should validate FEParamGetTiposConcepto - OK', async () => {
    const result = await invoice.FEParamGetTiposConcepto();
    expect(result).not.toBeNull()
  });

  it('should validate FEParamGetTiposConcepto request error', async () => {
    await invoice.FEParamGetTiposConcepto().catch((e) => {
      expect(e).toEqual({});
    });
  });

  it('should validate FECAEASinMovimientoConsultar - OK', async () => {
    const result = await invoice.FECAEASinMovimientoConsultar();
    expect(result).not.toBeNull()
  });

  it('should validate FECAEASinMovimientoConsultar request error', async () => {
    await invoice.FECAEASinMovimientoConsultar().catch((e) => {
      expect(e).toEqual({});
    });
  });

  it('should validate FEParamGetTiposTributos - OK', async () => {
    const result = await invoice.FEParamGetTiposTributos();
    expect(result).not.toBeNull()
  });

  it('should validate FEParamGetTiposTributos request error', async () => {
    await invoice.FEParamGetTiposTributos().catch((e) => {
      expect(e).toEqual({});
    });
  });

  it('should validate FEParamGetTiposOpcional - OK', async () => {
    const result = await invoice.FEParamGetTiposOpcional();
    expect(result).not.toBeNull()
  });

  it('should validate FEParamGetTiposOpcional request error', async () => {
    await invoice.FEParamGetTiposOpcional().catch((e) => {
      expect(e).toEqual({});
    });
  });

  it('should validate FECAEAConsultar - OK', async () => {
    const result = await invoice.FECAEAConsultar();
    expect(result).not.toBeNull()
  });

  it('should validate FECAEAConsultar request error', async () => {
    await invoice.FECAEAConsultar().catch((e) => {
      expect(e).toEqual({});
    });
  });

  it('should validate FECAEASinMovimientoInformar - OK', async () => {
    const result = await invoice.FECAEASinMovimientoInformar();
    expect(result).not.toBeNull()
  });

  it('should validate FECAEASinMovimientoInformar request error', async () => {
    await invoice.FECAEASinMovimientoInformar().catch((e) => {
      expect(e).toEqual({});
    });
  });

  it('should validate FECompUltimoAutorizado - OK', async () => {
    const result = await invoice.FECompUltimoAutorizado(1, 2);
    expect(result).not.toBeNull()
  });

  it('should validate FECompUltimoAutorizado request error', async () => {
    await invoice.FECompUltimoAutorizado(1, 2).catch((e) => {
      expect(e).toEqual({});
    });
  });

  it('should validate FECAEASolicitar - OK', async () => {
    const result = await invoice.FECAEASolicitar();
    expect(result).not.toBeNull()
  });

  it('should validate FECAEASolicitar request error', async () => {
    await invoice.FECAEASolicitar().catch((e) => {
      expect(e).toEqual({});
    });
  });

  it('should validate FECAESolicitar - OK', async () => {
    const lastVoucher: IFECompUltimoAutorizadoOutput = {
      FECompUltimoAutorizadoResult: {
        CbteNro: 1,
        CbteTipo: 2,
        PtoVta: 1,
        Errors: null,
        Events: null
      }
    };
    const result = await invoice.FECAESolicitar(lastVoucher);
    expect(result).not.toBeNull()
  });

  it('should validate FECAESolicitar request error', async () => {
    const lastVoucher: IFECompUltimoAutorizadoOutput = {
      FECompUltimoAutorizadoResult: {
        CbteNro: 1,
        CbteTipo: 2,
        PtoVta: 1,
        Errors: null,
        Events: null
      }
    };
    await invoice.FECAESolicitar(lastVoucher).catch((e: TypeError) => {
      expect(e).toEqual({});
    });
  });

  it('should validate FECAESolicitar request whit null params', async () => {
    await invoice.FECAESolicitar(null).catch((e: TypeError) => {
      expect(e.message).toEqual("Cannot read property 'FECompUltimoAutorizadoResult' of null");
    });
  });

  it('should validate FECompConsultar - OK', async () => {
    const result = await invoice.FECompConsultar(1, 2, 3);
    expect(result).not.toBeNull()
  });

  it('should validate FECompConsultar request error', async () => {
    await invoice.FECompConsultar(1, 2, 3).catch((e: TypeError) => {
      expect(e).toEqual({});
    });
  });

  it('should validate getInvoiceTemplate', async () => {
    const template = invoice.getInvoiceTemplate({
      header: {
        razonSocial: 'Empresa SA',
        direccionComercial: 'Av la voz del interior 343, Córdoba, Argentina',
        condicionIva: 'Responsable inscripto',
        ptoVenta: 11,
        cuit: 27321688751,
        ingresosBrutos: 'Exento',
        fechaInicioActividades: '10/10/2019',
        fechaCreacion: '30/10/2019',
        compNumero: 222,
        email: 'test@test.com'
      },
      body: {
        razonSocial: 'Juan Martin Morales',
        cuit: 27269031846,
        iva: 'Consumidor final',
        direccion: '',
        email: 'test@test.com'
      },
      details: [
        {
          cantidad: 1,
          descripcion: 'Lavarropa philips',
          importeNeto: 121,
          total: 121
        },
        {
          cantidad: 1,
          descripcion: 'Smart TV 42 pulgadas',
          importeNeto: 242,
          total: 242
        },
        {
          cantidad: 1,
          descripcion: 'Smart TV 48 pulgadas',
          importeNeto: 242,
          total: 242
        }
      ],
      footer: {
        totals: {
          importeNeto: 500,
          importeIva: 105,
          importeIntereses: 0,
          porcentajeIntereses: 10,
          subtotal: 0,
          total: 605
        },
        codigoCAECompleto: '1212121212121',
        CAE: '1233323',
        fechaVencCAE: '20191010'
      }
    });

    expect(template).not.toBeNull();
  });

});
