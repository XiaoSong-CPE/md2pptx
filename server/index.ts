import express from 'express'
import fs from 'fs'
import { exec } from 'child_process'
import http from 'http'
import https from 'https'
import path from 'path'
import pptxgen from 'pptxgenjs'
import cors from 'cors'

const app = express()
const port = 2003

app.use(express.text())
app.use(cors({
  origin: '*',
}))

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
        console.log(file);
      }

      ;(pptx as any).write('base64').then((base64) => {
        console.log('写完');
        res.send(base64)
      })
    }
  })
  // res.send('ok')
})

http.createServer(app).listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
