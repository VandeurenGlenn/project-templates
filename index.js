/* project-templates version 0.1.0 */
'use strict';

const ENVIRONMENT = {version: '0.1.0', production: true};

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = require('path');
var util = require('util');
var os = require('os');
var fs = require('fs');
var fs__default = _interopDefault(fs);
var inquirer = require('inquirer');
var read$2 = _interopDefault(require('vinyl-read'));
var child_process = require('child_process');

const readFile = util.promisify(fs__default.readFile);
const readdir = util.promisify(fs__default.readdir);
const writeFile = util.promisify(fs__default.writeFile);
const mkdir = util.promisify(fs__default.mkdir);

const transformFiles = async files => {
  let newFiles = [];
  return [...files, ...newFiles]
};

var projectStream = async (config, template, dest) => {
  const projectPath = path.join(__dirname, 'templates', template);
  
  let files = await read$2(path.join(projectPath, '**/**'));
  try {
    await mkdir(dest);
  } catch (e) {
    
  }
  files = await transformFiles(files);
  files = files.map(async ({path: path$1, contents, base, stats}) => {
    if (!contents) return;
    path$1 = path.join(path$1.replace(projectPath, dest));
    contents = contents.toString();
    for (const option of Object.entries(config)) {
      const regexp = new RegExp(`[$]${option[0]}`, 'g');
      contents = contents.replace(regexp, option[1]);
    }
    try {
      await writeFile(path$1, contents);
    } catch (e) {
      try {
        await mkdir(path.dirname(path$1));
        await writeFile(path$1, contents);
      } catch (e) {
        console.error(e);
      }
    }
    return {path: path$1, contents}
  });
  
  return files;
};

const read = util.promisify(fs.readFile);
const exec = util.promisify(child_process.exec);

const install = async (source, dest, arg = '') => await exec(`npm i --save ${source}`, {cwd: dest});
var projectInstall = async (projectPath, latest) => {
  console.log('installing dependencies');
  try {
    let pack = await read(path.join(projectPath, 'package.json'));
    pack = JSON.parse(pack.toString());
    let dependencies = {};
    if (pack.dependencies) dependencies = {...pack.dependencies};    
    if (pack.devDependencies) dependencies = {...dependencies, ...pack.devDependencies};
    
    
      if (latest) {
        await install(Object.keys(dependencies).join('@latest '), projectPath);
        
      } else {
        await install(Object.keys(dependencies).join(' '), projectPath);
      }
    console.log('done installing dependencies');
  } catch (e) {
    console.log(e);
    return console.log('Nothing to install');
  }
};

const read$1 = util.promisify(fs.readFile);

var projectUpgrade = async (projectPath, latest) => {
  if (latest==='latest') return projectInstall(projectPath, latest)
  try {
    let pack = await read$1(path.join(projectPath, 'package.json'));
    pack = JSON.parse(pack.toString());
    let dependencies = {};
    if (pack.dependencies) dependencies = {...pack.dependencies};
    if (pack.devDependencies) dependencies = {...dependencies, ...pack.devDependencies};
    // await execSync(`cd ${projectPath}`)
    for (const dependency of Object.keys(dependencies)) {
      console.log(dependency);
      // await execSync(`npm i -`)
    }
  } catch (e) {
    console.log(e);
    return console.log('Nothing to install');
  }
};

const readFile$1 = util.promisify(fs__default.readFile);
const writeFile$1 = util.promisify(fs__default.writeFile);

const version = '1.0.0';
const configPath = path.join(os.homedir(), '.project-templates');

const getConfig = async () => {
  try {
    let config = await readFile$1(configPath);
    config = JSON.parse(config.toString());
    return config;
  } catch (e) {
    if (e.code === 'ENOENT') {
      const { name } = await inquirer.prompt([{
        type: 'input',
        name: 'name',
        message: 'github username'
      }]);
      const { email } = await inquirer.prompt([{
        type: 'input',
        name: 'email',
        message: 'github user email',
        default: `${name}@gmail.com`
      }]);
      
      const { license, defaultTemplate } = await inquirer.prompt([{
        type: 'input',
        name: 'license',
        message: 'prefered license' 
      }, {
        type: 'list',
        name: 'defaultTemplate',
        message: 'prefered default template' ,
        choices: ['node', 'node-rollup', 'desktop', 'node-cli']
      }]);
      await writeFile$1(configPath, JSON.stringify({email, name, license, defaultTemplate}));
      return await getConfig();
    }
  }
};
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
    ].forEach(cat => console.log(cat));
    console.groupEnd();
    return
  }
  
  const config = await getConfig();
  
  let template = process.argv[2];
  let project = process.argv[3];
  
  
  const dest = process.argv[4] || process.cwd();
  
  if (template === 'upgrade') return projectUpgrade(dest, project)
  
  try {
    if (!project) project = path.basename(process.cwd());
    if (!template) template = config.defaultTemplate;
    console.groupCollapsed();
    console.log(`template: ${template}`);
    console.log(`project: ${project}`);
    console.groupCollapsed('config');
    console.log(`path: ${configPath}`);
    console.log(`value: ${JSON.stringify(config, null, '\n\t')}`);
    console.groupEnd();
    console.groupEnd();
    config.project = project;
    config.author = `${config.name} <${config.email}>`;
    await projectStream(config, template, dest);
    await projectInstall(dest, 'latest');
  } catch (e) {
    console.error(e);
  }

})();
