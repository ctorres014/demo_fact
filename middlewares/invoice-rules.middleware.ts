import { IFullInvoice, ITotal } from '../models/invoice.model';

export const invoiceRules = (req, res, next) => {

    const fullInvoice: IFullInvoice = req.body;

    const { totals } = fullInvoice.footer;

    const total: ITotal = { importeNeto: 0, total: 0, subtotal: 0, importeIntereses: 0, porcentajeIntereses: 0 };

    for (const item in total) {
        if (totals[item] === undefined || totals[item] < 0) {
            res.status(400).json({ ok: false, message: `La propiedad ${item} es requerida o el valor debe ser mayor o igual a 0.` });
            return;
        }
    }

    if (totals.total < totals.subtotal) {
        res.status(400).json({ ok: false, message: `La propiedad total deber ser mayor al subtotal.` });
        return;
    }

    if (totals.subtotal !== totals.importeNeto + (totals.importeIva !== undefined ? totals.importeIva : 0)) {
        res.status(400).json({ ok: false, message: `El subtotal deber igual a la suma de importeNeto + importeIva` });
        return;
    }

    if (totals.total !== totals.importeNeto + (totals.importeIva !== undefined ? totals.importeIva : 0) + totals.importeIntereses) {
        res.status(400).json({ ok: false, message: `El total deber igual a la suma de importeNeto + importeIva + intereses` });
        return;
    }

    if (!fullInvoice.body.email || !fullInvoice.header.email) {
        res.status(400).json({ ok: false, message: `Los campos body.email y header.email son requeridos.` });
        return;
    }

    next();
};
