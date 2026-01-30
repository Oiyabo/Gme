// const { createElement } = require("react");

function SRNG(s) {
  let seed = s >>> 0 || Math.floor(Math.random() * 4294967296) >>> 0;
  let state = seed;

  const t = function () {
    seed = (seed + 0x9e3779b9) >>> 0;
    state ^= seed;
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state = (state + seed) >>> 0;
    return state / 4294967296;
  };

  t.getSS = function () {
    return { seed: seed >>> 0, state: state >>> 0 };
  };

  t.setSS = function (snap) {
    seed = snap.seed >>> 0 || 1;
    state = snap.state >>> 0 || 1;
    calls = snap.calls >>> 0;
  };

  t.reseed = function (newSeed) {
    seed = newSeed >>> 0 || Math.floor(Math.random() * 4294967296) >>> 0;
    state = seed;
  };
  t.mixSeed = function (newSeed) {
    const s = newSeed >>> 0 || Math.floor(Math.random() * 4294967296) >>> 0;
    seed ^= s;
    state ^= (s + 0x9e3779b9) >>> 0;
  };

  t.wdR = function (options) {
    const total = options.reduce((s, o) => s + o.weight, 0);
    let r = this.next() * total;

    for (const o of options) {
      if (r < o.weight) return o.value;
      r -= o.weight;
    }
  };

  t.rmI = function (array) {
    if (!array.length) return undefined;
    return array[Math.floor(t() * array.length)];
  };

  return t;
}

const rng = SRNG(42738461);

const namedNPC = {
  user: {
    name: "user",
    hp: 100,
    physicalAtatck: 15,
    magicalAttack: 15,
    physicaldefense: 10,
    magicalAttack: 10,
    mana: 200,
    reactSpeed: 10,
    skills: ["punch", "orb launch", "block", "dodge", "explosive charge"],
  },
  Alltale: {
    name: "Alltale",
    hp: 125,
    physicalAtatck: 25,
    magicalAttack: 0,
    physicaldefense: 15,
    magicalAttack: 5,
    mana: 75,
    reactSpeed: 25,
    skills: ["slice", "spin kick", "shield block", "counter"],
  },
  Alice: {
    name: "alice",
    physicalAtatck: 0,
    magicalAttack: 25,
    physicaldefense: 5,
    magicalAttack: 15,
    hp: 75,
    mana: 300,
    reactSpeed: 12,
    skills: ["fire ball", "vines bind", "snow rain", "light bang"],
  },
  Alric: {
    name: "Alric",
    physicalAtatck: 5,
    magicalAttack: 0,
    physicaldefense: 30,
    magicalAttack: 20,
    hp: 250,
    mana: 50,
    reactSpeed: 6,
    skills: ["charge", "grab", "taunt", "protect"],
  },
  Aliva: {
    name: "Aliva",
    physicalAtatck: 5,
    magicalAttack: 5,
    physicaldefense: 10,
    magicalAttack: 20,
    hp: 75,
    mana: 250,
    reactSpeed: 8,
    skills: ["heal", "area heal", "aegis", "iron body", "elixing"],
  },
};
namedNPC.antiUser = structuredClone(namedNPC.user);
namedNPC.antiUser.name = "antiUser";

