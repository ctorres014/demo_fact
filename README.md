# Documentacíon modulo facturacion

## Crear factura electronica ##
```
Este servicio se usa para crear una factura electronica.
```
### URL: http://localhost:3000/ (POST)
## Request (Body):
```
{
	"header": {
            "razonSocial": "Empresa SA",
            "direccionComercial": "Av la voz del interior 343, Córdoba, Argentina",
            "condicionIva": "Responsable inscripto",
            "ptoVenta": 11,
            "cuit": 2732222221,
            "ingresosBrutos": "Exento",
            "fechaInicioActividades": "10/10/2019",
            "fechaCreacion": "30/10/2019",
            "email": "test@test.com"
        },
    "body": {
            "razonSocial": "Juan Martin Morales",
            "cuit": 33323322,
            "iva": "Consumidor final",
            "direccion": "Direccion 123",
            "email": "test@mail.com"
		},
    "details": [
            {
                "cantidad": 1,
                "descripcion": "Lavarropa philips",
                "importeNeto": 121,
                "total": 121
            },
            {
                "cantidad": 1,
                "descripcion": "Smart TV 42 pulgadas",
                "importeNeto": 242,
                "total": 242
            },
             {
                "cantidad": 1,
                "descripcion": "Smart TV 48 pulgadas",
                "importeNeto": 242,
                "total": 242
            }
        ],
    "footer": {
            "totals": {
                "importeNeto": 600,
                "importeIntereses": 60,
                "porcentajeIntereses": 10,
                "subtotal": 600,
                "total": 660
            }
        }
}
```

## GET Persona ##
```
Este servicio se usa para obtener los datos de la persona representada. Padron A10.
```
 ### URL: http://localhost:3000/getPersona/:cuitRepresentado/:idPersona (GET) ###

# Documentos:

### **Manual de desarrollo**: 
* Facturación Electrónica: https://www.afip.gob.ar/facturadecreditoelectronica/documentos/manual_desarrollador_COMPG.pdf
* Padron A10: https://www.afip.gob.ar/ws/ws_sr_padron_a10/manual_ws_sr_padron_a10_v1.1.pdf

### **Certificados para testing/homologación**
* https://www.afip.gob.ar/ws/documentacion/certificados.asp

### **Generacion de Certificados para Produccion**
* http://www.afip.gob.ar/ws/WSAA/WSAA.ObtenerCertificado.pdf