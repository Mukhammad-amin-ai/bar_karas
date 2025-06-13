import { RouterProvider } from 'react-router-dom';
import { Provider } from "react-redux";
import { store } from './providers/store';
import router from './providers/router'

function App() {
  return (
    <div className='wrapper'>
       <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </div>
  );
}

export default App;
