# Calorie Craft - Backend Service

[![Backend CI & Test](https://github.com/rizal2214/calorie-craft-backend/actions/workflows/ci.yml/badge.svg)](https://github.com/rizal2214/calorie-craft-backend/actions/workflows/ci.yml)

Proyek backend untuk aplikasi Calorie Craft, yang menyediakan API untuk menghitung BMI dan merekomendasikan resep makanan berdasarkan kategori BMI pengguna. Proyek ini dibangun dengan Node.js, Express, dan memiliki cakupan tes 100% yang divalidasi oleh alur kerja Continuous Integration (CI).

---

## ✨ Fitur Utama

-   **Kalkulator BMI**: Endpoint untuk menghitung Body Mass Index (BMI) berdasarkan tinggi, berat, dan jenis kelamin.
-   **Rekomendasi Resep**: Memberikan daftar resep yang relevan dari Spoonacular API berdasarkan kategori BMI (Underweight, Normal, Overweight, Obesity).
-   **Detail Resep**: Endpoint untuk mendapatkan detail lengkap dari resep tertentu, termasuk bahan, instruksi, dan informasi nutrisi.
-   **Validasi Input**: Middleware validasi yang kuat untuk memastikan semua data yang masuk sesuai dengan skema yang diharapkan.
-   **Testing Menyeluruh**: Cakupan tes 100% untuk semua _statements_, _branches_, _functions_, dan _lines_ menggunakan Jest.
-   **Continuous Integration**: Tes dijalankan secara otomatis pada setiap `push` dan `pull request` menggunakan GitHub Actions untuk memastikan kualitas kode.

---

## 🚀 Instalasi dan Menjalankan Proyek

### Prasyarat

-   [Node.js](https://nodejs.org/) (v18.x atau lebih tinggi)
-   [pnpm](https://pnpm.io/) (atau package manager lain seperti npm/yarn)

### Langkah-langkah

1.  **Clone repositori ini:**

    ```bash
    git clone https://github.com/rizal2214/calorie-craft-backend.git
    cd calorie-craft-backend
    ```

2.  **Instal dependensi:**

    ```bash
    pnpm install
    ```

3.  **Siapkan Environment Variables:**
    Buat file `.env` di direktori root dan tambahkan API Key Anda.

    ```env
    SPOONACULAR_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    ```

4.  **Menjalankan Aplikasi:**
    ```bash
    pnpm start
    ```
    Server akan berjalan di `http://localhost:3000` (atau port lain yang Anda konfigurasikan).

---

## 🧪 Menjalankan Tes

Proyek ini dilengkapi dengan serangkaian tes unit dan integrasi untuk memastikan keandalan.

-   **Menjalankan semua tes:**

    ```bash
    pnpm test
    ```

-   **Menjalankan tes dan melihat laporan cakupan (coverage):**
    ```bash
    pnpm run test:coverage
    ```
    Setelah selesai, buka `coverage/lcov-report/index.html` di browser Anda untuk melihat laporan interaktif.

---

## API Endpoints

Berikut adalah daftar endpoint yang tersedia:

| Method | Endpoint             | Deskripsi                                           |
| :----- | :------------------- | :-------------------------------------------------- |
| `POST` | `/api/bmi/calculate` | Menghitung BMI dan mengembalikan resep yang sesuai. |
| `GET`  | `/api/recipes/:id`   | Mendapatkan detail spesifik dari sebuah resep.      |

**Contoh Body untuk `POST /api/bmi/calculate`:**

```json
{
    "height": 175,
    "weight": 70,
    "gender": "male"
}
```
