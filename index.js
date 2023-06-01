const express = require("express");
const uuid = require("uuid");

const port = 3000;

const app = express();
app.use(express.json());

const order = [];

const logRequest = (request, response, next) => {
  console.log(`[${request.method}] - ${request.url}`);
  next();
};

const checkId = (request, response, next) => {
  const { id } = request.params;

  const index = order.findIndex((orderId) => orderId.id === id);

  if (index < 0) {
    return response.status(404).json({ error: "Id not found" });
  }

  request.orderIndex = index;
  request.userId = id;
  next();
};

app.get("/order", logRequest, (request, response) => {
  return response.json(order);
});

app.post("/order", logRequest, (request, response) => {
  const { clientName, orderItems, price } = request.body;

  const orderId = {
    id: uuid.v4(),
    clientName,
    orderItems,
    price,
    orderStatus: "Em preparação",
  };

  order.push(orderId);

  return response.status(201).json(orderId);
});

app.put("/order/:id", logRequest, checkId, (request, response) => {
  const { clientName, orderItems, price } = request.body;
  const index = request.orderIndex;
  const id = request.userId;

  const updatedOrder = {
    id,
    clientName,
    orderItems,
    price,
    orderStatus: "Em preparação",
  };

  order[index] = updatedOrder;

  return response.json(updatedOrder);
});

app.delete("/order/:id", logRequest, checkId, (request, response) => {
  const index = request.orderIndex;

  order.splice(index, 1);

  return response.status(204).json();
});

app.get("/order/:id", logRequest, checkId, (request, response) => {
  const index = request.orderIndex;

  const orderData = order[index];

  return response.json(orderData);
});

app.patch("/order/:id", logRequest, checkId, (request, response) => {  
  const index = request.orderIndex;
  
  const updatedStatus = { ...order[index], orderStatus: "Pronto" };

  order[index] = updatedStatus;

  return response.json(updatedStatus);
});

app.listen(port, () => {
  console.log(`🍔 Server started on port ${port}`);
});
