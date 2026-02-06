import { type Database } from '@/types/database.types';
import { type UserProfile, UserProfileSchema } from '../models/UserProfile';

type ProfileRow = Database['public']['Tables']['user_profiles']['Row'];

export function toUserProfile(row: ProfileRow): UserProfile {
	const mappedData = {
		id: row.id,
		firstName: row.first_name ?? '',
		lastName: row.last_name ?? '',
		isOnboarded: row.is_onboarded ?? false,
		timezone: row.timezone ?? 'UTC',
	};

	return UserProfileSchema.parse(mappedData);
}