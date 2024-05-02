
DROP TABLE IF Exists TypeInfos;

CREATE Table If Not Exists TypeInfos (
    shortname Text Primary Key,
    longname Text Not Null
);
INSERT INTO TypeInfos (shortname, longname) VALUES 
('xa', 'amulet'),
('ah', 'armorheavy'),
('al', 'armorlight'),
('am', 'armormedium'),
('wa', 'axe'),
('bh', 'boots'),
('wb', 'bow'),
('xc', 'cloak'),
('wd', 'dagger'),
('xf', 'familiar'),
('xw', 'feet'),
('gl', 'bracers'),
('gh', 'gauntlets'),
('hl', 'hat'),
('hm', 'roguehat'),
('hh', 'helmet'),
('uh', 'herb'),
('wm', 'mace'),
('up', 'potion'),
('xr', 'ring'),
('us', 'scrolls'),
('xs', 'shield'),
('bl', 'shoes'),
('wp', 'spear'),
('wt', 'staff'),
('ws', 'sword'),
('ww', 'wand'),
('wc', 'crossbow'),
('wg', 'gun'),
('z', 'tag'),
('xu', 'rune'),
('xm', 'moonstone'),
('fm', 'meal'),
('fd', 'dessert'),
('wi', 'instrument'),
('xx', 'aurastone');