
# NDU Tələbə Elmi Cəmiyyəti (TEC) - Rəsmi Veb-saytı

<p align="center">
  <img src="/public/logo1.png" alt="NDU TEC Logo" width="150">
</p>

<p align="center">
  Naxçıvan Dövlət Universiteti Tələbə Elmi Cəmiyyətinin (NDU TEC) müasir və funksional rəsmi veb-saytı.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.x-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Firebase-11.x-orange?style=for-the-badge&logo=firebase" alt="Firebase">
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-blueviolet?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS">
</p>

Bu repozitoriya Naxçıvan Dövlət Universiteti Tələbə Elmi Cəmiyyətinin (NDU TEC) rəsmi veb-saytının mənbə kodunu ehtiva edir. Layihə tələbələri, tədqiqatçıları və ictimaiyyəti TEC-in fəaliyyəti, layihələri, tədbirləri və nəşrləri haqqında məlumatlandırmaq, həmçinin müxtəlif interaktiv platformalar təqdim etmək məqsədilə yaradılmışdır.

## 🚀 Əsas Xüsusiyyətlər

Veb-sayt geniş funksionallığa malikdir və müasir texnoloji tələblərə cavab verir:

### 1. **Dinamik Məzmun İdarəçiliyi (Admin Panel)**
- **Güclü Admin Panel:** `src/app/ndutecnaxcivan19692025tec/` qovluğunda yerləşən panel saytın bütün dinamik məzmununu idarə etmək üçün tam funksional interfeys təmin edir.
- **CRUD Əməliyyatları:** Xəbərlər, layihələr, kitabxana materialları, komanda üzvləri, aforizmlər, jurnallar və s. kimi bütün məzmun növləri üçün Yaratma, Oxuma, Yeniləmə və Silmə (CRUD) əməliyyatları mövcuddur.
- **Təhlükəsiz Giriş:** Admin panel xüsusi şifrə ilə qorunur.

### 2. **Onlayn Təlim Platforması**
- **İstifadəçi Hesabları:** Tələbələr və digər istifadəçilər üçün fərdi qeydiyyat və giriş sistemi (`/training-login`, `/register`).
- **Modullu Təlimlər:** Təlimlər ardıcıl modullardan ibarətdir və istifadəçilər yalnız əvvəlki modulu bitirdikdən sonra növbəti modula keçə bilərlər.
- **İnteraktiv Testlər (Quiz):** Hər təlimin sonunda bilikləri yoxlamaq üçün test sistemi mövcuddur.
- **Avtomatik Sertifikat Generasiyası:** Testdən uğurla keçən (80%+) istifadəçilər üçün unikal ID ilə avtomatik olaraq sertifikat yaradılır və yükləmək üçün təqdim edilir.

### 3. **Məqalə və Sənəd Təqdimatı**
- **Elmi və Hüquq Jurnalları:** Tələbələr və tədqiqatçılar üçün iki fərqli jurnala (`Tələbə Elmi Jurnalı` və `Tələbə Hüquq Jurnalı`) onlayn məqalə göndərmə imkanı.
- **Fakültə və Kafedra Portalları:** Fakültə və kafedraların TEC ilə bağlı sənədləri (iclas protokolları, statistik hesabatlar) təhlükəsiz şəkildə təqdim etməsi üçün xüsusi portallar.

### 4. **Elektron Kitabxana**
- **Zəngin Resurs Mərkəzi:** Müxtəlif kateqoriyalarda (kitab, məqalə, jurnal, monoqrafiya) rəqəmsal materialların yerləşdiyi interaktiv kitabxana.
- **Axtarış və Filtrləmə:** İstifadəçilər materialları başlığa və kateqoriyaya görə asanlıqla axtara və filtrləyə bilərlər.

### 5. **SEO və Performans**
- **Axtarış Motoru Optimizasiyası (SEO):** Bütün səhifələr üçün dinamik meta teqlər, `openGraph` və `Twitter` kartları, `JSON-LD` formatında strukturlaşdırılmış məlumatlar (Schema.org).
- **Dinamik `sitemap.xml`:** Bütün statik və dinamik səhifələr üçün avtomatik yaradılan sayt xəritəsi.
- **Performans:** Next.js App Router, Server Components və digər müasir veb texnologiyaları sayəsində yüksək yüklənmə sürəti.

## 🛠️ Texnologiya Steki

Bu layihənin hazırlanmasında aşağıdakı texnologiya və alətlərdən istifadə olunmuşdur:

- **Frontend:** **Next.js 15** (App Router), **React 18**, **TypeScript**
- **UI Kitabxanası:** **ShadCN UI**, **Tailwind CSS**
- **Backend və Verilənlər Bazası:** **Firebase** (Firestore, Firebase Storage)
- **Form İdarəçiliyi və Validasiya:** **React Hook Form**, **Zod**
- **Animasiyalar:** **Framer Motion**
- **Server və Sessiya İdarəçiliyi:** **Next.js Middleware**, Cookie-based Authentication
- **Süni İntellekt (AI):** **Genkit** (Təlim modulları üçün şəkil və məzmun yaratmaq məqsədilə)

