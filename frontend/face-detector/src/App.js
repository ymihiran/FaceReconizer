import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Addfaces from './AddFaces.js';
import SearchFace from './SearchFace.js';
import HomePage from './HomePage.js';
import AnimatedCursor from "react-animated-cursor";

function App() {
  return (
    <>
      <AnimatedCursor
         color="#000"
         innerSize={12}
         outerSize={95}
         innerScale={2}
         outerScale={1.7}
         outerAlpha={5.5}
         outerStyle={{
           mixBlendMode: 'exclusion',
           backgroundColor: '#255a70'
         }}
          innerStyle={{
            backgroundColor: '#fff'
          }}
        clickables={[
          'a',
          'input[type="text"]',
          'input[type="email"]',
          'input[type="number"]',
          'input[type="submit"]',
          'input[type="image"]',
          'label[for]',
          'select',
          'textarea',
          'button',
          '.link'
        ]}
      />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analyze" element={<SearchFace />} />
          <Route path="/add-faces" element={<Addfaces />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
