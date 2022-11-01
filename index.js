/* @vandeurenglenn/project version 0.2.1 */
'use strict';

const ENVIRONMENT = {version: '0.2.1', production: true};

var path = require('path');
var util = require('util');
var os = require('os');
var fs = require('fs');
var inquirer = require('inquirer');
var meow = require('meow');
var read$2 = require('vinyl-read');
var child_process = require('child_process');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespaceDefaultOnly(e) {
  return Object.freeze({__proto__: null, 'default': e});
}

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var meow__default = /*#__PURE__*/_interopDefaultLegacy(meow);
var read__default = /*#__PURE__*/_interopDefaultLegacy(read$2);

util.promisify(fs__default['default'].readFile);
util.promisify(fs__default['default'].readdir);
const writeFile$1 = util.promisify(fs__default['default'].writeFile);
const mkdir = util.promisify(fs__default['default'].mkdir);
const existsSync = fs__default['default'].existsSync;

const transformFiles = async files => {
  let newFiles = [];
  return [...files, ...newFiles]
};

const promptOverwrite = async path => {
  await inquirer.prompt([{
    type: 'confirm',
    name: 'overwrite',
    message: `overwrite ${path}?`
  }]);
  
};

var projectStream = async (config, template, dest, overwrite) => {
  const projectPath = path.join(__dirname, 'templates', template);
  
  let files = await read__default['default'](path.join(projectPath, '**/**'));
  try {
    const exists = await existsSync(dest);
    if (!exists) await mkdir(dest);
  } catch (e) {
    await mkdir(dest);
  }
  files = await transformFiles(files);
  for (let {path: path$1, contents, base, stats} of files) {
    if (contents) {
      path$1 = path.join(path$1.replace(projectPath, dest));
      contents = contents.toString();
      for (const option of Object.entries(config)) {
        const regexp = new RegExp(`[$]${option[0]}`, 'g');
        contents = contents.replace(regexp, option[1]);
      }
      try {
        const exists = await existsSync(path$1);
        if (exists) {
          if (overwrite || await promptOverwrite(path$1)) await writeFile$1(path$1, contents);
        } else await writeFile$1(path$1, contents);
      } catch (e) {
        try {
          let exists = await existsSync(path.dirname(path$1));
          if (!exists) await mkdir(path.dirname(path$1));
          exists = await existsSync(path$1);
          if (!exists) await writeFile$1(path$1, contents);
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
};

const read$1 = util.promisify(fs.readFile);
const exec$1 = util.promisify(child_process.exec);

const install = async (source, dest, arg = '') => await exec$1(`npm i --save ${source}`, {cwd: dest});
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
};

const read = util.promisify(fs.readFile);

var projectUpgrade = async (projectPath, latest) => {
  if (latest==='latest') return projectInstall(projectPath, latest)
  try {
    let pack = await read(path.join(projectPath, 'package.json'));
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

const exec = util.promisify(child_process.exec);

var projectBuild = async dest => {
  await exec('npm run build', {cwd: dest});
};

const readFile = util.promisify(fs__default['default'].readFile);
const writeFile = util.promisify(fs__default['default'].writeFile);

const configPath = path.join(os.homedir(), '.project-templates');

const getConfig = async () => {
  try {
    let config = await readFile(configPath);
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
      await writeFile(configPath, JSON.stringify({email, name, license, defaultTemplate}));
      return await getConfig();
    }
  }
};
(async () => {
  const cli = meow__default['default'](
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

        --host, -h <string> hostname or ip

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
          port: {
            type: 'number',
            alias: 'p'
          },
          host: {
            type: 'string',
            alias: 'h'
          },
          skipInstall: {
            type: 'boolean',
            alias: 'S'
          }
        }
      });
  // console.log(cli);
  const flags = cli.flags;
  console.log(flags);
  const flagsLength = Object.keys(cli.flags).length;
  if (cli.input.length === 0 && flagsLength === 0) return cli.showHelp()
  else if (cli.input.length !== 0 && flagsLength === 0 ||
          cli.input.length !== 0 && flags.yesToAll) {
    cli.flags.template = cli.input[0];
  }
  if (flags.serve) {
    const importee = await Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespaceDefaultOnly(require('./project-serve.js')); });
    return importee.default(flags.serve, flags.port, flags.host)
  }
  const config = await getConfig();
  process.argv[2];
  process.argv[3];


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
