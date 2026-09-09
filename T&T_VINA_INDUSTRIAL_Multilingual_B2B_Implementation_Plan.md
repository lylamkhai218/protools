# T&T VINA INDUSTRIAL — Multilingual B2B Website Implementation Plan

## 0. Objective

Build a production-grade multilingual localization system for:

- `protools.com.vn/`
- `protools.com.vn/murrplastik/`

Current state:

- Protools homepage/site: Vietnamese only.
- Murrplastik: Vietnamese + English.
- The company needs better Chinese-language support for B2B customer communication at VEC 2026.

This is **not just a language dropdown**. The system must support accurate industrial terminology, scalable translations, SEO, responsive UX, and future AI + human translation workflows.

---

## 1. Default Language — Critical Requirement

**Vietnamese must be the default language.**

Required behavior:

1. First-time visitors see **Vietnamese (`vi`) by default**.
2. Do **not** force language selection on first visit.
3. Do **not** automatically redirect users based solely on IP/geolocation.
4. Browser-language detection may only be used as a non-blocking suggestion if desired.
5. Once the user explicitly selects another language, persist that preference.
6. On subsequent visits, restore the user's selected language.
7. If no saved preference exists, fallback must always be Vietnamese.

Priority:

```text
Explicit user selection
        ↓
Saved locale preference
        ↓
Optional browser-language suggestion
        ↓
🇻🇳 Vietnamese (default)
```

Vietnamese is the canonical/source language.

---

## 2. Required Languages

Implement locale architecture for exactly these languages, in this order:

1. 🇻🇳 Vietnamese — `vi`
2. 🇬🇧 English — `en`
3. 🇩🇪 Deutsch — `de`
4. 🇨🇳 中文 — `zh-CN`
5. 🇰🇷 한국어 — `ko`
6. 🇯🇵 日本語 — `ja`
7. 🇹🇭 ไทย — `th`

Display language names in their native form:

```text
🇻🇳 Tiếng Việt
🇬🇧 English
🇩🇪 Deutsch
🇨🇳 中文
🇰🇷 한국어
🇯🇵 日本語
🇹🇭 ไทย
```

Flags must appear before the language name.

Do not use the flag as the only identifier.

---

## 3. Mandatory Pre-Implementation Audit

Before modifying code, inspect the existing codebase.

Do not assume the framework or architecture.

Audit:

- `package.json`
- framework
- router
- build system
- existing i18n implementation
- Murrplastik routing
- current VI/EN implementation
- components
- hardcoded strings
- content structure
- SEO metadata
- sitemap
- robots
- deployment configuration
- existing URLs and redirects

Produce an architecture report before major implementation.

**Do not rewrite Murrplastik blindly.**

---

## 4. Recommended Architecture

Use one shared i18n architecture for the whole Protools ecosystem.

Conceptual structure:

```text
/components
  /language-switcher
  /header
  /footer
  /navigation
  /product
  /forms

/locales
  /vi
  /en
  /de
  /zh-CN
  /ko
  /ja
  /th

/content
  /pages
  /products
  /navigation
  /seo

/i18n
  config
  routing
  locale-detection
  translation-loader
  translation-utils
  glossary
```

Adapt the exact structure to the current framework.

Do not create seven duplicated component trees.

---

## 5. Locale Routing

Prefer locale-aware URLs.

Example:

```text
/vi/
/en/
/de/
/zh/
/ko/
/ja/
/th/
```

Example product/page routes:

```text
/vi/products/
/en/products/
/de/products/
/zh/products/
/ko/products/
/ja/products/
/th/products/
```

Murrplastik:

```text
/vi/murrplastik/
/en/murrplastik/
/de/murrplastik/
/zh/murrplastik/
/ko/murrplastik/
/ja/murrplastik/
/th/murrplastik/
```

However, inspect existing indexed URLs first.

Existing SEO URLs should be preserved where practical. If a URL must change, implement documented redirects and migration.

Avoid:

```text
?lang=zh
?language=english
```

unless technically unavoidable.

---

## 6. Language Switcher UX

Use the existing Protools design language.

Do not redesign the entire website.

### Desktop

Compact selector in the header:

```text
🇻🇳 VI ▾
```

Dropdown:

```text
┌─────────────────────────┐
│ 🇻🇳 Tiếng Việt      ✓   │
│ 🇬🇧 English             │
│ 🇩🇪 Deutsch             │
│ 🇨🇳 中文                 │
│ 🇰🇷 한국어               │
│ 🇯🇵 日本語               │
│ 🇹🇭 ไทย                 │
└─────────────────────────┘
```

### Mobile

Use a compact selector and vertical list/sheet.

Do not render seven horizontal language buttons.

### UX requirements

- Current language is visually obvious.
- Selected state is clear.
- Native language names are used.
- Flags appear before names.
- Dropdown closes on outside click.
- Escape closes the dropdown.
- Keyboard navigation works.
- Focus-visible state is clear.
- No layout shift.
- No overflow.

