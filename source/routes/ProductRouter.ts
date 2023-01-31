import { Router as useRouter } from 'express';
import { useProductController } from '../controllers/ProductController';

const Router: useRouter = useRouter();
const {
    getAllProduct,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductPending,
    createProductPending,
    updateProductPending,
    deleteProductPending,
    approvalProductPending,
    restoreProduct
} = useProductController();

Router.get('/productall', getAllProduct);
Router.get('/product', getProduct);
Router.post('/product', createProduct);
Router.put('/product', updateProduct);
Router.delete('/product', deleteProduct);
Router.get('/product/request', getProductPending);
Router.post('/product/request', createProductPending);
Router.put('/product/request', updateProductPending);
Router.delete('/product/request', deleteProductPending);
Router.put('/product/approval', approvalProductPending);
Router.put('/product/restore', restoreProduct);

export default Router;
