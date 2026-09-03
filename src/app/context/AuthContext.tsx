import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  LoginInput,
  Member,
  SignupInput,
} from "../../lib/types/member";
import MemberService from "../services/MemberService";

interface AuthContextValue {
  member: Member | null;
  isAuthLoading: boolean;
  signup: (input: SignupInput) => Promise<Member>;
  login: (input: LoginInput) => Promise<Member>;
  logout: () => Promise<void>;
  updateMember: (input: FormData) => Promise<Member>;
  refreshMember: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const refreshMember = useCallback(async () => {
    try {
      setMember(await MemberService.getMemberDetail());
    } catch {
      localStorage.removeItem("accessToken");
      setMember(null);
    }
  }, []);

  useEffect(() => {
    refreshMember().finally(() => setIsAuthLoading(false));
  }, [refreshMember]);

  const value = useMemo<AuthContextValue>(
    () => ({
      member,
      isAuthLoading,
      signup: async (input) => {
        const response = await MemberService.signup(input);
        localStorage.setItem("accessToken", response.accessToken);
        setMember(response.member);
        return response.member;
      },
      login: async (input) => {
        const response = await MemberService.login(input);
        localStorage.setItem("accessToken", response.accessToken);
        setMember(response.member);
        return response.member;
      },
      logout: async () => {
        try {
          await MemberService.logout();
        } finally {
          localStorage.removeItem("accessToken");
          setMember(null);
        }
      },
      updateMember: async (input) => {
        const updatedMember = await MemberService.updateMember(input);
        setMember(updatedMember);
        return updatedMember;
      },
      refreshMember,
    }),
    [isAuthLoading, member, refreshMember],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
