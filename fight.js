function spawnSkillShowEach(skill, self, pos, isTeam, psuedo, target) {
  // console.log(skill)
  const el = document.createElement("div");
  el.className = "skill-show";
  el.style.backgroundColor = isTeam ? skill.ref.color : "rgb(40,40,40)";
  el.style.top = isTeam ? "55%" : "5%";
  el.style.transform = `translateX(calc((25dvw * ${pos})))`;
  self.action.add({
    pos,
    skill,
    isPsuedo: psuedo,
    target,
    el,
  });
  // console.log(el);
  document.getElementById("main").prepend(el);
}

function spawnSkillShow(skill, self, sideB, target) {
  // console.log(...arguments)
  // if (!userAbility.isOnIn(self, skill)) return;
  // const s = skillsku[skill];
  // console.log(skill);
  const t = AllTE(self),
    s = t.actionSkill[skill],
    ref = s.ref;
  if (t.cooldown) t.cooldown[skill] = ref.cooldown;
    // console.log(t)
  const pos = ref.pos || [];
  for (let i = 0; i < pos.length; i++)
    spawnSkillShowEach(s, t, pos[i], sideB, false, target);
  const pseudo = ref.psuedoPos || []; // sesuai nama property Anda
  for (let i = 0; i < pseudo.length; i++)
    spawnSkillShowEach(s, t, pseudo[i], sideB, true, target);
}

enemyFightAI(rng);
// setInterval(() => {
//   FightMoCh(Object.values(teamG));
//   FightMoCh(Object.values(enemyG));
//   enemyFightAI(rng);
// }, 2000);

document.addEventListener("keydown", (e) => {
  if (e.key == "b") {
    resetBtnSkill();
    FightMoCh(Object.values(teamG));
    resetBtnSkill();
    FightMoCh(Object.values(enemyG));
    enemyFightAI(rng);

    fightSystem(teamG, enemyG);
  }
});

function enemyFightAI(r) {
  // console.log(enemyG.antiUser);
  const au = enemyG.antiUser;
  const antiUser = au.ref;
  const as = au.actionSkill;
  // console.log(as)
  // console.log(au._activeSkill)
  const arrSkill = antiUser.skills.filter((a) => as[a].isOn());
  // console.log(arrSkill);
  if (arrSkill.length <= 0) return;
  spawnSkillShow(
    r.rmI(antiUser.skills.filter((a) => as[a].isOn())),
    antiUser.name,
    false,
  );
}

function fightSystem(team, enemy) {
  actionTeam = [...Object.values(team).filter(a=>a.ActionInActive), ...Object.values(enemy).filter(a=>a.ActionInActive)];
  actionTeam.sort((a, b) => b.ActionInActive.speed - a.ActionInActive.speed);
  console.log(actionTeam);

  // console.log(Array(...document.querySelectorAll(".skill-show[data-pos='0'][data-side-b ='enemy']")).map(el => el?.dataset));
}
