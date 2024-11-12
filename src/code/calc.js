const YPRange = [44];
const FLRange = [12, 15, 18, 20, 22, 25, 28];
const minTP = 75;
const maxTP = 105;
const TPStep = 5;
const diameter = 0.7;

let result = [];

function calc() {
  YPRange.forEach((yp, i) => {
    result[i] = [];
    FLRange.forEach((fl, j) => {
      result[i][j] = [];
      for (let k = minTP; k <= maxTP; k += TPStep) {
        const v = (((yp / fl) * Math.PI * diameter * k * 60) / 1000).toFixed(1);
        result[i][j].push(`牙:${yp} 飞:${fl} 踏:${k} = ${v}km/h`);
      }
    });
  });

  result.forEach((row) => console.table(row));
}

calc();
