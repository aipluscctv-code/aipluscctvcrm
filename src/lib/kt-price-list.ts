// KT 영상보안 제품 단가표 (TEC 기술창업용, 2024.11월 기준 — 참고용, 변동 가능)
export type KtPriceItem = {
  model: string;
  name: string;
  spec?: string;
  price: number | "별도문의";
};

export const KT_PRICE_LIST: { category: string; items: KtPriceItem[] }[] = [
  {
    category: "녹화기",
    items: [
      { model: "KT-5MP04L", name: "ALL-in-One 500만[LITE] DVR 4ch H.265", spec: "4ch, TVI, 1TB", price: 230000 },
      { model: "KT-5MP08L", name: "ALL-in-One 500만[LITE] DVR 8ch H.265", spec: "8ch, TVI, 2TB", price: 310000 },
      { model: "KT-5MP16L", name: "ALL-in-One 500만[LITE] DVR 16ch H.265", spec: "16ch, TVI, 4TB", price: 455000 },
      { model: "KT-N5MP04AI", name: "NVR 프리미엄 인공지능 800만 AI 4CH", price: 280000 },
      { model: "KT-N5MP08AI", name: "NVR 프리미엄 인공지능 800만 AI 8CH", price: 360000 },
      { model: "KT-N5MP16AI", name: "NVR 프리미엄 인공지능 800만 AI 16CH", price: 580000 },
    ],
  },
  {
    category: "카메라 (210만)",
    items: [
      { model: "KT-ST24K", name: "210만 실내 돔 카메라", spec: "SONY EXMOR, IR 24개, 3.6mm", price: 46000 },
      { model: "KT-BT24K", name: "210만 실외 불릿 카메라", spec: "SONY EXMOR, IR 24개, 3.6mm", price: 49000 },
      { model: "KT-ST24K(2.8mm)", name: "210만 실내 돔 카메라 (E/V용)", spec: "SONY 센서, 2.8mm", price: 50000 },
      { model: "KT-HT90/96H", name: "210만 실외 고정하우징 카메라", spec: "IR 90개, 3.6mm", price: 75000 },
      { model: "KT-VFT12", name: "210만 가변 하우징 카메라", spec: "VARIFOCAL 2.7~12mm", price: 90000 },
    ],
  },
  {
    category: "특수카메라 (210만)",
    items: [
      { model: "KT-SVLFT24/K", name: "210만 실내 돔 초저조도 카메라", spec: "SONY STARVIS, 0.01Lux", price: 64000 },
      { model: "KT-BVLFT24/K", name: "210만 실외 불릿 초저조도 카메라", spec: "SONY STARVIS, 0.01Lux", price: 65000 },
      { model: "KT-SST24", name: "210만 연기감지카메라", spec: "온습도·연기·미세먼지 감지, 5MP DVR 연동 필요", price: 145000 },
      { model: "KTT-2MCB", name: "야간컬러 210만 불릿", spec: "3.6mm, 야간 WHITE LED", price: 65000 },
    ],
  },
  {
    category: "카메라 (500만)",
    items: [
      { model: "KT-5MPS24K/24H", name: "500만 실내 돔 카메라", spec: "IR 24개, 3.6mm", price: 53000 },
      { model: "KT-5MPB36K/36H", name: "500만 실외 불릿 카메라", spec: "IR 36개, 3.6mm", price: 58000 },
      { model: "KT-5MPH96H", name: "500만 실외 고정하우징 카메라", spec: "IR 96개, 3.6mm", price: 85000 },
    ],
  },
  {
    category: "특수카메라 (500만)",
    items: [
      { model: "KTT-5MCB", name: "야간컬러 500만 불릿", spec: "3.6mm, 야간 WHITE LED", price: 69000 },
      { model: "KT-5MP18N/NK", name: "500만 18배줌 스피드돔 PTZ 카메라", spec: "광학 18배줌, DC12V 2A 이상", price: 450000 },
    ],
  },
  {
    category: "카메라 (500만 IP)",
    items: [
      { model: "5MIPS", name: "IP카메라 500만 실내 돔 (고감도)", spec: "PoE 48V, IR 30M", price: 82000 },
      { model: "5MIPB", name: "IP카메라 500만 실외 불릿 (고감도)", spec: "PoE 48V, IR 30M", price: 84000 },
      { model: "KT-5MIP20N", name: "IP카메라 20배줌 스피드돔", spec: "광학 18배줌, Onvif 지원", price: 470000 },
      { model: "KT-5MIPMFZV1", name: "500만 가변 실외 불릿 모터라이즈 카메라", spec: "STARVIS, 2.7~13.5mm", price: 120000 },
      { model: "KTT-5MIPSAI", name: "AI 인공지능 IP카메라 실외 불릿", spec: "객체인식, 고감도", price: 110000 },
      { model: "KTT-5MIPBAI", name: "AI 인공지능 IP카메라 실외 불릿", spec: "객체인식, 고감도", price: 110000 },
    ],
  },
  {
    category: "HDD",
    items: [
      { model: "HDD 1TB", name: "DVR/NVR 저장장치 1TB", spec: "W/D 또는 SEAGATE 병행판매", price: 69000 },
      { model: "HDD 2TB", name: "DVR/NVR 저장장치 2TB", price: 95000 },
      { model: "HDD 3TB", name: "DVR/NVR 저장장치 3TB", price: 130000 },
      { model: "HDD 4TB", name: "DVR/NVR 저장장치 4TB", price: 150000 },
      { model: "HDD 6TB", name: "DVR/NVR 저장장치 6TB", price: 230000 },
      { model: "HDD 8TB", name: "DVR/NVR 저장장치 8TB", price: "별도문의" },
    ],
  },
  {
    category: "감지기/센서류",
    items: [
      { model: "KT-HSS", name: "열선감지기", spec: "설치높이 1.8~3m, DC 10~24V", price: 20000 },
      { model: "KT-ISS", name: "적외선감지기 (60m)", spec: "DC 10~24V", price: 40000 },
      { model: "KT-MSS", name: "자석감지기", price: 3000 },
      { model: "KT-SSS", name: "셔터감지기", price: 20000 },
      { model: "KT-WLS", name: "경광등", spec: "DC 12V", price: 20000 },
      { model: "KT-SRS", name: "사이렌", spec: "108dB, DC 12V", price: 5000 },
    ],
  },
  {
    category: "경계장비/리더기",
    items: [
      { model: "KT-CRS", name: "카드리더기 (도어락/DVR/NVR 연동)", spec: "카드사용자 100명, 13.56Hz", price: 110000 },
      { model: "KT-CRC", name: "카드리더기 케이스", price: 15000 },
      { model: "KT-FLS", name: "지문인식기 (도어락/DVR/NVR 연동)", spec: "근태관리 50인", price: 290000 },
      { model: "KT-FLC", name: "지문인식기 케이스", price: 20000 },
      { model: "KT-F2K", name: "(Slim) 지문인식기", spec: "출입문 제어, 13.56Hz", price: 200000 },
      { model: "KT-F2KC", name: "(Slim) 지문인식기 케이스", price: 20000 },
      { model: "KT-RFC", name: "RF 카드키", price: 2000 },
      { model: "KT-RFCS", name: "RF 부착형 카드키", spec: "스티커형", price: 2000 },
    ],
  },
  {
    category: "도어락",
    items: [
      { model: "KTT-GD2000", name: "소형락 무선리모컨 수신기 모듈", price: 60000 },
      { model: "KTT-GLC", name: "유리문 전용 데드볼트 케이스", price: 35000 },
      { model: "KTT-GB70", name: "소형락 방수/탈실버튼", price: 25000 },
      { model: "KTT-GES", name: "소형락 데드볼트 스페이스바", price: 200 },
      { model: "KT-PLOCK", name: "도어락 (방화문, 일반용)", price: 120000 },
      { model: "KT-GLOCK", name: "도어락 (유리문용)", price: 120000 },
      { model: "KT-GLOCK_HC", name: "유리문형 양문 홀더 (클립형)", price: 20000 },
      { model: "KT-PLOCK_MS", name: "방화문용 무선연동기 셋트", spec: "발신기+수신기", price: 60000 },
      { model: "KT-GLOCK_MS", name: "유리문용 무선연동기 셋트", spec: "발신기+수신기", price: 60000 },
    ],
  },
  {
    category: "기타장비",
    items: [
      { model: "KT-M22", name: "DELL 22인치 모니터", spec: "Full HD, HDMI 케이블 포함", price: 210000 },
      { model: "TOC-1220K", name: "전원 어댑터", spec: "12V 5A", price: 8000 },
      { model: "KT-SMPS6A", name: "전원공급장치 SMPS", spec: "3~4대 사용 권장, 13V/14V 6A", price: 25000 },
      { model: "KT-SMPS10A", name: "전원공급장치 SMPS", spec: "5~8대 사용 권장, 13V 10A", price: 45000 },
      { model: "SI-PV02", name: "발룬", spec: "200M 내외, 500만 카메라 100~150M", price: 9000 },
      { model: "KT-AMP", name: "앰프", spec: "출력 200W", price: 95000 },
      { model: "KT-SPK", name: "방수 스피커", spec: "50W", price: 39000 },
      { model: "TL-SG100LP", name: "IP카메라 POE(전원) 4포트", spec: "기가 POE", price: 49000 },
      { model: "TL-SG1008MP", name: "IP카메라 POE(전원) 8포트", spec: "기가 POE", price: 135000 },
      { model: "TL-SG1218MPE", name: "IP카메라 POE(전원) 16포트", spec: "기가 POE", price: 250000 },
    ],
  },
];
