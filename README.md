# KSS (Korean Stock Sentiment) - 주식 여론 분석 대시보드

실시간 주식 투자자 여론 분석 및 감정 점수 시각화 플랫폼

## 📋 목차
- [프로젝트 개요](#프로젝트-개요)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [설치 및 실행](#설치-및-실행)
- [백엔드 API 명세](#백엔드-api-명세)
- [백엔드 연동 가이드](#백엔드-연동-가이드)

---

## 🎯 프로젝트 개요

KSS는 주식 투자자들의 온라인 여론을 실시간으로 수집하고 분석하여, 감정 점수와 트렌드를 시각화하는 대시보드입니다.

### 주요 기능
- 📊 **실시간 여론 점수**: 투자자 감정을 0-100 점수로 계량화
- 📈 **감정-주가 상관관계**: 30일간 감정 추이와 주가 변동 비교
- 🔥 **공포 탐욕 지수**: CNN API 기반 시장 심리 게이지
- 💬 **핵심 키워드 분석**: 긍정/부정/핵심 키워드 추출
- 🎯 **내러티브 추출**: 주요 투자 테마와 강도 시각화
- 👥 **여론 주도자**: 영향력 있는 의견 리더 추적
- ⚡ **FOMO 알림**: 급등/급락 시그널 감지
- 📝 **일일 브리핑**: AI 요약 및 핵심 포인트 제공

---

## 🛠 기술 스택

### Frontend
- **Framework**: React 19.1.1 + TypeScript 5.8.2
- **Build Tool**: Vite 6.2.0 (Rolldown)
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts 3.2.1
- **State Management**: React Hooks (useState, useEffect)

### Backend (Django)
- **Framework**: Django
- **API**: REST API
- **Database**: (백엔드 팀에서 선택)

---

## 📁 프로젝트 구조

```
kss-feature-naverCrawling/
├── frontend/                    # React 프론트엔드
│   ├── src/
│   │   ├── components/         # UI 컴포넌트
│   │   │   ├── dashboard/      # 대시보드 개별 패널들
│   │   │   └── layout/         # Header, Sidebar
│   │   ├── services/           # ⭐ API 연동 레이어
│   │   │   ├── api.ts          # 백엔드 API 호출 함수들
│   │   │   └── stockService.ts # 비즈니스 로직 + Mock/Real 전환
│   │   ├── types.ts            # TypeScript 타입 정의
│   │   ├── constants.ts        # Mock 데이터
│   │   └── App.tsx
│   ├── .env                    # 환경 변수 (VITE_API_URL)
│   └── package.json
│
└── backend/                    # Django 백엔드
    ├── crawling/               # 크롤링 앱
    │   ├── models/
    │   ├── views/
    │   └── urls.py
    ├── kss/                    # Django 설정
    └── manage.py
```

---

## 🚀 설치 및 실행

### Frontend 실행
```bash
cd frontend
npm install
npm run dev
```
- 개발 서버: http://localhost:5173
- 현재 Mock 데이터 모드로 실행됨

### Backend 실행
```bash
cd backend
pip install -r requirement.txt
python manage.py migrate
python manage.py runserver
```
- 백엔드 서버: http://localhost:8000

---

## 📡 백엔드 API 명세

### 기본 정보
- **Base URL**: `http://localhost:8000`
- **Content-Type**: `application/json`
- **CORS**: Frontend `http://localhost:5173` 허용 필요

### API 엔드포인트

#### 1. 종목 목록
```http
GET /api/stocks/top?limit=10
```
**응답 예시**:
```json
[
  {
    "id": "samsung",
    "name": "삼성전자",
    "ticker": "005930",
    "mentions": 1234,
    "sentiment_score": 75.5
  }
]
```

---

#### 2. 실시간 여론 점수
```http
GET /api/sentiment/realtime/{ticker}
```
**파라미터**: `ticker` - 종목 코드 (예: "005930")

**응답 예시**:
```json
{
  "score": 75.5,
  "summary": {
    "totalMentions": 1234,
    "activeUsers": 567,
    "positiveRatio": 0.65,
    "avgSentiment": 75.5,
    "trendDirection": "up"
  },
  "previousScore": 70.2,
  "change": 5.3
}
```

---

#### 3. 감정 추이 데이터 (30일)
```http
GET /api/sentiment/trend/{ticker}?days=30
```
**응답 예시**:
```json
[
  {
    "date": "11월 1일",
    "positive": 65,
    "negative": 35
  },
  {
    "date": "11월 2일",
    "positive": 70,
    "negative": 30
  }
]
```

---

#### 4. 주가 데이터
```http
GET /api/stock-price/{ticker}?days=30
```
**응답 예시**:
```json
[
  {
    "date": "2024-11-01",
    "close": 71000,
    "volume": 12345678
  },
  {
    "date": "2024-11-02",
    "close": 72500,
    "volume": 10234567
  }
]
```

---

#### 5. AI 요약
```http
GET /api/ai/summary/{ticker}
```
**응답 예시**:
```json
{
  "text": "삼성전자에 대한 투자자 심리가 매우 긍정적입니다.",
  "timestamp": "2024-11-16T10:30:00Z"
}
```

---

#### 6. 핵심 키워드
```http
GET /api/keywords/{ticker}
```
**응답 예시**:
```json
[
  {
    "word": "실적발표",
    "count": 450,
    "sentiment": "positive"
  },
  {
    "word": "경쟁심화",
    "count": 280,
    "sentiment": "negative"
  },
  {
    "word": "기술혁신",
    "count": 520,
    "sentiment": "core"
  }
]
```
- `sentiment`: `"positive"` | `"negative"` | `"core"`

---

#### 7. 내러티브 (투자 테마)
```http
GET /api/narratives/{ticker}
```
**응답 예시**:
```json
[
  {
    "id": "n1",
    "theme": "신기술 개발 성공",
    "sentiment": "positive",
    "strength": 0.85,
    "examples": [
      "AI 기술 특허 출원",
      "차세대 반도체 개발",
      "글로벌 파트너십 체결"
    ]
  },
  {
    "id": "n2",
    "theme": "시장 경쟁 심화",
    "sentiment": "negative",
    "strength": 0.60,
    "examples": [
      "중국 업체 점유율 확대",
      "가격 경쟁 격화"
    ]
  }
]
```
- `sentiment`: `"positive"` | `"negative"`
- `strength`: 0.0 ~ 1.0 (강도)

---

#### 8. FOMO 알림
```http
GET /api/alerts/fomo/{ticker}
```
**응답 예시**:
```json
[
  {
    "id": "fomo-1",
    "type": "surge",
    "title": "급등 알림",
    "message": "최근 1시간 동안 언급량 급증",
    "timestamp": "2024-11-16T10:30:00Z",
    "severity": "high"
  }
]
```
- `type`: `"surge"` | `"spike"` | `"trend"`
- `severity`: `"high"` | `"medium"` | `"low"`

---

#### 9. 여론 주도자
```http
GET /api/opinion-leaders/{ticker}
```
**응답 예시**:
```json
[
  {
    "id": "ol1",
    "username": "투자고수",
    "influence": 0.90,
    "sentiment": "bullish",
    "recentPost": "삼성전자 실적 발표 후 주가 상승 전망..."
  },
  {
    "id": "ol2",
    "username": "시장분석가",
    "influence": 0.75,
    "sentiment": "neutral",
    "recentPost": "단기적으로는 조정 가능성..."
  }
]
```
- `sentiment`: `"bullish"` | `"bearish"` | `"neutral"`
- `influence`: 0.0 ~ 1.0

---

#### 10. 실시간 댓글
```http
GET /api/comments/realtime/{ticker}?limit=5
```
**응답 예시**:
```json
[
  {
    "id": "comment-1",
    "author": "사용자1",
    "text": "이 종목 매수했습니다!",
    "timestamp": "2024-11-16T10:30:00Z",
    "sentiment": "positive",
    "likes": 42
  }
]
```

---

#### 11. 일일 브리핑
```http
GET /api/briefing/daily/{ticker}
```
**응답 예시**:
```json
{
  "summary": "삼성전자에 대한 오늘의 투자자 심리를 요약합니다.",
  "keyPoints": [
    "실적 발표 이후 긍정적 반응 지속",
    "기관 투자자 매수세 증가",
    "기술적 분석상 상승 추세 유지",
    "글로벌 시장 불확실성은 리스크 요인",
    "장기 전망은 여전히 긍정적"
  ],
  "outlook": "positive"
}
```
- `outlook`: `"positive"` | `"neutral"` | `"negative"`

---

#### 12. 24시간 감정 추이
```http
GET /api/sentiment/hourly/{ticker}
```
**응답 예시**:
```json
[
  {
    "time": "0:00",
    "sentiment": 65.5,
    "volume": 450
  },
  {
    "time": "1:00",
    "sentiment": 68.2,
    "volume": 380
  }
]
```
- 0:00 ~ 23:00 (24개 데이터)

---

## 🔌 백엔드 연동 가이드

### Step 1: 환경 변수 설정
`frontend/.env` 파일 생성:
```env
VITE_API_URL=http://localhost:8000
```

### Step 2: Mock 모드 비활성화
`frontend/src/services/stockService.ts` 파일 수정:

```typescript
// 4번째 줄
const USE_BACKEND = true;  // false → true 로 변경
```

### Step 3: CORS 설정 (Django)
`backend/kss/settings.py`:
```python
INSTALLED_APPS = [
    'corsheaders',
    # ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
```

### Step 4: API 응답 형식 확인
- 위의 API 명세대로 JSON 응답 형식을 맞춰주세요
- TypeScript 타입 정의는 `frontend/src/types.ts` 참고

### Step 5: 테스트
```bash
# Frontend 실행
cd frontend
npm run dev

# Backend 실행 (다른 터미널)
cd backend
python manage.py runserver
```

브라우저에서 http://localhost:5173 접속 후 네트워크 탭에서 API 호출 확인

---

## 🐛 트러블슈팅

### 문제: CORS 에러
**해결**: Django `django-cors-headers` 설치 및 설정 확인

### 문제: API 호출 실패
**해결**: 
1. `stockService.ts`의 `USE_BACKEND` 값 확인
2. `.env` 파일의 `VITE_API_URL` 확인
3. Backend 서버 실행 상태 확인
4. 브라우저 콘솔에서 에러 메시지 확인

### 문제: Mock 데이터가 계속 표시됨
**해결**: 
- `stockService.ts`에서 `USE_BACKEND = true` 확인
- 브라우저 캐시 삭제 (Ctrl + Shift + R)
- Vite 캐시 삭제 후 재시작:
  ```bash
  rm -rf node_modules/.vite
  npm run dev
  ```

---

## 📞 연락처
- Frontend: [프론트엔드 개발자]
- Backend: [백엔드 개발자]
- Repository: https://github.com/Unani0528/kss

---

## 📝 개발 노트

### Frontend 서비스 레이어 구조
```
services/
├── api.ts              # 순수 HTTP 호출 함수들 (14개 엔드포인트)
└── stockService.ts     # 비즈니스 로직 + Mock/Real 전환
```

**api.ts**: 각 백엔드 API 엔드포인트별 함수 (fetchAPI 헬퍼 사용)
**stockService.ts**: 
- `USE_BACKEND` 플래그로 Mock/Real 전환
- `getStockData()`: 모든 API 병렬 호출 후 Stock 객체로 변환
- `generateMockStock()`: Mock 데이터 생성

### TypeScript 타입 정의 위치
모든 데이터 타입은 `frontend/src/types.ts`에 정의되어 있습니다:
- `Stock`: 전체 종목 데이터
- `Company`: 기업 정보
- `Keyword`: 키워드
- `Narrative`: 내러티브
- `OpinionLeader`: 여론 주도자
- `Comment`: 댓글
- `FomoAlert`: FOMO 알림
- 기타 모든 인터페이스

---

## ✅ 체크리스트 (백엔드 개발자용)

- [ ] Django CORS 설정 완료
- [ ] 12개 API 엔드포인트 구현
- [ ] API 응답 형식이 명세와 일치하는지 확인
- [ ] 종목 코드(ticker) 파라미터 처리
- [ ] 날짜 형식: ISO 8601 (예: "2024-11-16T10:30:00Z")
- [ ] 한국어 날짜: "11월 16일" 형식
- [ ] 에러 핸들링 (404, 500 등)
- [ ] 개발 서버 실행 확인 (http://localhost:8000)
- [ ] Frontend와 통합 테스트 완료

---

**Last Updated**: 2025년 11월 16일