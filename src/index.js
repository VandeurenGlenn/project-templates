import { basename, join } from 'path'
import { homedir } from 'os'
import { readFile, writeFile } from 'fs'
import inquirer from 'inquirer'
import meow from 'meow'
import projectStream from './stream.js'
import projectInstall from './install.js'
import projectUpgrade from './upgrade.js'
import projectBuild from './build.js'

const configPath = join(homedir(), '.project-templates')

const getConfig = async () => {
  try {
    let config = await readFile(configPath)
    config = JSON.parse(config.toString())
    return config
  } catch (e) {
    console.log(e)
    if (e.code === 'ENOENT') {
      const github = {}
      const { name } = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'github username'
        }
      ])
      const { email } = await inquirer.prompt([
        {
          type: 'input',
          name: 'email',
          message: 'github user email',
          default: `${name}@gmail.com`
        }
      ])

      const { license, defaultTemplate } = await inquirer.prompt([
        {
          type: 'input',
          name: 'license',
          message: 'preferred license'
        }
      ])
      await writeFile(configPath, JSON.stringify({ email, name, license, defaultTemplate }))
      return await getConfig()
    }
  }
}

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
      `,
  {
    importMeta: import.meta
  },
  {
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
  }
)
// console.log(cli);
const flags = cli.flags
console.log({ flags })
const flagsLength = Object.keys(cli.flags).length
if (cli.input.length === 0 && flagsLength === 0) cli.showHelp()
else if ((cli.input.length !== 0 && flagsLength === 0) || (cli.input.length !== 0 && flags.yesToAll)) {
  cli.flags.template = cli.input[0]
}
if (flags.serve) {
  const importee = await import('./serve.js')
  importee.default(flags.serve, flags.port, flags.host)
} else {
  const config = await getConfig()
  let template = process.argv[2]
  let project = process.argv[3]

  const dest = process.argv[4] || process.cwd()

  if (!cli.flags.name) cli.flags.name = basename(process.cwd())

  if (cli.flags.template) {
    config.project = cli.flags.name
    config.author = `${config.name} <${config.email}>`
    console.log(flags)
    await projectStream(config, cli.flags.template, dest, flags.yesToAll)
    if (!flags.skipInstall) await projectInstall(dest, cli.flags.upgrade)
    await projectBuild(dest)
  } else if (cli.flags.upgrade) await projectUpgrade(dest, cli.flags.upgrade)
}
