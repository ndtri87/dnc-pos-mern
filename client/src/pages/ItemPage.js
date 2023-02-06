import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { Modal, Button, Table, Form, Input, Select, message } from "antd";

const ItemPage = () => {
  const [itemsData, setItemsData] = useState([]);
  const dispatch = useDispatch();
  const [popupModal, setPopupModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const getAllItems = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const { data } = await axios.get("/api/items/get-item");
      setItemsData(data);
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

  // handle delete
  const handleDelete = async (record) => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      await axios.post("/api/items/delete-item", { itemId: record._id });
      message.success("Item Deleted Successfully");
      getAllItems();
      setPopupModal(false);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      message.error("Something Went Wrong");
      console.log(error);
    }
  };

  // able data
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
      title: "Thao tác",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <EditOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              setEditItem(record);
              setPopupModal(true);
            }}
          />
          <DeleteOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              handleDelete(record);
            }}
          />
        </div>
      ),
    },
  ];

  // handle form submit
  const handleSubmit = async (value) => {
    if (editItem === null) {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        await axios.post("/api/items/add-item", value);
        message.success("Item Added Successfully");
        getAllItems();
        setPopupModal(false);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        dispatch({ type: "HIDE_LOADING" });
        message.error("Something Went Wrong");
        console.log(error);
      }
    } else {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        await axios.put("/api/items/edit-item", {
          ...value,
          itemId: editItem._id,
        });
        message.success("Item Update Successfully");
        getAllItems();
        setPopupModal(false);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        dispatch({ type: "HIDE_LOADING" });
        message.error("Something Went Wrong");
        console.log(error);
      }
    }
  };

  return (
    <DefaultLayout>
      <div className='d-flex justify-content-between'>
        <h1>Danh sách sản phẩm</h1>
        <Button typeof='primary' onClick={() => setPopupModal(true)}>
          Thêm sản phẩm
        </Button>
      </div>
      <Table columns={columns} dataSource={itemsData} bordered />

      {popupModal && (
        <Modal
          title={`${editItem !== null ? "Sửa sản phẩm" : "Thêm sản phẩm"}`}
          visible={popupModal}
          onCancel={() => {
            setEditItem(null);
            setPopupModal(false);
          }}
          footer={false}
        >
          <Form
            layout='vertical'
            initialValues={editItem}
            onFinish={handleSubmit}
          >
            <Form.Item name='name' label='Name'>
              <Input />
            </Form.Item>
            <Form.Item name='price' label='Price'>
              <Input />
            </Form.Item>
            <Form.Item name='image' label='Image URL'>
              <Input />
            </Form.Item>
            <Form.Item name='category' label='Category'>
              <Select>
                <Select.Option value='drinks'>Drinks</Select.Option>
                <Select.Option value='rice'>Rice</Select.Option>
                <Select.Option value='noodles'>Noodel</Select.Option>
              </Select>
            </Form.Item>
            <div className='d-flex justify-content-end'>
              <Button type='primary' htmlType='submit'>
                SAVE
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default ItemPage;
