import {load} from 'js-yaml';
import {readFileSync} from 'fs';

export interface CommandOptions {
  env?: {[key: string]: string};
}

export interface Shopifile {
  extensions?: {development: Configs};
}

export interface Configs {
  extensionPoints?: string[];
  entries: {[key: string]: string};
  buildDir: string;
  build?: CommandOptions;
  serve?: CommandOptions;
}

const REQUIRED_CONFIGS = ['build_dir', 'entries'];

export function getConfigs() {
  try {
    const shopifile: Shopifile = load(readFileSync('shopifile.yml', 'utf8'));
    const configs = shopifile?.extensions[0].development;
    const jsonConfigs = Object.keys(configs).reduce(
      (acc, key) => ({
        ...acc,
        [toCamelCase(key)]: configs[key],
      }),
      {},
    );

    if (isValidConfig(jsonConfigs)) {
      return jsonConfigs;
    }
  } catch (e) {
    console.log(`Failed with error: ${e}`);
    process.exit(1);
  }
}

function toCamelCase(str) {
  return str.replace(/_./g, (x) => x.toUpperCase()[1]);
}

function isValidConfig(configs: any): configs is Configs {
  REQUIRED_CONFIGS.forEach((key) => {
    if (!configs[toCamelCase(key)]) {
      throw `Invalid configuration. Missing \`${key}\``;
    }
  });

  return true;
}
