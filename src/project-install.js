import { promisify } from 'util';
import { readFile } from 'fs';
import { join } from 'path';
import { exec as _exec} from 'child_process'
const read = promisify(readFile);
const exec = promisify(_exec);

const install = async (source, dest, arg = '') => await exec(`npm i --save ${source}`, {cwd: dest});
export default async (projectPath, latest) => {
  console.log('installing dependencies');
  try {
    let pack = await read(join(projectPath, 'package.json'))
    pack = JSON.parse(pack.toString())
    let dependencies = {}
    if (pack.dependencies) dependencies = {...pack.dependencies}    
    if (pack.devDependencies) dependencies = {...dependencies, ...pack.devDependencies}
    
    
      if (latest) {
        await install(Object.keys(dependencies).join('@latest '), projectPath)
        
      } else {
        await install(Object.keys(dependencies).join(' '), projectPath)
      }
    console.log('done installing dependencies');
  } catch (e) {
    console.log(e);
    return console.log('Nothing to install');
  }
}