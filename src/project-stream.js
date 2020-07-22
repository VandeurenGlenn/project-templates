import { join, relative, dirname } from 'path';
import { promisify } from 'util';
import fs from 'fs';
import read from 'vinyl-read';
import { prompt } from 'inquirer';

const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const existsSync = fs.existsSync

const transformFiles = async files => {
  let newFiles = [];
  return [...files, ...newFiles]
}

const promptOverwrite = async path => {
  const answers = await prompt([{
    type: 'confirm',
    name: 'overwrite',
    message: `overwrite ${path}?`
  }])
  
}

export default async (config, template, dest, overwrite) => {
  const projectPath = join(__dirname, 'templates', template)
  
  let files = await read(join(projectPath, '**/**'));
  try {
    const exists = await existsSync(dest)
    if (!exists) await mkdir(dest)
  } catch (e) {
    await mkdir(dest);
  }
  files = await transformFiles(files)
  for (let {path, contents, base, stats} of files) {
    if (contents) {
      path = join(path.replace(projectPath, dest))
      contents = contents.toString();
      for (const option of Object.entries(config)) {
        const regexp = new RegExp(`[$]${option[0]}`, 'g');
        contents = contents.replace(regexp, option[1])
      }
      try {
        const exists = await existsSync(path)
        if (exists) {
          if (overwrite || await promptOverwrite(path)) await writeFile(path, contents);
        } else await writeFile(path, contents);
      } catch (e) {
        try {
          let exists = await existsSync(dirname(path))
          if (!exists) await mkdir(dirname(path))
          exists = await existsSync(path)
          if (!exists) await writeFile(path, contents);
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
