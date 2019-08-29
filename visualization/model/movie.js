const fs = require('fs')

const movieFilePath = 'db/movie.json'

const m = {
    data: null,
}

const loadMovies = () => {
    // let content = fs.readFileSync(movieFilePath, 'utf8')
    // let ms = JSON.parse(content)
    // return ms
    let client = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";

    client.connect(url, function(err, db) {
        if (err) {
            throw err
        }
        let collection = db.db("mtime").collection("movies")
        console.log(collection.find().toArray((err, data) => {
            m.data = data
        }))
    })
}

loadMovies()

m.all = function() {
    let ms = this.data
    return m
}

// 导出一个对象的时候用 module.exports = 对象 的方式
// 这样引用的时候就可以直接把模块当这个对象来用了(具体看使用方法)
console.log('imported')
module.exports = m

