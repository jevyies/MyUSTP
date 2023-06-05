import { globalFunctions } from '@/constants/index.js';
import { Ability } from '@casl/ability';
export const initialAbility = [
  {
    action: 'read',
    subject: 'Auth',
  },
]

//  Read ability from localStorage
// 👉 Handles auto fetching previous abilities if already logged in user
// ℹ️ You can update this if you store user abilities to more secure place
// ❗ Anyone can update localStorage so be careful and please update this
const stringifiedUserAbilities = localStorage.getItem('userAbilities') ? globalFunctions.decryptData(localStorage.getItem('userAbilities')) : null
const existingAbility = stringifiedUserAbilities ? stringifiedUserAbilities : null
export default new Ability(existingAbility || initialAbility)