function conditionSkill(self, skill) {
  for (const con of skill.condition || []) {
    // console.log(con);
    switch (con[0]) {
      case "afterCooldown":
        if (self.cooldown[skill.name] > 0) {
          self.cooldown[skill.name]--;
          return false;
        }
        break;
      // console.log(!action.every(a=>a.skill.name != name));
      // if (!action.every(a=>a.skill.name != name)) return false;
    }
  }
  return true;
}
const teamG = {};
const enemyG = {};
const meName = ["user", "antiUser"];
function chooseFightT(name) {
  const ref = namedNPC[name] || {};
  const forCheck = [];
  const actionSkill = {};
  const obj = {
    ref,
    action: new Set(),
    actionSkill,
    _activeSkill: new Set(),
    forCheck,
    cooldown: {},
    ActionInActive: null,
  };
  for (const skill of ref.skills) {
    // for (const skill of skills) {
    const skillsk = skillsku[skill];
    const sk = (actionSkill[skill] = {
      ref: skillsk,
      active: true,
      isOn() {
        return this.active && conditionSkill(obj, sk);
      },
      speed: skillsk.speedMod + ref.reactSpeed,
    });
    // sk.active = true;
    // sk.isOn = () => {
    //   // console.log("jalan");
    //   return sk.active && conditionSkill(obj, sk);
    // };
    if (skillsk.cooldown) obj.cooldown[skill] = 0;
    actionSkill[skill] = sk;
    const fun = (ob) => {
      for (const el of ob) {
        if (forCheck[el]) forCheck[el].push(sk);
        else forCheck[el] = [sk];
      }
    };
    // console.log(sk)
    fun(skillsk.pos);
    fun(skillsk.psuedoPos || []);
    ///
    ///
    // const isOn = () => as.active;
  }
  return obj;
}
// function chooseEnemy() {
//   const userCopy = structuredClone(party.user);
//   userCopy.name = "antiUser";
//   enemy.antiUser = {
//     action: [],
//   };
//   enemy.antiUser.ref = userCopy;
// }
const AllTE = (name) => teamG[name] || enemyG[name];

const skillsku = {
  punch: {
    name: "punch",
    color: "#abcdef",
    pos: [1],
    speedMod: 0,
  },
  "orb launch": {
    name: "orb launch",
    color: "#efadcb",
    pos: [2],
    psuedoPos: [1],
    speedMod: -2,
  },
  "explosive charge": {
    name: "explosive charge",
    color: "#efadcb",
    pos: [4],
    condition: [["afterCooldown"]],
    cooldown: 8,
    speedMod: 0,
  },
  block: {
    name: "block",
    color: "#cbefad",
    pos: [1],
    speedMod: 2,
  },
  dodge: {
    name: "dodge",
    color: "#dbafec",
    pos: [1],
    speedMod: 10,
  },
  slice: {
    name: "slice",
    color: "#efadcb",
    pos: [1],
    speedMod: 1,
  },
  "spin kick": {
    name: "spin kick",
    color: "#efadcb",
    pos: [1],
    speedMod: -2,
  },
  "shield block": {
    name: "shield block",
    color: "#efadcb",
    pos: [1],
    speedMod: 5,
    speedMod: 5,
  },
  counter: {
    name: "counter",
    color: "#efadcb",
    pos: [1],
    condition: [["onlyAfter", "block"]],
    speedMod: 10,
  },
  "fire ball": {
    name: "fire ball",
    color: "#efadcb",
    pos: [1],
    mv: "attack",
  },
  "vines bind": {
    name: "vines bind",
    color: "#efadcb",
    pos: [1],
    mv: "attack",
  },
  "snow rain": {
    name: "snow rain",
    color: "#efadcb",
    pos: [2],
    psuedopos: [1], ///////////
    mv: "attack",
  },
  "light bang": {
    name: "light bang",
    color: "#efadcb",
    pos: [1],
    mv: "attack",
  },
  charge: {
    name: "charge",
    color: "#efadcb",
    pos: [1],
    mv: "attack",
  },
  grab: {
    name: "grab",
    color: "#efadcb",
    pos: [1],
    mv: "attack",
  },
  taunt: {
    name: "taunt",
    color: "#efadcb",
    pos: [1],
    mv: "attack",
  },
  protect: {
    name: "protect",
    color: "#efadcb",
    pos: [1],
    mv: "attack",
  },
  heal: {
    name: "heal",
    color: "#efadcb",
    pos: [1],
    mv: "attack",
  },
  "area heal": {
    name: "area heal",
    color: "#efadcb",
    pos: [1],
    mv: "attack",
  },
  aegis: {
    name: "aegis",
    color: "#efadcb",
    pos: [1],
    mv: "attack",
  },
  "iron body": {
    name: "iron body",
    color: "#efadcb",
    pos: [1],
    mv: "attack",
  },
  elixiring: {
    name: "elixiring",
    color: "#efadcb",
    pos: [1],
    mv: "attack",
  },
};

