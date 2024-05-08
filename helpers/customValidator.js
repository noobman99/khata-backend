exports.validUID = (uid) => {
  if (!uid) {
    return false;
  }

  // regex to match a UID, starts with USR followed by 7 digits
  const regex = /^USR[A-Za-z0-9]{7}$/;

  return regex.test(uid);
};
