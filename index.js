/* @vandeurenglenn/project version 0.2.0 */
'use strict';

const ENVIRONMENT = {version: '0.2.0', production: true};

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = require('path');
var util = require('util');
var fs = require('fs');
var fs__default = _interopDefault(fs);
var read = _interopDefault(require('vinyl-read'));
var inquirer = require('inquirer');
var child_process = require('child_process');
var os = require('os');
var meow = _interopDefault(require('meow'));

const readFile = util.promisify(fs__default.readFile);
const readdir = util.promisify(fs__default.readdir);
const writeFile = util.promisify(fs__default.writeFile);
const mkdir = util.promisify(fs__default.mkdir);
const existsSync = fs__default.existsSync;

const transformFiles = async files => {
  let newFiles = [];
  return [...files, ...newFiles]
};

const promptOverwrite = async path$$1 => {
  const answers = await inquirer.prompt([{
    type: 'confirm',
    name: 'overwrite',
    message: `overwrite ${path$$1}?`
  }]);
  
};

var projectStream = async (config, template, dest, overwrite) => {
  const projectPath = path.join(__dirname, 'templates', template);
  
  let files = await read(path.join(projectPath, '**/**'));
  try {
    const exists = await existsSync(dest);
    if (!exists) await mkdir(dest);
  } catch (e) {
    await mkdir(dest);
  }
  files = await transformFiles(files);
  for (let {path: path$$1, contents, base, stats} of files) {
    if (contents) {
      path$$1 = path.join(path$$1.replace(projectPath, dest));
      contents = contents.toString();
      for (const option of Object.entries(config)) {
        const regexp = new RegExp(`[$]${option[0]}`, 'g');
        contents = contents.replace(regexp, option[1]);
      }
      try {
        const exists = await existsSync(path$$1);
        if (exists) {
          if (overwrite || await promptOverwrite(path$$1)) await writeFile(path$$1, contents);
        } else await writeFile(path$$1, contents);
      } catch (e) {
        try {
          let exists = await existsSync(path.dirname(path$$1));
          if (!exists) await mkdir(path.dirname(path$$1));
          exists = await existsSync(path$$1);
          if (!exists) await writeFile(path$$1, contents);
        } catch (e) {
          // console.error(e);
        }
      }
    }
    
  }
  // files = files.map(async ({path, contents, base, stats}) => {
  // 
  //   }
  //   return {path, contents}
  // })
  
  return files;
}

const read$1 = util.promisify(fs.readFile);
const exec = util.promisify(child_process.exec);

const install = async (source, dest, arg = '') => await exec(`npm i --save ${source}`, {cwd: dest});
var projectInstall = async (projectPath, latest) => {
  console.log('installing dependencies');
  try {
    let pack = await read$1(path.join(projectPath, 'package.json'));
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
}

const read$2 = util.promisify(fs.readFile);

var projectUpgrade = async (projectPath, latest) => {
  if (latest==='latest') return projectInstall(projectPath, latest)
  try {
    let pack = await read$2(path.join(projectPath, 'package.json'));
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
}

const exec$1 = util.promisify(child_process.exec);

var projectBuild = async dest => {
  await exec$1('npm run build', {cwd: dest});
}

const readFile$1 = util.promisify(fs__default.readFile);
const writeFile$1 = util.promisify(fs__default.writeFile);

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
        message: 'preferred license' 
      }]);
      await writeFile$1(configPath, JSON.stringify({email, name, license, defaultTemplate}));
      return await getConfig();
    }
  }
};
(async () => {
  const cli = meow(
      `
      Usage
        $ jsproject [option] <input>
      
      Quick template
        $ jsproject [template]
      
      Options
        --template, -r <template> Template to scaffold
        
        --name, -n <name> Project name - default's to directory name
        
        --upgrade, -u <option> Upgrade dependencies
        
        --serve, -s <path> Serve html app (defaults to www)
        
        --run, -r <option> Start desktop app
        
        --port, -p <number> 
        
        --yesToAll, -y Accept all default prompts
        
        --skipInstall, -S
        
      
      ## template options
      template: 
        - node: start a new nodejs project
        - node-rollup: start a new nodejs project using rollup for building and code splitting
        - node-cli: start a new nodejs cli project using rollup for building and code splitting
        - electron: start a new electron desktop app
        
        example: jsproject node
                 jsproject --template node
      
      name: 
        name of your project, defaults to current working directory when not set
        
        example: project node project-name
      
      ## maintaining
      
      upgrade:
      - latest
      
      example: project upgrade latest
      `, {
        flags: {
          template: {
            type: 'string',
            alias: 't'
          },
          name: {
            type: 'string',
            alias: 'n'
          },
          upgrade: {
            type: 'string',
            alias: 'u'
          },
          serve: {
            type: 'string',
            alias: 's'
          },
          run: {
            type: 'string',
            alias: 'r'
          },
          yesToAll: {
            type: 'boolean',
            alias: 'y'
          },
          skipInstall: {
            type: 'boolean',
            alias: 'S'
          }
        }
      });
  // console.log(cli);
  const flags = cli.flags;
  const flagsLength = Object.keys(cli.flags).length;
  if (cli.input.length === 0 && flagsLength === 0) return cli.showHelp()
  else if (cli.input.length !== 0 && flagsLength === 0 ||
          cli.input.length !== 0 && flags.yesToAll) {
    cli.flags.template = cli.input[0];
  }
  if (flags.serve) {
    const importee = await Promise.resolve(require("./project-serve.js"));
    return importee(flags.serve, flags.port)
  }
  const config = await getConfig();  
  let template = process.argv[2];
  let project = process.argv[3];
  
  
  const dest = process.argv[4] || process.cwd();
  
  if (!cli.flags.name) cli.flags.name = path.basename(process.cwd());
  
  if (cli.flags.template) {
    config.project = cli.flags.name;
    config.author = `${config.name} <${config.email}>`;
    console.log(flags);
    await projectStream(config, cli.flags.template, dest, flags.yesToAll);
    if (!flags.skipInstall) await projectInstall(dest, cli.flags.upgrade);
    await projectBuild(dest);
    return
  } else if (cli.flags.upgrade) await projectUpgrade(dest, cli.flags.upgrade);
  
  
  

})();
