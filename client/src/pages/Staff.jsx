import React,{useState,useEffect} from 'react';
import { useSelector } from 'react-redux';

function Staff() {
const { role } = useSelector((state) => state.user);
const [data, setData] = useState([]);
const [cardError, setCardError] = useState(null);
useEffect(() => {
    const fetchStaff = async () => { 
        const response = await fetch('/api/staff/get-staff');
        const responseData = await response.json();
        const data = responseData.data;
        if (responseData.success === false) {
        console.log(data.message);
        return;
        }
        console.log(data);
        setData(data);
    };

    fetchStaff();
    }, []);
const handleDelete = async (index) => {
    try {
        alert("Are you sure you want to delete");
        const response = await fetch(`/api/staff/delete-staff/${data[index]?._id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        });
        const result = await response.json();
        if (response.ok) {
        const updatedCards = data.filter((_, i) => i !== index);
        setData(updatedCards);
        setCardError(null);
        } else {
        setCardError(result.message);
        }
    } catch (error) {
        setCardError(error.message);
        }
    };    
  return (
    <div>
        <div className="mt-6">
        {Array.isArray(data) && data.length > 0 && data.map((object, index) => (
          <div className="card p-4 mb-4 border border-gray-300 rounded-md shadow-sm" key={index}>
            {Object.keys(object).map((key) => (
              <div key={key} className="mb-2">
                <label className="font-semibold">{key}:</label>
                <span className="ml-2">{object[key]}</span>
              </div>
            ))}

            <div className="flex justify-between mt-4">
              {(role === 'admin' || (role === 'accountant' && formData.regNo != '')) && (
                <button
                  onClick={() => handleDelete(index)}
                  className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              )}
            </div>

            {cardError && <p className="text-red-700">{cardError}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Staff