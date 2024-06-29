import { create } from "zustand";
import { persist } from "zustand/middleware";

type Profile = {
  id: number;
  name: string;
  email: string;
  imageUrl: string;
};

interface ProfileStore {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) =>
        set(() => ({
          profile,
        })),
    }),
    {
      name: "profile-store",
    }
  )
);
