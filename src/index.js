import "./styles.css";

document.getElementById("app").innerHTML = `
<h1>Hello Vanilla!</h1>
<div>
  We use the same configuration as Parcel to bundle this sandbox, you can find more
  info about Parcel 
  <a href="https://parceljs.org" target="_blank" rel="noopener noreferrer">here</a>.
  <button id="foo">Click me!</button>
</div>
`;

document.getElementById("foo").addEventListener("click", function () {
  /*
  Make sure you are wearing the hr monitor, as it typically
  goes to sleep when inactive, not allowing you to connect to it.
  Instructions
  ===
  1. Using Google Chrome, open the dev console and paste the below code.
  2. A panel near the address bar will open, searching for nearby bluetooth (ble)
     heart rate devices. Don't click away from the panel or Chrome will cancel the search.
  3. When found, click connect on your device.
  4. An event listener will be added to start capturing the hr data.
     You can refresh the browser if you need to disconnect or cancel the streaming data.
  The value will be a DataView.
  developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView
  Pass the index of the hr, (2nd item in the Array buffer): val.getInt8(1)
  */

  const connect = async (props) => {
    console.clear();
    const device = await navigator.bluetooth.requestDevice({
      filters: [
        {
          services: ["heart_rate"]
        }
      ],
      acceptAllDevices: false
    });
    console.log(`%c\n👩🏼‍⚕️`, "font-size: 82px;", "Starting HR...\n\n");
    const server = await device.gatt.connect(),
      service = await server.getPrimaryService("heart_rate"),
      char = await service.getCharacteristic("heart_rate_measurement");

    char.oncharacteristicvaluechanged = props.onChange;
    char.startNotifications();
    return char;
  };

  const data = [];

  connect({
    onChange: (e) => {
      const val = e.target.value.getInt8(1);
      data.push(val / 2);
      let arr = data.slice(-200);
      if (arr.length < 200) {
        const fill = [];
        let n = 200 - arr.length;
        while (n--) fill.push(arr[0]);
        arr = fill.concat(arr);
      }
      console.clear();
      console.graph(arr);
      console.log(`%c\n💚 ${val}`, "font-size: 24px;");
    }
  }).catch((e) => console.warn(Error(e)));

  /**
   * Grapher lib (only for creating an example chart in the console)
   */
  (function () {
    if (!window.console || !window.console.log) return;
    var canvas,
      context,
      height = 100,
      width = 400;
    canvas = document.createElement("canvas");
    canvas.height = height + "";
    canvas.width = width + "";
    context = canvas.getContext("2d");
    document.body.appendChild(canvas);
    canvas.style.cssText = "position: absolute; left: -99999px";
    context.fillStyle = "#fff";
    var _graph = function (imageURL, height, width) {
      console.log(
        "%c ",
        "" +
          "font-size: 0;" +
          "padding-left: " +
          width +
          "px;" +
          "padding-bottom: " +
          height +
          "px;" +
          'background: url("' +
          imageURL +
          '"),' +
          "-webkit-linear-gradient(#eee, #888);" +
          ""
      );
    };
    window.console.graph = function (data) {
      var units = Math.floor(width / data.length);
      width = units * data.length;
      context.clearRect(0, 0, width, height);
      for (var i = 0; i < data.length; i++) {
        context.fillRect(i * units, 0, units, 100 - data[i]);
      }
      _graph(canvas.toDataURL(), height, width);
    };
  })();
});
