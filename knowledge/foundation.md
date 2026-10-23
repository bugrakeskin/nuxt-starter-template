---
type: Architecture
title: Generic Nuxt foundation
description: Framework and delivery sources without customer domain features.
generated: { by: agent/codex, at: "2026-10-21T16:09:59Z" }
status: stable
code_refs: [knowledge/development.md, knowledge/design.md, nuxt.config.ts, .unfogy/contract.yaml, layers/base/, server/api/health.get.ts, scripts/db-migrate.mjs, scripts/runtime-entrypoint.mjs]
---

This repository is a generic application starter. Read [development](development.md), [design](design.md) and the static `.unfogy/contract.yaml` before extending the foundation. `nuxt.config.ts` extends layers/base. Keep secrets outside public runtime config. Package and contract files own current tool versions and delivery checks. No Customer resolver or Customer-specific setup helper is established here. Do not copy App meeting or candidate features into generic knowledge.

Related: [development](development.md).

Read [product](product.md) for starter audience and capability limits and [design](design.md) for generic visual source mappings. Rebind both through [initialization](initialization.md) after an authorized clone.

## Showcase and fixture contract


### Amaç

Starter, customer projesine başlangıç veren iki ayrı sınırı taşır:

- public ve Supabase'siz UI showcase;
- customer uygulamasına aktarılacak generic Nuxt, Nuxt UI, auth ve Supabase
  altyapısı.

Showcase bir customer business domain'i değildir. Temsilcinin customer ile UI
başlangıç noktası seçmesini kolaylaştıran, aynı veriyi farklı dashboard
yerleşimleriyle gösteren başlangıç yüzüdür.

### Public showcase rotaları

| Route | Sorumluluk |
| --- | --- |
| `/` | Starter tanıtımı, ortak veri preview'ı, altı wireframe kartı ve hızlı erişim |
| `/theme` | Theme preset ve color mode davranışının showcase'u |
| `/dashboard/[pattern]` | Seçilen wireframe pattern'in aynı fixture ile gösterimi |

Bu rotalar public çalışır ve Supabase environment, auth session veya gerçek
database bağlantısı gerektirmez. Customer business route'ları eklendiğinde
auth middleware, user-scoped client ve RLS sınırları ayrıca uygulanır.

### Wireframe showcase

Baseline altı yaygın admin/SaaS dashboard wireframe seçeneğini destekler:

1. Sol sidebar + topbar + main canvas
2. Collapsible icon sidebar + dense table
3. Full horizontal top navigation + wide canvas
4. Three-column workspace
5. Bento/card-grid analytics dashboard
6. Tabbed single-column report dashboard

Altı seçenek anasayfada eşit ağırlıkta gösterilir. Hiçbiri varsayılan olarak
öne çıkarılmaz. Bu baseline pattern'leri temsil eder; customer-specific görsel
kimlik ve son polish daha sonraki project tasarımında değiştirilebilir.

### Ortak veri sözleşmesi

Altı sayfa aynı typed ve domain-bağımsız showcase fixture'ını kullanır.
Fixture; gerçekçi fakat sentetik KPI, grafik serisi, liste/tablo kayıtları,
durum, bildirim, activity ve profil özetleri sağlayabilir.

- `app/data/dashboard-showcase.ts`: tek fixture kaynağı.
- `app/types/dashboard-showcase.ts`: DashboardShowcaseData sözleşmesi.

Veri app-safe local TS/JSON kaynağından okunur. Server API, runtime secret,
Supabase veya customer verisi kullanılmaz. Layout component'leri fixture'a
doğrudan bağlanmaz; ortak composable/props katmanından hazır veriyi alır.

Ortak component'ler KPI, chart, table, activity, filter ve state görünümlerini
sağlar. Wireframe'lar bu parçaları farklı composition, yoğunluk ve yerleşimle
kullanır; component kopyaları oluşturmaz.

Showcase etkileşimleri local state ile sınırlıdır: filtre, sıralama, tab,
modal, pagination ve form aksiyonları gerçek mutation yapmaz. Loading, empty,
error, populated ve disabled state'leri sentetik fixture/config ile
gösterilebilir. Reload sonrasında wireframe seçimi korunmaz.

### Ortak showcase header

`/`, `/theme` ve `/dashboard/[pattern]` rotaları ortak showcase header
component'ini kullanır.

- Sağda light/dark color mode kontrolü bulunur.
- Theme preset ayrı bir dropdown olarak bulunur.
- Wireframe sayfaları ayrı bir dropdown/kısayol olarak bulunur.
- Aktif preset, color mode ve wireframe görünür durumda tutulur.
- Theme preset ve color mode browser persistence ile korunur.
- Wireframe seçimi yalnız route/navigation state'idir; kalıcılaştırılmaz.

Kontroller Nuxt UI component'leri ve Nuxt'un native navigation yöntemleriyle
kurulur. Mobilde aynı davranış Nuxt UI'nin responsive dropdown/sheet
pattern'leriyle korunur.

### Kalite sınırı

Her yeni wireframe aynı typed fixture sözleşmesini kullanmalı ve şu kontrolleri
geçmelidir:

- route ve fixture unit/Nuxt testleri;
- desktop, tablet ve mobile kontrolü;
- light/dark/system kontrolü;
- keyboard navigation, focus, semantic heading ve WCAG 2.2 AA hedefi;
- loading, empty, error, populated ve disabled state kontrolü;
- shared browser reload sonrası temiz console;
- hydration mismatch veya `null.ce` hatası olmaması.

Starter'ın genel teslim kapıları [development](development.md#testing) ve `README.md` içindeki
contract, test, lint, typecheck, build ve smoke kontrolleridir. Eski `docs/starter/README.md`, d5bec342f07c533bd245c60ad54a562200ff3b9e revizyonunda bu kapıların ve desktop browser kontrolünün geçtiğini bildiriyordu; ölçüm revizyonu ve ham kanıt bu kayıtta yoktur. Bu tarihsel ifade güncel doğrulama değildir. Yeni değişiklikte kapılar ve uygun viewport/browser kontrolleri yeniden çalıştırılır; gerçek staging kanıtı ayrıca raporlanır.

### Kapsam dışı

- Showcase verisini Supabase'e yazmak veya gerçek business API'larına bağlamak.
- Customer-specific domain, role model veya business workflow eklemek.
- Runtime'da sınırsız layout/theme üretmek.
- Full Theme Studio, customer-wide theme publication veya server persistence.
- Browser E2E/screenshot test paketini baseline dependency yapmak.


## Migration provenance

Human approved root docs consolidation and removal on 2026-10-10. Original source: docs/starter/README.md at d5bec342f07c533bd245c60ad54a562200ff3b9e. Preserved intent and source observations do not establish fresh runtime success. Shared governance remains in the separately admitted Control repository.

## Factory-compatible installation source

The generic `.unfogy/application.yaml` replaces the former config.yaml template as the sole installation input. the repository metadata in `.unfogy/application.yaml` carries unresolved owner/identity fields; placeholders prevent accidental installation. `.unfogy/contract.yaml` remains separate build/runtime compatibility metadata. Rebind both installation manifests after authorized clone and provide reviewed migrations before provisioning the remote Supabase stack. Build-only CI lives in `.unfogy/woodpecker/`; the operator CLI owns scan validation, migrations and publication. No App/customer data or provider allocation is embedded here. See [initialization](initialization.md#bind-factory-installation-metadata).

Current config boundary: one application.yaml replaces both old declarations. Fill all template placeholders before execution. Customer execution remains unavailable; this template does not grant admission or publication authority.
