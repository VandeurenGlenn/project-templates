import { exec as _exec} from 'child_process'
import { promisify } from 'util'

const exec = promisify(_exec)

export default async dest => {
  await exec('npm run build', {cwd: dest})
}