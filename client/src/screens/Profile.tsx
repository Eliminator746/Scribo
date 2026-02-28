import { useGetCurrentUserQuery } from "@/features/apiSlice";
import BlogContainer from "@/ui_components/Blogcontainer";
import Hero from "@/ui_components/Hero";

const Profile = () => {
  const { data: currentUser, isLoading, error } = useGetCurrentUserQuery();

  const profileData = currentUser;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 dark:text-red-400">Failed to load profile</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 dark:text-gray-400">
          No profile data available
        </p>
      </div>
    );
  }

  return (
    <>
      <Hero
        name={profileData.username || "User"}
        role={profileData.job_title || "Blogger"}
        bio={profileData.bio || "Welcome to my profile"}
        avatar={profileData.profile_picture_url || "/src/images/pic.jpg"}
      />
      <BlogContainer />
    </>
  );
};

export default Profile;
