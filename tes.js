// function controlledRandom(min, max, randomness = 1) {
//   const u = Math.random();
//   const bias = Math.pow(u, randomness === 0 ? Infinity : 1 / randomness);
//   return min + bias * (max - min);
// }

// // Contoh
// const a = controlledRandom(0, 100, 0.2); // cenderung ke tengah
// const b = controlledRandom(0, 100, 1);   // acak normal

// console.log(a,b);

// function seededRandom(seed) {
//   let x = Math.sin(seed++) * 10000;
//   return x - Math.floor(x);
// }

// // Contoh
// const rand1 = seededRandom(42);
// const rand2 = seededRandom(42);
// console.log(rand1, rand2);

// function lowVarianceRandom(mean, variance) {
//   return mean + (Math.random() * 2 - 1) * variance;
// }

// // Contoh
// const aa = lowVarianceRandom(50, 2);   // hampir selalu dekat 50
// const bb = lowVarianceRandom(50, 30);  // lebih liar
// const cc = lowVarianceRandom(50, 100);  // lebih liar

// console.log(aa,bb,cc);

// function weightedRandom(options) {
//   const total = options.reduce((s, o) => s + o.weight, 0);
//   let r = Math.random() * total;

//   for (const o of options) {
//     if (r < o.weight) return o.value;
//     r -= o.weight;
//   }
// }

// // Contoh
// const aaa = weightedRandom([
//   { value: "A", weight: 80 },
//   { value: "B", weight: 20 }
// ]);

// function makeRNG(seed) {
//   let state = (seed >>> 0) || 1;

//   function next() {
//     state ^= state << 13;
//     state ^= state >>> 17;
//     state ^= state << 5;
//     return (state >>> 0) / 4294967296;
//   }

//   return {
//     next,

//     // simpan state saat ini
//     getState() {
//       return state >>> 0;
//     },

//     // restore state lama
//     setState(s) {
//       state = (s >>> 0) || 1;
//     },

//     // reset ke seed awal
//     reseed(newSeed) {
//       state = (newSeed >>> 0) || 1;
//     }
//   };
// }

// const rng = makeRNG(42);

// rng.next(); // A
// rng.next(); // B

// const checkpoint = rng.getState(); // simpan state

// rng.next(); // C
// rng.next(); // D

// rng.setState(checkpoint); // rewind

// rng.next(); // C (identik)
// rng.next(); // D (identik)

// const saveData = JSON.stringify({
//   rngState: rng.getState()
// });

// // restore
// const data = JSON.parse(saveData);
// rng.setState(data.rngState);

function SRNG(s) {
  let seed = s >>> 0 || Math.floor(Math.random() * 4294967296) >>> 0;
  let state = seed;

  this.next = function () {
    seed = (seed + 0x9e3779b9) >>> 0;
    state ^= seed;
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state = (state + seed) >>> 0;
    return state / 4294967296;
  };

  this.getSnapshot = function () {
    return { seed: seed >>> 0, state: state >>> 0 };
  };

  this.setSnapshot = function (snap) {
    seed = snap.seed >>> 0 || 1;
    state = snap.state >>> 0 || 1;
    calls = snap.calls >>> 0;
  };

  this.reseed = function (newSeed) {
    seed = newSeed >>> 0 || Math.floor(Math.random() * 4294967296) >>> 0;
    state = seed;
  };
  this.mixSeed = function (newSeed) {
    const s = newSeed >>> 0 || Math.floor(Math.random() * 4294967296) >>> 0;
    seed ^= s;
    state ^= (s + 0x9e3779b9) >>> 0;
  };

  this.weightedRandom = function (options) {
    const total = options.reduce((s, o) => s + o.weight, 0);
    let r = this.next() * total;

    for (const o of options) {
      if (r < o.weight) return o.value;
      r -= o.weight;
    }
  };
}

// const rng = new SRNG();

// aaa = rng.weightedRandom([
//   { value: "A", weight: 80 },
//   { value: "B", weight: 20 },
// ]);
// console.log(aaa);
// aaa = rng.weightedRandom([
//   { value: "A", weight: 80 },
//   { value: "B", weight: 20 },
// ]);
// console.log(aaa);
// aaa = rng.weightedRandom([
//   { value: "A", weight: 80 },
//   { value: "B", weight: 20 },
// ]);
// console.log(aaa);
// aaa = rng.weightedRandom([
//   { value: "A", weight: 80 },
//   { value: "B", weight: 20 },
// ]);
// console.log(aaa);
// aaa = rng.weightedRandom([
//   { value: "A", weight: 80 },
//   { value: "B", weight: 20 },
// ]);
// console.log(aaa);
// aaa = rng.weightedRandom([
//   { value: "A", weight: 80 },
//   { value: "B", weight: 20 },
// ]);
// console.log(aaa);
// aaa = rng.weightedRandom([
//   { value: "A", weight: 80 },
//   { value: "B", weight: 20 },
// ]);
// console.log(aaa);
// aaa = rng.weightedRandom([
//   { value: "A", weight: 80 },
//   { value: "B", weight: 20 },
// ]);
// console.log(aaa);
// aaa = rng.weightedRandom([
//   { value: "A", weight: 80 },
//   { value: "B", weight: 20 },
// ]);
// console.log(aaa);

// const me = rng.getSnapshot();
// console.log(me);
