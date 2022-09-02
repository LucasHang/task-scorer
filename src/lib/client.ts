import Gun from 'gun/gun.js';
import { GUN_PEERS } from './vars';

const gun = Gun({ peers: GUN_PEERS, localStorage: false });

export default gun;
