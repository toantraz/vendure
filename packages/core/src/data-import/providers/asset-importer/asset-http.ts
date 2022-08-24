import fs from 'fs-extra';
import path from 'path';
import util from 'util';
import fetch from 'node-fetch';

const isAssetHttp = (assetPath: string) => {
  const httpRegex = /^https?:\/\//;
  return httpRegex.test(assetPath)
}

const download = async (assetPath: string, tartgetDir: string = '/tmp') => {
  const pipeline = util.promisify(require('stream').pipeline)
  const resp = await fetch(assetPath);
  const fname = path.basename(assetPath);
  const targetName = `${tartgetDir}/${fname}`
  await pipeline(resp.body, fs.createWriteStream(targetName));
  return targetName;
}

const assetFiles = async (assetPaths: string[], importAssetsDir: string, tmpDir: string = '/tmp') => {
  const files: string[] = []
  for (const assetPath of assetPaths) {
    if (isAssetHttp(assetPath)) {
      const filePath = await download(assetPath, tmpDir);
      files.push(filePath);
    } else {
      const filename = path.join(importAssetsDir, assetPath);
      files.push(filename);
    }
  }
  return files;
}

export {
  isAssetHttp,
  download,
  assetFiles
}