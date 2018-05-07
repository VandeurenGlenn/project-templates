import { promisify } from 'util';
import { readFile } from 'fs';
import { join } from 'path';
import projectInstall from './project-install'
const read = promisify(readFile);

export default async (projectPath, latest) => {
  if (latest==='latest') return projectInstall(projectPath, latest)
  try {
    let pack = await read(join(projectPath, 'package.json'))
    pack = JSON.parse(pack.toString())
    let dependencies = {}
    if (pack.dependencies) dependencies = {...pack.dependencies}
    if (pack.devDependencies) dependencies = {...dependencies, ...pack.devDependencies}
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