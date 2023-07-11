import { css } from '@emotion/react'

export default css`
  html {
    box-sizing: border-box;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  * {
    scrollbar-color: #c0c4cc transparent;
    scrollbar-width: thin;

    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    ::-webkit-scrollbar-track {
      border-radius: 5px;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 5px;
      background-color: #c0c4cc;

      :hover {
        background-color: #8f9bb3;
      }
    }
  }

  html {
    height: 100%;
  }

  body {
    width: 100vw;
    height: 100vh;

    min-width: 800px;
    min-height: 500px;
  }
  #root {
    width: 100%;
    height: 100%;
  }
  body #app-container {
    width: 100%;
    height: 100%;
  }

  body {
    /* height: 100%; */
    background: transparent;
    overflow: hidden;
    color: #3d3d3d;
    padding: 0;
    margin: 0;
  }

  #root {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`
