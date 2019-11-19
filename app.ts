import express from 'express';
import { router } from './routes/routes';
import bodyParser from 'body-parser';
import { session } from './middlewares/session.middleware';
import { invoiceRules } from './middlewares/invoice-rules.middleware';

class App {
  public express: any;
  constructor() {
    this.express = express();
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(bodyParser.json());
    this.express.use(express.static('public'));
    this.express.use('/getPersona', router);
    this.express.use('/', session, invoiceRules, router);

  }
}

export default new App().express;
