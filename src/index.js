const fs = require('fs');
const path = require('path');
const rootDirPath = path.resolve(__dirname, '..');
const mySourcePath = path.resolve(rootDirPath, './mySource');
const tomServerPath = path.resolve(rootDirPath, './tom-server');

recursiveDir(mySourcePath);

function copy(src, dst) {
  readable = fs.createReadStream(src);
  writable = fs.createWriteStream(dst);
  readable.pipe(writable);
  console.log('复制成功-----' + dst);
};

function recursiveDir(filePath) {
  //根据文件路径读取文件，返回文件列表
  fs.readdir(filePath, function(err, files) {
    if (err) {
      console.warn(err);
    } else {
      //遍历读取到的文件列表
      files.forEach(function(filename) {
        //获取当前文件的绝对路径
        var filedir = path.join(filePath, filename);
        //根据文件路径获取文件信息，返回一个fs.Stats对象
        fs.stat(filedir, function(eror, stats) {
          if (eror) {
            console.warn("获取文件stats失败");
          } else {
            let isFile = stats.isFile(); //是文件
            let isDir = stats.isDirectory(); //是文件夹
            if (isFile) {
              // console.log("文件路径：", filedir);
              const dirPath = filedir.split(filename)[0];
              // console.log("文件夹路径：", dirPath);
              const dirRelativePath = dirPath.split(mySourcePath)[1];
              // console.log("文件夹相对路径：", dirRelativePath);
              const targetPath = path.join(tomServerPath, dirRelativePath);
              // console.log("目标路径", targetPath);
              const tartetFilePath = path.join(targetPath, filename);
              fs.access(tartetFilePath, (err) => {
                if (err && err.code === "ENOENT") {
                  // console.log("目标文件不存在，开始复制..." + tartetFilePath);
                  copy(filedir, tartetFilePath);
                } else {
                  // console.log("存在目标文件，开始覆盖..." + tartetFilePath);
                  fs.readFile(filedir, "utf8", function(err, data) {
                    if (err) throw err;
                    fs.writeFile(tartetFilePath, data, "utf8", (err) => {
                      if (err) throw err;
                      console.log('覆写成功-----' + tartetFilePath);
                    });
                  });
                }
              });
            }
            if (isDir) {
              recursiveDir(filedir);
            }
          }
        });
      });
    }
  });
}