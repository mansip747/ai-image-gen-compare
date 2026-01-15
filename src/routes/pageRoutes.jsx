import { createBrowserRouter } from 'react-router-dom';
import ImageGenerate from '../pages/ImageGenerate/ImageGenerate';

const pageRoutes = createBrowserRouter([
  {
    path: '/',
    element: <ImageGenerate />
  }
]);

export default pageRoutes;
