import axios from "axios";

const BASE_URL = "http://localhost:8080/api/auth";

export const sendOtp = async (mobile) => {
  return axios.post(`${BASE_URL}/send-otp`, { identifier: mobile });
};

export const verifyOtp = async (mobile, otp) => {
  return axios.post(`${BASE_URL}/verify-otp`, { identifier: mobile, otp });
};
