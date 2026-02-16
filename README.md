PRD-docs: [G-DOCS](https://docs.google.com/document/d/1jvQ2IFyPE-6qEDDy0bjbige_CqKcj95R7nXY2sfFpeo/edit?usp=sharing)
ERD : [DRAW SQL](https://drawsql.app/teams/coinz/diagrams/nutrilog)

---

### Langkah Setup & Pengerjaan

1. Clone Repository
   ❌ Jangan `git init` manual  
   ✅ Gunakan clone agar history tetap bersih

```bash
git clone git@github.com:Devora-Devscale/Nutrilog.git
cd Nutrilog
```

2. install dependencies

```bash
pnpm install
```

3. Buat file .env dari contoh file .env.example
4. Buat branch baru

```bash
git checkout -b feat/nama-fitur
```

5. untuk membuat environment development

```bash
docker compose -f docker-compose.dev.yml up -d
```

6. tambahkan model pada file schema.prisma
7. DB migrate:

```bash
pnpm db:migrate
```

8. DB generate:

```bash
pnpm db:generate
```

9. Run semua project:

```bash
moon :dev
```

atau

```bash
pnpm run dev
```

atau bisa jalankan satu per satu (dengan 2 terminal)

```bash
pnpm dev:api
```

```bash
pnpm dev:platform
```

10. Setelah selesai mengerjakan. Check format sebelum melakukan git commit.

```bash
pnpm lint
```

11. Fix format jika ada yang tidak sesuai

```bash
pnpm lint:fix
```

jika masih ada yang error, berarti perlu diperbaiki secara manual. Setelah selesai diperbaiki lanjutkan dengan langkah 9.

12. Stage kode

```bash
git add .
```

13. Commit kode

```bash
git commit -m "Pesan commit (gunakan best practice prefix commit message)"
```

14. Push kode ke github

```bash
git push origin feat/nama-branch
```

15. Buat pull request dari kode branch ke main. Assign mas Indra as reviewer dan kalian sebagai assignee

### Langkah Develop API

1. Buat model yang dibutuhkan di prisma schema (termasuk enum)
2. jalankan prisma migrate & generate di root:

```
pnpm db:migrate
pnpm db:generate
```

3. Buat modules baru di apps/api

```
import {schemaValidasi} from "@nutrilog/schema"
export const newRoute = new Hono().get(/,
  zValidator("json", schemaValidasi),
  async(c)=>{

  // your code here
  }
)
```

kalau ada request jangan lupa bikin validasi di packages/schema.
`packages/schema/modules/namafile.ts`

```bash
export const namaSchema = z.object({
  name: z.email(),
  email: z.string(),
  password: z.string()
})

export type SchemaInput = z.infer<typeof namaSchema>
```

`packages/schema/index.ts`

```bash
export {namaSchema} from "./modules/namafile"
export type {namaSchema} from "./modules/namafile"
```

### Langkah Develop Platform

Perhatian:

- UI menggunakan ShadCN, silakan tambahkan komponen sesuai kebutuhan
- Jika membuat komponen sendiri gunakan TailwindCSS
- Idealnya menggunakan React Hook Form + Zod untuk validasi form
- Gunakan TanStack Query + Hono Client untuk API call
- Hooks boleh dibuat langsung di dalam folder routes
  ```
  namaroutes/
  ├──index.ts
  ├──-hook.ts (di depannya ada simbol hyphen)
  ```
- Semua routes yang membutuhkan authentikasi harus berada di dalam folder \_authed:
  `apps/platform/src/routes/_authed/`

###### Contoh struktur:

> routes/
> ├── login/
> ├── register/
> └── \_authed/

      ├── dashboard/
      └── routebaru/

Untuk membuat halaman baru:
`apps/platform/src/routes/routebaru/index.tsx`
