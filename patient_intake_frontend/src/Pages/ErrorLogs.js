import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ErrorLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const user = useSelector((state) => state?.userInfo?.user);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${process.env.REACT_APP_API}/errorLogs?user_id=${user?.id}`);

        if (res?.data?.status === "false") {
          setLoading(false);
          return;
        }

        setLogs(res?.data?.data);
      } catch (err) {
        setError(error.message);
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Error Logs</h2>
      <table className="table table-striped">
        <thead className="thead-dark">
          <tr>
            {/* <th scope="col">User ID</th> */}
            <th scope="col">S. no.</th>
            <th scope="col">Error Message</th>
            <th scope="col">Function Name</th>
            <th scope="col">Created At</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          ) : logs?.length === 0 ? (
            <div className="d-flex justify-content-center m-2">No record found</div>
          ) : (
            logs.map((log, index) => (
              <tr key={index}>
                {/* <td>{log.user_id}</td> */}
                <td>{index + 1}</td>
                <td className="text-danger">{log.error_msg}</td>
                <td>{log.function_name}</td>
                <td>{new Date(log.created_at).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ErrorLogs;
