/* global ngapp, xelib, registerPatcher */
let knownDeathItemsAnimals, knownDeathItemsMonsters;
let forbiddenFactions = ['DLC1VampireFaction', 'DLC2AshSpawnFaction', 'DragonPriestFaction', 'DraugrFaction', 'DwarvenAutomatonFaction', 'IceWraithFaction', 'SoulCairnFaction', 'VampireFaction', 'WispFaction'];
let allowedVoice = ['CrBearVoice', 'CrChickenVoice', 'CrCowVoice', 'CrDeerVoice', 'CrDogVoice', 'CrDogHusky', 'CrFoxVoice', 'CrGoatVoice', 'CrHareVoice', 'CrHorkerVoice', 'CrHorseVoice', 'CrMammothVoice', 'CrMudcrabVoice', 'CrSabreCatVoice', 'CrSkeeverVoice', 'CrSlaughterfishVoice', 'CrWolfVoice', 'DLC2CrBristlebackVoice', 'CrChaurusVoice', 'CrFrostbiteSpiderVoice', 'CrFrostbiteSpiderGiantVoice', 'CrSprigganVoice', 'CrTrollVoice', 'CrWerewolfVoice', 'CrDragonVoice', 'CrChaurusInsectVoice'];
let animalTypes = ['Skip', 'Bear', 'Bear, Cave', 'Bear, Snow', 'Bristleback', 'Chaurus', 'Chaurus, Hunter', 'Chicken', 'Cow', 'Deer', 'Deer, Vale', 'Dog', 'Dragon', 'Elk, Female', 'Elk, Male', 'Fox', 'Fox, Snow', 'Goat', 'Hare', 'Horker', 'Horse', 'Mammoth', 'MudCrab, Small', 'MudCrab, Large', 'MudCrab, Giant', 'Sabrecat', 'Sabrecat, Vale', 'Skeever', 'Slaughterfish', 'Spider, Frostbite', 'Spider, Giant Frostbite', 'Spriggan', 'Spriggan, Burnt', 'Troll', 'Troll, Frost', 'Werebear', 'Werewolf', 'Wolf', 'Wolf, Ice'];
let deathItemNameMatch = ['Werebear', 'Bear', 'BearCave', 'BearSnow', 'Bristleback', 'Chaurus', 'CharusHunter', 'Chicken', 'Cow', 'DeerVale', 'Deer', 'Dog', 'Dragon', 'ElkFemale', 'ElkMale', 'FoxIce', 'Fox', 'FrostbiteSpiderGiant', 'FrostbiteSpider', 'Goat', 'Hare', 'Horker', 'Horse', 'Mammoth', 'MudCrab01', 'MudCrab02', 'MudCrab03', 'SabrecatSnow', 'SabrecatVale', 'Sabrecat', 'Skeever', 'Slaughterfish', 'Spriggan', 'SprigganBurnt', 'TrollFrost', 'Troll', 'Werewolf', 'WolfIce', 'Wolf'];
let monsterTypes = ['Chaurus', 'CharusHunter', 'Dragon', 'FrostbiteSpider', 'FrostbiteSpiderGiant', 'Spriggan', 'SprigganBurnt', 'Troll', 'TrollFrost', 'Werebear', 'Werewolf'];
let blacklistedRecords = ['HISLCBlackWolf', 'BSKEncRat'];
let blacklistedDeathItems = ['DLC1DeathItemDragon06', 'DLC1DeathItemDragon07', 'DeathItemDragonBonesOnly', 'DeathItemVampire', '_00DeathItemDramanBossSpecial', 'DeathItemForsworn'];
let cobjRecords = {};
let flstRecords = {};
let lvliRecords = {};
let miscRecords = {};
let alchRecords = {};
let qustRecords = {};
let Pelts = {};
let DefaultPelt = {};
let CheckPatchesRunOnce = false;

let debugging = true;

let fixedAnimalTypes = {
  'Bear, Cave': 'BearCave',
  'Bear, Snow': 'BearSnow',
  'Chaurus, Hunter': 'CharusHunter',
  'Elk, Female': 'ElkFemale',
  'Elk, Male': 'ElkMale',
  'Fox, Snow': 'FoxIce',
  'MudCrab, Small': 'MudCrab01',
  'MudCrab, Large': 'MudCrab02',
  'MudCrab, Giant': 'MudCrab03',
  'Sabrecat, Snow': 'SabrecatSnow',
  'Spider, Frostbite': 'FrostbiteSpider',
  'Spider, Giant Frostbite': 'FrostbiteSpiderGiant',
  'Spriggan, Burnt': 'SprigganBurnt',
  'Deer, Vale': 'DeerVale',
  'Sabrecat, Vale': 'SabrecatVale',
  'Wolf, Ice': 'WolfIce',
  'Troll, Frost': 'TrollFrost'
};

let animalTypeIndex = {
  'Bear': 0,
  'BearCave': 1,
  'BearSnow': 2,
  'Chicken': 3,
  'Cow': 4,
  'Deer': 5,
  'Dog': 6,
  'ElkFemale': 7,
  'ElkMale': 8,
  'Fox': 9,
  'FoxIce': 10,
  'Goat': 11,
  'Hare': 12,
  'Horker': 13,
  'Horse': 14,
  'Mammoth': 15,
  'MudCrab01': 16,
  'MudCrab02': 17,
  'MudCrab03': 18,
  'Sabrecat': 19,
  'SabrecatSnow': 20,
  'Skeever': 21,
  'Slaughterfish': 22,
  'Wolf': 23,
  'WolfIce': 24,
  'DeerVale': 25,
  'SabrecatVale': 26,
  'Bristleback': 27,
  'Chaurus': 0,
  'FrostbiteSpider': 1,
  'FrostbiteSpiderGiant': 2,
  'Spriggan': 3,
  'Troll': 4,
  'TrollFrost': 5,
  'Werewolf': 6,
  'Dragon': 7,
  'CharusHunter': 8,
  'Werebear': 9,
  'SprigganBurnt': 10
};

let vanillaToCaco = {
  '_DS_Food_Raw_Bear': 'CACO_FoodMeatBear',
  '_DS_Food_Raw_Chaurus': 'CACO_FoodMeatChaurusMeat',
  '_DS_Food_Raw_Dragon': '_DS_Food_Raw_Dragon',
  '_DS_Food_Raw_Elk': 'FoodMeatVenison',
  '_DS_Food_Raw_Fox': 'CACO_FoodMeatFox',
  '_DS_Food_Raw_Goat': 'CACO_FoodMeatGoatPortionRaw',
  '_DS_Food_Raw_Hare': '_DS_Food_Raw_Hare',
  '_DS_Food_Raw_Mammoth': 'CACO_FoodMeatMammoth',
  '_DS_Food_Raw_Mudcrab': '_DS_Food_Raw_Mudcrab',
  '_DS_Food_Raw_Sabrecat': 'CACO_FoodMeatSabre',
  '_DS_Food_Raw_Skeever': 'CACO_FoodMeatSkeeverRaw',
  '_DS_Food_Raw_Slaughterfish': 'CACO_FoodSeaSlaughterfishRaw',
  '_DS_Food_Raw_Spider': '_DS_Food_Raw_Spider',
  '_DS_Food_Raw_Troll': 'CACO_FoodMeatTroll',
  '_DS_Food_Raw_Wolf': 'FoodDogMeat',
  'FoodBeef': 'FoodBeef',
  'FoodChicken': 'FoodChicken',
  'FoodClamMeat': 'FoodClamMeat',
  'FoodDogMeat': 'FoodDogMeat',
  'FoodGoatMeat': 'FoodGoatMeat',
  'FoodHorkerMeat': 'FoodHorkerMeat',
  'FoodHorseMeat': 'FoodHorseMeat',
  'FoodMammothMeat': 'FoodMammothMeat',
  'FoodPheasant': 'FoodPheasant',
  'FoodRabbit': 'FoodRabbit',
  'FoodSalmon': 'FoodSalmon',
  'FoodVenison': 'FoodVenison',
  'DLC2FoodAshHopperMeat': 'DLC2FoodAshHopperMeat',
  'DLC2FoodAshHopperLeg': 'DLC2FoodAshHopperLeg',
  'DLC2FoodBoarMeat': 'DLC2FoodBoarMeat',
  'HumanFlesh': 'CACO_FoodMeatHumanoidFlesh'
};

