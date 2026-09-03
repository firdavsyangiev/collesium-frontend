import api from "./api";
import {
  AuthResponse,
  LoginInput,
  Member,
  SignupInput,
  TopBuyer,
} from "../../lib/types/member";

class MemberService {
  public async signup(input: SignupInput): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/members/signup", input);
    return data;
  }

  public async login(input: LoginInput): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/members/login", input);
    return data;
  }

  public async getMemberDetail(): Promise<Member> {
    const { data } = await api.get<{ member: Member }>("/members/detail");
    return data.member;
  }

  public async updateMember(input: FormData): Promise<Member> {
    const { data } = await api.patch<{ member: Member }>(
      "/members/update",
      input,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data.member;
  }

  public async logout(): Promise<void> {
    await api.post("/members/logout");
  }

  public async getTopBuyers(): Promise<TopBuyer[]> {
    const { data } = await api.get<TopBuyer[]>("/members/top-buyers");
    return data;
  }
}

const memberService = new MemberService();

export default memberService;