---

## 7. Required Design Skills

Use:

- `/design-taste-frontend`
- `/ui-ux-pro-max`

Apply them specifically to:

- language switcher
- header integration
- dropdown
- mobile language sheet
- typography
- spacing
- responsive behavior
- interaction states
- accessibility

The result must feel:

- industrial
- professional
- restrained
- technical
- trustworthy
- B2B

Avoid making it look like:

- SaaS dashboard
- generic AI template
- Google Translate widget
- language-demo website

---

## 8. Accessibility

The language switcher must support:

- semantic button
- `aria-label`
- `aria-expanded`
- `aria-current`
- keyboard navigation
- Enter
- Space
- Escape
- focus-visible
- screen readers
- reduced motion

Do not use emoji as UI icons.

Flags should use appropriate flag assets/visual elements.

---

## 9. Translation Architecture

Never hard-code user-facing UI text inside components.

Bad:

```tsx
<h1>Giải pháp tự động hóa</h1>
```

Good:

```tsx
<h1>{t("solutions.automation.title")}</h1>
```

Example:

```json
{
  "solutions": {
    "automation": {
      "title": "Giải pháp tự động hóa"
    }
  }
}
```

Keep separate translation domains for:

- UI
- navigation
- product content
- technical specifications
- SEO metadata
- forms
- validation/errors
- CTAs

---

## 10. Technical Glossary — Critical for Industrial B2B

Create a structured technical glossary.

Initial concepts should include:

- cable carrier
- drag chain
- energy chain
- cable protection
- protective conduit
- connector
- cable gland
- industrial automation
- robotics
- CNC
- machine tooling
- cable management
- automation solutions
- industrial components

Glossary entries must support all seven locales.

Approved glossary terminology must take precedence over generic machine translation.

Do not allow an AI translation system to randomly retranslate approved technical terms.

---

## 11. Translation Workflow

Recommended:

```text
🇻🇳 Vietnamese source
        ↓
Professional translation / AI-assisted translation
        ↓
Technical glossary enforcement
        ↓
Human review
        ↓
Publish
```

Do not directly publish generic machine translations for important:

- product names
- technical specifications
- industrial terminology
- company descriptions
- sales claims
- safety information

---

## 12. Murrplastik Migration

Murrplastik currently has Vietnamese + English.

Do not rebuild it from scratch without auditing the existing implementation.

Required:

1. Audit existing VI/EN implementation.
2. Extract existing translations.
3. Migrate them into the shared i18n architecture.
4. Preserve current behavior.
5. Preserve existing SEO URLs where possible.
6. Add:
   - German
   - Chinese
   - Korean
   - Japanese
   - Thai

The final architecture should be shared between Protools homepage and Murrplastik.

---

## 13. Persistence

When a user selects a language:

```text
User selects 🇨🇳 中文
        ↓
Save `zh-CN`
        ↓
Navigate in Chinese
        ↓
Refresh
        ↓
Remain in Chinese
```

Browser back/forward must work correctly.

Deep links must retain the correct locale.

If no preference exists, use Vietnamese.

---

## 14. Do Not Force IP-Based Language

Do not do:

```text
IP = China
↓
Force Chinese
```

This creates bad UX for:

- VPN users
- travelers
- Vietnamese staff abroad
- international customers working in Vietnam

User choice always wins.

---

## 15. SEO

Every localized page must correctly support:

- canonical
- hreflang
- locale metadata
- Open Graph
- sitemap integration
- structured data where appropriate

Expected hreflang set:

```html
<link rel="alternate" hreflang="vi" ... />
<link rel="alternate" hreflang="en" ... />
<link rel="alternate" hreflang="de" ... />
<link rel="alternate" hreflang="zh-CN" ... />
<link rel="alternate" hreflang="ko" ... />
<link rel="alternate" hreflang="ja" ... />
<link rel="alternate" hreflang="th" ... />
```

Do not create conflicting canonical/hreflang relationships.

---

## 16. SEO Metadata Localization

Translate/localize:

- `<title>`
- meta description
- Open Graph title
- Open Graph description
- canonical
- hreflang

Do not use the Vietnamese metadata for every locale.

---

## 17. Performance

Do not unnecessarily load all seven locale dictionaries on the initial page.

Use the framework's best available:

- server-side locale loading
- lazy loading
- code splitting
- locale-specific bundles

Goals:

- no unnecessary JS bundle growth
- no blocking translation load
- no layout shift
- no LCP regression
- no duplicated content loading

---

## 18. B2B Chinese Experience

Chinese localization must prioritize business intent, not literal word replacement.

Important actions:

```text
产品
行业解决方案
关于 T&T
联系我们
获取报价
产品目录 / 下载
```

The Chinese experience should make it easy for a visiting customer to:

