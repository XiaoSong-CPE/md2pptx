import express from 'express'
import fs from 'fs'
import { exec } from 'child_process'
import http from 'http'
import https from 'https'
import path from 'path'
import pptxgen from 'pptxgenjs'
import cors from 'cors'
import vhost from 'vhost'

// 设置https
let options = {}
let dev = true
try {
  options = {
    key: fs.readFileSync('C:\\Certbot\\live\\cnection.cn\\privkey.pem'),
    cert: fs.readFileSync('C:\\Certbot\\live\\cnection.cn\\fullchain.pem')
  }
  dev = false
} catch (error) {
  console.log('证书加载失败，使用测试模式')
}

// 设置协议
const server = (dev ? http : https) as typeof http
const protocol = dev ? 'http' : 'https'
const port = dev ? 80 : 443
const host = dev ? 'localhost' : 'ppt.cnection.cn'

// 初始化 express
const app = express()
// 设置 CORS
app.use(cors({ origin: host }))
// 设置子域名
app.use(
  vhost(host, (req, res, next) => {
    next()
  })
)
// 启动静态文件服务
app.use(express.static(path.join(__dirname, '../dist')))
// 解析API文本
app.use(express.text())
// API 服务
app.post('/', (req, res) => {
  const slidesPath = path.join(__dirname, '../../slidev/slides.md')
  const timestamp = Date.now()
  const ext = path.extname(slidesPath)
  const newPath = path.join(path.dirname(slidesPath), `${timestamp}${ext}`)
  fs.renameSync(slidesPath, newPath)
  fs.writeFileSync(slidesPath, req.body)
  exec('npm run png', { cwd: path.join(__dirname, '../../slidev') }, (error) => {
    if (error) {
      res.status(500).send(error.message)
    } else {
      const files = fs
        .readdirSync(path.join(__dirname, '../../slidev/slides-export'))
        .filter((file) => file.endsWith('.png'))
        .sort()

      const pptx = new pptxgen()
      for (const file of files) {
        const slide = pptx.addSlide()
        slide.background = { path: path.join(__dirname, '../../slidev/slides-export', file) }
        console.log(file)
      }

      ;(pptx as any).write('base64').then((base64) => {
        // 打印前 100 个字符
        console.log(base64.slice(0, 100))
        res.send(base64)
      })
    }
  })
})

// 启动服务
server.createServer(options, app).listen(port, () => {
  console.log(`PPT server listening at ${protocol}://${host}:${port}`)
})
