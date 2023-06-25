const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.cloudname,
    api_key: process.env.APIcloudinary,
    api_secret: process.env.secretcloudinary
});

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:'DanceBeat',
        allowerdFormats:['jpeg','png','jpg']
    }
});

module.exports = {
    cloudinary,
    storage
}