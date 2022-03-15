const aws = require('aws-sdk')
const s3 = new aws.S3()
const rekognition = new aws.Rekognition()
const ExifImage = require('exif').ExifImage;

const getImageMetadata = async (buffer) => {
  return new Promise((resolve, reject) => {
    new ExifImage(buffer, (err, exifData) => {
      if(err) {
        reject(err);
      } else {
        resolve({
          image: exifData.image,
          exif: exifData.exif,
          gps: exifData.gps
        })
      }
    })
  });
}

const getImageLabels = async (imageBuffer) => {
  const rekognitionParams = {
    Image: {
      Bytes: imageBuffer
    },
    MinConfidence: 75
  }
  const result = await rekognition.detectLabels(rekognitionParams).promise()
  const labels = result.Labels.map(l => l.Name)
  return labels;
}

exports.handler = async function (event) {
  let body = event.body;
  if(event.isBase64Encoded) {
    body = Buffer.from(body, 'base64')
  }

  // Get filename
  const filename = event.pathParameters.filename;

  // Get size of buffer
  const size = body.length;

  // Get image data from Rekognition
  console.log(`Get image labels via Rekognition`);
  const labels = await getImageLabels(body);

  // Get Photo Metadata
  console.log("Get photo metadata...");
  const metadata = await getImageMetadata(body);

  // Return image information
  const outputData = JSON.stringify({
    ...metadata,
    filename,
    labels,
    size
  })
  return {
    isBase64Encoded: false,
    statusCode: 200,
    body: outputData,
    headers: {
      "content-type": "application/json"
    }
  }
};
