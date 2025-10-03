import axios from "axios";

const API_URL = "http://localhost:5000/api/presale"; // change if deployed

export async function getStatus() {
  const res = await axios.get(`${API_URL}/status`);
  return res.data;
}

export async function buy(amount) {
  const res = await axios.post(`${API_URL}/buy`, { amount });
  return res.data;
}
