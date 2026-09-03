import api from "./api";

export interface ContactInput {
  name: string;
  email: string;
  message: string;
}

class CommunityService {
  public async sendContactMessage(input: ContactInput): Promise<void> {
    await api.post("/contact", input);
  }
}

const communityService = new CommunityService();

export default communityService;
