import { delayedResult, photoDetail } from '../fixtures/';

const apiEndpoint = window.appConfig.apiEndpoint;

const getFileData = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.readAsArrayBuffer(file)
  })
}

// Mock implementation
export const uploadPhoto = async (file) => {
  const result = await fetch(`${apiEndpoint}/inspect/${file.name}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'image/jpeg'
    },
    body: await getFileData(file)
  })
  return  {
    ...JSON.parse(await result.text()),
   url: URL.createObjectURL(file)
  }
}
