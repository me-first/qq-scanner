import QRCode from "qrcode";

export const DOMElement = {
  qrGenerateForm: document.querySelector("#qr-generator-form"),
  qrName: document.querySelector("#Person_name"),
  qrPassword: document.querySelector("#Person_password"),
  qrMessage: document.querySelector("#Person_message"),
  qrGenerateBtn: document.querySelector("#generate-btn"),
  qrCodeOutputCanvas: document.querySelector("#qr-canvas"),
  qrScannerVideo: document.querySelector("#video"),
  qrScannerStartBtn: document.querySelector("#startbutton"),
  flipBtn: document.querySelector("#flip-btn"),
  qrScannerCanvas: document.querySelector("#canvas-capture"),
  qrScannerPhoto: document.querySelector("#photo"),
  qrScannedInformation: document.querySelector(".output-information"),
};

const qrGenerator = () => {
  DOMElement.qrGenerateForm.addEventListener("submit", (e) => {
    const name = DOMElement.qrName.value;
    const password = DOMElement.qrPassword.value;
    const message = DOMElement.qrMessage.value;
    const url = `Your QR information os : Name = ${name},password=${password} , message = ${message}`;

    QRCode.toCanvas(DOMElement.qrCodeOutputCanvas, url, function (error) {
      if (error) console.error(error);
      console.log("success!");
    });

    e.preventDefault();
  });
};

qrGenerator();
