import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import Button from './js/button';

import logo from './assets/logo.svg';

import FractalModule from './js/wasm-binding/fractal.js'
import { drawFractalActionFactory, downloadImageActionFactory, drawSimpleFractalActionFactory } from './js/action/fractal.js'
import wasmImportObject from './js/wasm/wasm-import-object.js'

import wasmLoader from './lib.rs';

const maxStep = 18;
const title = 'JavaScript FwDays: Rust to Wasm in React Web App Demo!';

const getImage = () => document.querySelector('#canvas-out');

const cb = function (wasm) {
  const wasmInstance = wasm.instance;
  const { add, dec } = wasmInstance.exports;

  const doCalc = (prevValue, value) => add(prevValue, value);

  const fractalModule = new FractalModule(wasmInstance.exports);

  const getImageParams = () => {
    const img = getImage();
    const { width, height } = img;
  
    return { img, width, height};
  };

  const doGenerateFractal = startStep => {
    const imgParams = getImageParams();
    const ctx = imgParams.img.getContext("2d");

    wasmImportObject.helper.setCanvas(ctx);
    
    const action = drawSimpleFractalActionFactory(fractalModule, ctx, imgParams.width, imgParams.height);
    console.time('drawFractal');
    action(startStep, maxStep);
    console.timeEnd('drawFractal');
    return "Generated"
  };

  const doSaveFractalImage = step => {
    const imgParams = getImageParams();

    const action = downloadImageActionFactory(fractalModule, imgParams.width, imgParams.height, step);

    action(step);
    return "Saved"
  };

  ReactDOM.render(
    <div className="App">
      <img className="App-Logo" src={logo} alt="React Logo" />
      <h1 className="App-Title">{title}</h1>
      <ul>
        <li>
          <Button title="Add 1" action ={ doCalc } value= { 1 } showResult = { true } />
        </li>
        <li>
          <Button title="Generate Fractal" action ={ doGenerateFractal } value= { 1 }/>
          <canvas id="canvas-out" width="480" height="480"></canvas>
        </li>
        <li>
          <Button title="Generate and Save Fractal" action ={ doSaveFractalImage } value= { maxStep }/>
        </li>
      </ul>
    </div>,
    document.getElementById('app')
  );
}

wasmLoader(wasmImportObject).then(cb);

module.hot.accept();