1. Understand T&T.
2. Find relevant products.
3. Understand technical capabilities.
4. Request a quotation.
5. Contact the company.

---

## 19. Future Multilingual Sales Assistant

Design the architecture so a future feature can support:

```text
Vietnamese sales input
        ↓
Industrial terminology layer
        ↓
Chinese business-language translation
        ↓
Customer-ready Chinese output
```

Potential actions:

- Copy
- Send
- WeChat
- Email
- Zalo

This is a future phase, not a requirement to build immediately.

---

## 20. Multi-Agent Execution

If Antigravity supports parallel agents, divide work into:

### Agent A — Architecture / CTO

Audit codebase and create:

`I18N_ARCHITECTURE.md`

No major UI changes.

### Agent B — UI/UX

Use:

- `/design-taste-frontend`
- `/ui-ux-pro-max`

Implement language selector and responsive states.

### Agent C — i18n

Implement:

- locale config
- routing
- translation loader
- fallback
- persistence
- locale-aware navigation

### Agent D — Content

Inventory hardcoded strings.

Create translation keys.

Create glossary structure.

### Agent E — SEO

Implement:

- canonical
- hreflang
- sitemap
- metadata
- Open Graph
- structured data

### Agent F — QA

Test all seven locales and responsive breakpoints.

---

## 21. QA Breakpoints

Test at minimum:

```text
375px
768px
1024px
1440px
```

Test all:

```text
🇻🇳 VI
🇬🇧 EN
🇩🇪 DE
🇨🇳 ZH-CN
🇰🇷 KO
🇯🇵 JA
🇹🇭 TH
```

Test:

- navigation
- language switcher
- refresh
- browser back/forward
- deep links
- 404
- forms
- footer
- metadata
- long German strings
- Chinese typography
- Japanese wrapping
- Korean wrapping
- Thai wrapping

---

## 22. Acceptance Criteria

The feature is not complete until:

### Functional

- [ ] Vietnamese is the default language.
- [ ] Seven locales are supported.
- [ ] Language switcher works.
- [ ] User selection persists.
- [ ] Refresh preserves language.
- [ ] Browser back/forward works.
- [ ] Deep links work.
- [ ] 404 behavior works per locale.
- [ ] Murrplastik VI/EN behavior does not regress.

### Content

- [ ] No unexpected hardcoded UI strings.
- [ ] Translation keys are structured.
- [ ] Technical glossary exists.
- [ ] Missing translation fallback exists.
- [ ] Important technical/product translations are reviewable.

### SEO

- [ ] Canonical is correct.
- [ ] Hreflang is correct.
- [ ] Sitemap is locale-aware.
- [ ] Metadata is localized.
- [ ] Open Graph is localized.
- [ ] Existing indexed URLs are protected where possible.

### UX

- [ ] Desktop works.
- [ ] Tablet works.
- [ ] Mobile works.
- [ ] Keyboard works.
- [ ] Screen reader semantics are present.
- [ ] Focus states are visible.
- [ ] Escape works.
- [ ] No overflow.
- [ ] No layout shift.
- [ ] Reduced-motion behavior is respected.

### Performance

- [ ] No unnecessary loading of all locale dictionaries.
- [ ] No significant LCP regression.
- [ ] No unnecessary JS bundle growth.

---

## 23. Recommended Implementation Order

### Phase 0 — Audit

```text
Codebase
↓
Framework
↓
Routing
↓
Existing i18n
↓
Murrplastik
↓
SEO
```

### Phase 1 — Foundation

```text
Locale config
↓
Routing
↓
Translation loader
↓
Fallback
↓
Persistence
```

### Phase 2 — UI

```text
Language switcher
↓
Desktop
↓
Mobile
↓
Accessibility
```

### Phase 3 — Migration

```text
Existing Vietnamese
↓
Existing English
↓
Murrplastik VI/EN
```

### Phase 4 — Localization

```text
🇻🇳 VI
↓
🇬🇧 EN
↓
🇩🇪 DE
↓
🇨🇳 ZH-CN
↓
🇰🇷 KO
↓
🇯🇵 JA
↓
🇹🇭 TH
```

For business priority, Chinese may be completed immediately after the existing VI/EN foundation because of the current VEC customer need.

### Phase 5 — SEO + QA

```text
hreflang
↓
canonical
↓
sitemap
↓
metadata
↓
responsive QA
↓
translation QA
↓
technical terminology QA
```

---

## 24. Final Engineering Principle

This must be a professional international industrial B2B localization system.

It must not feel like:

- Google Translate widget
- generic AI website
- SaaS dashboard
- language-demo UI

It should feel:

- technical
- restrained
- trustworthy
- international
- fast
- easy to use
- consistent with T&T VINA INDUSTRIAL

**Critical default rule:**

> If the user has never explicitly selected another language, the website must open in 🇻🇳 Tiếng Việt.
