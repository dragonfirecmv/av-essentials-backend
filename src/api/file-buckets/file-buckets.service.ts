import { Injectable, Req, Res, HttpException, HttpStatus } from '@nestjs/common';
import { Storage, Bucket, StorageOptions } from '@google-cloud/storage'
import { Router } from 'express';
import multer = require('multer');
// import * as multer from 'multer'
// import MulterGoogleCloudStorage from 'multer-google-storage';

@Injectable()
export class FileBucketsService {

  private gcStorage: Storage
  private gcsBucket: Bucket
  private gcsOptions: StorageOptions & { bucket?: string }
  
  constructor() {
    this.gcsOptions = {
      bucket: process.env.GCS_BUCKET,
      projectId: process.env.GCLOUD_PROJECT,
      keyFilename: process.env.GCS_KEYFILE
    }

    this.gcStorage = new Storage({
      projectId: this.gcsOptions.projectId,
      keyFilename: this.gcsOptions.keyFilename
    })

    this.gcsBucket = this.gcStorage.bucket(this.gcsOptions.bucket)
  }

  async fileUpload(file, res, userId) {
    if (!file) {
      throw new HttpException(
        'No files received!',
        HttpStatus.BAD_REQUEST
      )
    }

    const gcsFileName = `${Date.now()}_${userId}_${file.originalname}`
    const theFile = this.gcsBucket.file(gcsFileName)

    const theStream = theFile.createWriteStream({
      metadata: {
        contentType: file.mimetype
      },
      resumable: false
    })

    theStream.on('error', (err) => {
      throw new HttpException(
        err.message,
        HttpStatus.BAD_REQUEST
      )
    })

    theStream.on('finish', () => {
      file.cloudStorageObject = gcsFileName
      res.send({
        filename: gcsFileName,
        publicUrl: `https://${this.gcsOptions.bucket}.storage.googleapis.com/${gcsFileName}`
        // publicUrl: this.getPublicUrl(this.gcBucket, gcsFileName)
      })
    })

    theStream.end(file.buffer);
  }

  
  async fileRemove(payload: { filename: string }, userId) {
    const { filename } = payload
    const tmpFilename = filename.split('_')

    if ( tmpFilename[1] !== userId ) {
      throw new HttpException(
        'Unauthorized Access!',
        HttpStatus.UNAUTHORIZED
      )
    }

    let gcsFile = this.gcsBucket.file(filename)

    if (!gcsFile) {
      throw new HttpException(
        `File ${filename} does not exists!`,
        HttpStatus.NOT_FOUND
      )
    }

    console.log('befur', gcsFile)
    await gcsFile.delete()

    console.log('after', gcsFile)

    return {
      filename,
      deleted: true
    }
  }

  // private getPublicUrl(bucketName, fileName) {
  //   return `https://storage.googleapis.com/${bucketName}/${fileName}`;
  // }
}



// const router = Router()

// router.post(
//   '/upload',
//   multer.single('image'),
//   gcsMiddlewares.sendUploadToGCS,
//   (req, res, next) => {
//     if (req.file && req.file.gcsUrl) {
//       return res.send(req.file.gcsUrl);
//     }

//     return res.status(500).send('Unable to upload');
//   },
// );
