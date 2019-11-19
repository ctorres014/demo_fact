export const configurations = {
    email: {
        credentials: {
            user: 'noreply.imood@gmail.com',
            pass: 'noreplyimood123'
        },
        options: {
            host: 'smtp.googlemail.com',
            port: 465,
            filename: 'factura.pdf',
            from: '"Mood Factura" <noreply.imood@gmail.com>',
            subject: 'Factura electronica',
            html: 'Definir mensaje23232312312321',
        }
    },
    pdf: {
        options: {
            format: 'A4' as 'A4',
            width: "595px",
            height: "842px"
        }
    },
    certificates: {
        file: './certs/certificado.pem',
        key: './certs/MiClavePrivada'
    },
    cache: './cache/',
    services: {
        wsfe: 'wsfe',
        padronA10: 'ws_sr_padron_a10'
    }
}
