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
            onError={(e) => {
              e.currentTarget.onerror = null; // Prevent infinite loop
              e.currentTarget.src = ''; // Clear the src
              e.currentTarget.style.display = 'none'; // Hide the img
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.classList.add('bg-primary/10');
                parent.textContent = email?.charAt(0).toUpperCase() || '?';
              }
            }}
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