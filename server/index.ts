import express from 'express'
import fs from 'fs'
import { exec } from 'child_process'
import http from 'http'
import path from 'path'
import pptxgen from 'pptxgenjs'
import * as log4js from "log4js";

// 配置日志
log4js.configure({
  appenders: {
    fileLog: {
      type: "file",
      filename: ".log",
      maxLogSize: 10 * 1024 * 1024, // = 10Mb
    },
    consoleLog: {
      type: "stdout"
    }
  },
  categories: {
    default: { appenders: ["fileLog", "consoleLog"], level: "all" },
    md2pptx: { appenders: ["fileLog", "consoleLog"], level: "all" },
  },
});

const logger = log4js.getLogger("md2pptx");
logger.level = "all";

// 如果直接运行，就是开发环境。如果被调用，就是生产环境
const dev = require.main === module
dev ? logger.info('dev mode on') : logger.info('dev mode off')

// 初始化 express
const app = express()

// 启动静态文件服务
app.use(express.static(path.join(__dirname, '../dist')))
logger.info('静态文件已部署')
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
        logger.error('slidev error')
        logger.error(error)
      } else {
        const files = fs
          .readdirSync(pngPath)
          .filter((file) => file.endsWith('.png'))
          .sort()

        const pptx = new pptxgen()
        for (const file of files) {
          const slide = pptx.addSlide()
          slide.background = { path: path.join(pngPath, file) }
          logger.debug('file list:')
          logger.debug(file)
        }

        ; (pptx as any).write('base64').then((base64) => {
          // 打印前 100 个字符
          logger.debug(base64.slice(0, 100))
          res.send(base64)
        })
      }
    }
  )
})

if (dev) {
  // 开发环境
  http.createServer(app).listen(80, () => {
    logger.info(`PPT server listening at http://localhost`)
  })
}

// 导出app
export { app }
