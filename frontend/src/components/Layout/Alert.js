import React from "react";
import { Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";

const TheAlertCompo = () => {
  const alerts = useSelector((state) => state.alert);
  if (alerts !== null && alerts.length > 0) {
    return alerts.map((alert, index) => (
      <Alert
        key={index}
        description={alert.msg}
        type={alert.alertType}
        showIcon
      />
    ));
  } else {
    return null;
  }
};
export default TheAlertCompo;
