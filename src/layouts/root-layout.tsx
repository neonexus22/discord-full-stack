import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  useAuth,
  useSession,
} from "@clerk/clerk-react";
import { ReactNode, useEffect } from "react";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "../pages/home-page";
import Sidebar from "../components/navigation/sidebar";
import CreateServerModal from "../components/modals/create-server-modal";
import { useProfileStore } from "../stores/profileStore";
import { useMutation } from "@apollo/client";
import { CREATE_PROFILE } from "../graphql/mutations/create-profile";
import ChannelLayout from "./channel-layout";
import ChannelPage from "../pages/channel-page";
import ServerLayout from "./server-layout";
import InviteModal from "../components/modals/server/invite-modal";
import UpdateServerModal from "../components/modals/server/update-server-modal";
import CreateChannelModal from "../components/modals/server/create-channel-modal";
import DeleteChannelModal from "../components/modals/server/channel/delete-channel-modal";
import DeleteServerModal from "../components/modals/server/delete-server-modal";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

const RootLayout = () => {
  const profile = useProfileStore((state) => state.profile);
  const setProfile = useProfileStore((state) => state.setProfile);
  const { session } = useSession();
  const { isSignedIn } = useAuth();

  const [createProfile] = useMutation(CREATE_PROFILE, {});

  useEffect(() => {
    if (!isSignedIn) setProfile(null);
  }, [isSignedIn, setProfile]);

  useEffect(() => {
    const createProfileFn = async () => {
      if (!session?.user) return;
      try {
        await createProfile({
          variables: {
            input: {
              email: session.user?.emailAddresses[0]?.emailAddress,
              name: session.user?.fullName,
              imageUrl: session.user?.imageUrl,
            },
          },
          onCompleted: (data) => {
            setProfile(data.createProfile);
          },
          onError: (error) => {
            console.log("Error creating profile", { error });
          },
        });
      } catch (error) {
        console.log(error);
      }
    };
    if (profile?.id) return;
    createProfileFn();
  }, [session?.user, profile?.id]);

  return (
    <div>
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default function RoutetLayout() {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      publishableKey={PUBLISHABLE_KEY}
    >
      <Routes>
        <Route path="" element={<RootLayout />}>
          <Route
            index
            element={
              <ProtectedRoute>
                <CreateServerModal />
                <HomePage />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="servers/:serverId/" element={<ServerLayout />}>
          <Route
            index
            element={
              <ProtectedRoute>
                <CreateChannelModal />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route
          path="servers/:serverId/channels/:channelType/:channelId"
          element={<ChannelLayout />}
        >
          <Route
            index
            element={
              <ProtectedRoute>
                <CreateChannelModal />
                <DeleteChannelModal />
                <UpdateServerModal />
                <DeleteServerModal />
                <InviteModal />
                <ChannelPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </ClerkProvider>
  );
}
