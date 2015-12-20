import Users from './models/users';
import WeaponGroups from './models/weapongroups';
import Weapons from './models/weapons';
import DbConn from './dbconn';


const users = Users(DbConn);
const weaponGroups = WeaponGroups(DbConn);
const weapons = Weapons(DbConn);

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
  Weapons: weapons
};

export default Db;

