import MaleAvatar from 'shared/assests/maleAvatar.svg';
import FemaleAvatar from 'shared/assests/femaleAvatar.svg';

export const getPatientAvatar = (gender: string) => {
  if (!gender) {
    return MaleAvatar
  }
  if (gender?.[0]?.toLowerCase() === 'm') {
    return MaleAvatar;
  } 
  return FemaleAvatar;
}

export const getPatientGender = (gender: string) => {
  if (gender?.[0]?.toLowerCase() === 'm') {
    return 'Male';
  }
  return 'Female';
}