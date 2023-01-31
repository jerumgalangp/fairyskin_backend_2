import { Router as useRouter } from 'express';
import { useInvoiceController } from '../controllers/InvoiceController';

const Router: useRouter = useRouter();
const {
    getAllInvoice,
    getInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoicePending,
    createInvoicePending,
    updateInvoicePending,
    deleteInvoicePending,
    approvalInvoicePending,
    restoreInvoice
} = useInvoiceController();

Router.get('/invoiceall', getAllInvoice);
Router.get('/invoice', getInvoice);
Router.post('/invoice', createInvoice);
Router.put('/invoice', updateInvoice);
Router.delete('/invoice', deleteInvoice);

Router.get('/invoice/request', getInvoicePending);
Router.post('/invoice/request', createInvoicePending);
Router.put('/invoice/request', updateInvoicePending);
Router.delete('/invoice/request', deleteInvoicePending);
Router.put('/invoice/approval', approvalInvoicePending);
Router.put('/invoice/restore', restoreInvoice);

export default Router;
