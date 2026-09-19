import * as migration_20260919_175650_initial from './20260919_175650_initial';

export const migrations = [
  {
    up: migration_20260919_175650_initial.up,
    down: migration_20260919_175650_initial.down,
    name: '20260919_175650_initial'
  },
];
