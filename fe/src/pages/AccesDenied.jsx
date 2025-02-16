// AccessDenied.js
import { Link } from "react-router-dom";

const AccessDenied = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        // backgroundColor: "#f8d7da",
        color: "#721c24",
        textAlign: "center",
        fontSize: "1.5rem",
      }}
    >
      <div>
        <h1>Access Denied</h1>
        <p>Sorry, you don't have permission to access this page.</p>
        <Link to="/" style={{ textDecoration: "none", color: "#007bff" }}>
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default AccessDenied;