let loadKnownDeathItemsAnimals = function () {
  let elements = xelib.GetElements(flstRecords['_DS_FL_DeathItems'], 'FormIDs');
  knownDeathItemsAnimals = elements.map(element => xelib.GetValue(element));
};

let loadKnownDeathItemsMonsters = function () {
  let elements = xelib.GetElements(flstRecords['_DS_FL_DeathItems_Monsters'], 'FormIDs');
  knownDeathItemsMonsters = elements.map(element => xelib.GetValue(element));
};

let hasFaction = function (rec, factions) {
  if (!xelib.HasElement(rec, 'Factions'))
    return;
  let elements = xelib.GetElements(rec, 'Factions'),
  recordFactions = elements.map(element => xelib.GetRefEditorID(element, 'Faction'));
  return !!recordFactions.find(faction => factions.includes(faction));
};

let hasVoice = function (rec, voices) {
  if (!xelib.HasElement(rec, 'VTCK'))
    return;
  let element = xelib.GetRefEditorID(rec, 'VTCK');
  return !!voices.includes(element);
};

let isCreature = function (rec) {
  let deathItem = xelib.GetValue(rec, 'INAM');
  return (!hasFaction(rec, forbiddenFactions) &&
    hasVoice(rec, allowedVoice) &&
    !(knownDeathItemsAnimals.includes(deathItem) ||
      knownDeathItemsMonsters.includes(deathItem)) &&
    xelib.GetValue(rec, 'INAM') != '' &&
    !blacklistedRecords.includes(xelib.EditorID(rec)) &&
    !blacklistedDeathItems.includes(deathItem.replace(/\s\[.*\]/, '')));
};

let getElementFileName = function (rec) {
  return xelib.WithHandle(xelib.GetElementFile(rec), file => {
    return xelib.Name(file);
  });
};

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

let cacheRecords = function (cache, sig) {
  xelib.GetRecords(0, sig).forEach(rec => {
    let edid = xelib.EditorID(rec);
    cache[edid] = xelib.GetWinningOverride(rec);
  });
};

let BuildPeltRecords = function () {
  xelib.GetElements(0, "Hunterborn.esp\\FLST\\_DS_FL_PeltLists\\FormIDs").forEach((value, index) => {
    if (xelib.HasElement(xelib.GetLinksTo(value), "FormIDs")) {
      let testing = xelib.GetElements(xelib.GetLinksTo(value), "FormIDs")
        Pelts[xelib.FullName(xelib.GetLinksTo(testing[1]))] = {};
      DefaultPelt[xelib.FullName(xelib.GetLinksTo(testing[1]))] = {};
      testing.forEach((value, index) => {
        Pelts[xelib.FullName(xelib.GetLinksTo(testing[1]))][index] = xelib.GetWinningOverride(xelib.GetLinksTo(testing[index]));
        DefaultPelt[xelib.FullName(xelib.GetLinksTo(testing[1]))][index] = xelib.GetWinningOverride(xelib.GetLinksTo(testing[index]));
      })
    }
  });
  xelib.GetElements(0, "Hunterborn.esp\\FLST\\_DS_FL_PeltLists_Monsters\\FormIDs").forEach((value, index) => {
    if (xelib.HasElement(xelib.GetLinksTo(value), "FormIDs")) {
      let testing = xelib.GetElements(xelib.GetLinksTo(value), "FormIDs")
        Pelts[xelib.FullName(xelib.GetLinksTo(testing[1]))] = {};
      DefaultPelt[xelib.FullName(xelib.GetLinksTo(testing[1]))] = {};
      testing.forEach((value, index) => {
        Pelts[xelib.FullName(xelib.GetLinksTo(testing[1]))][index] = xelib.GetWinningOverride(xelib.GetLinksTo(testing[index]));
        DefaultPelt[xelib.FullName(xelib.GetLinksTo(testing[1]))][index] = xelib.GetWinningOverride(xelib.GetLinksTo(testing[index]));
      })
    }
  });
};

let buildDeathItem = function (deathItems, rec) {
  let name = xelib.LongName(rec),
  editorID = xelib.EditorID(rec),
  filename = getElementFileName(rec),
  deathItem = xelib.GetRefEditorID(rec, 'INAM');
  if (!name || !isCreature(rec))
    return;
  if (!deathItems.hasOwnProperty(deathItem)) {
    for (let i = 0; i < deathItemNameMatch.length; i++) {
      let re = new RegExp(deathItemNameMatch[i], 'i');
      if (deathItem.match(/SpiderAlbino/i) != null) {
        deathItems[deathItem] = {
          animalType: 'Spider, Albino',
          npcs: []
        };
        break
      } else if (deathItem.match(re) != null) {
        let nameMatch = Object.keys(fixedAnimalTypes).find(key => fixedAnimalTypes[key] === deathItemNameMatch[i]);
        if (nameMatch == undefined)
          nameMatch = deathItemNameMatch[i];
        deathItems[deathItem] = {
          animalType: nameMatch,
          npcs: []
        };
        break;
      } else if (deathItem.match(/Elk/i) != null) {
        deathItems[deathItem] = {
          animalType: 'Elk, Male',
          npcs: []
        };
        break;
      } else if (deathItem.match(/MudCrab/i) != null) {
        deathItems[deathItem] = {
          animalType: 'MudCrab, Large',
          npcs: []
        };
        break;
      } else
        deathItems[deathItem] = {
          animalType: 'Skip',
          npcs: []
        };
    }
    if (deathItem.match(/Spider/i) != null && deathItems[deathItem].animalType == 'Skip') {
      deathItems[deathItem] = {
        animalType: 'Spider, Frostbite',
        npcs: []
      };
    }
  }
  let foundNpc = deathItems[deathItem].npcs.find(npc => {
    return npc.path === editorID && npc.filename === filename;
  });
  if (!foundNpc)
    deathItems[deathItem].npcs.push({
      name: name,
      path: editorID,
      filename: filename,
      showNPCS: false
    });
};

let CreateStandardRecords = function (patch) {
  qustRecords["_DS_Hunterborn"] = xelib.CopyElement(xelib.GetWinningOverride(xelib.GetElement(0, "Hunterborn.esp\\QUST\\_DS_Hunterborn")), patch);
  flstRecords["_DS_FL_CarcassObjects"] = xelib.CopyElement(flstRecords["_DS_FL_CarcassObjects"], patch);
  flstRecords["_DS_FL_PeltLists"] = xelib.CopyElement(flstRecords["_DS_FL_PeltLists"], patch);
  flstRecords["_DS_FL_Mats__Lists"] = xelib.CopyElement(flstRecords["_DS_FL_Mats__Lists"], patch);
  flstRecords["_DS_FL_DeathItems"] = xelib.CopyElement(flstRecords["_DS_FL_DeathItems"], patch);
  flstRecords["_DS_FL_DeathItemTokens"] = xelib.CopyElement(flstRecords["_DS_FL_DeathItemTokens"], patch);
  flstRecords["_DS_FL_DeathItems_Monsters"] = xelib.CopyElement(flstRecords["_DS_FL_DeathItems_Monsters"], patch);
  flstRecords["_DS_FL_DeathItemTokens_Monsters"] = xelib.CopyElement(flstRecords["_DS_FL_DeathItemTokens_Monsters"], patch);
  flstRecords["_DS_FL_PeltLists_Monsters"] = xelib.CopyElement(flstRecords["_DS_FL_PeltLists_Monsters"], patch);
  flstRecords["_DS_FL_Mats__Lists_Monsters"] = xelib.CopyElement(flstRecords["_DS_FL_Mats__Lists_Monsters"], patch);
  flstRecords["_DS_FL_Mats__Perfect"] = xelib.CopyElement(flstRecords["_DS_FL_Mats__Perfect"], patch);
  flstRecords["_DS_FL_Mats__Perfect_Monsters"] = xelib.CopyElement(flstRecords["_DS_FL_Mats__Perfect_Monsters"], patch);
};

