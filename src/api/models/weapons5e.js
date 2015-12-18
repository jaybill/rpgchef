const weapons = [{
  "name": "Club",
  "price": "1 SP",
  "damage": "1d4 bludgeoning",
  "weight": "3 lbs",
  "properties": null,
  "subgroup": "Mace",
  "group": "Basic"
}, {
  "name": "Greatclub",
  "price": "2 SP",
  "damage": "1d8 bludgeoning",
  "weight": "15 lbs",
  "properties": "Two-Handed",
  "subgroup": "Mace",
  "group": "Basic"
}, {
  "name": "Handaxe",
  "price": "5 GP",
  "damage": "1d4 slashing",
  "weight": "5 lbs",
  "properties": "Range 30/120",
  "subgroup": "Axe",
  "group": "Basic"
}, {
  "name": "Mace",
  "price": "5 GP",
  "damage": "1d6 bludgeoning",
  "weight": "8 lbs",
  "properties": null,
  "subgroup": "Mace",
  "group": "Basic"
}, {
  "name": "Scythe",
  "price": "5 SP",
  "damage": "1d8 slashing",
  "weight": "10 lbs",
  "properties": "Two-Handed",
  "subgroup": "Axe",
  "group": "Basic"
}, {
  "name": "Sickle",
  "price": "2 SP",
  "damage": "1d6 slashing",
  "weight": "5 lbs",
  "properties": null,
  "subgroup": "Sword",
  "group": "Basic"
}, {
  "name": "Spear",
  "price": "1 GP",
  "damage": "1d6 piercing",
  "weight": "5 lbs",
  "properties": null,
  "subgroup": "Spear",
  "group": "Basic"
}, {
  "name": "Trident",
  "price": "5 GP",
  "damage": "1d6 piercing",
  "weight": "6 lbs",
  "properties": null,
  "subgroup": "Spear",
  "group": "Basic"
}, {
  "name": "War Pick",
  "price": "5 GP",
  "damage": "1d6 piercing",
  "weight": "6 lbs",
  "properties": null,
  "subgroup": "Pick",
  "group": "Basic"
}, {
  "name": "Dagger",
  "price": "2 GP",
  "damage": "1d4 piercing",
  "weight": "1 lbs",
  "properties": "Range 20/80",
  "subgroup": "Dagger",
  "group": "Finesse"
}, {
  "name": "Katana",
  "price": "35 GP",
  "damage": "1d8 slashing",
  "weight": "3 lbs",
  "properties": "Two-Handed",
  "subgroup": "Sword",
  "group": "Finesse"
}, {
  "name": "Quarterstaff",
  "price": "2 SP",
  "damage": "1d8 bludgeoning",
  "weight": "4 lbs",
  "properties": "Two-Handed",
  "subgroup": "Staff",
  "group": "Finesse"
}, {
  "name": "Rapier",
  "price": "25 GP",
  "damage": "1d6 piercing",
  "weight": "2 lbs",
  "properties": null,
  "subgroup": "Sword",
  "group": "Finesse"
}, {
  "name": "Scimitar",
  "price": "25 GP",
  "damage": "1d6 slashing",
  "weight": "4 lbs",
  "properties": null,
  "subgroup": "Sword",
  "group": "Finesse"
}, {
  "name": "Short Sword",
  "price": "10 GP",
  "damage": "1d6 piercing",
  "weight": "3 lbs",
  "properties": null,
  "subgroup": "Sword",
  "group": "Finesse"
}, {
  "name": "Spiked Chain",
  "price": "15 GP",
  "damage": "1d6 piercing",
  "weight": "5 lbs",
  "properties": "Reach, Two-Handed",
  "subgroup": "Whip",
  "group": "Finesse"
}, {
  "name": "Whip",
  "price": "2 GP",
  "damage": "1d4 slashing",
  "weight": "2 lbs",
  "properties": "Reach",
  "subgroup": "Whip",
  "group": "Finesse"
}, {
  "name": "Bastard Sword",
  "price": "35 GP",
  "damage": "1d10 slashing",
  "weight": "10 lbs",
  "properties": "Two-Handed",
  "subgroup": "Sword",
  "group": "Martial"
}, {
  "name": "Battleaxe",
  "price": "10 GP",
  "damage": "1d8 slashing",
  "weight": "10 lbs",
  "properties": null,
  "subgroup": "Axe",
  "group": "Martial"
}, {
  "name": "Flail",
  "price": "10 GP",
  "damage": "1d8 bludgeoning",
  "weight": "2 lbs",
  "properties": null,
  "subgroup": "Flail",
  "group": "Martial"
}, {
  "name": "Longsword",
  "price": "15 GP",
  "damage": "1d8 slashing",
  "weight": "5 lbs",
  "properties": null,
  "subgroup": "Sword",
  "group": "Martial"
}, {
  "name": "Morningstar",
  "price": "15 GP",
  "damage": "1d8 bludgeoning & piercing",
  "weight": "12 lbs",
  "properties": null,
  "subgroup": "Mace",
  "group": "Martial"
}, {
  "name": "Shield",
  "price": "10 GP",
  "damage": "1d6 bludgeoning",
  "weight": "5 lbs",
  "properties": null,
  "subgroup": "Shield",
  "group": "Martial"
}, {
  "name": "Throwing Axe",
  "price": "5 GP",
  "damage": "1d6 slashing",
  "weight": "7 lbs",
  "properties": "Range 20/80",
  "subgroup": "Axe",
  "group": "Martial"
}, {
  "name": "Warhammer",
  "price": "15 GP",
  "damage": "1d8 bludgeoning",
  "weight": "8 lbs",
  "properties": null,
  "subgroup": "Hammer",
  "group": "Martial"
}, {
  "name": "Glaive",
  "price": "10 GP",
  "damage": "1d10 slashing",
  "weight": "15 lbs",
  "properties": "Reach, Two-Handed",
  "subgroup": "Spear",
  "group": "Heavy"
}, {
  "name": "Greataxe",
  "price": "30 GP",
  "damage": "1d12 slashing",
  "weight": "15 lbs",
  "properties": "Two-Handed",
  "subgroup": "Axe",
  "group": "Heavy"
}, {
  "name": "Greatsword",
  "price": "50 GP",
  "damage": "1d12 slashing",
  "weight": "10 lbs",
  "properties": "Two-Handed",
  "subgroup": "Sword",
  "group": "Heavy"
}, {
  "name": "Lance",
  "price": "10 GP",
  "damage": "1d12 piercing",
  "weight": "10 lbs",
  "properties": "Reach, Two-Handed, Special",
  "subgroup": "Spear",
  "group": "Heavy"
}, {
  "name": "Longspear",
  "price": "5 GP",
  "damage": "1d10 piercing",
  "weight": "5 lbs",
  "properties": "Reach, Two-Handed",
  "subgroup": "Spear",
  "group": "Heavy"
}, {
  "name": "Halberd",
  "price": "10 GP",
  "damage": "1d10 slashing",
  "weight": "15 lbs",
  "properties": "Reach, Two-Handed",
  "subgroup": "Axe",
  "group": "Heavy"
}, {
  "name": "Maul",
  "price": "10 GP",
  "damage": "1d12 bludgeoning",
  "weight": "25 lbs",
  "properties": "Two-Handed",
  "subgroup": "Hammer",
  "group": "Heavy"
}, {
  "name": "Crossbow, Hand",
  "price": "10 GP",
  "damage": "1d6 piercing",
  "weight": "3 lbs",
  "properties": "Range 30/120, Special",
  "subgroup": "Crossbow",
  "group": "Simple Missle"
}, {
  "name": "Dart",
  "price": "5 CP, each",
  "damage": "1d4 piercing",
  "weight": "1/2 lbs",
  "properties": "Range 30/120",
  "subgroup": "Spear",
  "group": "Simple Missle"
}, {
  "name": "Sling",
  "price": "1 SP",
  "damage": "1d4 bludgeoning",
  "weight": "1/2 lbs",
  "properties": "Range 30/120",
  "subgroup": "Sling",
  "group": "Simple Missle"
}, {
  "name": "Crossbow, Light",
  "price": "25 GP",
  "damage": "1d8 piercing",
  "weight": "6 lbs",
  "properties": "Range 80/320, Two-Handed, Special",
  "subgroup": "Crossbow",
  "group": "Martial Missile"
}, {
  "name": "Javelin",
  "price": "5 SP",
  "damage": "1d6 piercing",
  "weight": "5 lbs",
  "properties": "Range 30/120",
  "subgroup": "Spear",
  "group": "Martial Missile"
}, {
  "name": "Shortbow",
  "price": "25 GP",
  "damage": "1d6 piercing",
  "weight": "2 lbs",
  "properties": "Range 80/320, Two-Handed",
  "subgroup": "Bow",
  "group": "Martial Missile"
}, {
  "name": "Throwing Hammer",
  "price": "2 GP",
  "damage": "1d6 bludgeoning",
  "weight": "7 lbs",
  "properties": "Range 20/80",
  "subgroup": "Hammer",
  "group": "Martial Missile"
}, {
  "name": "Crossbow, Heavy",
  "price": "50 GP",
  "damage": "1d10 piercing",
  "weight": "10 lbs",
  "properties": "Range 100/400, Two-Handed, Special",
  "subgroup": "Crossbow",
  "group": "Heavy Martial Missile"
}, {
  "name": "Longbow",
  "price": "50 GP",
  "damage": "1d8 piercing",
  "weight": "3 lbs",
  "properties": "Range 150/600, Two-Handed",
  "subgroup": "Bow",
  "group": "Heavy Martial Missile"
}];


export default weapons;
