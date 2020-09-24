import * as core from '@actions/core'
import { dir } from 'console';
import { Utils as utils } from './utils';
import {wait} from './wait'
import *  as fs from 'fs'
import * as nodeDir from 'node-dir'
import { pathToFileURL } from 'url';
import * as path from 'path'
class FileBanner {
  ext!: string
  banner!: string
  commentStyle!: string
}

function HydrateBanner(fileBanner: FileBanner, banner: string) {
    let lines = banner.split("\n");

    lines.forEach((line, index) => {

      fileBanner.banner += fileBanner.commentStyle + line;

      if(index != lines.length - 1){
        fileBanner.banner += "\n"
      }
    });
    core.debug(`The file for ${fileBanner.ext} is \n ${fileBanner.banner}`);
}

async function BannerChecker(inputs: Inputs, fileBanners: FileBanner[]){
  nodeDir.files(inputs.path, (err, files)=>{
    files.forEach(filePath => {
      ParseFile(filePath, inputs, fileBanners);
    });
  });
}


function ParseFile(filePath: string, inputs: Inputs, fileBanners: FileBanner[]){
  let fileExtension = path.extname(filePath);

  core.debug(`Reading file in path ${filePath}`);
  
  fileBanners.forEach(fileBanner => {
    
    if(fileBanner.ext === fileExtension){
      
      var contents = fs.readFileSync(filePath).toString();

      if(contents.startsWith(fileBanner.banner)){
        let fileName = path.parse(filePath).name;
        core.setFailed(`File ${fileName} does not have the required banner.`)
      }

    }
  });
}


const fileBanners: FileBanner[] = [
  { ext: '.js', commentStyle: '//', banner:'' },
  { ext: '.yml', commentStyle: '#', banner:'' }
]


class Inputs {
  banner!: string;
  path!: string;
  includeExtensions!: string[];
  excludeExtensions!: string[];
  warning!: boolean;

  constructor(){
    this.Initialize();
  }

  Initialize(){
    this.banner = core.getInput('banner');
    core.debug(core.getInput('banner'));
    this.path = core.getInput('path');
    this.includeExtensions = utils.ParseListInputs(core.getInput('include-extensions'));
    this.excludeExtensions = utils.ParseListInputs(core.getInput('exclude-extensions'));
    this.warning = core.getInput('warning') === 'true';
  }
}

async function run(): Promise<void> {
  try {
    // Get the user inputs
    let inputs = new Inputs();

    core.debug('Parsed the inputs ...')

    fileBanners.forEach(fileBanner => {
      HydrateBanner(fileBanner, inputs.banner); 
    });

    core.debug('Created banners ...')
    BannerChecker(inputs, fileBanners);
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
