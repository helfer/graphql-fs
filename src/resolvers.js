import { FileLoader } from './loaders.js';
export default {
  Directory: {
    files(dir){
      return dir.files();
    },
    //TODO: this resolver threw an error, but I had no idea where
    // it came from. That's not good.
    subdirectories(dir){
      return dir.subdirectories();
    },
  },
  File: {
    content(file){
      // return fs readfile
      return file.read();
    },

    size(file){
      return file.stats().then( stats => stats.size );
    },
  },
  Query: {
    file( obj, { path }){
      const fl = new FileLoader();
      return fl.openFile(path);
      // get file info and pass it to file
    },
    dir(obj, { path }){
      // get the directory info at that path and pass it to dir
      const fl = new FileLoader();
      return fl.openDir(path);
    }
  },
  /* Mutation: {
    createFile( obj, { dirPath, name, content }){
      //fs create file, return file
    },
    updateFile( obj, { filePath, newContent }){
      //fs read file, return file
    },
    deleteFile( obj, { filePath }){
      //fs delete file, return success
    },

    mkdir( obj, { firPath, name }){
      // make directory and return it
    },
    rmdir( obj, { dirPath }){
      // remove directory and return it
    },
  }*/
}
