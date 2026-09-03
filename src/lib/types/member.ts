export enum MemberType {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum MemberStatus {
  ACTIVE = "ACTIVE",
  BLOCK = "BLOCK",
  DELETE = "DELETE",
}

export interface Member {
  _id: string;
  memberType: MemberType;
  memberStatus: MemberStatus;
  memberNick: string;
  memberPhone: string;
  memberImage?: string;
  memberPoints: number;
  memberAddress?: string;
  memberDesc?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SignupInput {
  memberNick: string;
  memberPhone: string;
  memberPassword: string;
}

export interface LoginInput {
  memberPhone: string;
  memberPassword: string;
}

export interface AuthResponse {
  accessToken: string;
  member: Member;
}
