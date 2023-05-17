import { useEffect, useRef } from "react";

const chartHeight = 10;
const chartWidth = 200;
const mainColor = "gold";
const grayColor = "#606060"

function ValuesBar( { stat }) {
  const canvasRef = useRef(null);
  const ref = useRef(null);

  const draw = (ctx, scale) => {
    const canvas = canvasRef.current;
    var w = canvas.width / 2;
    const midx = w / 2;
    ctx.fillStyle = "#404040";
    ctx.fillRect(0, 0, w, chartHeight * scale);
    const max = stat.isPercent ? 100 : Math.max(stat.value1, stat.value2);
    const scalex = midx / max;
    const col1 = stat.value1 >= stat.value2 ? mainColor : grayColor;
    const col2 = stat.value2 >= stat.value1 ? mainColor : grayColor;
    ctx.fillStyle = col1;
    ctx.fillRect(midx - stat.value1 * scalex, 0, stat.value1 * scalex, chartHeight * scale)
    ctx.fillStyle = col2;
    ctx.fillRect(midx, 0, stat.value2 * scalex, chartHeight * scale)
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth * 2; //chartWidth * 2; //320 * 2; //canvas.offsetWidth;
    canvas.height = chartHeight * 2; //320 * 2; //canvas.offsetHeight;
    canvas.style.width = (canvas.width / 2).toString() + "px";
    canvas.style.height = (canvas.height / 2).toString() + "px";
    const dpi = window.devicePixelRatio;
    context.scale(dpi, dpi);

    // // var scale = (canvas.width * 0.8) / ((maxLat - minLat) * 100000);
    // var sc = (canvas.width / 4 / allwidth) * 0.8;
    // setXscale(sc);
    var sc = 1;
    draw(context, sc);
  }, [stat]);

  const onMouseDown = (e) => {
    const canvas = canvasRef.current;
  }

  return (
    <>
      <div ref={ref}>
        <canvas id="canvas" ref={canvasRef} onMouseDown={onMouseDown} />
      </div>
    </>
  );
}

export default ValuesBar;
