import { Button, Form, Input, message } from "antd";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = async (value) => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      await axios.post("/api/users/register", value);
      dispatch({ type: "HIDE_LOADING" });
      message.success("Register Successfully");
      navigate("/login");
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Something Went Wrong");
      console.log(error);
    }
  };

  // Currently login user
  useEffect(() => {
    if (localStorage.getItem("auth")) {
      localStorage.getItem("auth");
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <div className='register'>
        <div className='register-form'>
          <h1>DNC POS</h1>
          <h3>Đăng ký</h3>
          <Form layout='vertical' onFinish={handleSubmit}>
            <Form.Item name='name' label='Họ và tên'>
              <Input />
            </Form.Item>
            <Form.Item name='userId' label='Tên đăng nhập'>
              <Input />
            </Form.Item>
            <Form.Item name='password' label='Mật khẩu'>
              <Input type='password' />
            </Form.Item>
            <div className='d-flex justify-content-between'>
              <p>
                Đã đăng ký vui lòng <Link to='/login'>Đăng nhập!</Link>
              </p>
              <Button type='primary' htmlType='submit'>
                Đăng ký
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Register;
