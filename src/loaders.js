import fsp from 'fs-promise';
import path from 'path';

class FileLoader {

  constructor(baseDir){
    // TODO: use baseDir
    this.baseDir = '/Users/helfer/workspace/helfer/graphql-fs';
  }

  makeFullPath(partialPath){
   return path.join( this.baseDir, partialPath);
  }

  openFile(filePath){
    const fullPath = this.makeFullPath(filePath);
    return fsp.open(fullPath, 'r+')
    .then( (fd) => new File(fd, path.basename(fullPath), fullPath) )
    .catch( (e) => {
      console.error('cannot open file', fullPath);
      throw e;
      return null;
    });
  }

  openDir(dirPath){
    const fullPath = this.makeFullPath(dirPath);
    return fsp.stat(fullPath)
      .then( (stats) => {
        if (!stats.isDirectory()){
          console.error(`${fullPath} is not a directory`);
          return null;
        }
        return new Directory(fullPath);
      })
      .catch( (err) => {
        console.error('could not find directory', fullPath);
        return null;
      });
    
  }

}

class Directory {
  constructor( dirPath ){
    this.path = dirPath;

    // figure out the name
    const pathFragments = dirPath.split('/').filter( x => x ); //nix only
    this.name = pathFragments[ pathFragments.length -1 ];
  }


  // TODO: Memoize stuff. If you list the contents once,
  // they should be remembered. Any file should be opened
  // only once, any directory only listed once.

  // TODO: Simplify things by always requiring an absolute path.
  // also, don't allow .. anywhere.

  contents({includeFiles = true, includeDirs = true}) {
    // TODO: this assumes that everything is a file. Bad.
    // TODO: assumes a certain directory structure. not good.
    const fl = new FileLoader(); //ugh, make it a singleton
    return fsp.readdir(this.path)
      .then( (res) => {
        const promises = [];
        res.forEach( (fileName) => {
          const fullPath = `./${this.name}/${fileName}`;
          promises.push(
            fsp.stat(fullPath)
            .then( (res) => { 
              if ( includeFiles && res.isFile()) {
                return fl.openFile(fullPath);  
              }
              if ( includeDirs && res.isDirectory()) {
                return fl.openDir(fullPath);  
              }
              return null;
            })
          );
        });
        // TODO: I'd rather not use Promise.all, because
        // one failure shouldn't make everything else fail
        return Promise.all(promises)
        .then( (values) => {
          return values.filter( v => v !== null ); 
        });
      })
      .catch( (err) => {
        console.error(err);
        console.error('cannot list dir contents');
      });
  }

  files(){
    return this.contents({includeDirs: false});
  }

  subdirectories(){
    return this.contents({includeFiles: false});
  }

}


class File {
  constructor(fd, name, fullPath){
    this.fd = fd;
    this.name = name;
    this.path = fullPath;
  }

  read(){
    // memoize this
    return fsp.readFile(this.fd);
  }

  stats(){
    // memoize this
    return fsp.fstat(this.fd)
      //.then( (res) => { console.log(res); return res})
      .catch( (err) => {
        console.error('error getting file stats');
        return null;
      });
  }
}


export { FileLoader, File }
