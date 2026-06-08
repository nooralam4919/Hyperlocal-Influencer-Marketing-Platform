import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Protector({
  children,
  authentication = true,
}) {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const authStatus = useSelector(
    (state) => state.auth.status
  );

  useEffect(() => {


    if (authentication && authStatus !== true) {
      navigate("/getstarted");
    }

    else if (!authentication && authStatus === true) {
      navigate("/");
    }

    setLoading(false);

  }, [authStatus, navigate, authentication]);

  return loading ? (
    <h1>Loading...</h1>
  ) : (
    <>{children}</>
  );
}