## 🚀 Lokal Mühitdə İşə Salma

Layihəni lokal kompüterinizdə sınamaq üçün aşağıdakı addımları izləyin.

1.  **Repo-nu klonlayın:**
    ```bash
    git clone https://github.com/Yusif-Mirzezade/ndutec.git
    cd ndutec
    ```

2.  **Asılılıqları yükləyin:**
    ```bash
    npm install
    ```

3.  **Firebase Konfiqurasiyasını yaradın:**
    Layihənin kök qovluğunda `.env.local` adlı bir fayl yaradın və aşağıdakı məzmunu öz Firebase layihənizin məlumatları ilə əvəz edərək daxil edin:
    ```env
    # Firebase
    NEXT_PUBLIC_FIREBASE_API_KEY="AIza..."
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
    NEXT_PUBLIC_FIREBASE_APP_ID="1:..."
    
    # Genkit (Google AI)
    GEMINI_API_KEY="your-gemini-api-key"
    ```

4.  **İnkişaf Serverini İşə salın:**
    ```bash
    npm run dev
    ```
    Bu əmri icra etdikdən sonra sayt [http://localhost:9002](http://localhost:9002) ünvanında aktiv olacaq.

## ☁️ Linux Serverə Deploy (Nginx + PM2)

Tətbiqi canlı yayımlamaq üçün Linux serverinizdə Node.js və `pm2` yüklü olmalıdır.

1.  **Layihəni Serverə Klonlayın:**
    ```bash
    git clone https://github.com/Yusif-Mirzezade/ndutec.git
    cd ndutec
    ```

2.  **Asılılıqları Yükləyin və Proyektinizi Hazırlayın:**
    ```bash
    npm install
    npm run build
    ```
    Bu əmr tətbiqi istehsal (production) üçün hazırlayacaq və `.next` qovluğuna yığacaq.

3.  **PM2 Proses Menecerini Qurma və Tətbiqi Başlatma:**
    Əgər `pm2` yüklü deyilsə, onu qlobal olaraq yükləyin:
    ```bash
    npm install pm2 -g
    ```
    Sonra tətbiqi `pm2` ilə başladın:
    ```bash
    pm2 start npm --name "ndutec-website" -- run start
    ```
    Bu əmr, `package.json`-dakı `start` skriptini işə salacaq, tətbiqinizə `ndutec-website` adını verəcək və server yenidən başlasa belə avtomatik işə düşməsini təmin edəcək.

4.  **Nginx Konfiqurasiyasını Yaratmaq:**
    `Nginx`-i bir "reverse proxy" olaraq istifadə edərək, gələn sorğuları Next.js tətbiqinizin işlədiyi porta (defolt olaraq `9002`) yönləndirəcəyik.
    
    Saytınız üçün yeni bir Nginx konfiqurasiya faylı yaradın:
    ```bash
    sudo nano /etc/nginx/sites-available/your_domain.com
    ```

    Aşağıdakı nümunəvi konfiqurasiyanı həmin fayla daxil edin və `your_domain.com`-u öz domen adınızla əvəz edin:
    ```nginx
    server {
        listen 80;
        server_name your_domain.com www.your_domain.com;

        # HTTP sorğularını HTTPS-ə yönləndirmək üçün (SSL sertifikatı qurduqdan sonra aktiv edin)
        # return 301 https://$host$request_uri;

        location / {
            proxy_pass http://localhost:9002;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
    ```

5.  **Konfiqurasiyanı Aktivləşdirin və Nginx-i Yenidən Başladın:**
    ```bash
    # Yaratdığınız konfiqurasiyanı aktiv saytlara əlavə edin
    sudo ln -s /etc/nginx/sites-available/your_domain.com /etc/nginx/sites-enabled/
    
    # Nginx konfiqurasiyasını yoxlayın
    sudo nginx -t
    
    # Hər şey qaydasındadırsa, Nginx-i yenidən başladın
    sudo systemctl restart nginx
    ```
    Bu addımlardan sonra saytınız domen adınız üzərindən əlçatan olacaq. Unutmayın ki, təhlükəsiz bağlantı (HTTPS) üçün serverinizdə **SSL sertifikatı** (məsələn, Let's Encrypt ilə) qurmaq vacibdir.

## ⚙️ Mövcud Skriptlər

Layihə qovluğunda aşağıdakı əsas `npm` skriptlərini icra edə bilərsiniz:

-   `npm run dev`: Tətbiqi inkişaf (development) rejimində işə salır.
-   `npm run build`: Tətbiqi istehsal (production) üçün hazırlayır.
-   `npm run start`: İstehsal üçün hazırlanmış versiyanı işə salır. `npm run build`-dən sonra istifadə olunur.
-   `npm run lint`: Kodda potensial səhvləri və üslub problemlərini yoxlayır.

