import React from "react";
import { Button, Card } from "antd";
import { useDispatch } from "react-redux";

const ItemList = ({ item }) => {
  const dispatch = useDispatch();
  //Update Cart handler
  const handleAddToCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...item, quantity: 1 },
    });
  };
  const { Meta } = Card;
  return (
    <div>
      <Card
        style={{
          width: 200,
          marginBottom: 10,
          marginRight: 10,
        }}
        cover={<img alt={item.name} src={item.image} style={{ height: 200 }} />}
      >
        <Meta title={item.name} />
        <div className='item-button'>
          <Button onClick={() => handleAddToCart()} type='primary' block>
            Add To Cart
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ItemList;
