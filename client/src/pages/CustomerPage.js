import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Table } from "antd";

const CustomerPage = () => {
  const [billsData, setBillsData] = useState([]);
  const dispatch = useDispatch();
  const getAllItems = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const { data } = await axios.get("/api/bills/get-bills");
      setBillsData(data);
      dispatch({ type: "HIDE_LOADING" });
      console.log(data);
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.log(error);
    }
  };
  //useEffect
  useEffect(() => {
    getAllItems();
  }, []);

  const columns = [
    { title: "Mã hóa đơn", dataIndex: "_id" },
    {
      title: "Tên Khách hàng",
      dataIndex: "customerName",
    },
    { title: "Số điện thoại", dataIndex: "customerNumber" },
  ];

  return (
    <DefaultLayout>
      <h1>Customer Page</h1>
      <Table
        columns={columns}
        dataSource={billsData}
        bordered
        pagination={false}
      />
    </DefaultLayout>
  );
};

export default CustomerPage;
