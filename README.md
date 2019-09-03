# mtime_spider-data_visualization
时光网电影 Top100 爬虫和数据可视化

# 如何使用
（以下操作在 MacOS 10.14.6，Node.js v12.2.0，yarn v1.16.0 下测试可用）

## 时光网 Top100 爬虫
1. 安装 MongoDB 并启动服务，需要运行在 `localhost:27017` 上。
2. 在 `/spider` 目录下，运行 `yarn install`，安装爬虫所需的库。
3. 在 `/spider` 目录下，运行 `yarn run start`。

## 数据可视化
1. 确认爬虫已经运行过且运行正常，数据已经存储到 MongoDB。
2. 在 `/spider` 目录下，运行 `yarn install`，安装数据可视化所需的库。
3. 在 `/spider` 目录下，运行 `yarn run start`，确认没有其他应用占用 8000 端口。
4. 访问 `http://localhost:8000`。

# 项目效果
## 爬虫
![mtime_spider.gif](https://i.loli.net/2019/09/03/49wDLAd2morN7X6.gif)
## 数据可视化
![movie.png](https://i.loli.net/2019/08/29/DFJm9zH3buK8NtC.png)
![point.png](https://i.loli.net/2019/08/29/ZVuRQvF5c72p1JT.png)
![stars.png](https://i.loli.net/2019/08/29/2TEWJhxBcMVsp8j.png)
![director.png](https://i.loli.net/2019/08/29/U3qzFa4BwhDe1l2.png)

# 技术栈
- Node.js
- syncrequest
- cheerio
- MongoDB
- Express.js
- JQuery
- Lodash
- ECharts