let CreateToken = function (animalType, animalRecord, patch) {
  if (miscRecords.hasOwnProperty(`_DS_DI${animalType}`)) {
    Token = xelib.CopyElement(miscRecords[`_DS_DI${animalType}`], patch, true);
    xelib.SetValue(Token, 'EDID', xelib.EditorID(Token).replace(animalType.replace('Crab', 'crab'), animalRecord));
    xelib.SetValue(Token, 'FULL', xelib.FullName(Token).replace(animalType.replace(/Crab(0.)/, 'crab $1').replace('Elk ', 'Elk'), animalRecord));
    let edid = xelib.EditorID(Token);
    miscRecords[edid] = Token;

    if (!monsterTypes.includes(animalType)) {
      let DeathItemTokenFL = flstRecords["_DS_FL_DeathItemTokens"];
      xelib.AddFormID(DeathItemTokenFL, xelib.GetValue(Token));
    } else {
      let DeathItemTokenFL = flstRecords["_DS_FL_DeathItemTokens_Monsters"];
      xelib.AddFormID(DeathItemTokenFL, xelib.GetValue(Token));
    }
  } else {
    Token = xelib.CopyElement(miscRecords['_DS_DICow'], patch, true);
    xelib.SetValue(Token, 'EDID', xelib.EditorID(Token).replace("Cow", animalRecord));
    xelib.SetValue(Token, 'FULL', xelib.FullName(Token).replace("Cow", animalRecord));
    let edid = xelib.EditorID(Token);
    miscRecords[edid] = Token;

    if (!monsterTypes.includes(animalType)) {
      let DeathItemTokenFL = flstRecords["_DS_FL_DeathItemTokens"];
      xelib.AddFormID(DeathItemTokenFL, xelib.GetValue(Token));
    } else {
      xelib.RemoveKeyword(Token, '_DS_KW_AnimalToken');
      xelib.AddKeyword(Token, '_DS_KW_MonsterToken');
      let DeathItemTokenFL = flstRecords["_DS_FL_DeathItemTokens_Monsters"];
      xelib.AddFormID(DeathItemTokenFL, xelib.GetValue(Token));
    }
  }
};

let CreateCarcass = function (animalType, animalRecord, npc, jsonRecord, patch) {
  Carcass = null;
  if (miscRecords.hasOwnProperty(`_DS_CarcassFresh_${animalType}`) && !monsterTypes.includes(animalType)) {
    Carcass = xelib.CopyElement(miscRecords[`_DS_CarcassFresh_${animalType}`], patch, true);
    xelib.SetValue(Carcass, 'EDID', xelib.EditorID(Carcass).replace(animalType, animalRecord));
    xelib.SetValue(Carcass, 'FULL', xelib.FullName(Carcass).replace(animalType.replace('Sabrecat', 'Sabre Cat').replace(/Crab(0.)/, 'crab').replace('Elk ', 'Elk'), xelib.FullName(npc)));
    let edid = xelib.EditorID(Carcass);
    miscRecords[edid] = Carcass;
    xelib.AddFormID(flstRecords["_DS_FL_CarcassObjects"], xelib.GetValue(Carcass));
  } else if (!monsterTypes.includes(animalType)) {
    Carcass = xelib.CopyElement(miscRecords['_DS_CarcassFresh_Cow'], patch, true);
    xelib.SetValue(Carcass, 'EDID', xelib.EditorID(Carcass).replace("Cow", animalRecord));
    let fullName = "";
    if (jsonRecord.properName != "") {
      fullName = jsonRecord.properName;
    } else {
      fullName = xelib.FullName(npc);
    }
    xelib.SetValue(Carcass, 'FULL', xelib.FullName(Carcass).replace("Cow", fullName));
    xelib.SetValue(Carcass, 'Model\\MODL', "Clutter\\Containers\\MiscSackLarge.nif");
    xelib.SetValue(Carcass, 'DATA\\Value', jsonRecord.carcassValue);
    xelib.SetValue(Carcass, 'DATA\\Weight', jsonRecord.carcassWeight);
    let edid = xelib.EditorID(Carcass);
    miscRecords[edid] = Carcass;
    xelib.AddFormID(flstRecords["_DS_FL_CarcassObjects"], xelib.GetValue(Carcass));
  }
  return Carcass;
};

let CreateMats = function (animalType, animalRecord, jsonRecord, patch) {
  if (flstRecords.hasOwnProperty(`_DS_FL_Mats_${animalType}`)) {
    let oldEdid = xelib.EditorID(flstRecords[`_DS_FL_Mats_${animalType}`]);
    let formList = xelib.CopyElement(flstRecords[`_DS_FL_Mats_${animalType}`], patch, true);
    xelib.SetValue(formList, 'EDID', oldEdid.replace(animalType, animalRecord));
    if (!monsterTypes.includes(animalType)) {
      xelib.AddFormID(flstRecords["_DS_FL_Mats__Lists"], xelib.GetValue(formList));
    } else {
      xelib.AddFormID(flstRecords["_DS_FL_Mats__Lists_Monsters"], xelib.GetValue(formList));
    }
  } else {
    let oldEdid = xelib.EditorID(flstRecords['_DS_FL_Mats_Cow']);
    formList = xelib.CopyElement(flstRecords['_DS_FL_Mats_Cow'], patch, true);
    xelib.SetValue(formList, 'EDID', oldEdid.replace("Cow", animalRecord));
    xelib.RemoveElement(formList, 'FormIDs');
    if (!monsterTypes.includes(animalType)) {
      xelib.AddFormID(flstRecords["_DS_FL_Mats__Lists"], xelib.GetValue(formList));
    } else {
      xelib.AddFormID(flstRecords["_DS_FL_Mats__Lists_Monsters"], xelib.GetValue(formList));
    }
    Object.keys(jsonRecord.mats).forEach(key => {
      let MatsLvl = xelib.CopyElement(lvliRecords['_DS_LI_Mats_Cow_00'], patch, true);
      xelib.SetValue(MatsLvl, 'EDID', `_DS_LI_Mats_${animalRecord}_0${key}`);
      let edid = xelib.EditorID(MatsLvl);
      lvliRecords[edid] = MatsLvl;
      xelib.AddFormID(formList, xelib.LongName(MatsLvl));
      xelib.RemoveElement(MatsLvl, 'Leveled List Entries');
      let value = jsonRecord.mats[key];
      Object.keys(value).forEach(key2 => {
        let value2 = value[key2];
        if (xelib.FileByName('Hunterborn_CACO-SE_Patch.esp') > 0 || cobjRecords.hasOwnProperty(`HB_CACO_RecipeJerkyHare`)) {
          key2 = vanillaToCaco[key2] || key2;
        }
        xelib.AddLeveledEntry(MatsLvl, key2, "1", value2.toString());
      });
    });
  }
};

let GetDefaultPelt = function (npc) {
  let deathItem = xelib.GetLinksTo(npc, 'INAM');
  if (!deathItem)
    return;
  let winningDeathItem = xelib.GetWinningOverride(deathItem);
  let deathItemArray = xelib.GetElements(winningDeathItem, 'Leveled List Entries');
  let entry = deathItemArray.find(function (item) {
    let testItem = xelib.GetRefEditorID(item, 'LVLO\\Reference');
    return (/Pelt|Hide|Skin|Fur|Wool|Leather/i.test(testItem) && !(/LVLI/.test(xelib.GetValue(item, "LVLO\\Reference"))));
  });
  if (entry)
    return xelib.GetLinksTo(entry, 'LVLO\\Reference');
};

