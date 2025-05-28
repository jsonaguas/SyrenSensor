import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FitbitCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      fetch("https://lesiun05ul.execute-api.us-east-1.amazonaws.com/demo/get/exchangeFitbitToken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Fitbit connected:", data);
          alert("Fitbit successfully connected!");
          navigate("/settings"); // or wherever you want to redirect
        })
        .catch((err) => {
          console.error("Error connecting to Fitbit:", err);
          alert("Failed to connect to Fitbit.");
        });
    }
  }, [navigate]);

  return <p className="text-white p-4">Authorizing with Fitbit...</p>;
}
