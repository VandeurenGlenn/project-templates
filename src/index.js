import { basename, join } from 'path';
import { promisify } from 'util';
import { homedir } from 'os';
import fs from 'fs';
import { prompt } from 'inquirer';
import projectStream from './project-stream';
import projectInstall from './project-install';
import projectUpgrade from './project-upgrade';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const version = '1.0.0';
const configPath = join(homedir(), '.project-templates');

const getConfig = async () => {
  try {
    let config = await readFile(configPath)
    config = JSON.parse(config.toString());
    return config;
  } catch (e) {
    if (e.code === 'ENOENT') {
      const github = {};
      const { name } = await prompt([{
        type: 'input',
        name: 'name',
        message: 'github username'
      }])
      const { email } = await prompt([{
        type: 'input',
        name: 'email',
        message: 'github user email',
        default: `${name}@gmail.com`
      }])
      
      const { license, defaultTemplate } = await prompt([{
        type: 'input',
        name: 'license',
        message: 'prefered license' 
      }, {
        type: 'list',
        name: 'defaultTemplate',
        message: 'prefered default template' ,
        choices: ['node', 'node-rollup', 'desktop', 'node-cli']
      }])
      await writeFile(configPath, JSON.stringify({email, name, license, defaultTemplate}));
      return await getConfig();
    }
  }
}
(async () => {
  if (process.argv[2] === 'help') {
    console.groupCollapsed(`project-templates@${version}`);
    [
      `
      ## templating
      template: 
        - node: start a new nodejs project
        - node-rollup: start a new nodejs project using rollup for building and code splitting
        - node-cli: start a new nodejs cli project using rollup for building and code splitting
        - desktop: start a new electron desktop app
        
        example: project node
      `,
      `name: 
        name of your project, defaults to current working directory when not set
        
        example: project node project-name
      
      ## maintaining
      
      upgrade:
      - latest
      
      example: project upgrade latest
      `
    ].forEach(cat => console.log(cat))
    console.groupEnd();
    return
  }
  
  const config = await getConfig();
  
  let template = process.argv[2];
  let project = process.argv[3];
  
  
  const dest = process.argv[4] || process.cwd();
  
  if (template === 'upgrade') return projectUpgrade(dest, project)
  
  try {
    if (!project) project = basename(process.cwd());
    if (!template) template = config.defaultTemplate;
    console.groupCollapsed()
    console.log(`template: ${template}`)
    console.log(`project: ${project}`)
    console.groupCollapsed('config')
    console.log(`path: ${configPath}`);
    console.log(`value: ${JSON.stringify(config, null, '\n\t')}`);
    console.groupEnd();
    console.groupEnd();
    config.project = project;
    config.author = `${config.name} <${config.email}>`;
    await projectStream(config, template, dest);
    await projectInstall(dest, 'latest')
  } catch (e) {
    console.error(e);
  }

})()
