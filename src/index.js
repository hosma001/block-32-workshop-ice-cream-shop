import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';

const App = ()=> {
  const [flavors, setFlavors] = useState([]);

  useEffect(()=> {
    const fetchFlavors = async() => {
      const { data } = await axios.get('/api/flavors')
      setFlavors(data);
    };
    fetchFlavors();
  },[]);

  const deleteFlavor = async(flavor) => {
    const data = await axios.delete(`/api/flavors/${ flavor.id }`);
    const newFlavorList = flavors.filter(_flavor => {
      return _flavor.id !== flavor.id;
    });
    setFlavors(newFlavorList);
  };

  return (
    <div>
      <h1>Ice Cream Shop ({ flavors.length })</h1>
      <ul>
        {
          flavors.map(flavor => {
            return(
              <li key={ flavor.id }>
                { flavor.name }
                <button onClick={()=> { deleteFlavor(flavor) }}>x</button>
              </li>
            );
          })
        }
      </ul>
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);
