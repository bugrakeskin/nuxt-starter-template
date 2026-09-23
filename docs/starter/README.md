# Starter structure baseline

Bu belge Nuxt starter'ın uygulanmış yapı baseline'ıdır. Uygulama ve local
production-preview doğrulaması tamamlanmıştır; kapsam dışı staging/provisioning
ve müşteri özelleştirmeleri ayrıca ele alınır. Runtime, Supabase, theme ve test
kuralları kendi belgelerinde tanımlıdır.

## Amaç

Starter, customer projesine başlangıç veren iki ayrı sınırı taşır:

- public ve Supabase'siz UI showcase;
- customer uygulamasına aktarılacak generic Nuxt, Nuxt UI, auth ve Supabase
  altyapısı.

Showcase bir customer business domain'i değildir. Temsilcinin customer ile UI
başlangıç noktası seçmesini kolaylaştıran, aynı veriyi farklı dashboard
yerleşimleriyle gösteren başlangıç yüzüdür.

## Nuxt-native yapı

Uygulama Nuxt'un file-based routing, native layouts, auto-imports ve route-level
code splitting kurallarını kullanır. Custom router, runtime route registry veya
framework dışı navigation katmanı eklenmez.

```text
app/
├── app.vue
├── assets/
│   └── css/
├── components/
│   ├── dashboard/          # Ortak KPI, chart, table, state ve activity parçaları
│   └── showcase/            # Ortak public header ve seçim preview parçaları
├── composables/             # Showcase ve theme davranışının küçük composable'ları
├── data/                    # Typed, sentetik showcase fixture'ları
├── layouts/                 # Ortak uygulama shell'leri
├── pages/
│   ├── index.vue            # Showcase hub
│   ├── theme.vue            # Theme preset showcase
│   └── dashboard/
│       └── [pattern].vue    # File-based wireframe sayfası
├── types/                   # Ortak veri sözleşmeleri
└── utils/                   # Auto-import edilen saf yardımcılar
```

Nuxt `layouts/` yalnız ortak shell davranışını taşır. Altı dashboard wireframe
layout pattern'i sayfa ve ortak dashboard component'lerinin composition'ı olarak
kurulur; sayfalara özel custom router veya layout switching sistemi yazılmaz.

## Public showcase rotaları

| Route | Sorumluluk |
| --- | --- |
| `/` | Starter tanıtımı, ortak veri preview'ı, altı wireframe kartı ve hızlı erişim |
| `/theme` | Theme preset ve color mode davranışının showcase'u |
| `/dashboard/[pattern]` | Seçilen wireframe pattern'in aynı fixture ile gösterimi |

Bu rotalar public çalışır ve Supabase environment, auth session veya gerçek
database bağlantısı gerektirmez. Customer business route'ları eklendiğinde
auth middleware, user-scoped client ve RLS sınırları ayrıca uygulanır.

## Wireframe showcase

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

## Ortak veri sözleşmesi

Altı sayfa aynı typed ve domain-bağımsız showcase fixture'ını kullanır.
Fixture; gerçekçi fakat sentetik KPI, grafik serisi, liste/tablo kayıtları,
durum, bildirim, activity ve profil özetleri sağlayabilir.

```text
app/data/
└── dashboard-showcase.ts    # Tek fixture kaynağı

app/types/
└── dashboard-showcase.ts    # DashboardShowcaseData sözleşmesi
```

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

## Ortak showcase header

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

## Theme preset katalogu ve styling sınırı