const controlUIUX = {
  battleSkillsButton: {},
};
namedNPC.user.skills.forEach((a) => {
  const el = document.createElement("div");
  el.className = "skill";
  el.dataset.skill = a;
  control.appendChild(el);
  controlUIUX.battleSkillsButton[a] = el;
});
document
  .querySelectorAll(".skill")
  .forEach((el) => (controlUIUX.battleSkillsButton[el] = el));
function FightMoCh(grp) {
  // console.log(grp);
  for (const char of grp) {
    const action = char.action;
    for (const as of char._activeSkill) {
      // console.log(as);
      char.actionSkill[as].active = true;
    }
    char._activeSkill.clear();
    for (const act of action) {
      const pos = --act.pos,
        el = act.el,
        style = el.style,
        actskill = act.skill;
      if (pos == -3) {
        el.remove();
        action.delete(act);
        continue;
      }
      if (pos == 0) {
        style.backgroundColor = actskill.ref.color;
        char.ActionInActive = actskill;
      }
      style.transform = `translateX(calc(25dvw * ${pos}))`;
      for (const as of char.forCheck?.[pos] || []) {
        as.active = false;
        char._activeSkill.add(as.ref.name);
        // console.log(char);
      }
      // const isIt = char.ref === userG;
      // if (isIt) resetBtnSkill(char._activeSkill);
    }
    // for (let i = 0; i < action.size; i++) {
    //   const act = action[i],
    //     pos = --act.pos,
    //     el = act.el,
    //     style = el.style;
    //   if (pos == -3) {
    //     el.remove();
    //     action.delete(i);
    //     continue;
    //   }
    //   if (pos == 0) style.backgroundColor = act.skill.color;
    //   style.transform = `translateX(calc(25dvw * ${pos}))`;
    //   const isIt = char.ref === userG;
    //   if (isIt) resetBtnSkill(char._activeSkill);
    //   // console.log(act.skill.name, char.actionSkill[act.skill.name])
    //   for (const as of char.forCheck?.[pos] || []) {
    //     as.active = false;
    //     char._activeSkill.add(as.name);
    //     // console.log(as)
    //   }
    //   if (isIt) resetBtnSkill(char._activeSkill);
    // }
    // char.action = action.filter((v) => v);
  }
}
function resetBtnSkill(obj) {
  const as = controlUIUX.battleSkillsButton;
  for (const name of teamG.user._activeSkill) {
    as[name].classList.toggle("unable");
  }
}

function loadKeypadSetting() {
  const tab = document.querySelector(".settingTab.keypad");
  const table = document.createElement("table");

  const headerRow = document.createElement("tr");
  headerRow.innerHTML = "<th>Key</th><th>Skill</th>";
  table.appendChild(headerRow);

  Object.keys(skillsku).forEach((key, i) => {
    const row = document.createElement("tr");
    const skill = keySkill[key];
    const tdl = document.createElement("td");
    tdl.textContent = key;
    const tdr = document.createElement("td");
    const skc = document.createElement("div");
    skc.className = "setingKeyControl";
    skc.textContent = skillsku[key].key;
    skc.addEventListener("click", (el) => {
      const ele = document.querySelector(".settingKeyChoose");
      ele.style.display = "block";
      kpc.element = el.target;
      kpc.keypadMode = "settingKeypad";
      kpc.onEdit = key;
      console.log(kpc);
    });
    tdr.appendChild(skc);
    row.appendChild(tdl);
    row.appendChild(tdr);
    // row.innerHTML = `<td>${key}</td><td><div class="setingKeyControl">${skillsku[key].key}</div></td>`;
    table.appendChild(row);
  });

  tab.appendChild(table);
}

const kpc = {
  keypadMode: "battle",
  onEdit: "",
  element: null,
};
const keySkill = {};
Object.entries(skillsku).forEach(([skill, info]) => {
  keySkill[info.key] = skill;
});
// const keypad = Object.keys(keySkill);
let keypad = Object.entries(keySkill)
  .filter(([_, value]) => value)
  .map(([key]) => key);

loadKeypadSetting();
teamG["user"] = chooseFightT("user");
enemyG["antiUser"] = chooseFightT("antiUser");
