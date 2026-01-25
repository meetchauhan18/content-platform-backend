export const authKeys = {
  all: ["auth"],
  profile: () => [...authKeys.all, "profile"],
};
