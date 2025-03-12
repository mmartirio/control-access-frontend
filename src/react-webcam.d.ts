declare module 'react-webcam' {
  import * as React from 'react';

  interface WebcamProps {
    audio?: boolean;
    height?: number | string;
    width?: number | string;
    screenshotFormat?: string;
    videoConstraints?: MediaStreamConstraints;
    onUserMediaError?: (error: any) => void;
    onUserMedia?: (stream: MediaStream) => void;
    onScreenshot?: (dataUri: string) => void;
  }

  class Webcam extends React.Component<WebcamProps> {
    getScreenshot(): string | null;
  }

  export default Webcam;
}
