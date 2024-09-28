import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
const Dashboard = ()=> {
  const { role } = useSelector(state => state.role);
  const [data,setData] = useState(null);
    const fetch = async()=>{
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('/api/user/staff-panel',{
                method: 'GET',
                headers:{
                    'Authorization':`Bearer${token}`,
                },
            })
            if(!response.ok){
                throw new Error('Authorization Unsuccessful');
            }
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error(error);
        }
    }
  return (
    <div>
      {role == 'student' && data? (data.map((object,index)=>(
        <div key={index}>
        {Object.keys(object).map((key) => (
          <div key={key}>
            <label>{key}</label>
            <span>{object[key]}</span>
          </div>
        ))}
     </div>
      ))) 
      : (<p>No data availble</p>) }
      {role == 'accountant' || role == 'admin' &&
        <div>
          <Link to={'/fee-structure'}>
            <div>
              <h2>Add Fee Structue</h2>
              <button>Add</button>
            </div>
          </Link>
          <Link to={'/search'}>
              <div>
                <h2>Edit Fee Structure</h2>
                <button>Edit</button>
              </div>
          </Link>
          {role == 'admin' && 
            <Link to={'/search'}>
              <div>
                <h2>Delete Fee Structure</h2>
                <button>Delete</button>
              </div>
            </Link>
          }
          <Link to={'/fee-payment'}>
            <div>
              <h2>Add Fee Payment</h2>
              <button>Add</button>
            </div>
          </Link>
          <Link to={'/search'}>
              <div>
                <h2>Search payments</h2>
                <button>Delete</button>
              </div>
          </Link>
          {role == 'admin' && 
            <Link to={'/search'}>
              <div>
                <h2>Delete Fee Payment</h2>
                <button>Delete</button>
              </div>
            </Link>
          }
        </div>
      }
    </div>
  )
}
export default Dashboard;