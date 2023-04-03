/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date: March 20, 2023
 * Author: Parnian Azarm
 *
 */

const unzipper = require("unzipper"),
  fs = require("fs"),
  PNG = require("pngjs").PNG,
  path = require("path");


/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (zipFilePath, pathOut) => {
  return fs.createReadStream(zipFilePath) 
    .pipe(unzipper.Extract({path:pathOut}))
    .promise()
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (pathUnzipped) => {
  let file_path = []
  return new Promise((res, rej) => {
    fs.readdir(pathUnzipped, (err, data) => {
      if(err) {
        rej(err)
      }
      else {
        for (let file of data) {
          if (file != "__MACOSX") {
            file_path.push(path.join(pathUnzipped, file))
          }
        }
      }
      res(file_path)
    })

  })
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */


const grayScale = (pathUnzipped, pathProcessed) => {
  return new Promise(()=> {
    fs.createReadStream(pathUnzipped)
  .pipe(
    new PNG({

    })
  )
  .on("parsed", function () {
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        var idx = (this.width * y + x) << 2;

        let Gray= ((this.data[idx]) + (this.data[idx + 1]) + (this.data[idx + 2]))/3
        this.data[idx] = Gray;
        this.data[idx + 1] = Gray;
        this.data[idx + 2] = Gray;
      }
    }
    let cutted = pathUnzipped.split("\\")
    console.log(cutted[-1]);
    let filename = cutted.slice(-1).pop();
    // let filename = cutted[-1]; doesn't work
      // console.log(filename)
      
    // need to have the greyscaled folder created in order for it to work
    this.pack().pipe(fs.createWriteStream(path.join(pathProcessed , "grayscaled" + filename)));
  });
  })
};



module.exports = {
  unzip,
  readDir,
  grayScale,
};
