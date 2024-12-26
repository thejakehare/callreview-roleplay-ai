import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export interface Profile {
  role: string;
  avatar_url: string | null;
  first_name: string;
  last_name: string;
}

export const profileApi = {
  async getProfile(userId: string): Promise<Profile | null> {
    console.log('Fetching profile for user:', userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('role, avatar_url, first_name, last_name')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      toast.error('Error loading profile');
      return null;
    }

    if (data) {
      console.log('Profile data fetched:', data);
      return data;
    }

    console.log('No profile data found');
    return null;
  },

  async createProfile(userId: string, profile: Partial<Profile>): Promise<boolean> {
    console.log('Creating profile for user:', userId, 'with data:', profile);
    
    const { error } = await supabase
      .from('profiles')
      .insert([{ id: userId, ...profile }]);

    if (error) {
      console.error('Error creating profile:', error);
      toast.error('Error creating profile');
      return false;
    }

    toast.success('Profile created successfully');
    return true;
  },

  async updateProfile(userId: string, profile: Partial<Profile>): Promise<boolean> {
    console.log('Updating profile with:', profile);
    
    const { error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', userId);

    if (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
      return false;
    }

    toast.success('Profile updated successfully');
    return true;
  },

  async uploadAvatar(userId: string, file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}-${Math.random()}.${fileExt}`;

      console.log('Uploading avatar:', filePath);
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('Updating profile with new avatar:', filePath);
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: filePath })
        .eq('id', userId);

      if (updateError) throw updateError;

      toast.success('Profile photo updated successfully');
      return publicUrl;
    } catch (error: any) {
      console.error('Error uploading profile photo:', error);
      toast.error('Error uploading profile photo');
      return null;
    }
  }
};