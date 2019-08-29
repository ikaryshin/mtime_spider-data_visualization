const groupByArray = (data, arrayName) => {
    let group = {}
    for (let d of data) {
        let array = d[arrayName]
        for (let element of array) {
            if (group[element] === undefined) {
                group[element] = [d,]
            } else {
                group[element].push(d)
            }
        }
    }
    return group
}

const groupByGenres = (data) => {
    return groupByArray(data, 'genres')
}

const groupByStars = (data) => {
    let group = groupByArray(data, 'stars')
    console.log('star', group)
    group = _.pickBy(group, e => e.length >= 2)
    console.log('g', group)
    return group
}

const renderChart = function (data, chartStore) {
    _.remove(data, d => d.point === null)

    let director = _.groupBy(data, 'director')
    let directorOption = optionForDirector(director)
    let pieByDirector = chartStore.pieByDirector
    pieByDirector.setOption(directorOption)

    let star = groupByStars(data)
    let starOption = optionForMovieStar(star)
    let pie = chartStore.pieByStar
    pie.setOption(starOption)

    let genre = groupByGenres(data)
    let genreOption = optionForMovieType(genre)
    let bar = chartStore.bar
    bar.setOption(genreOption)

    let year = _.groupBy(data, 'year')
    let yearOption = optionForMovieYear(year)
    let line = chartStore.line
    line.setOption(yearOption)
}

const fetchMovies = function (callback) {
    let protocol = location.protocol
    // 如果是通过 node 运行的, prototol 是 http
    // 则调用 api 来获取电影数据
    // 否则直接调用 movieJSON 函数获取电影数据
    if (protocol === 'http:') {
        // 使用 ajax 动态获取数据
        api.fetchMovies(callback)
    } else {
        // 直接使用 JSON 数据 不从后台获取
        let d = movieJSON()
        renderChart(d)
    }
}

const __main = function () {
    const chartStore = {
        pieByStar: null,
        pieByDirector: null,
        bar: null,
        line: null,
    }

    initedChart(chartStore)
    fetchMovies((d) => {
        d = JSON.parse(d)
        data = d.data
        renderChart(data, chartStore)
    })
}

// $(document).ready() 这个东西是 jQuery 的回调函数
// 是页面内容(只包括元素, 不包括元素引用的图片)载入完毕之后的回调事件
$(document).ready(function () {
    __main()
})
