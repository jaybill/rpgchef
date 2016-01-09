import DbConn from './dbconn';
import Users from './models/users';
import Weapons from './models/weapons';
import Effects from './models/effects';
import UserWeapons from './models/userweapons';

const users = Users(DbConn);
const weapons = Weapons(DbConn);
const effects = Effects(DbConn);
const userWeapons = UserWeapons(DbConn);


userWeapons.belongsTo(users);

var Db = {
  Users: users,
  Weapons: weapons,
  Effects: effects,
  UserWeapons: userWeapons
};

export const conn = DbConn;

export default Db;

