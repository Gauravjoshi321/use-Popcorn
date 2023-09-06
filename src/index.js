import React from 'react';
// import { useState } from "react"
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import StarRating from './star';

// function Test() {
//   const [testRating, setTestRating] = useState(0);

//   return <div>
//     <StarRating setTestRating={setTestRating} />
//     <p>This movie has a rating of {testRating}</p>
//   </div>
// }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode >
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
