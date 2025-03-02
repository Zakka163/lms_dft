# Panduan Otomasi Deployment

Script ini mengotomatisasi proses deployment untuk aplikasi backend dan frontend. Ikuti langkah-langkah berikut untuk memastikan setup berjalan dengan lancar.

## Langkah-Langkah

1. **Tarik perubahan terbaru dari Git**

   ```sh
   git pull
   ```

2. **Masuk ke direktori backend**

   ```sh
   cd be
   ```

3. **Pastikan konfigurasi lingkungan**

   - Jika file `.env` belum ada, salin dari `.env.example`:
     ```sh
     cp .env.example .env
     ```

4. **Instal dependensi dan bangun backend**

   ```sh
   npm install
   npm run build
   npm run sync
   npm run seed
   ```

5. **Kembali ke direktori utama**

   ```sh
   cd ..
   ```

6. **Masuk ke direktori frontend**

   ```sh
   cd fe
   ```

7. **Instal dependensi frontend**

   ```sh
   npm install
   ```

8. **Instal PM2 secara global**

   ```sh
   npm i -g pm2
   ```

9. **Jalankan aplikasi menggunakan PM2**

   ```sh
   pm2 start ecosystem.config.js
   ```

10. **Pantau proses PM2**

    ```sh
    pm2 monit
    ```

## Akun Default

### Akun Admin
- **Username**: admin@gmail.com
- **Password**: 123

### Akun Siswa
- **Username**: siswa@gmail.com
- **Password**: 123

