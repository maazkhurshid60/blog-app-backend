
const whiteListDomains = ['http://localhost:3000', 'http://localhost:8000', 'https://blog-app-next-app.vercel.app']

module.exports = {
    origin: function (origin, callback) {
        if(whiteListDomains.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('CORS Error'))
        }
    }
}