let TweakPelts = function (Pelts, DefaultPelt) {
  let DefaultPeltValue = xelib.GetValue(DefaultPelt, 'DATA - Data\\Value');
  if (Pelts[xelib.FullName(DefaultPelt)][0]) {
    xelib.SetValue(Pelts[xelib.FullName(DefaultPelt)][0], 'FULL', `${xelib.FullName(DefaultPelt)} (Poor)`);
    xelib.SetValue(Pelts[xelib.FullName(DefaultPelt)][0], 'DATA - Data\\Value', (Math.round(DefaultPeltValue / 2)).toString());
    miscRecords[`${xelib.FullName(DefaultPelt)} (Poor)`] = xelib.GetWinningOverride(Pelts[xelib.FullName(DefaultPelt)][0]);
  }
  if (Pelts[xelib.FullName(DefaultPelt)][2]) {
    xelib.SetValue(Pelts[xelib.FullName(DefaultPelt)][2], 'FULL', `${xelib.FullName(DefaultPelt)} (Fine)`);
    xelib.SetValue(Pelts[xelib.FullName(DefaultPelt)][2], 'DATA - Data\\Value', (Math.round(DefaultPeltValue * 2)).toString());
    miscRecords[`${xelib.FullName(DefaultPelt)} (Fine)`] = xelib.GetWinningOverride(Pelts[xelib.FullName(DefaultPelt)][2]);
  }
  if (Pelts[xelib.FullName(DefaultPelt)][3]) {
    xelib.SetValue(Pelts[xelib.FullName(DefaultPelt)][3], 'FULL', `${xelib.FullName(DefaultPelt)} (Flawless)`);
    xelib.SetValue(Pelts[xelib.FullName(DefaultPelt)][3], 'DATA - Data\\Value', (Math.round(DefaultPeltValue * 20)).toString());
    miscRecords[`${xelib.FullName(DefaultPelt)} (Flawless)`] = xelib.GetWinningOverride(Pelts[xelib.FullName(DefaultPelt)][3]);
  }
};

let CreatePelts = function (Pelts, Carcass, animalType, animalRecord, aiIndex, npc, patch) {
  if (flstRecords.hasOwnProperty(`_DS_FL_Pelts${animalType}`)) {
    let oldEdid = xelib.EditorID(flstRecords[`_DS_FL_Pelts${animalType}`]);
    PeltsFL = xelib.CopyElement(flstRecords[`_DS_FL_Pelts${animalType}`], patch, true);
    xelib.SetValue(PeltsFL, 'EDID', oldEdid.replace(animalType, animalRecord));
    let edid = xelib.EditorID(PeltsFL);
    flstRecords[edid] = PeltsFL;
  } else {
    let oldEdid = xelib.EditorID(flstRecords[`_DS_FL_PeltsCow`]);
    PeltsFL = xelib.CopyElement(flstRecords[`_DS_FL_PeltsCow`], patch, true);
    xelib.SetValue(PeltsFL, 'EDID', oldEdid.replace("Cow", animalRecord));
    let edid = xelib.EditorID(PeltsFL);
    flstRecords[edid] = PeltsFL;
  }
  if (!monsterTypes.includes(animalType)) {
    xelib.AddFormID(flstRecords["_DS_FL_PeltLists"], xelib.GetValue(PeltsFL));
  } else {
    xelib.AddFormID(flstRecords["_DS_FL_PeltLists_Monsters"], xelib.GetValue(PeltsFL));
  }
  if (GetDefaultPelt(npc) != undefined) {
    let peltTemp = xelib.GetWinningOverride(GetDefaultPelt(npc));
    if (!Pelts.hasOwnProperty(xelib.FullName(peltTemp))) {
      Pelts[xelib.FullName(peltTemp)] = {};
      xelib.GetElements(PeltsFL, 'FormIDs').forEach((pelt, index) => {
        if (index == 1) {
          Pelts[xelib.FullName(peltTemp)][index] = peltTemp;
        } else {
          Pelts[xelib.FullName(peltTemp)][index] = (xelib.CopyElement(peltTemp, patch, true));
          xelib.SetValue(Pelts[xelib.FullName(peltTemp)][index], 'EDID', `_DS_Pelt_${animalRecord}_0${index}`);
        }
        let edid = xelib.EditorID(Pelts[xelib.FullName(peltTemp)][index]);
        flstRecords[edid] = Pelts[xelib.FullName(peltTemp)][index];
        xelib.SetValue(PeltsFL, `FormIDs\\[${index}]`, xelib.LongName(Pelts[xelib.FullName(peltTemp)][index]));
      });
      TweakPelts(Pelts, peltTemp);
    } else {
      for (let index = 0; index < 4; index++) {
        xelib.SetValue(PeltsFL, `FormIDs\\[${index}]`, xelib.LongName(Pelts[xelib.FullName(peltTemp)][index]));
      };
    }

    if (!monsterTypes.includes(animalType) && xelib.HasElement(Pelts[xelib.FullName(peltTemp)][1], 'Model')) {
      DefaultPeltModel = xelib.GetElement(Pelts[xelib.FullName(peltTemp)][1], 'Model');
      xelib.CopyElement(DefaultPeltModel, Carcass);
    }
  } else {
    xelib.RemoveElement(PeltsFL, 'FormIDs');
  }
};

let CreateNewDeathItem = function (animalType, animalRecord, npc, jsonRecord, patch) {
  if (lvliRecords.hasOwnProperty(`_DS_DeathItem_${animalType.replace(/0[123]|Female|Male/i,'')}`)) {
    NewDeathItem = xelib.CopyElement(lvliRecords[`_DS_DeathItem_${animalType.replace(/0[123]|Female|Male/i,'')}`], patch, true);
    let oldEdid = xelib.EditorID(NewDeathItem);
    xelib.SetValue(NewDeathItem, 'EDID', oldEdid.replace(animalType.replace(/0[123]|Female|Male/i, ''), animalRecord));
    let edid = xelib.EditorID(NewDeathItem);
    lvliRecords[edid] = NewDeathItem;
  } else {
    NewDeathItem = xelib.CopyElement(lvliRecords[`_DS_DeathItem_Cow`], patch, true);
    let oldEdid = xelib.EditorID(NewDeathItem);
    xelib.SetValue(NewDeathItem, 'EDID', oldEdid.replace("Cow", animalRecord));
    let edid = xelib.EditorID(NewDeathItem);
    lvliRecords[edid] = NewDeathItem;
    xelib.RemoveElement(NewDeathItem, 'Leveled List Entries');
    if (GetDefaultPelt(npc) != undefined)
      xelib.AddLeveledEntry(NewDeathItem, "_DS_Token_Pelt", "1", "1");
    if (jsonRecord.type == "animal")
      xelib.AddLeveledEntry(NewDeathItem, "_DS_Token_Carcass_Clean", "1", "1");
    if (jsonRecord.mats.length != 0)
      xelib.AddLeveledEntry(NewDeathItem, "_DS_Token_Mat", "1", "1");
    if (jsonRecord.meat != "") {
      xelib.AddLeveledEntry(NewDeathItem, "_DS_Token_Meat", "1", "1");
      xelib.AddLeveledEntry(NewDeathItem, "_DS_Token_Meat_Fresh", "1", "1");
    }
    if (jsonRecord.type == "monster" && jsonRecord.venom != "")
      xelib.AddLeveledEntry(NewDeathItem, "_DS_Token_Venom", "1", "1");
    if (jsonRecord.type == "monster" && jsonRecord.bloodType != "")
      xelib.AddLeveledEntry(NewDeathItem, "_DS_Token_Blood", "1", "1");
  }

  if (!monsterTypes.includes(animalType)) {
    xelib.AddFormID(flstRecords["_DS_FL_DeathItems"], xelib.GetValue(npc, 'INAM'));
    DeathItemLIArray = xelib.GetScript(qustRecords["_DS_Hunterborn"], "_DS_HB_Animals");
  } else {
    xelib.AddFormID(flstRecords["_DS_FL_DeathItems_Monsters"], xelib.GetValue(npc, 'INAM'));
    DeathItemLIArray = xelib.GetScript(qustRecords["_DS_Hunterborn"], "_DS_HB_Monsters");
  }
  let DeathItemLIArrayProperty = xelib.GetScriptProperty(DeathItemLIArray, "DeathItemLI");
  let newform = xelib.AddArrayItem(DeathItemLIArrayProperty, "Value\\Array of Object", "Object v2\\FormID", xelib.GetValue(NewDeathItem));
  xelib.SetValue(newform, "Object v2\\Alias", "None");
};

