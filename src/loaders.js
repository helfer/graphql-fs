import fsp from 'fs-promise';
import path from 'path';

class FileLoader {

  constructor(baseDir){
    // TODO: use baseDir
    this.baseDir = '/Users/helfer/workspace/helfer/graphql-fs';
  }

  open(filePath){
    return fsp.open(path.join( this.baseDir, filePath),'r+')
    .then( (fd) => new File(fd) )
    .catch( (e) => {
      console.error('cannot open file', path.join( this.baseDir, filePath));
      throw e;
      return null;
    });
  }

}


class File {
  constructor(fd){
    this.fd = fd;
  }

  read(){
    return fsp.readFile(this.fd);
  }
}


export { FileLoader, File }
