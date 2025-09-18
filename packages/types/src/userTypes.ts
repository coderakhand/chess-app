
export interface FidePlayer {
  rank: number;
  name: string;
  federation: string;
  flagAbbreviation: string;
  rating: number;
  birthYear: number;
}

export interface UserInfo {
  isGuest: boolean;
  id: string | null;
  username: string;
  email: string;
  ratings: {
    bullet: number;
    blitz: number;
    rapid: number;
  };
}