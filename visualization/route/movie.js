const movie = require('../model/movie')

const all = {
    path: '/api/movie/all',
    method: 'get',
    func: function(request, response) {
        let ms = movie.all()
        console.log(JSON.stringify(ms))
        let r = JSON.stringify(ms)
        // console.log(r)
        response.send(r)
    }
}

const routes = [
    all,
]

module.exports.routes = routes
