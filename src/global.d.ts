declare module '*.svg' {
  import * as React from 'react'
  export const ReactComponent: React.FunctionComponent<
    React.ComponentProps<'svg'> & { title?: string }
  >
}
declare module '*.png' {
  const src: string
  export default src
}
declare module '*.jpg' {
  const src: string
  export default src
}
declare module '*.jpeg' {
  const src: string
  export default src
}

declare global {
  export interface Window {
    h5sdk: any
    tt: any
  }
}
