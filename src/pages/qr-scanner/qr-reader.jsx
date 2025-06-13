import QrScanner from "qr-scanner";
import { useEffect, useRef, useState } from "react";
import "./qr-scanner.scss";

export const QrReader = () => {
  const scanner = useRef();
  const videoEl = useRef(null);
  const qrBoxEl = useRef(null);
  const [qrOn, setQrOn] = useState(true);

  const [scannedResult, setScannedResult] = useState("");

  const onScanSuccess = (result) => {
    setScannedResult(result?.data);
    if (result?.data) {
      window.location.href = `${result?.data}`;
    }
  };

  const onScanFail = (err) => {
    console.log(err);
  };

  useEffect(() => {
    if (videoEl.current && !scanner.current) {
      scanner.current = new QrScanner(videoEl.current, onScanSuccess, {
        onDecodeError: onScanFail,
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
        overlay: qrBoxEl.current || undefined,
      });

      scanner.current
        .start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
        });
    }

    return () => {
      if (!videoEl.current) {
        scanner.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!qrOn)
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
  }, [qrOn]);

  return (
    <div className="qr-reader">
      <div className="text-qr">
        <h1 className="raleway-font">
          Чтобы перейти в меню ресторана, отсканируйте QR-code на столе
        </h1>
      </div>
      <video ref={videoEl}></video>
    </div>
  );
};
