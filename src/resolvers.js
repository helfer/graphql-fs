import { FileLoader } from './loaders.js';
export default {
  /* Directory: {
    contents(obj){
      //return list of files/objects
    },
    subdirectories(obj){
      //return a list of file directories
    },
    files(obj){
      //return a list of file objects
    }
  }, */
  File: {
    content(file){
      // return fs readfile
      console.log('returning content!');
      return file.read();
    }
  },
  Query: {
    file( obj, { path }){
      const fl = new FileLoader();
      return fl.open(path);
      // get file info and pass it to file
    },
    //dir(obj, { path }){
      // get the directory info at that path and pass it to dir
    //}
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