let CreatePerfectMats = function (animalType, animalRecord, patch) {
  if (lvliRecords.hasOwnProperty(`_DS_LI_Mats_Perfect_${animalType}`)) {
    PerfectMats = xelib.CopyElement(lvliRecords[`_DS_LI_Mats_Perfect_${animalType}`], patch, true);
    let oldEdid = xelib.EditorID(PerfectMats);
    xelib.SetValue(PerfectMats, 'EDID', oldEdid.replace(animalType, animalRecord));
  } else {
    PerfectMats = xelib.CopyElement(lvliRecords[`_DS_LI_Mats_Perfect_Cow`], patch, true);
    let oldEdid = xelib.EditorID(PerfectMats);
    xelib.SetValue(PerfectMats, 'EDID', oldEdid.replace("Cow", animalRecord));
  }
  if (!monsterTypes.includes(animalType)) {
    xelib.AddFormID(flstRecords["_DS_FL_Mats__Perfect"], xelib.GetValue(PerfectMats));
  } else {
    xelib.AddFormID(flstRecords["_DS_FL_Mats__Perfect_Monsters"], xelib.GetValue(PerfectMats));
  }
};

let CreateRecipe1 = function (Recipes, peltArray, animalType, animalRecord, jsonRecord, patch, index) {
  if (cobjRecords.hasOwnProperty(`_DS_Recipe_Pelt_${animalType}_0${index}`) || cobjRecords.hasOwnProperty(`RecipeLeather${animalType}Hide`) || cobjRecords.hasOwnProperty(`RecipeLeather${animalType}Hide02`) || cobjRecords.hasOwnProperty(`DLC1RecipeLeather${animalType}Hide`)) {
    if (cobjRecords.hasOwnProperty(`_DS_Recipe_Pelt_${animalType}_0${index}`)) {
      Recipes[index] = xelib.CopyElement(cobjRecords[`_DS_Recipe_Pelt_${animalType}_0${index}`], patch, true);
      xelib.SetValue(Recipes[index], 'Conditions\\[4]\\CTDA - \\Parameter #1', xelib.LongName(peltArray[index]));
    } else {
      let oldRecipe = (cobjRecords[`RecipeLeather${animalType}Hide`] || cobjRecords[`RecipeLeather${animalType}Hide02`] || cobjRecords[`DLC1RecipeLeather${animalType}Hide`]);
      Recipes[index] = xelib.CopyElement(oldRecipe, patch, true);
      xelib.SetValue(Recipes[index], 'Conditions\\[3]\\CTDA - \\Parameter #1', xelib.LongName(peltArray[index]));
    }
    oldEdid = xelib.EditorID(Recipes[index]);
    xelib.SetValue(Recipes[index], 'EDID', oldEdid.replace(animalType, animalRecord));
  } else {
    Recipes[index] = xelib.CopyElement(cobjRecords[`_DS_Recipe_Pelt_Mammoth_0${index}`], patch, true);
    xelib.SetValue(Recipes[index], 'Conditions\\[4]\\CTDA - \\Parameter #1', xelib.LongName(peltArray[index]));
    oldEdid = xelib.EditorID(Recipes[index]);
    xelib.SetValue(Recipes[index], 'EDID', oldEdid.replace("Mammoth", animalRecord));
    xelib.SetValue(Recipes[index], 'NAM1', jsonRecord.peltCount[index]);
  }
  let edid = xelib.EditorID(Recipes[index]);
  cobjRecords[edid] = Recipes[index];
  xelib.SetValue(Recipes[index], 'Items\\[0]\\CNTO - Item\\Item', xelib.LongName(peltArray[index]));
  if (index == 1 && cobjRecords.hasOwnProperty(`RecipeLeatherGoatHide_TreeBark`)) {
    xelib.SetValue(Recipes[index], 'Items\\[1]\\CNTO - Item\\Item', '_DS_Misc_AnimalFat');
    xelib.SetValue(Recipes[index], 'Items\\[1]\\CNTO - Item\\Count', xelib.GetValue(Recipes[index], 'NAM1'));
  } else if (index == 2) {
    xelib.SetValue(Recipes[index], 'CNAM - Created Object', xelib.LongName(peltArray[1]));
  } else if (index == 3) {
    xelib.SetValue(Recipes[index], 'CNAM - Created Object', xelib.LongName(peltArray[index - 1]));
  }
};

let CreateRecipe2 = function (Recipes, peltArray, animalType, animalRecord, jsonRecord, patch, index1, index2) {
  if (cobjRecords.hasOwnProperty(`HB_Recipe_FurPlate_${animalType}_0${index1}`)) {
    Recipes[index2] = xelib.CopyElement(cobjRecords[`HB_Recipe_FurPlate_${animalType}_0${index1}`], patch, true);
    oldEdid = xelib.EditorID(Recipes[index2]);
    xelib.SetValue(Recipes[index2], 'EDID', oldEdid.replace(animalType, animalRecord));
    xelib.SetValue(Recipes[index2], 'Items\\[0]\\CNTO - Item\\Item', xelib.LongName(peltArray[index1]));
    xelib.SetValue(Recipes[index2], 'Conditions\\[4]\\CTDA - \\Parameter #1', xelib.LongName(peltArray[index1]));
  } else {
    Recipes[index2] = (xelib.CopyElement(cobjRecords[`HB_Recipe_FurPlate_Cow_0${index1}`], patch, true))
    oldEdid = xelib.EditorID(Recipes[index2]);
    xelib.SetValue(Recipes[index2], 'EDID', oldEdid.replace("Cow", animalRecord));
    xelib.SetValue(Recipes[index2], 'Items\\[0]\\CNTO - Item\\Item', xelib.LongName(peltArray[index1]));
    xelib.SetValue(Recipes[index2], 'Conditions\\[4]\\CTDA - \\Parameter #1', xelib.LongName(peltArray[index1]));
    xelib.SetValue(Recipes[index2], 'NAM1', jsonRecord.furPlateCount[index1]);
  }
  let edid = xelib.EditorID(Recipes[index2]);
  cobjRecords[edid] = Recipes[index2];
};

let CreateRecipe3 = function (Recipes, peltArray, animalType, animalRecord, jsonRecord, patch, index) {
  if (cobjRecords.hasOwnProperty(`RecipeLeatherGoatHide_TreeBark`)) {
    if (cobjRecords.hasOwnProperty(`_DS_Recipe_Pelt_${animalType}_01_TreeBark`)) {
      Recipes[index] = xelib.CopyElement(cobjRecords[`_DS_Recipe_Pelt_${animalType}_01_TreeBark`], patch, true);
      xelib.SetValue(Recipes[index], 'Conditions\\[4]\\CTDA - \\Parameter #1', xelib.LongName(peltArray[1]));
      oldEdid = xelib.EditorID(Recipes[index]);
      xelib.SetValue(Recipes[index], 'EDID', oldEdid.replace(animalType, animalRecord));
      xelib.SetValue(Recipes[index], 'Items\\[0]\\CNTO - Item\\Item', xelib.LongName(peltArray[1]));
    } else if (cobjRecords.hasOwnProperty(`RecipeLeather${animalType}Hide_TreeBark`) || cobjRecords.hasOwnProperty(`RecipeLeather${animalType}Hide02_TreeBark`) || cobjRecords.hasOwnProperty(`DLC1RecipeLeather${animalType}Hide_TreeBark`)) {
      let oldRecipe = (cobjRecords[`RecipeLeather${animalType}Hide_TreeBark`] || cobjRecords[`RecipeLeather${animalType}Hide02_TreeBark`] || cobjRecords[`DLC1RecipeLeather${animalType}Hide_TreeBark`]);
      Recipes[index] = xelib.CopyElement(oldRecipe, patch, true);
      xelib.SetValue(Recipes[index], 'Conditions\\[3]\\CTDA - \\Parameter #1', xelib.LongName(peltArray[1]));
      oldEdid = xelib.EditorID(Recipes[index]);
      xelib.SetValue(Recipes[index], 'EDID', oldEdid.replace(animalType, animalRecord));
      xelib.SetValue(Recipes[index], 'Items\\[0]\\CNTO - Item\\Item', xelib.LongName(peltArray[1]));
    } else {
      Recipes[index] = xelib.CopyElement(cobjRecords[`_DS_Recipe_Pelt_Mammoth_01_TreeBark`], patch, true);
      xelib.SetValue(Recipes[index], 'NAM1', jsonRecord.peltCount[1]);
      xelib.SetValue(Recipes[index], 'Items\\[1]\\CNTO - Item\\Count', (parseInt(jsonRecord.peltCount[1]) * 4).toString());
      xelib.SetValue(Recipes[index], 'Conditions\\[4]\\CTDA - \\Parameter #1', xelib.LongName(peltArray[1]));
      oldEdid = xelib.EditorID(Recipes[index]);
      xelib.SetValue(Recipes[index], 'EDID', oldEdid.replace("Mammoth", animalRecord));
      xelib.SetValue(Recipes[index], 'Items\\[0]\\CNTO - Item\\Item', xelib.LongName(peltArray[1]));
    }
    let edid = xelib.EditorID(Recipes[index]);
    cobjRecords[edid] = Recipes[index];
  }
};

