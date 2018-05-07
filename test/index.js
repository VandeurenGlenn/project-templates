console.log(process.cwd());

const { spawn } = require('child_process');
const t = spawn('node', ['./index.js', 'node', 'project-name', '.test/node'])
t.stdout.on('data', data => {
  console.log(data.toString());
})

t.stderr.on('data', data => {
  console.log(data.toString());
})

const r = spawn('node', ['./index.js', 'node-rollup', 'project-name', '.test/node-rollup'])
r.stdout.on('data', data => {
  console.log(data.toString());
})

r.stderr.on('data', data => {
  console.log(data.toString());
})
