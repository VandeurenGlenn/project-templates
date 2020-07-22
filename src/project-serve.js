import Koa from 'koa'
import mount from 'koa-mount'
import serve from 'koa-static'
import open from 'open'
import { join } from 'path'

export default (path = 'www', port = 3000) => {
  const server = new Koa()
  
  server.use(serve(join(process.cwd(), path)))
  
  server.listen(port)
  
  open(`http://127.0.0.1:${port}`)
}