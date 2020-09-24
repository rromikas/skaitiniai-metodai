const daugianaris = (x) => {
  return (
    0.88 * Math.pow(x, 4) -
    1.44 * Math.pow(x, 3) -
    5.33 * Math.pow(x, 2) +
    7.35 * x +
    0.83
  );
};

const transcendentine = (x) => {
  return 1.9 * x * Math.sin(x) - Math.pow(x / 1.5 - 3, 2);
};

const funkcijosNr = 1;
let funkcijos = [daugianaris, transcendentine];

const skenavimoPradzia = funkcijosNr === 0 ? -3.88 : -10;
const skenavimoPabaiga = funkcijosNr === 0 ? 7.05 : 10;
const zingsnis = 0.5;
const maxIteraciju = 200;
const eps1 = 1 / 1000000;
const eps2 = 1 / 1000000;

let saknuIntervalai = [];

let x = skenavimoPradzia;

while (x < skenavimoPabaiga) {
  if (
    Math.sign(funkcijos[funkcijosNr](x)) !==
    Math.sign(funkcijos[funkcijosNr](x + zingsnis))
  ) {
    saknuIntervalai.push([x, x + zingsnis]);
  }
  x += zingsnis;
}
let canvas = document.getElementById("grafikas");
let ctx = canvas.getContext("2d");

const drawFunction = (funkcija, x1, x2) => {
  let scale = canvas.width / (x2 - x1);

  let centerX = Math.abs(x1) * scale;

  ctx.lineWidth = "4";

  ctx.beginPath();
  ctx.setLineDash([]);
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX - 8, 15);
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX + 8, 15);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.setLineDash([5, 3]);
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, canvas.height);
  ctx.closePath();
  ctx.stroke();

  //x ąšies reikšmės
  let rightX = centerX;
  let leftX = centerX;
  let index = 1;
  ctx.font = "30px Arial";
  ctx.fillText(0, rightX + 10, canvas.height / 2 + 30);
  console.log("SCALE", scale);
  while (rightX < canvas.width || leftX > 0) {
    rightX = rightX + scale;
    leftX = leftX - scale;
    if (index % Math.ceil(60 / scale) === 0) {
      let text = index;
      var metrics = ctx.measureText(text);
      var textWidth = metrics.width;

      ctx.fillText(index, rightX - textWidth / 2, canvas.height / 2 + 30);
      ctx.fillText(-index, leftX - textWidth / 2, canvas.height / 2 + 30);
    }

    index++;
  }

  //y ąšies reikšmės

  ctx.beginPath();
  ctx.setLineDash([5, 3]);
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.moveTo(0, canvas.height / 2);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.setLineDash([]);
  ctx.moveTo(canvas.width, canvas.height / 2);
  ctx.lineTo(canvas.width - 15, canvas.height / 2 - 8);
  ctx.moveTo(canvas.width, canvas.height / 2);
  ctx.lineTo(canvas.width - 15, canvas.height / 2 + 8);
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.setLineDash([]);
  x = 0;
  for (let i = x1; i < x2; i = i + 0.01) {
    let y = canvas.height / 2 - funkcija(i) * scale;
    ctx.lineTo(x * scale, y);
    x += 0.01;
  }
  ctx.closePath();
  ctx.strokeStyle = "blue";
  ctx.lineWidth = "4";
  ctx.stroke();
};

const tikslinimasStyguMetodu = (n1, n2) => {
  let iteracija = 1;
  let rado = false;
  while (iteracija <= maxIteraciju && !rado) {
    let k = Math.abs(daugianaris(n1) / daugianaris(n2));
    let nMid = (n1 + k * n2) / (1 + k);
    if (ArTikslu(n1, n2, nMid)) {
      rado = true;
      return "Rado per " + iteracija + " itercijų, saknis yra " + nMid;
    } else {
    }

    if (Math.sign(daugianaris(n2)) === Math.sign(daugianaris(nMid))) {
      n2 = nMid;
    } else {
      n1 = nMid;
    }
    iteracija++;
  }

  return "Nerado";
};

