# 🚀 Ogi Life Track - Kişisel Finans & Alışkanlık Yönetimi

Modern bir **Electron + React** tabanlı masaüstü uygulaması. Bu proje, kişisel bütçe takibi, borç yönetimi, döviz kurları ve günlük alışkanlık takibini tek bir "Komuta Merkezi"nde birleştirir.

![GitHub repo size](https://img.shields.io/github/repo-size/masterninjahayday/ogi-life-track)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Özellikler

-   **💰 Çoklu Hesap Yönetimi:** Farklı banka ve borsa hesaplarınızı (TRY/USDT) ekleyin, güncelleyin.
-   **📈 Canlı Döviz Kuru:** Binance API entegrasyonu ile anlık **USDT/TRY** verisi çekilir.
-   **🎯 Finansal Hedef Paneli:** Belirlediğiniz USDT hedefine ne kadar yaklaştığınızı (Net Değer üzerinden) progress bar ile takip edin.
-   **💸 Akıllı Borç Takvimi:** Ödeme tarihine 3 gün kalan borçlar için "Yanıp Sönen" (Blink) görsel uyarı sistemi.
-   **🚬 Alışkanlık Takibi (Sigara):** Günlük içim takibi, son 3 günü geriye dönük güncelleme ve tasarruf edilen miktarın otomatik hesaplanması.
-   **💳 Ek Kart Yönetimi:** Aile bireylerinden alınan ek kartların harcamalarını asıl bakiyeden bağımsız olarak kontrol etme.
-   **🎨 Modern Arayüz:** Tailwind CSS ile güçlendirilmiş, karanlık mod (Dark Mode) odaklı siber-finans tasarımı.
-   **🖥️ Windows Entegrasyonu:** Bilgisayar açıldığında otomatik başlama özelliği.

## 🛠️ Kullanılan Teknolojiler

-   **Framework:** [Electron](https://www.electronjs.org/) & [React](https://reactjs.org/)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Database:** [SQLite](https://www.sqlite.org/) (Local storage için)
-   **Language:** TypeScript
-   **API:** Binance Public API

## 🚀 Kurulum ve Çalıştırma

Projeyi yerelinizde çalıştırmak için şu adımları izleyin:

1.  **Repoyu klonlayın:**
    ```bash
    git clone [https://github.com/KULLANICI_ADIN/ogi-life-track.git](https://github.com/KULLANICI_ADIN/ogi-life-track.git)
    cd ogi-life-track
    ```

2.  **Bağımlılıkları yükleyin:**
    ```bash
    npm install
    ```

3.  **Geliştirme modunda başlatın:**
    ```bash
    npm run dev
    ```

4.  **Windows için .exe çıktısı alın:**
    ```bash
    npm run build:win
    ```



## 📄 Lisans

Bu proje MIT lisansı altındadır.
