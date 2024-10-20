import React,{ useState,useEffect } from 'react'
import { useSelector } from 'react-redux';

function StudentDashBoard() {
  const {role} = useSelector((state)=>state.user);
    const [data, setData] = useState(null);
    const [cardError, setCardError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/student/payment-history", {
        method: "GET",
      
      });
      console.log(response);
      if (!response.ok) {
        throw new Error("Authorization Unsuccessful");
      }
      const responseData = await response.json();
      const result = responseData.data;
      setData(result);
      console.log(result);
      
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
    {Array.isArray(data) && data.length > 0 && data.map((object, index) => (
          <div className="card p-4 mb-4 border border-gray-300 rounded-md shadow-sm" key={index}>
            {Object.keys(object).map((key) => (
              (key !== '_id' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'password' && key !== '__v' && key !== 'refreshToken') && (
                <div key={key} className="mb-2">
                  <label className="font-semibold">{key}:</label>
                  <span className="ml-2">{object[key]}</span>
                </div>
              )
            ))}

            <div className="flex justify-between mt-4">
              {(role === 'admin' || role === 'accountant') && (
                <button
                  onClick={() => handleEdit(index)}
                  className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
                >
                  Edit
                </button>
              )}
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
    </>
  )
}

export default StudentDashBoard