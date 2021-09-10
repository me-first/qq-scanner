import Jimp from "jimp";
import QrCode from "qrcode-reader";

import { DOMElement } from "./qr-generator";

let ScannedBuffer;

(function () {
  let width = 320;
  let height = 0;
  let streaming = false;
  let video = DOMElement.qrScannerVideo;
  let canvas = DOMElement.qrScannerCanvas;
  let photo = DOMElement.qrScannerPhoto;
  let startbutton = DOMElement.qrScannerStartBtn;

  navigator.mediaDevices.enumerateDevices().then((devices) => {
    let sourceId = null;
    // enumerate all devices
    for (var device of devices) {
      // if there is still no video input, or if this is the rear camera
      if (
        device.kind == "videoinput" &&
        (!sourceId || device.label.indexOf("back") !== -1)
      ) {
        sourceId = device.deviceId;
      }
    }
    // we didn't find any video input
    if (!sourceId) {
      throw "no video input";
    }
    let constraints = {
      video: {
        sourceId: sourceId,
      },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.log(err);
        alert("Permission denied!!");
      });
  });

  //   navigator.mediaDevices
  //     .getUserMedia({
  //       video: {
  //         facingMode: "enviroment",
  //       },
  //     })
  //     .then((stream) => {
  //       video.srcObject = stream;
  //       video.play();
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       alert("Permission denied!!");
  //     });

  video.addEventListener(
    "canplay",
    function (e) {
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth / width);
        video.setAttribute("width", width);
        video.setAttribute("height", height);
        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
        streaming = true;
      }
    },
    false
  );

  startbutton.addEventListener(
    "click",
    function (ev) {
      takepicture();
      ev.preventDefault();
    },
    false
  );

  function clearphoto() {
    var context = canvas.getContext("2d");
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL("image/png");
    photo.setAttribute("src", data);
  }

  function takepicture() {
    var context = canvas.getContext("2d");
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
      var data = canvas.toDataURL("image/png");
      photo.setAttribute("src", data);
      const newData = data.replace(/^data:image\/\w+;base64,/, "");
      var imageBuffer = new Buffer(newData, "base64");
      ScannedBuffer = imageBuffer;
    } else {
      clearphoto();
    }
  }

  function base64ToHex(str) {
    const raw = atob(str);
    let result = "";
    for (let i = 0; i < raw.length; i++) {
      const hex = raw.charCodeAt(i).toString(16);
      result += hex.length === 2 ? hex : "0" + hex;
    }
    return result.toUpperCase();
  }
})();

DOMElement.qrScannerStartBtn.addEventListener("click", () => {
  console.log(ScannedBuffer);
  Jimp.read(ScannedBuffer, function (err, image) {
    if (err) {
      console.error(err);
      // TODO handle error
    }
    var qr = new QrCode();
    qr.callback = function (err, value) {
      if (err) {
        console.error(err);
        DOMElement.qrScannedInformation.innerHTML =
          "Please place the QR Code Perfectly";

        // TODO handle error
      }
      console.log(value.result);
      DOMElement.qrScannedInformation.innerHTML = value.result;
    };
    qr.decode(image.bitmap);
  });
});
