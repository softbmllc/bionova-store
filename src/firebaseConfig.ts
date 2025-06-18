// src/firebaseConfig.ts

import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAH24DEyVBICPK6DcIUpQtj9pkegj54ip8",
  authDomain: "looma-store.firebaseapp.com",
  projectId: "looma-store",
  storageBucket: "looma-store.appspot.com",
  messagingSenderId: "76702168220",
  appId: "1:76702168220:web:6c226b493c3ddc5f44a959",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);