let CreateRecipes = function (Recipes, Pelts, animalType, animalRecord, npc, jsonRecord, patch) {
  if (GetDefaultPelt(npc) != undefined) {
    let peltTemp = xelib.GetWinningOverride(GetDefaultPelt(npc));
    if (!DefaultPelt.hasOwnProperty(xelib.FullName(peltTemp))) {
      CreateRecipe1(Recipes, Pelts[xelib.FullName(peltTemp)], animalType, animalRecord, jsonRecord, patch, 0);
      CreateRecipe1(Recipes, Pelts[xelib.FullName(peltTemp)], animalType, animalRecord, jsonRecord, patch, 1);
      CreateRecipe1(Recipes, Pelts[xelib.FullName(peltTemp)], animalType, animalRecord, jsonRecord, patch, 2);
      CreateRecipe1(Recipes, Pelts[xelib.FullName(peltTemp)], animalType, animalRecord, jsonRecord, patch, 3);
      CreateRecipe2(Recipes, Pelts[xelib.FullName(peltTemp)], animalType, animalRecord, jsonRecord, patch, 0, 4);
      //CreateRecipe2(Recipes, Pelts[xelib.FullName(peltTemp)], animalType, animalRecord, jsonRecord, patch, 1, 5); //No Recipes created yet
      CreateRecipe2(Recipes, Pelts[xelib.FullName(peltTemp)], animalType, animalRecord, jsonRecord, patch, 2, 6);
      //CreateRecipe2(Recipes, Pelts[xelib.FullName(peltTemp)], animalType, animalRecord, jsonRecord, patch, 3, 7); //No Recipes created yet
      CreateRecipe3(Recipes, Pelts[xelib.FullName(peltTemp)], animalType, animalRecord, jsonRecord, patch, 8);
      DefaultPelt[xelib.FullName(peltTemp)] = Pelts[xelib.FullName(peltTemp)];
    }
  }
};

let CarcassSizes = function (aiIndex, animalType, jsonRecord, patch) {
  if (!monsterTypes.includes(animalType)) {
    CarcassSizeArray = xelib.GetScript(qustRecords["_DS_Hunterborn"], "_DS_HB_Animals");
  } else {
    CarcassSizeArray = xelib.GetScript(qustRecords["_DS_Hunterborn"], "_DS_HB_Monsters");
  }
  let CarcassSizeArrayProperty = xelib.GetScriptProperty(CarcassSizeArray, "CarcassSizes");
  if (aiIndex != undefined) {
    let OriginalCarcassSize = xelib.GetElements(CarcassSizeArrayProperty, "Value\\Array of Int32")[aiIndex];
    xelib.AddArrayItem(CarcassSizeArrayProperty, "Value\\Array of Int32", "", xelib.GetValue(OriginalCarcassSize));
  } else {
    xelib.AddArrayItem(CarcassSizeArrayProperty, "Value\\Array of Int32", "", jsonRecord.carcassSize);
  }
};

let ActiveAnimalSwitches = function (aiIndex, animalType, jsonRecord, patch) {
  if (!monsterTypes.includes(animalType)) {
    let AnimalSwitchesArray = xelib.GetScript(qustRecords["_DS_Hunterborn"], "_DS_HB_Animals");
    AnimalSwitchesArrayProperty = xelib.GetScriptProperty(AnimalSwitchesArray, "ActiveAnimalSwitches");
  } else {
    let AnimalSwitchesArray = xelib.GetScript(qustRecords["_DS_Hunterborn"], "_DS_HB_Monsters");
    AnimalSwitchesArrayProperty = xelib.GetScriptProperty(AnimalSwitchesArray, "ActiveMonsterSwitches");
  }
  if (aiIndex != undefined) {
    let OriginalAnimalSwitches = xelib.GetElements(AnimalSwitchesArrayProperty, "Value\\Array of Object")[aiIndex];
    newform = xelib.AddArrayItem(AnimalSwitchesArrayProperty, "Value\\Array of Object", "Object v2\\FormID", xelib.GetValue(xelib.GetElement(OriginalAnimalSwitches, "Object v2\\FormID")));
  } else {
    newform = xelib.AddArrayItem(AnimalSwitchesArrayProperty, "Value\\Array of Object", "Object v2\\FormID", jsonRecord.animalSwitch);
  }
  xelib.SetValue(newform, "Object v2\\Alias", "None");
};

let AllMeatWeights = function (aiIndex, animalType, jsonRecord, patch) {
  if (!monsterTypes.includes(animalType))
    MeatWeightsArray = xelib.GetScript(qustRecords["_DS_Hunterborn"], "_DS_HB_Animals");
  else
    MeatWeightsArray = xelib.GetScript(qustRecords["_DS_Hunterborn"], "_DS_HB_Monsters");
  MeatWeightsArrayProperty = xelib.GetScriptProperty(MeatWeightsArray, "AllMeatWeights");
  if (aiIndex != undefined) {
    let OriginalMeatWeights = xelib.GetElements(MeatWeightsArrayProperty, "Value\\Array of Float")[aiIndex];
    xelib.AddArrayItem(MeatWeightsArrayProperty, "Value\\Array of Float", "", xelib.GetValue(OriginalMeatWeights));
  } else {
    xelib.AddArrayItem(MeatWeightsArrayProperty, "Value\\Array of Float", "", xelib.GetValue(alchRecords[jsonRecord.meat], "DATA"));
  }
};

let BloodTypes = function (aiIndex, animalType, jsonRecord, patch) {
  if (monsterTypes.includes(animalType)) {
    let BloodTypesArray = xelib.GetScript(qustRecords["_DS_Hunterborn"], "_DS_HB_Monsters");
    let BloodTypesArrayProperty = xelib.GetScriptProperty(BloodTypesArray, "BloodTypes");
    if (aiIndex != undefined) {
      let OriginalBloodTypes = xelib.GetElements(BloodTypesArrayProperty, "Value\\Array of Object")[aiIndex];
      newform = xelib.AddArrayItem(BloodTypesArrayProperty, "Value\\Array of Object", "Object v2\\FormID", xelib.GetValue(xelib.GetElement(OriginalBloodTypes, "Object v2\\FormID")));
    } else {
      newform = xelib.AddArrayItem(BloodTypesArrayProperty, "Value\\Array of Object", "Object v2\\FormID", jsonRecord.bloodType);
    }
    xelib.SetValue(newform, "Object v2\\Alias", "None");
  }
};

let DefaultPeltValues = function (animalType, npc, patch, Pelts) {
  if (!monsterTypes.includes(animalType)) {
    DefaultPeltValuesArray = xelib.GetScript(qustRecords["_DS_Hunterborn"], "_DS_HB_Animals");
  } else {
    DefaultPeltValuesArray = xelib.GetScript(qustRecords["_DS_Hunterborn"], "_DS_HB_Monsters");
  }
  DefaultPeltValuesArrayProperty = xelib.GetScriptProperty(DefaultPeltValuesArray, "DefaultPeltValues");
  if (GetDefaultPelt(npc) != undefined) {
    let peltTemp = xelib.GetWinningOverride(GetDefaultPelt(npc));
    xelib.AddArrayItem(DefaultPeltValuesArrayProperty, "Value\\Array of Int32", "", xelib.GetValue(miscRecords[xelib.EditorID(peltTemp)], "DATA\\Value"));
  } else {
    xelib.AddArrayItem(DefaultPeltValuesArrayProperty, "Value\\Array of Int32", "", "0");
  }
};

