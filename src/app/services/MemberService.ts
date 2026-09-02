import api from "./api";

export interface SignupInput {
  memberNick: string;
  memberPhone: string;
  memberPassword: string;
}

export interface AuthResponse {
  accessToken: string;
  member: {
    _id: string;
    memberNick: string;
    memberPhone: string;
  };
}

class MemberService {
  public async signup(input: SignupInput): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/members/signup", input);
    localStorage.setItem("accessToken", data.accessToken);
    return data;
  }
}

const memberService = new MemberService();

export default memberService;
