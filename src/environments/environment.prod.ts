//
// to remove usage of VERSION: require('../../package.json').version
// specify resolveJsonModule in tsconfig.json's compilerOptions
// "resolveJsonModule": true,

import {version} from '../../package.json';

export const environment = {
  production: true,
  ASSETS_PATH: "./disney-admin/assets",
  VERSION: version  
};
