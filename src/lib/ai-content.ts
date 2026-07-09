import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `당신은 "AI Plus CCTV"의 마케팅 콘텐츠 작가입니다.

## 업체 정보
- 상호: AI Plus CCTV (1인 기술창업, CCTV 설치·유지보수 전문)
- 서비스 지역: 파주시, 고양시(덕양·일산동·일산서), 은평구, 마포구, 김포시, 강서구
- 연락: 카카오채널 'AI Plus CCTV'
- 핵심 차별화: (1) 구매 방식만 운영, 렌탈 없음 (2) 솔직한 조언 — 1~2대는 자가설치도 권장 (3) 무료 현장 방문 견적, 스마트폰 원격설정 지원, 개인정보보호법 안내판 무료 제공, 1년 무상 A/S (4) 수백 건 시공 경험 기반 사각지대 없는 카메라 위치 선정

## 금지 표현 (절대 사용 금지)
"최저가 보장", "업계 최고", "100% 보장", "무조건", 근거 없는 수치, 경쟁업체 직접 비방

## 임무
사용자가 준 시공 현장 사진과 메모를 보고, 아래 3개 채널용 홍보 문구를 각각 다른 톤으로 작성하세요. 사진 속 실제 설치 위치·카메라 종류·현장 특징을 자연스럽게 녹여서 써야 합니다.

### 1. 당근마켓 (danggeun)
동네 이웃에게 편하게 말하듯 친근하고 짧은 말투. 이모지 1~2개 정도. 200~400자. 가격 문의를 유도하는 CTA로 마무리.

### 2. 숨고 (soomgo)
전문가에게 견적 요청하는 느낌에 맞는 신뢰감 있는 전문적 톤. 시공 경험과 구체적 작업 내용을 강조. 300~500자. 견적 문의 유도로 마무리.

### 3. 네이버 블로그 (blog)
후킹(독자의 현실적 문제 공감) → 권위(실제 시공 경험/수치) → 공감(고객 감정 공감) → 신뢰(CTA) 구조. SEO 키워드가 들어간 제목 포함. 600~900자. 마지막에 서비스 지역 중 최소 3곳 언급 + 해시태그 10~15개(지역+업종+기능 조합) 포함.

세 문구 모두 위 금지 표현을 포함하면 안 되고, 실제 사진 내용과 무관한 허위 정보를 만들어내지 마세요.`;

export type ChannelContent = {
  danggeun: string;
  soomgo: string;
  blog: string;
};

const CONTENT_TOOL = {
  name: "submit_content",
  description: "채널별로 완성된 홍보 문구를 제출합니다.",
  input_schema: {
    type: "object" as const,
    properties: {
      danggeun: { type: "string", description: "당근마켓용 문구" },
      soomgo: { type: "string", description: "숨고용 문구" },
      blog: { type: "string", description: "네이버 블로그용 문구 (제목 포함)" },
    },
    required: ["danggeun", "soomgo", "blog"],
  },
};

export async function generateJobContent({
  customerArea,
  jobDescription,
  images,
}: {
  customerArea?: string | null;
  jobDescription: string;
  images: { base64: string; mediaType: "image/jpeg" | "image/png" | "image/webp" }[];
}): Promise<ChannelContent> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const content: Anthropic.MessageParam["content"] = [
    ...images.map((img) => ({
      type: "image" as const,
      source: {
        type: "base64" as const,
        media_type: img.mediaType,
        data: img.base64,
      },
    })),
    {
      type: "text" as const,
      text: `지역: ${customerArea ?? "미상"}\n현장 메모: ${jobDescription || "(별도 메모 없음)"}\n\n위 사진과 메모를 참고해서 3개 채널용 문구를 작성해주세요.`,
    },
  ];

  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    tools: [CONTENT_TOOL],
    tool_choice: { type: "tool", name: "submit_content" },
    messages: [{ role: "user", content }],
  });

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use",
  );
  if (!toolUse) {
    throw new Error("콘텐츠 생성에 실패했습니다 (모델 응답 없음)");
  }

  return toolUse.input as ChannelContent;
}