let MeatTypes = function (aiIndex, animalType, jsonRecord, patch) {
  if (!monsterTypes.includes(animalType)) {
    MeatTypesArray = xelib.GetScript(qustRecords["_DS_Hunterborn"], "_DS_HB_Animals");
  } else {
    MeatTypesArray = xelib.GetScript(qustRecords["_DS_Hunterborn"], "_DS_HB_Monsters");
  }
  let MeatTypesArrayProperty = xelib.GetScriptProperty(MeatTypesArray, "MeatTypes");
  if (aiIndex != undefined) {
    let OriginalMeatTypes = xelib.GetElements(MeatTypesArrayProperty, "Value\\Array of Object")[aiIndex];
    let OriginalMeatType = xelib.GetElement(OriginalMeatTypes, "Object v2\\FormID");
    let OriginalMeatTypeLink = xelib.GetLinksTo(OriginalMeatType);
    newform = xelib.AddArrayItem(MeatTypesArrayProperty, "Value\\Array of Object", "Object v2\\FormID", xelib.EditorID(alchRecords[xelib.EditorID(OriginalMeatTypeLink)]));
  } else {
    let meatRecord = jsonRecord.meat;
    if (xelib.FileByName('Hunterborn_CACO-SE_Patch.esp') > 0 || cobjRecords.hasOwnProperty(`HB_CACO_RecipeJerkyHare`)) {
      meatRecord = vanillaToCaco[meatRecord] || meatRecord;
    }
    newform = xelib.AddArrayItem(MeatTypesArrayProperty, "Value\\Array of Object", "Object v2\\FormID", xelib.EditorID(alchRecords[meatRecord]));
  }
  xelib.SetValue(newform, "Object v2\\Alias", "None");
};

let NegativeTreasure = function (aiIndex, animalType, animalRecord, jsonRecord, patch) {
  if (monsterTypes.includes(animalType)) {
    let NegativeTreasureArray = xelib.GetScript(qustRecords["_DS_Hunterborn"], "_DS_HB_Monsters");
    NegativeTreasureArrayProperty = xelib.GetScriptProperty(NegativeTreasureArray, "NegativeTreasure");
    if (aiIndex != undefined) {
      let OriginalNegativeTreasure = xelib.GetElements(NegativeTreasureArrayProperty, "Value\\Array of Object")[aiIndex];
      newform = xelib.AddArrayItem(NegativeTreasureArrayProperty, "Value\\Array of Object", "Object v2\\FormID", xelib.GetValue(xelib.GetElement(OriginalNegativeTreasure, "Object v2\\FormID")));
    } else {
      let OriginalNegativeTreasure = xelib.CopyElement(flstRecords['_DS_FL_DiscardChaurus'], patch, true);
      let oldEdid = xelib.EditorID(OriginalNegativeTreasure);
      xelib.SetValue(OriginalNegativeTreasure, 'EDID', oldEdid.replace("Chaurus", animalRecord));
      xelib.RemoveElement(OriginalNegativeTreasure, 'FormIDs');
      let edid = xelib.EditorID(OriginalNegativeTreasure);
      flstRecords[edid] = OriginalNegativeTreasure;
      for (let x = 0; x < jsonRecord.negativeTreasure.length; x++) {
        xelib.AddFormID(OriginalNegativeTreasure, jsonRecord.negativeTreasure[x]);
      }
      newform = xelib.AddArrayItem(NegativeTreasureArrayProperty, "Value\\Array of Object", "Object v2\\FormID", xelib.GetValue(OriginalNegativeTreasure));
    }
    xelib.SetValue(newform, "Object v2\\Alias", "None");
  }
};

let SharedDeathItems = function (aiIndex, animalType, jsonRecord, patch) {
  if (!monsterTypes.includes(animalType))
    SharedDeathItemsArray = xelib.GetScript(qustRecords["_DS_Hunterborn"], "_DS_HB_Animals");
  else
    SharedDeathItemsArray = xelib.GetScript(qustRecords["_DS_Hunterborn"], "_DS_HB_Monsters");
  let SharedDeathItemsArrayProperty = xelib.GetScriptProperty(SharedDeathItemsArray, "SharedDeathItems");
  if (aiIndex != undefined) {
    let OriginalSharedDeathItems = xelib.GetElements(SharedDeathItemsArrayProperty, "Value\\Array of Object")[aiIndex];
    newform = xelib.AddArrayItem(SharedDeathItemsArrayProperty, "Value\\Array of Object", "Object v2\\FormID", xelib.GetValue(xelib.GetElement(OriginalSharedDeathItems, "Object v2\\FormID")));
  } else {
    newform = xelib.AddArrayItem(SharedDeathItemsArrayProperty, "Value\\Array of Object", "Object v2\\FormID", jsonRecord.sharedDeathItems);
  }
  xelib.SetValue(newform, "Object v2\\Alias", "None");
};

let VenomTypes = function (aiIndex, animalType, jsonRecord, patch) {
  if (monsterTypes.includes(animalType)) {
    let VenomTypesArray = xelib.GetScript(qustRecords["_DS_Hunterborn"], "_DS_HB_Monsters");
    let VenomTypesArrayProperty = xelib.GetScriptProperty(VenomTypesArray, "VenomTypes");
    if (aiIndex != undefined) {
      let OriginalVenomTypes = xelib.GetElements(VenomTypesArrayProperty, "Value\\Array of Object")[aiIndex];
      newform = xelib.AddArrayItem(VenomTypesArrayProperty, "Value\\Array of Object", "Object v2\\FormID", xelib.GetValue(xelib.GetElement(OriginalVenomTypes, "Object v2\\FormID")));
    } else {
      newform = xelib.AddArrayItem(VenomTypesArrayProperty, "Value\\Array of Object", "Object v2\\FormID", jsonRecord.venom);
    }
    xelib.SetValue(newform, "Object v2\\Alias", "None");
  }
};

let FreshCarcassMsgBoxes = function (aiIndex, animalType, jsonRecord, patch) {
  if (!monsterTypes.includes(animalType)) {
    let FreshCarcassMsgBoxesArray = xelib.GetScript(qustRecords["_DS_Hunterborn"], "_DS_HB_MAIN");
    let FreshCarcassMsgBoxesArrayProperty = xelib.GetScriptProperty(FreshCarcassMsgBoxesArray, "FreshCarcassMsgBoxes");
    if (aiIndex != undefined) {
      let OriginalFreshCarcassMsgBoxes = xelib.GetElements(FreshCarcassMsgBoxesArrayProperty, "Value\\Array of Object")[aiIndex];
      newform = xelib.AddArrayItem(FreshCarcassMsgBoxesArrayProperty, "Value\\Array of Object", "Object v2\\FormID", xelib.GetValue(xelib.GetElement(OriginalFreshCarcassMsgBoxes, "Object v2\\FormID")));
    } else {
      newform = xelib.AddArrayItem(FreshCarcassMsgBoxesArrayProperty, "Value\\Array of Object", "Object v2\\FormID", jsonRecord.carcassMessageBox);
    }
    xelib.SetValue(newform, "Object v2\\Alias", "None");
  }
};

let AnimalIndex = function (aiIndex, animalType, jsonRecord, patch) {
  if (!monsterTypes.includes(animalType)) {
    let AnimalIndexArray = xelib.GetScript(qustRecords["_DS_Hunterborn"], "_DS_HB_Animals");
    AnimalIndexArrayProperty = xelib.GetScriptProperty(AnimalIndexArray, "AnimalIndex");
  } else {
    let AnimalIndexArray = xelib.GetScript(qustRecords["_DS_Hunterborn"], "_DS_HB_Monsters");
    AnimalIndexArrayProperty = xelib.GetScriptProperty(AnimalIndexArray, "MonsterIndex");
  }
  if (aiIndex != undefined) {
    let OriginalAnimalIndex = xelib.GetElements(AnimalIndexArrayProperty, "Value\\Array of String")[aiIndex];
    let newform = xelib.AddArrayItem(AnimalIndexArrayProperty, "Value\\Array of String", "", xelib.GetValue(OriginalAnimalIndex));
  } else {
    let newform = xelib.AddArrayItem(AnimalIndexArrayProperty, "Value\\Array of String", "", jsonRecord.name);
  }
};

