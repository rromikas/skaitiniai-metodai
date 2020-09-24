const zingsnis = 0.5;
const maxIteraciju = 200;
const eps1 = 1 / 1000000;
const eps2 = 1 / 1000000;

let canvas = document.getElementById("grafikas");
let ctx = canvas.getContext("2d");

let tieses = {};
let etapas = "skenavimas";

let skenavimoLaikas = 100; //ms
let paspaudimas = 0;

const lauktiPaspaudimo = () => {
  let p = paspaudimas;
  return new Promise((resolve, reject) => {
    let tikrinti = () => {
      setTimeout(() => {
        if (paspaudimas !== p) {
          resolve(true);
        } else {
          tikrinti();
        }
      }, 500);
    };
    tikrinti();
  });
};

const tikslinimasPazingsniuiKirstiniuMetodu = (n1, n2, funkcija, index) => {
  let iteracija = 1;

  const tikslinti = async () => {
    let a = (funkcija(n2) - funkcija(n1)) / (n2 - n1);
    let b = funkcija(n2) - a * n2;
    let nMid = -b / a;
    tieses[index] = {
      nuo1: [n1, funkcija(n1)],
      nuo2: [n2, funkcija(n2)],
      iki: [nMid, 0],
    };
    drawFunction(funkcija, pradzia, pabaiga);
    if (Math.abs(funkcija(nMid)) < eps1) {
      return "Rado per " + iteracija + " iteracijų, reiksme: " + nMid;
    } else if (iteracija > maxIteraciju) {
      return "Nerado";
    } else {
      n1 = n2;
      n2 = nMid;
      iteracija++;
      await lauktiPaspaudimo();
      tikslinti();
    }
  };

  tikslinti();
};

const tikslinimasKirstiniuMetodu = (n1, n2, funkcija, index) => {
  let iteracija = 1;

  const tikslinti = () => {
    setTimeout(() => {
      let a = (funkcija(n2) - funkcija(n1)) / (n2 - n1);
      let b = funkcija(n2) - a * n2;
      let nMid = -b / a;
      tieses[index] = {
        nuo1: [n1, funkcija(n1)],
        nuo2: [n2, funkcija(n2)],
        iki: [nMid, 0],
      };
      drawFunction(funkcija, pradzia, pabaiga);
      if (Math.abs(funkcija(nMid)) < eps1) {
        return "Rado per " + iteracija + " iteracijų, reiksme: " + nMid;
      } else if (iteracija > maxIteraciju) {
        return "Nerado";
      } else {
        n1 = n2;
        n2 = nMid;
        iteracija++;
        tikslinti();
      }
    }, 1000);
  };

  tikslinti();
};

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

const transcendentine = (x) => {
  return 1.9 * x * Math.sin(x) - Math.pow(x / 1.5 - 3, 2);
};

const daugianaris = (x) => {
  return (
    0.88 * Math.pow(x, 4) -
    1.44 * Math.pow(x, 3) -
    5.33 * Math.pow(x, 2) +
    7.35 * x +
    0.83
  );
};

const einamaFunkcija = transcendentine;

let btn = document.getElementById("action-btn");
btn.addEventListener("click", () => {
  console.log("etapas", etapas);
  paspaudimas++;
  if (etapas === "skenavimas") {
    scann(einamaFunkcija);
  } else if (etapas === "skenavimas baigtas") {
    etapas = "tikslinimas";
    intervals.forEach((x, i) => {
      tikslinimasPazingsniuiKirstiniuMetodu(
        x[0] - 0.1,
        x[0],
        einamaFunkcija,
        i
      );
    });
  }
});

btn.addEventListener("dblclick", () => {
  if (etapas === "skenavimas baigtas" || etapas === "tikslinimas") {
    etapas = "tikslinimas";
    intervals.forEach((x, i) => {
      tikslinimasKirstiniuMetodu(x[0] - 0.1, x[0], einamaFunkcija, i);
    });
  }
});

let pradzia = -10,
  pabaiga = 30;

let intervals = [];
let cursor = pradzia;
const scann = (funkcija) => {
  const check = () => {
    setTimeout(() => {
      if (
        Math.sign(funkcija(cursor)) !== Math.sign(funkcija(cursor + zingsnis))
      ) {
        intervals.push([cursor, cursor + zingsnis]);
      }
      if (cursor <= pabaiga) {
        cursor += zingsnis;
        drawFunction(funkcija, pradzia, pabaiga);
        check();
      } else {
        etapas = "skenavimas baigtas";
      }
    }, skenavimoLaikas);
  };
  check();
};

