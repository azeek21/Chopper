export default async function typeWriter() {
    const doc: any = document.getElementById("demo");
    let txt = [
      "YOU ❤️",
      "YOUTUBERS 📺!",
      "MARKETOLOGS 🛍!",
      "POLITICANS ⚖️!",
      "SCIENTISTS 🔬!",
      "EVERYONE ❄️!",
    ];
    let speed = 100;
    (async () => {
      let i = 0;
      let f = 1;
      const me = setInterval(() => {
        doc.innerText = "❤️";
        let ii = 0;
        const p = setInterval(() => {
          doc.innerText += txt[i][ii];
          ii++;
          if (ii >= txt[i].length) {
            clearInterval(p);
          }
        }, 70);

        if (i == txt.length - 1) {
          i = 0;
          f--;
        } else {
          i++;
        }

        if (f == 0) {
          clearInterval(me);
        }
      }, 3500);
    })();
  };