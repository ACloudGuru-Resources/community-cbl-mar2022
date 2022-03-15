import { delayedResult, photoDetail } from '../fixtures/';

// Mock implementation
export const uploadPhoto = async (file) => {
  const output = {
    url: URL.createObjectURL(file),
    ...photoDetail
  }
  return await delayedResult(output, 3000);
}
