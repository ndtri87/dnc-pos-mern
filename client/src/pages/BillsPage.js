import DefaultLayout from "../components/DefaultLayout";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { EyeOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { Button, Modal, Table } from "antd";

const BillsPage = () => {
  const componentRef = useRef();
  const [billsData, setBillsData] = useState([]);
  const dispatch = useDispatch();
  const [popupModal, setPopupModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const getAllBills = async () => {
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
    getAllBills();
  }, []);

  // Print handle
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // able data
  const columns = [
    { title: "Mã hóa đơn", dataIndex: "_id" },
    {
      title: "Tên Khách hàng",
      dataIndex: "customerName",
    },
    { title: "Số điện thoại", dataIndex: "customerNumber" },
    { title: "Tổng hóa đơn", dataIndex: "subTotal" },
    { title: "VAT (10%)", dataIndex: "tax" },
    { title: "Tổng thanh toán", dataIndex: "totalAmount" },
    {
      title: "Thao tác",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <EyeOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedBill(record);
              setPopupModal(true);
            }}
          />
        </div>
      ),
    },
  ];
  console.log(selectedBill);
  return (
    <DefaultLayout>
      <div className='d-flex justify-content-between'>
        <h1>Danh sách hóa đơn</h1>
      </div>
      <Table columns={columns} dataSource={billsData} bordered />
      {popupModal && (
        <Modal
          id='md'
          width={335}
          pagination={false}
          title='In hóa đơn chi tiết'
          visible={popupModal}
          onCancel={() => {
            setPopupModal(false);
          }}
          footer={false}
        >
          {/* =============== Invoice modal start ================ */}
          <div id='invoice-POS' ref={componentRef}>
            <center id='top'>
              <div className='logo' />
              <div className='info'>
                <h2>Công ty TNHH Đinh Nguyên</h2>
                <p>Điện thoại: 0903102161</p>
                <p>Đại lộ Hùng Vương, Thành phố Bến Cát</p>
              </div>
              {/* End info */}
            </center>
            {/* End invoiceTop */}
            <div id='mid'>
              <div className='mt-2'>
                <p>
                  Tên khách hàng: <b>{selectedBill.customerName}</b>
                  <br />
                  Số điện thoại: <b>{selectedBill.customerNumber}</b>
                  <br />
                  Ngày: <b>{selectedBill.date.toString().substring(0, 10)}</b>
                  <br />
                </p>
                <hr style={{ margin: "5px" }} />
              </div>
            </div>
            {/* End Invoice Mid */}
            <div id='bot'>
              <div id='table'>
                <table>
                  <tbody>
                    <tr className='tabletitle'>
                      <td className='item'>
                        <h2>Sản phẩm</h2>
                      </td>
                      <td className='Hours'>
                        <h2>Số lượng</h2>
                      </td>
                      <td className='Rate'>
                        <h2>Giá</h2>
                      </td>
                      <td className='Rate'>
                        <h2>Tổng cộng</h2>
                      </td>
                    </tr>
                    {selectedBill.cartItems.map((item) => (
                      <>
                        <tr className='service'>
                          <td className='tableitem'>
                            <p className='itemtext'>{item.name}</p>
                          </td>
                          <td className='tableitem'>
                            <p className='itemtext'>{item.quantity}</p>
                          </td>
                          <td className='tableitem'>
                            <p className='itemtext'>
                              {item.price.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </p>
                          </td>
                          <td className='tableitem'>
                            <p className='itemtext'>
                              {(item.quantity * item.price).toLocaleString(
                                "vi-VN",
                                {
                                  style: "currency",
                                  currency: "VND",
                                }
                              )}
                            </p>
                          </td>
                        </tr>
                      </>
                    ))}
                    <tr className='tabletitle'>
                      <td />
                      <td />
                      <td className='Rate'>
                        <h2>VAT</h2>
                      </td>
                      <td className='payment'>
                        <h2>
                          {selectedBill.tax.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </h2>
                      </td>
                    </tr>
                    <tr className='tabletitle'>
                      <td />
                      <td />
                      <td className='Rate'>
                        <h2>Khách hàng thanh toán</h2>
                      </td>
                      <td className='payment'>
                        <h2>
                          <b>
                            {selectedBill.totalAmount.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </b>
                        </h2>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* End Table*/}
              <div id='legalcopy'>
                <p className='legal'>
                  <strong>
                    Cám ơn quý khách đã sử dụng dịch vụ của chúng tôi.
                  </strong>
                  <br />
                </p>
              </div>
            </div>
            {/* End Invoice Bot */}
          </div>
          <div className='d-flex mt-3 justify-content-end'>
            <Button type='primary' onClick={handlePrint}>
              In
            </Button>
          </div>
          {/* ============ Invoice modal end =============== */}
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default BillsPage;
