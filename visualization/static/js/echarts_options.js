const optionForPie = function(data, text) {
    let option = {
        title: {
            text: text,
            x: 'center',
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
            {
                name: '',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: data,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    }

    return option
}

const optionForBar = function(data, text) {
    let option = {
        title: {
            text: text,
            x: 'center',
        },
        xAxis: {
            data: data.axis,
            name: '电影类型',
            axisLabel: {
                textStyle: {
                    color: '#000'
                },
                interval: 0,
                rotate: -80,
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            z: 10
        },
        yAxis: {
            name: '电影数量',
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#999'
                }
            }
        },
        series: [
            {
                type: 'bar',
                itemStyle: {
                    normal: {color: 'rgba(0,0,0,0.05)'}
                },
                barGap:'-100%',
                barCategoryGap:'40%',
                animation: false
            },
            {
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#83bff6'},
                                {offset: 0.5, color: '#188df0'},
                                {offset: 1, color: '#188df0'}
                            ]
                        )
                    },
                    emphasis: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#2378f7'},
                                {offset: 0.7, color: '#2378f7'},
                                {offset: 1, color: '#83bff6'}
                            ]
                        )
                    }
                },
                data: data.data
            }
        ]
    }
    return option
}

const optionForLine = function(data) {
    let option = {
        title: {
            text: '时光网 Top100 分年份平均分数折线图',
            x: 'center',
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                params = params[0]
                let value = params.value
                let s = value[0] + ': ' + value[1]
                return s
            },
            axisPointer: {
                animation: false
            }
        },
        xAxis: {
            name: '上映时间',
            type: 'time',
            splitLine: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            name: '平均分',
            boundaryGap: [0, '100%'],
            splitLine: {
                show: false
            },
            min: 8,
        },
        series: [{
            name: '模拟数据',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: data
        }]
    };
    return option
}

const optionForDirector = function(director) {
    console.log(director)
    let data = _.map(director, (v, k) => {
        let o = {
            name: k,
            value: v.length,
        }
        return o
    })
    console.log(data)
    let option = optionForPie(data, '时光网 Top100 分导演电影数量饼图')
    return option
}

const optionForMovieType = function(type) {
    let data = {
        axis: [],
        data: [],
    }
    _.each(type, (v, k) => {
        data.axis.push(k)
        data.data.push(v.length)
    })
    let option = optionForBar(data, '时光网 Top100 分电影类型数量汇总直方图')
    return option
}

const optionForMovieYear = function(year) {
    let data = _.map(year, (v, k) => {
        let avg = _.meanBy(v, 'point')
        let o = {
            name: k,
            value: [k, avg.toFixed(2)],
        }
        return o
    })
    let option = optionForLine(data)
    return option
}

const optionForMovieStar = (star) => {
    let data = []

    _.forEach(Object.entries(star), ([k, v]) => {
        if (v.length >= 2) {
            data.push({
                name: k,
                value: v.length
            })
        }
    })
    let option = optionForPie(data, '时光网 Top100 分演员电影数量饼图(参演电影数量>=2)')

    return option
}

const initedChart = function(chartStore) {
    _.each(chartStore, (v, k) => {
        let selector = '#' + k
        log(selector)
        let element = document.querySelector(selector)
        log(element)
        let chart = echarts.init(element)
        chartStore[k] = chart
    })
}



