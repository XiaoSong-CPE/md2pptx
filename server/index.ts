import express from 'express'
import fs from 'fs'
import { exec } from 'child_process'
import http from 'http'
import path from 'path'
import pptxgen from 'pptxgenjs'

// 如果直接运行，就是开发环境。如果被调用，就是生产环境
const dev = require.main === module

// 初始化 express
const app = express()

// 启动静态文件服务
app.use(express.static(path.join(__dirname, '../dist')))
// 解析API文本
app.use(express.text())
// 解析json
app.use(express.json())
// API 服务
app.post('/', (req, res) => {
  const timestamp = Date.now()
  console.log(timestamp)
  const slidesPath = path.join(__dirname, `../../slidev/${timestamp}.md`)
  const pngPath = path.join(__dirname, `../../slidev/png/`)
  // 删除pngPath下的所有文件
  fs.readdirSync(pngPath).forEach((file) => {
    fs.unlinkSync(path.join(pngPath, file))
  })
  // 写入文件
  fs.writeFileSync(slidesPath, req.body)
  exec(
    `npx slidev export ${timestamp}.md --timeout 60000 --format png --output ${pngPath}`,
    { cwd: path.join(__dirname, '../../slidev') },
    (error) => {
      if (error) {
        res.status(500).send(error.message)
      } else {
        const files = fs
          .readdirSync(pngPath)
          .filter((file) => file.endsWith('.png'))
          .sort()

        const pptx = new pptxgen()
        for (const file of files) {
          const slide = pptx.addSlide()
          slide.background = { path: path.join(pngPath, file) }
          console.log(file)
        }

        ;(pptx as any).write('base64').then((base64) => {
          // 打印前 100 个字符
          console.log(base64.slice(0, 100))
          res.send(base64)
        })
      }
    }
  )
})

if (dev) {
  // 开发环境
  http.createServer(app).listen(80, () => {
    console.log(`PPT server listening at http://localhost`)
  })
}

// 导出app
export { app }
