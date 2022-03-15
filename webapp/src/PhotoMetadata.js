import { bytesToSize, parseExifDate } from './util';

const PhotoMetadata = ({ photoMetadata }) => {

  const getModifyDateDescriptor = (dateString) => {
    const date = parseExifDate(dateString);
    return `${date.toLocaleString()}`
  }

  const renderMetadata = () => {
    console.dir(photoMetadata)
    if(photoMetadata && photoMetadata.image) {
      return (
        <div className="bg-slate-700 p-5 mb-6 lg:mb-0;">
          <div className="metadata">
            <div className="metadata-title">Filename</div>
            <div className="metadata-item">{ photoMetadata.filename }</div>
          </div>
          <div className="metadata">
            <div className="metadata-title">File Size</div>
            <div className="metadata-item">{  bytesToSize(photoMetadata.size) }</div>
          </div>
          { photoMetadata.exif && photoMetadata.exif.ExifImageWidth &&
            <div className="metadata">
              <div className="metadata-title">Resolution</div>
              <div className="metadata-item">{ `${photoMetadata.exif.ExifImageWidth} x ${photoMetadata.exif.ExifImageHeight}` }</div>
          </div>
          }
          { photoMetadata.image && photoMetadata.image.Make &&
            <div className="metadata">
              <div className="metadata-title">Make</div>
              <div className="metadata-item">{ `${photoMetadata.image.Make}` }</div>
          </div>
          }
          { photoMetadata.image && photoMetadata.image.Model &&
            <div className="metadata">
              <div className="metadata-title">Model</div>
              <div className="metadata-item">{ `${photoMetadata.image.Model}` }</div>
          </div>
          }
          { photoMetadata.image && photoMetadata.image.ModifyDate &&
            <div className="metadata">
              <div className="metadata-title">Date Captured</div>
              <div className="metadata-item">{ `${getModifyDateDescriptor(photoMetadata.image.ModifyDate)}` }</div>
          </div>
          }
          <div className="metadata">
            <div className="metadata-title">AI Tags</div>
            <ul className="tag-list">
              { photoMetadata.labels.map((label) => (
                <li className="tag-list-item" key={label}>
                  <span className="tag-list-badge"> { label } </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    } else {
      return (
        <div className="bg-slate-700 p-5">
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      )
    }
  }

  return renderMetadata()
}

export default PhotoMetadata;