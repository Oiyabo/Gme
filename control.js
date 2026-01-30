document.addEventListener("keydown", ({ key }) => {
  if (kpc.keypadMode == "battle") {
    if (!keypad.includes(key)) return;
    spawnSkillShow(keySkill[key], team.user.name, true);
    userAbility.click = false;
  } else if (kpc.keypadMode == "settingKeypad") {
    const kk = teamG.user.actionSkill[kpc.onEdit].key;
    keySkill[kk] = "";
    kk.key = key;
    keySkill[key] = kpc.onEdit;
    keypad = Object.entries(keySkill)
      .filter(([_, value]) => value)
      .map(([key]) => key);
    kpc.element.textContent = key;
    kpc.onEdit = "";
    kpc.element = null;
    kpc.keypadMode = "battle";
    document.querySelector(".settingKeyChoose").style.display = "none";
  }
});

document.querySelector("#settingButton").addEventListener("click", (el) => {
  const tab = document.querySelector(".settingTab.main");
  if (tab.style.display === "none") tab.style.display = "flex";
  else
    document
      .querySelectorAll(".settingTab")
      .forEach((t) => (t.style.display = "none"));
});

document
  .querySelector(".settingKids.keypad")
  .addEventListener("click", (el) => {
    const tab = document.querySelector(".settingTab.keypad");
    tab.style.display = tab.style.display === "flex" ? "none" : "flex";
  });

document
  .querySelector(".settingKeyChoose")
  .addEventListener("click", (el) => (el.target.style.display = "none"));

const userG = namedNPC.user;
// console.log(controlUIUX.battleSkillsButton)
Object.entries(controlUIUX.battleSkillsButton).forEach(([name, skill]) => {
  skill.addEventListener("click", () => {
    if (!teamG.user.actionSkill[name].active) return;
    spawnSkillShow(skill.dataset.skill, userG.name, true);
    // userAbility.click = false;
  });
});