Starter, Nuxt UI Theme Studio'daki 11 resmi preset'i tek typed katalogda taşır:
`app/utils/theme-presets.ts`. Preset verisi palette,
font, radius, component default'ları ve light/dark semantic token override'larını
barındırır. Özel palette shade'leri `main.css` içindeki build-time `@theme
static` tanımlarıyla sağlanır.

Altı wireframe aynı semantic Nuxt UI theme sistemini kullanır. Layout'lar raw
renk veya preset ID'sine göre template branch'i taşımaz. Custom CSS yalnız
semantic token, theme config ve gerekli küçük layout utility'leriyle sınırlıdır;
yeni UI primitive veya bağımsız design system yazılmaz.

Theme preset seçimi ve light/dark/system color mode ayrı state'lerdir. Theme
preset persistence Nuxt'un cookie/runtime mekanizmasıyla, color mode persistence
Nuxt UI'nin native color-mode davranışıyla sağlanır. Reload sonrası aktif tercih
korunmalı ve hydration mismatch oluşmamalıdır. `ClientOnly`, warning
suppression, screenshot workaround veya framework dışı geçici çözüm kabul
edilmez.

### Yeni preset oluşturma

Yeni bir preset oluşturmak için starter'ın mevcut typed theme kataloğu
genişletilir; dropdown, anasayfa ve `/theme` rotasına ayrıca kayıt eklenmez.

1. `app/utils/theme-presets.ts` içindeki `themePresetIds` listesine yeni,
   benzersiz bir ID eklenir.
2. Aynı dosyadaki `themePresets` listesine preset tanımı eklenir.
3. Mevcut Nuxt UI palette'leri kullanılabilir. Yeni renk palette/shade
   gerekiyorsa `app/assets/css/main.css` içinde build-time `@theme static`
   tanımı eklenir.
4. Yeni font kullanılacaksa `nuxt.config.ts` içindeki `fonts.families`
   listesine Nuxt Fonts kaydı eklenir; preset içindeki `font` alanı aynı aile
   adını kullanır.
5. Preset için `colors`, `radius`, `font`, `components` ve gerekiyorsa
   `tokens.light` / `tokens.dark` değerleri tanımlanır.
6. Preset ID ve label beklentileri `test/unit/dashboard-showcase.test.ts`
   içinde güncellenir.

Örnek:

```ts
{
  id: 'ocean',
  label: 'Ocean',
  description: 'Blue actions with calm slate surfaces.',
  colors: {
    primary: 'blue',
    secondary: 'cyan',
    success: 'teal',
    info: 'sky',
    warning: 'amber',
    error: 'red',
    neutral: 'slate'
  },
  radius: 0.5,
  font: {
    sans: 'Inter',
    weights: { normal: 400, medium: 500, semibold: 600, bold: 700 },
    lineHeight: 1.5
  },
  components: {
    button: 'solid',
    field: 'outline',
    panel: 'soft',
    size: 'md'
  },
  tokens: {
    light: { '--ui-bg': 'var(--ui-color-neutral-50)' },
    dark: { '--ui-bg': 'var(--ui-color-neutral-950)' }
  }
}
```

Yeni font örneği:

```ts
// nuxt.config.ts
fonts: {
  families: [
    { name: 'Your Font', provider: 'google', global: true }
  ]
}
```

Preset uygulaması `useThemePreset()` tarafından yapılır; seçim cookie ile
korunur ve yalnız preset verisi değişir. Layout component'lerine preset ID'si
özel branch olarak eklenmez.

## Kalite sınırı

Her yeni wireframe aynı typed fixture sözleşmesini kullanmalı ve şu kontrolleri
geçmelidir:

- route ve fixture unit/Nuxt testleri;
- desktop, tablet ve mobile kontrolü;
- light/dark/system kontrolü;
- keyboard navigation, focus, semantic heading ve WCAG 2.2 AA hedefi;
- loading, empty, error, populated ve disabled state kontrolü;
- shared browser reload sonrası temiz console;
- hydration mismatch veya `null.ce` hatası olmaması.

Starter'ın genel teslim kapıları `docs/testing.md` ve `README.md` içindeki
contract, test, lint, typecheck, build ve smoke kontrolleridir. Bu baseline için
bu kapılar temizdir; shared browser desktop kontrolünde hydration mismatch,
`null.ce`, error veya warning görülmemiştir. Ayrı viewport ve gerçek staging
kontrolleri bu local baseline'ın dışında raporlanır.

## Kapsam dışı

- Showcase verisini Supabase'e yazmak veya gerçek business API'larına bağlamak.
- Customer-specific domain, role model veya business workflow eklemek.
- Runtime'da sınırsız layout/theme üretmek.
- Full Theme Studio, customer-wide theme publication veya server persistence.
- Browser E2E/screenshot test paketini baseline dependency yapmak.
