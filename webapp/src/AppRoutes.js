import React from 'react';
import {
  Route,
  Routes,
  useLocation
} from "react-router-dom";
import Photo from './Photo';
import NotFound from './NotFound';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import NoPhoto from './NoPhoto';

const AppRoutes = ({ photoDetail, uploadPhoto, isLoading }) => {

  const location = useLocation();

  return (
    <TransitionGroup component={null}>
      <CSSTransition 
        key={location.key} 
        classNames='next' 
        timeout={500}>
        <Routes location={location}>
          <Route path="/photo" element={<Photo photoDetail={photoDetail} />} />
          <Route index element={<NoPhoto uploadPhoto={uploadPhoto} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  )
}

export default AppRoutes;