const tikslinimasKirstiniuMetodu = (n1, n2, funkcija) => {
  let iteracija = 1;

  while (iteracija <= maxIteraciju) {
    let a = (funkcija(n2) - funkcija(n1)) / (n2 - n1);
    let b = funkcija(n2) - a * n2;
    let nMid = -b / a;
    if (Math.abs(funkcija(nMid)) < eps1) {
      return "Rado per " + iteracija + " iteracijų, reiksme: " + nMid;
    }
    n1 = n2;
    n2 = nMid;
    iteracija++;
  }

  return "Nerado";
};

const tikslinimasSiaurinantSkenavimoIntervala = (n1, n2, funkcija) => {
  let iteracija = 1;
  let mazejantisZingsnis = 0.125; // 4 kartus mazesnis uz pradini
  let x = n1;
  let rado = false;
  while (x < n2 && !rado && iteracija < maxIteraciju) {
    if (
      Math.sign(funkcija(x)) !== Math.sign(funkcija(x + mazejantisZingsnis))
    ) {
      rado = true;
      n1 = x;
      n2 = x + mazejantisZingsnis;
      mazejantisZingsnis = mazejantisZingsnis / 4;
    }
    iteracija++;
    x += mazejantisZingsnis;
  }
  let nMid = (n2 + n1) / 2;
  if (ArTikslu(n1, n2, nMid)) {
    return "Rado per " + iteracija + " iteracijų, saknis yra " + nMid;
  }

  return "Nerado";
};

const ArTikslu = (pradzia, pabaiga, vidurys) => {
  if (Math.abs(pradzia) + Math.abs(pabaiga) > eps1) {
    return (
      Math.abs(funkcijos[funkcijosNr](vidurys)) < eps1 &&
      (pabaiga - pradzia) / Math.abs(vidurys) < eps2
    );
  } else {
    Math.abs(funkcijos[funkcijosNr](vidurys)) < eps1 &&
      pabaiga - pradzia < eps2;
  }
};

// 1 ir 5 METODAMS
saknuIntervalai.forEach((x) => {
  console.log(
    "Intervalas: " +
      x +
      ", " +
      tikslinimasSiaurinantSkenavimoIntervala(
        x[0],
        x[1],
        funkcijos[funkcijosNr]
      )
  );
});

//KIRSTINIU METODUI
// saknuIntervalai.forEach((x) => {
//   console.log(
//     "Intervalas: " +
//       x[0] +
//       ", " +
//       parseFloat(x[0] - 0.001) +
//       ", " +
//       tikslinimasKirstiniuMetodu(x[0], x[0] - 0.001, funkcijos[funkcijosNr])
//   );
// });

const uzdavinys = {
  art1: 0.0001,
  art2: 0.0002,
  funkcija: (x) => {
    x = x === 0 ? 0.00000001 : x;
    return (
      50 * Math.pow(Math.E, -((3 * x) / 0.45)) -
      10 +
      4.41 * Math.pow(x, -1) * (Math.pow(Math.E, -((3 * x) / 0.45)) - 1)
    );
  },
};

// UZDAVINIO SPRENDIMAS
console.log(
  "A Intervalas: " +
    x +
    ", " +
    tikslinimasKirstiniuMetodu(
      uzdavinys.art1,
      uzdavinys.art2,
      uzdavinys.funkcija
    )
);

//UZDAVINIO GRAFIKO PIESIMAS
drawFunction(uzdavinys.funkcija, -2, 100);

//DAUGIANARIO GRAFIKO PIESIMAS
// drawFunction(daugianaris, -10, 10);

//TRANSCENDENTINES GRAFIKO PIESIMAS
// drawFunction(transcendentine, -5, 10); // -30 30 matosi visas grafikas