const drawFunction = (funkcija, x1, x2) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let scale = canvas.width / (x2 - x1);

  let centerX = Math.abs(x1) * scale;

  ctx.lineWidth = "2";
  ctx.beginPath();
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, canvas.height);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.moveTo(0, canvas.height / 2);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.setLineDash([]);
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX - 8, 15);
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX + 8, 15);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(canvas.width, canvas.height / 2);
  ctx.lineTo(canvas.width - 15, canvas.height / 2 - 8);
  ctx.moveTo(canvas.width, canvas.height / 2);
  ctx.lineTo(canvas.width - 15, canvas.height / 2 + 8);
  ctx.closePath();
  ctx.stroke();

  //x ąšies reikšmės
  let rightX = centerX;
  let leftX = centerX;
  let index = 1;
  ctx.font = "15px Arial";
  ctx.fillText(0, rightX + 10, canvas.height / 2 + 30);
  while (rightX < canvas.width || leftX > 0) {
    rightX = rightX + scale;
    leftX = leftX - scale;
    if (index % Math.ceil(60 / scale) === 0) {
      let text = index;
      var metrics = ctx.measureText(text);
      var textWidth = metrics.width;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(rightX, canvas.height / 2 + 10);
      ctx.lineTo(rightX, canvas.height / 2 - 10);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(leftX, canvas.height / 2 + 10);
      ctx.lineTo(leftX, canvas.height / 2 - 10);
      ctx.closePath();
      ctx.stroke();
      ctx.fillText(index, rightX - textWidth / 2, canvas.height / 2 + 30);
      ctx.fillText(-index, leftX - textWidth / 2, canvas.height / 2 + 30);
    }

    index++;
  }

  // ctx.beginPath();
  // ctx.moveTo(-1.4 * scale, canvas.height / 2 + 5 * scale);
  // ctx.lineTo(10 * scale, canvas.height / 2 + 5 * scale);
  // ctx.closePath();
  // ctx.stroke();

  intervals.forEach((inter) => {
    ctx.fillStyle = "rgba(10, 210, 34, 0.22)";
    ctx.fillRect(
      (inter[0] - pradzia) * scale,
      0,
      zingsnis * scale,
      canvas.height
    );

    // ctx.beginPath();
    // ctx.moveTo((inter[0] - pradzia) * scale, canvas.height);
    // ctx.lineTo((inter[0] - pradzia) * scale, 0);
    // ctx.closePath();
    // ctx.strokeStyle = "green";
    // ctx.stroke();
    // ctx.beginPath();
    // ctx.moveTo((inter[1] - pradzia) * scale, canvas.height);
    // ctx.lineTo((inter[1] - pradzia) * scale, 0);
    // ctx.closePath();
    // ctx.stroke();
  });

  ctx.fillStyle = "rgba(210, 10,121, 0.22)";
  ctx.fillRect((cursor - pradzia) * scale, 0, zingsnis * scale, canvas.height);
  ctx.fillStyle = "#000";

  //   ctx.beginPath();
  //   ctx.moveTo((cursor - pradzia) * scale, canvas.height);
  //   ctx.lineTo((cursor - pradzia) * scale, 0);
  //   ctx.closePath();
  //   ctx.strokeStyle = "red";
  //   ctx.lineWidth = "3";
  //   ctx.stroke();
  //   ctx.beginPath();
  //   ctx.moveTo((cursor - pradzia + zingsnis) * scale, canvas.height);
  //   ctx.lineTo((cursor - pradzia + zingsnis) * scale, 0);
  //   ctx.closePath();
  //   ctx.stroke();

  //   ctx.strokeStyle = "#000";
  //   ctx.lineWidth = "1";
  //   ctx.beginPath();
  //   ctx.setLineDash([]);
  //   ctx.moveTo(canvas.width, canvas.height / 2);
  //   ctx.lineTo(canvas.width - 15, canvas.height / 2 - 8);
  //   ctx.moveTo(canvas.width, canvas.height / 2);
  //   ctx.lineTo(canvas.width - 15, canvas.height / 2 + 8);
  //   ctx.closePath();
  //   ctx.stroke();
  x = 0;
  ctx.setLineDash([]);
  let prevPoint = [0, 0];
  for (let i = x1; i < x2; i = i + 0.01) {
    let y = canvas.height / 2 - funkcija(i) * scale;
    // console.log(x * scale, y);
    ctx.beginPath();
    ctx.moveTo(...prevPoint);
    if (y > canvas.height + 200) {
      ctx.moveTo(x * scale, canvas.height);
      prevPoint = [x * scale, canvas.height];
    } else if (y < -200) {
      ctx.moveTo(x * scale, 0);
      prevPoint = [x * scale, 0];
    } else {
      ctx.lineTo(x * scale, y);
      prevPoint = [x * scale, y];
    }

    x += 0.01;
    ctx.strokeStyle = "blue";
    ctx.lineWidth = "3";
    ctx.closePath();
    ctx.stroke();

    ctx.strokeStyle = "#000";
  }

  ctx.strokeStyle = "orange";
  ctx.lineWidth = "3";
  //tiesiu piesimas

  Object.values(tieses).forEach((x) => {
    ctx.beginPath();
    ctx.moveTo(
      centerX + x.nuo1[0] * scale,
      canvas.height / 2 + x.nuo1[1] * -scale
    );
    ctx.lineTo(
      centerX + x.iki[0] * scale,
      canvas.height / 2 + x.iki[1] * -scale
    );
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(
      centerX + x.nuo2[0] * scale,
      canvas.height / 2 + x.nuo2[1] * -scale
    );
    ctx.lineTo(
      centerX + x.iki[0] * scale,
      canvas.height / 2 + x.iki[1] * -scale
    );
    ctx.closePath();
    ctx.stroke();
  });

  ctx.strokeStyle = "#000";
};

drawFunction(einamaFunkcija, pradzia, pabaiga);
