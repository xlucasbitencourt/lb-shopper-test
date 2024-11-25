import axios from 'axios';
import 'dotenv/config';

const { GOOGLE_API_KEY } = process.env;

export const api = axios.create({
  baseURL: 'https://routes.googleapis.com/directions/v2:computeRoutes',
  headers: {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": GOOGLE_API_KEY,
    "X-Goog-FieldMask": "*"
  }
});