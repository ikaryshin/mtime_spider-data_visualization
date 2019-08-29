// node 标准库放在前面
const fs = require('fs')

// 接着放第三方库
const request = require('syncrequest')
const cheerio = require('cheerio')
const mongodb = require('mongodb')

// 最后放自己写的模块
const log = console.log.bind(console)


// ES6 定义一个类
class Movie {
    constructor() {
        // 分别是电影名/评分/引言/排名/封面图片链接
        this.ranking = 0
        this.coverUrl = ''
        this.chineseName = ''
        this.name = ''
        this.year = ''
        this.director = ''
        this.stars = []
        this.genres = []
        this.description = ''
        this.point = 0
        this.votes = 0
    }
}

// 当选择器找到多个 html 标签时，分别提取出这些 html 标签的文本，并放入数组中
const textsFromMultiElements = (data) => {
    let l = []
    for (let i = 0; i < data.length; i++) {
        let s = data[i]
        l.push(s.children[0].data)
    }
    return l
}

const movieFromListItem = (div) => {
    let e = cheerio.load(div)

    let m = new Movie()

    m.ranking = parseInt(e('.number em').text())
    m.coverUrl = e('.mov_pic a img').attr('src')
    let name = e('.mov_con h2 a').text()
    let [chineseName, other] = name.split(String.fromCharCode(160))
    m.chineseName = chineseName.trim()
    let parts = other.split('(')
    m.name = parts.slice(0, parts.length - 1).join('(').trim()
    m.year = parseInt(parts.slice(-1)[0])

    // m.director = e('.mov_con p:nth-child(2) a').text()
    m.director = e('.mov_con').find('p').eq(0).find('a').text()

    // let stars = e('.mov_con p:nth-child(3) a')
    let stars = e('.mov_con').find('p').eq(1).find('a')
    m.stars = textsFromMultiElements(stars)

    // let genres = e('.mov_con p:nth-child(4) span a')
    let genres = e('.mov_con').find('p').eq(2).find('span').find('a')
    m.genres = textsFromMultiElements(genres)

    // m.description = e('.mov_con p:nth-child(5)').text()
    m.description = e('.mov_con').find('p').eq(3).text()

    // m.point = parseInt(e('.mov_point span').text())
    m.point = parseFloat(e('.mov_point').find('span').text())

    // m.votes = parseInt(e('.mov_point p').text())
    m.votes = parseInt(e('.mov_point').find('p').text())

    return m
}

const ensurePath = (path) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path)
    }
}

const cachedUrl = (url) => {
    let directory = 'cached_html'
    ensurePath(directory)

    let cacheFile
    log('url', url)
    let parts = url.split('-')
    if (parts.length > 1) {
        cacheFile = parts.slice(-1)[0]
    } else {
        cacheFile = '1.html'
    }
    cacheFile = `${directory}/${cacheFile}`
    log('cacheFile', cacheFile)

    let exists = fs.existsSync(cacheFile)
    if (exists) {
        let data = fs.readFileSync(cacheFile)
        return data
    } else {
        let r = request.get.sync(url)
        let body = r.body

        fs.writeFileSync(cacheFile, body)
        return body
    }
}

const moviesFromUrl = (url) => {
    let body = cachedUrl(url)
    let e = cheerio.load(body)

    let movieListItems = e('.top_list ul li')
    let movies = []
    for (let i = 0; i < movieListItems.length; i++) {
        let listItems = movieListItems[i]
        let m = movieFromListItem(listItems)
        movies.push(m)
    }
    return movies
}

const saveMovies = (movies) => {
    // let s = JSON.stringify(movies, null, 2)
    // let path = 'mtime.json'
    // fs.writeFileSync(path, s)
    let client = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";

    client.connect(url, function (err, db) {
        if (err) throw err;
        let collection = db.db("mtime").collection("movies")
        collection.deleteMany({})
        collection.insertMany(movies)
        db.close()
    })
}

const downloadCovers = (movies) => {
    let coverPath = 'covers'
    ensurePath(coverPath)
    const request = require('request')
    for (let i = 0; i < movies.length; i++) {
        let m = movies[i]
        let url = m.coverUrl
        let ranking = m.ranking
        let name = m.name.split(' / ')[0]
        let path = `${coverPath}/${ranking}.jpg`
        log('cover path', path)

        request(url).pipe(fs.createWriteStream(path))
    }
}

const __main = () => {
    // 主函数

    let url = 'http://www.mtime.com/top/movie/top100/'
    let urls = [url,]
    for (let i = 2; i < 11; i++) {
        let u = url + `index-${i}.html`
        urls.push(u)
    }

    let movies = []
    for (let u of urls) {
        let moviesInPage = moviesFromUrl(u)

        movies = [...movies, ...moviesInPage]
    }

    saveMovies(movies)
    downloadCovers(movies)
    log('抓取成功, 数据已写入')
}

__main()
