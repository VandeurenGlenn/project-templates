console.log(process.cwd());

const { spawn } = require('child_process');

const spawnProject = template => {
  const node = spawn('node', ['./index.js', template, 'project-name', `.test/${template}`])
  node.stdout.on('data', data => {
    console.log(data.toString());
  })
  
  node.stderr.on('data', data => {
    console.log(data.toString());
  })
};

(async () => {
  await spawnProject('node')
  await spawnProject('node-rollup')
  await spawnProject('node-cli')
  await spawnProject('html-rollup')
  await spawnProject('electron')
})()


