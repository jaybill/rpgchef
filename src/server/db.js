import DbConn from './dbconn';
import Users from './models/users';
import Weapons from './models/weapons';
import Effects from './models/effects';
import UserWeapons from './models/userweapons';
import StripeUsers from './models/stripeUsers';
import Modules from './models/modules';

const users = Users(DbConn);
const weapons = Weapons(DbConn);
const effects = Effects(DbConn);
const userWeapons = UserWeapons(DbConn);
const stripeUsers = StripeUsers(DbConn);
const modules = Modules(DbConn);

userWeapons.belongsTo(users);

var Db = {
  Users: users,
  Weapons: weapons,
  Effects: effects,
  UserWeapons: userWeapons,
  StripeUsers: stripeUsers,
  Modules: modules
};

export const conn = DbConn;

export default Db;

