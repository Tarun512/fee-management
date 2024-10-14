import React from 'react'

function StudentDashBoard() {
    const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/user/staff-panel", {
        method: "GET",
      
      });
      if (!response.ok) {
        throw new Error("Authorization Unsuccessful");
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
    <div className="container mx-auto p-6">
      {role === "student" && data ? (
        data.map((object, index) => (
          <div key={index}>
            {Object.keys(object).map((key) => (
              <div key={key} className="mb-2">
                <label className="font-bold">{key}:</label>
                <span className="ml-2">{object[key]}</span>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>No data available</p>
      )}
    </div>
    </>
  )
}

export default StudentDashBoard