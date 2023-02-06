import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Select, Table } from "antd";

const CartPage = () => {
  const [subTotal, setSubTotal] = useState(0);
  const [billPopup, setBillPopup] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.rootReducer);
  // handle increament
  const handleIncreament = (record) => {
    dispatch({
      type: "UPDATE_CART",
      payload: { ...record, quantity: record.quantity + 1 },
    });
  };

  // handle decreament
  const handleDecreament = (record) => {
    if (record.quantity !== 1) {
      dispatch({
        type: "UPDATE_CART",
        payload: { ...record, quantity: record.quantity - 1 },
      });
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name" },
    {
      title: "Image",
      dataIndex: "image",
      render: (image, record) => (
        <img src={image} alt={record.name} height='60' width='60' />
      ),
    },
    { title: "Price", dataIndex: "price" },
    {
      title: "Quantity",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <PlusCircleOutlined
            className='mx-3'
            style={{ cursor: "pointer" }}
            onClick={() => handleIncreament(record)}
          />
          <b>{record.quantity}</b>
          <MinusCircleOutlined
            className='mx-3'
            style={{ cursor: "pointer" }}
            onClick={() => handleDecreament(record)}
          />
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <DeleteOutlined
          style={{ cursor: "pointer" }}
          onClick={() =>
            dispatch({
              type: "DELETE_FROM_CART",
              payload: record,
            })
          }
        />
      ),
    },
  ];

  useEffect(() => {
    let temp = 0;
    cartItems.forEach((item) => (temp = temp + item.price * item.quantity));
    setSubTotal(temp);
  }, [cartItems]);

  //handleSubmit
  const handleSubmit = async (value) => {
    try {
      const newObject = {
        ...value,
        cartItems,
        subTotal,
        tax: Number(((subTotal / 100) * 10).toFixed(2)),
        totalAmount: Number(
          Number(subTotal) + Number(((subTotal / 100) * 10).toFixed(2))
        ),
        userId: JSON.parse(localStorage.getItem("auth"))._id,
      };
      //console.log(newObject);
      await axios.post("/api/bills/add-bills", newObject);
      message.success("Tạo hóa đơn");
      navigate("/bills");
    } catch (error) {
      message.error("Something went wrong");
      console.log(error);
    }
  };

  return (
    <DefaultLayout>
      <Table columns={columns} dataSource={cartItems} bordered />
      <div className='d-flex flex-column'>
        <hr />
        <h3>
          Tổng tiền:{" "}
          <b>
            {subTotal.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </b>
        </h3>
        <Button type='primary' onClick={() => setBillPopup(true)}>
          Tạo hóa đơn
        </Button>
      </div>
      <Modal
        title='Thông tin thanh toán'
        visible={billPopup}
        onCancel={() => setBillPopup(false)}
        footer={false}
      >
        <Form layout='vertical' onFinish={handleSubmit}>
          <Form.Item name='customerName' label='Tên khách hàng'>
            <Input />
          </Form.Item>
          <Form.Item name='customerNumber' label='Số điện thoại'>
            <Input />
          </Form.Item>

          <Form.Item name='paymentMode' label='Phương thức thanh toán'>
            <Select>
              <Select.Option value='cash'>Tiền mặt</Select.Option>
              <Select.Option value='card'>Chuyển khoản</Select.Option>
            </Select>
          </Form.Item>
          <div className='bill-it'>
            <h5>
              Tổng tiền: <b>{subTotal}</b>
            </h5>
            <h5>
              VAT: <b>{((subTotal / 100) * 10).toFixed(2)}</b>
            </h5>
            <h5>
              TỔNG THANH TOÁN:{" "}
              <b>{Number(subTotal) + ((subTotal / 100) * 10).toFixed(2)}</b>
            </h5>
          </div>
          <div className='d-flex justify-content-end'>
            <Button type='primary' htmlType='submit'>
              Thanh toán
            </Button>
          </div>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};
export default CartPage;
