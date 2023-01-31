import multer from 'multer';

//const filePath = path.resolve(__dirname, '..', '..', 'tmp');

//const imgStoragePath = path.join(__dirname, '..', 'images');

const uploadConfig = {
    storage: multer.diskStorage({
        destination: function (_req, _file, callback) {
            //var d = new Date();
            //const dt = d.getMonth() + 1 + '' + d.getDate() + '' + d.getFullYear() + '' + d.getHours() + '' + d.getMinutes() + '' + d.getHours() + '' + d.getMilliseconds();

            var fs = require('fs');

            var dir = './files/';

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }

            callback(null, dir);
        },
        // filename: (request, file, callback) => {
        //     //const fileHash = crypto.randomBytes(10).toString('hex');
        //     const fileName = `${request.body.item_code} - ${file.originalname}`;
        //     callback(null, fileName);
        // }
        filename: (req, file, callback) => {
            const filenameParts = file.originalname.split('.');
            const ext = filenameParts.pop();
            let order_reference_number = req.body.order_reference_number.trim();

            let basename = filenameParts.join('.');
            basename = basename.replace(/\s/g, '_');

            //const additionalPath = Date.now() + '' + Math.floor(Math.random() * (2000 - 500)) + 500;
            console.log('---------------MULTER CONFIG--------------------------------------');
            console.log('order_reference_number', order_reference_number);
            console.log('basename', basename);
            //console.log('additionalPath', additionalPath);
            console.log('ext', ext);
            console.log('---------------------MULTER CONFIG---------------------------------');
            callback(null, order_reference_number + '.' + ext);
        }
    })
};

export default uploadConfig;
