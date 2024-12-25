interface ProfileAvatarProps {
  avatarUrl: string | null;
  email: string;
}

export const ProfileAvatar = ({ avatarUrl, email }: ProfileAvatarProps) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="h-20 w-20 rounded-full overflow-hidden bg-secondary">
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt="Profile" 
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-primary/10">
            {email?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-lg font-medium text-foreground">
          {email}
        </h3>
      </div>
    </div>
  );
};