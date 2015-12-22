import DbConn from './dbconn';
import Users from './models/users';
import WeaponGroups from './models/weapongroups';
import Weapons from './models/weapons';
import Effects from './models/effects';

const users = Users(DbConn);
const weaponGroups = WeaponGroups(DbConn);
const weapons = Weapons(DbConn);
const effects = Effects(DbConn);

// RELATIONSHIPS

weaponGroups.hasMany(weaponGroups, {
  as: "subgroups",
  foreignKey: "parentId"
});

weaponGroups.hasMany(weapons, {
  as: "weapons",
  foreignKey: "groupId"
});


var Db = {
  Users: users,
  WeaponGroups: weaponGroups,
  Weapons: weapons,
  Effects: effects
};

export const conn = DbConn;

export default Db;

