import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PhotoMetadata from './PhotoMetadata';

const Photo = ({ photoDetail }) => {

  const navigate = useNavigate();
  
  useEffect(() => {
    if(!photoDetail) {
      navigate('/');
    }
  }, [photoDetail]);

  return (
    <>
    { photoDetail &&
    <div className="page-container photo-detail">
      <div className="flex-container">
        <div className="left-side">
          <div className="image-container">
            <img src={ photoDetail.url } 
              className="image-preview"
              alt={ photoDetail.filename } />
          </div>
        </div>
        <div className="right-side">
          <PhotoMetadata
            photoMetadata={photoDetail} />
        </div>
      </div>
    </div> }
    </>
  )

}

export default Photo;
