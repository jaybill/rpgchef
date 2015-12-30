import DbConn from './dbconn';
import Users from './models/users';
import Weapons from './models/weapons';
import Effects from './models/effects';

const users = Users(DbConn);
const weapons = Weapons(DbConn);
const effects = Effects(DbConn);

// RELATIONSHIPS


// DB OBJECT

var Db = {
  Users: users,
  Weapons: weapons,
  Effects: effects
};

export const conn = DbConn;

export default Db;

