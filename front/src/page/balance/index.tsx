import React from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";

interface Transaction {
  id: number;
  type: "Receipt" | "Sending";
  from: string;
  amount: string;
  time: string;
}

const BalancePage = () => {
  const transactions: Transaction[] = [];
  const navigate = useNavigate();

  const handleNotification = () => {
    navigate("/notifications");
  };

  const handleSettings = () => {
    navigate("/settings");
  };

  const handleRecive = () => {
    navigate("/receive");
  };

  const handleSend = () => {
    navigate("/send");
  };

  return <div></div>;
};

export default BalancePage;
