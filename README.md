# blog

[Astro](https://astro.build/) + Content Collections 기반 개인 블로그 + 공부 정리 사이트.

`main` 브랜치에 push하면 GitHub Actions가 자동으로 빌드·배포합니다.

배포 주소: https://s4ng.github.io/

- 다크 전용 테마 (배경: Material Darker `#212121`)
- 상단 메뉴: 블로그 / 학습기록 / 정보

## 콘텐츠 구조

콘텐츠는 두 개의 [Content Collection](https://docs.astro.build/en/guides/content-collections/)으로 관리합니다. 스키마는 `src/content.config.ts`에 정의되어 있습니다.

- `src/content/blog/` — 블로그 글. 홈(`/`)에서 **연도별로 그룹핑**되어 나열됩니다.
  - frontmatter: `title`, `date`(YYYY-MM-DD), `tags`(선택)
  - URL: `/blog/<슬러그>/` (슬러그 = 파일/폴더 이름)
- `src/content/study/` — 강의·책 공부 정리. `/study` 페이지에서 **대메뉴 → 서브그룹 → 순서**대로 나열됩니다.
  - frontmatter: `title`, `category`(대메뉴), `group`(서브그룹, 선택), `order`(정렬 순서)
  - 예: `study/java/effective-java/`, `study/java/jvm-lecture/`, `study/design-patterns/`

## 글 작성

### 블로그 글

`src/content/blog/`에 `YYYY-MM-DD-slug.md` 파일을 만들고 frontmatter를 채웁니다.

```md
---
title: 글 제목
date: 2025-08-14
tags: [dev]
---

본문 시작...
```

### 공부 정리 (study)

`src/content/study/` 아래 적절한 폴더에 `.md` 파일을 만들고 frontmatter로 위치·순서를 지정합니다.

```md
---
title: "전략 패턴"
category: "디자인 패턴"
order: 1
---

본문...
```

- `category`가 대메뉴, `group`(있으면)이 서브그룹, `order`가 그룹 내 정렬 순서입니다.
- 대메뉴/서브그룹의 **표시 순서**는 `src/pages/study/index.astro`의 `CATEGORY_ORDER`·`GROUP_ORDER`에서 조정합니다.

## 이미지 첨부

### 방식 A: 글 옆 폴더 (권장)

글을 폴더로 만들고 이미지를 옆에 둔 뒤 **상대경로**로 참조합니다. Astro가 자동으로 최적화(webp 변환 등)합니다.

```
src/content/blog/
└─ 2025-08-14-my-post/
   ├─ index.md          # 본문 (파일명 index.md 고정)
   └─ screenshot.png
```

```md
![스크린샷](screenshot.png)
```

### 방식 B: public 폴더 (공용 이미지·로고)

`public/`에 두고 **절대경로**(`public` 생략)로 참조합니다. 이 경로의 파일은 최적화 없이 그대로 서빙됩니다.

```md
![프로필](/profile.png)
```

- 큰 원본 이미지는 미리 줄여서 커밋하세요.

## 로컬 개발

```bash
npm install      # 최초 1회 (또는 의존성 변경 시)
npm run dev      # 개발 서버 (http://localhost:4321)
npm run build    # 프로덕션 빌드 (배포 전 검증, 출력: dist/)
npm run preview  # 빌드 결과를 로컬에서 확인
```

> 참고: `vite`를 `^6`으로 고정해 두었습니다(`package.json`의 `overrides`). Node 20.19 미만 환경에서 상위 vite가 끌려와 빌드가 깨지는 것을 막기 위함입니다.

## 배포

1. (최초 1회) GitHub 저장소 **Settings → Pages → Build and deployment → Source = "GitHub Actions"** 로 설정.
2. `main` 브랜치에 push → `.github/workflows/deploy.yml` 워크플로가 자동 실행되어 GitHub Pages(`dist/`)에 배포.

> 빠른 수정은 GitHub 웹 에디터(저장소에서 `.` 키 → github.dev)로도 가능합니다.
