import { parse } from 'toml'
import { argv } from 'yargs'
import fs from 'fs'

const configDir = argv.configDir || './config'

let cfgFile = fs.readFileSync(`${configDir}/forge.toml`, {encoding: 'utf-8'})
let c = parse(cfgFile)

Object.freeze(c)

export default c
