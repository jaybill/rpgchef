import weapons from './models/weapons5e';
import log from 'loglevel';
import _ from 'lodash';
import { convertToCoppers } from '../util';

let grouped = _.groupBy(weapons, (weapon) => {
  return weapon.group
});

const groupNames = _.keys(grouped);

let groups = [];

let id = 0;
_.forIn(groupNames, (groupName) => {

  const group = {
    id: id++,
    parent: null,
    name: groupName
  };

  groups.push(group);

  const subgroups = _.groupBy(grouped[groupName], (item) => {
    return item.subgroup;
  });

  const subgroupNames = _.keys(subgroups);

  _.forIn(subgroupNames, (subGroupName) => {
    groups.push({
      id: id++,
      parent: group.id,
      name: subGroupName
    });

  });
});

let items = [];
let itemId = 0;

_.forIn(weapons, (weapon) => {

  const itemGroup = _.find(groups, (group) => {
    return group.name == weapon.group;
  });

  const itemSubGroup = _.find(groups, (group) => {
    return group.name == weapon.subgroup && group.parent == itemGroup.id;
  });

  const item = {
    id: itemId++,
    name: weapon.name,
    priceInCp: convertToCoppers(weapon.price),
    damage: weapon.damage,
    weightInLb: parseFloat(weapon.weight),
    "properties": weapon["properties"],
    groupId: itemSubGroup.id
  };
  items.push(item);

});

console.log(items);



