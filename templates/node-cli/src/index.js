import meow from 'meow';
import { prompt } from 'inquirer';

export default (() => {
  const cli = meow(`
    Usage
      $ foo <input>
 
    Options
      --name, -n  Name
 
    Examples
      $ foo --name name
  `, {
      flags: {
          name: {
              type: 'string',
              alias: 'n'
          }
      }
  });
  
  console.log(cli);
})()
