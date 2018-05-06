import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import Button from './js/button';

import logo from './assets/logo.svg';

import x86Loader from './js/wasm-binding/x86-loader.js'
import { drawFractalActionFactory, downloadImageActionFactory } from './js/action/fractal.js'
import wasmImportObject from './js/wasm/wasm-import-object.js'

import wasmLoader from './lib.rs';

const maxStep = 18;
const title = 'JavaScript FwDays: Rust to Wasm in React Web App Demo!';

const getImage = () => document.querySelector('#canvas-out');

const cb = function (wasm) {
  const wasmInstance = wasm.instance;

  const x86LoaderModule = new x86Loader(wasmInstance.exports);

  ReactDOM.render(
    <div className="App">
      <img className="App-Logo" src={logo} alt="React Logo" />
      <h1 className="App-Title">{title}</h1>
      <ul>
        <li>
          <Button title="Load Linux" action ={ x86LoaderModule.load.bind(x86LoaderModule) } value= { 1 } showResult = { true } />
        </li>
        <li>
          <Button title="Run Linux" action ={ x86LoaderModule.run.bind(x86LoaderModule) } value= { 1 } showResult = { true } />
        </li>
      </ul>
    </div>,
    document.getElementById('app')
  );
}

wasmLoader(wasmImportObject).then(cb);

module.hot.accept();