let ModifyDeathItem = function (npc, patch) {
  let deathItem = xelib.GetLinksTo(npc, 'INAM');
  let deathItemWinning = xelib.GetWinningOverride(deathItem);
  let deathItemFlag = xelib.GetValue(deathItemWinning, 'LVLF');
  if (deathItemFlag != "001") {
    let newDeathItem = xelib.CopyElement(deathItemWinning, patch);
    xelib.SetValue(newDeathItem, "LVLF", "001");
  }
};

let addRecords = function (npc, animalType, patch) {
  if (animalType != "Skip" && !miscRecords['_DS_DI' + xelib.GetValue(npc, 'INAM').replace('DeathItem', '').replace(/ \[LVLI.*/i, '')]) {

    animalType = fixedAnimalTypes[animalType] || animalType;

    let animalRecord = xelib.GetValue(npc, 'INAM').replace('DeathItem', '').replace(/ \[LVLI.*/i, '');
    let aiIndex = animalTypeIndex[animalType];
    let Recipes = {};
    let jsonRecord = {};

    for (let i = 0; i < Object.keys(jsonData).length; i++) {
      for (let j = 0; j < Object.keys(jsonData[i]).length; j++) {
        if (jsonData[i][j].name == animalType) {
          jsonRecord = jsonData[i][j];
        }
      }
    }

    if (debugging)
      console.log(npc + " " + animalType + " " + animalRecord);
    CreateToken(animalType, animalRecord, patch);
    if (debugging)
      console.log(1);
    let Carcass = CreateCarcass(animalType, animalRecord, npc, jsonRecord, patch);
    if (debugging)
      console.log(2);
    CreateMats(animalType, animalRecord, jsonRecord, patch);
    if (debugging)
      console.log(3);
    CreatePelts(Pelts, Carcass, animalType, animalRecord, aiIndex, npc, patch);
    if (debugging)
      console.log(4);
    CreateNewDeathItem(animalType, animalRecord, npc, jsonRecord, patch);
    if (debugging)
      console.log(5);
    CreatePerfectMats(animalType, animalRecord, patch);
    if (debugging)
      console.log(6);
    CreateRecipes(Recipes, Pelts, animalType, animalRecord, npc, jsonRecord, patch);
    if (debugging)
      console.log(7);
    CarcassSizes(aiIndex, animalType, jsonRecord, patch);
    if (debugging)
      console.log(8);
    ActiveAnimalSwitches(aiIndex, animalType, jsonRecord, patch);
    if (debugging)
      console.log(9);
    BloodTypes(aiIndex, animalType, jsonRecord, patch);
    if (debugging)
      console.log(10);
    DefaultPeltValues(animalType, npc, patch, Pelts);
    if (debugging)
      console.log(11);
    MeatTypes(aiIndex, animalType, jsonRecord, patch);
    if (debugging)
      console.log(12);
    AllMeatWeights(aiIndex, animalType, jsonRecord, patch);
    if (debugging)
      console.log(13);
    NegativeTreasure(aiIndex, animalType, animalRecord, jsonRecord, patch);
    if (debugging)
      console.log(14);
    SharedDeathItems(aiIndex, animalType, jsonRecord, patch);
    if (debugging)
      console.log(15);
    VenomTypes(aiIndex, animalType, jsonRecord, patch);
    if (debugging)
      console.log(16);
    FreshCarcassMsgBoxes(aiIndex, animalType, jsonRecord, patch);
    if (debugging)
      console.log(17);
    AnimalIndex(aiIndex, animalType, jsonRecord, patch);
    if (debugging)
      console.log(18);
    ModifyDeathItem(npc, patch);
    if (debugging)
      console.log(19);
  }
};

let spliceTypes = function (name, type, sortName) {
  let i = 1;
  if (animalTypes.find(element => element == sortName) == undefined) {
    let arrayTest = animalTypes[i];
    while (arrayTest && arrayTest < sortName) {
      arrayTest = animalTypes[++i];
    }
    animalTypes.splice(i, 0, sortName);
    if (type == "monster") {
      monsterTypes.push(name);
    }
    return false;
  }
  return true;
};

let loadJsonData = function (patchJson, i) {
  jsonData[i] = fh.loadJsonFile(patchJson, []);
  for (let j = 0; j < Object.keys(jsonData[i]).length; j++) {
    if (!allowedVoice.includes(jsonData[i][j].voice)) {
      allowedVoice.push(jsonData[i][j].voice);
    }
    if (spliceTypes(jsonData[i][j].name, jsonData[i][j].type, jsonData[i][j].sortName)) {
      if (debugging)
        jsonData[i].splice(j, 1);
      j--;
    } else {
      if (debugging)
        console.log("Adding creature: " + jsonData[i][j].name);
      deathItemNameMatch.unshift(jsonData[i][j].name);
      fixedAnimalTypes[jsonData[i][j].sortName] = jsonData[i][j].name;
    }
  }
};

let CheckPatches = function () {
  if (!CheckPatchesRunOnce) {
    CheckPatchesRunOnce = true;
    let i = 0;
    jsonData = [];
    let jsonFiles = fh.getFiles(patcherPath, {
      matching: ['*.json', '!module.json']
    });
    jsonFiles.sort(function (a, b) {
      if (a.match(/Skyrim\.json/) != null)
        return -1;
    });
    jsonFiles.forEach(file => {
      let tempfile = file.replace(patcherPath + "\\", '').replace('.json', '');
      if (xelib.FileByName(`${tempfile}.esp`) > 0 || xelib.FileByName(`${tempfile}.esm`) > 0 || xelib.FileByName(`${tempfile}.esl`) > 0) {
        loadJsonData(file, i);
        i++;
      }
    });
  }
}

let settingsController = function ($scope, referenceService, progressService, errorService) {
  let patcherSettings = $scope.settings.hunterbornCreaturePatcher;

  let GetCreatures = function () {
    cacheRecords(flstRecords, 'FLST');
    loadKnownDeathItemsMonsters();
    loadKnownDeathItemsAnimals();
    $scope.items = patcherSettings.items = patcherSettings.items || {};
    $scope.animalTypes = animalTypes;
    xelib.WithHandles(xelib.GetRecords(0, 'NPC_'), function (records) {
      let len = records.length;
      records.forEach(function (rec, index) {
        let msg = `Getting creature information (${index}/${len})`;
        progressService.progressMessage(msg);
        rec = xelib.GetWinningOverride(rec);
        buildDeathItem($scope.items, rec);
      });
    });
  };

  $scope.loadCreatures = function () {
    CheckPatches();
    progressService.showProgress({
      message: 'Loading records...'
    });
    errorService.try(GetCreatures);
    progressService.hideProgress();
  };

  $scope.clearCreatures = function () {
    CheckPatches();
    $scope.items = patcherSettings.items = {};
    progressService.showProgress({
      message: 'Loading records...'
    });
    errorService.try(GetCreatures);
    progressService.hideProgress();
  };
};

registerPatcher({
  info: info,
  gameModes: [xelib.gmTES5, xelib.gmSSE],
  settings: {
    label: 'Hunterborn Creature Patcher',
    templateUrl: `${patcherPath}/partials/settings.html`,
    controller: settingsController,
    defaultSettings: {}
  },
  execute: {
    initialize: function (patch, helpers, settings) {
      if (!settings.items)
        return;
      let recordsToPatch = [];
      CheckPatches();
      cacheRecords(cobjRecords, 'COBJ');
      cacheRecords(flstRecords, 'FLST');
      cacheRecords(lvliRecords, 'LVLI');
      cacheRecords(miscRecords, 'MISC');
      cacheRecords(alchRecords, 'ALCH');
      CreateStandardRecords(patch);
      BuildPeltRecords();
      Object.values(settings.items).forEach(item => {
        item.npcs.forEach(npc => {
          recordsToPatch.push({
            animalType: item.animalType,
            npc: xelib.GetElement(0, `${npc.filename}\\NPC_\\${npc.path}`)
          });
        });
      });
      let i = 0;
      recordsToPatch.forEach((record, index) => {
        try {
          addRecords(record.npc, record.animalType, patch);
        } catch (err) {}
      });
    },
    process: []
  }
});
