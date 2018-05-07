import { join, relative, dirname } from 'path';
import { promisify } from 'util';
import fs from 'fs';
import read from 'vinyl-read';

const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

const transformFiles = async files => {
  let newFiles = [];
  return [...files, ...newFiles]
}

export default async (config, template, dest) => {
  const projectPath = join(__dirname, 'templates', template)
  
  let files = await read(join(projectPath, '**/**'));
  try {
    await mkdir(dest);
  } catch (e) {
    
  }
  files = await transformFiles(files)
  files = files.map(async ({path, contents, base, stats}) => {
    if (!contents) return;
    path = join(path.replace(projectPath, dest))
    contents = contents.toString();
    for (const option of Object.entries(config)) {
      const regexp = new RegExp(`[$]${option[0]}`, 'g');
      contents = contents.replace(regexp, option[1])
    }
    try {
      await writeFile(path, contents);
    } catch (e) {
      try {
        await mkdir(dirname(path))
        await writeFile(path, contents);
      } catch (e) {
        console.error(e);
      }
    }
    return {path, contents}
  })
  
  return files;
}
