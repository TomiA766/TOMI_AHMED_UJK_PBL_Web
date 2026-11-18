--
-- PostgreSQL database dump
--

\restrict EBbkeHdXIo0QgoKmAPQhYZYBgV0npKD85FQbtX6RxbdR3qEDhNHQ7vx8s0a66H6

-- Dumped from database version 17.11
-- Dumped by pg_dump version 17.11

-- Started on 2026-11-18 20:10:17

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4894 (class 1262 OID 33339)
-- Name: db_mahasiswa; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE db_mahasiswa WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';


ALTER DATABASE db_mahasiswa OWNER TO postgres;

\unrestrict EBbkeHdXIo0QgoKmAPQhYZYBgV0npKD85FQbtX6RxbdR3qEDhNHQ7vx8s0a66H6
\connect db_mahasiswa
\restrict EBbkeHdXIo0QgoKmAPQhYZYBgV0npKD85FQbtX6RxbdR3qEDhNHQ7vx8s0a66H6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 33340)
-- Name: siswa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.siswa (
    kode_siswa character varying(10) NOT NULL,
    nama_siswa character varying(100) NOT NULL,
    jurusan character varying(50) NOT NULL,
    tanggal_lahir date NOT NULL,
    alamat text NOT NULL
);


ALTER TABLE public.siswa OWNER TO postgres;

--
-- TOC entry 4888 (class 0 OID 33340)
-- Dependencies: 217
-- Data for Name: siswa; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.siswa VALUES ('S003', 'Agus Prasetyo', 'Teknik Informatika', '2004-11-02', 'Jl. Pandanaran No. 8, Semarang');
INSERT INTO public.siswa VALUES ('S004', 'Dewi Lestari', 'Teknik Informatika', '2005-01-29', 'Jl. Kaliurang Km 5, Sleman');
INSERT INTO public.siswa VALUES ('S005', 'Rizky Ramadhan', 'Teknik Informatika', '2005-05-17', 'Jl. Gatot Subroto No. 12, Medan');
INSERT INTO public.siswa VALUES ('S006', 'Putri Anggraini', 'Sistem Informasi', '2005-09-08', 'Jl. Sudirman No. 40, Palembang');
INSERT INTO public.siswa VALUES ('S007', 'Fajar Nugroho', 'Sistem Informasi', '2004-12-25', 'Jl. Darmo Permai No. 7, Surabaya');
INSERT INTO public.siswa VALUES ('S008', 'Anisa Rahmawati', 'Sistem Informasi', '2005-04-03', 'Jl. Ijen No. 14, Malang');
INSERT INTO public.siswa VALUES ('S009', 'Dimas Aditya', 'Sistem Informasi', '2005-08-19', 'Jl. Pajajaran No. 3, Bogor');
INSERT INTO public.siswa VALUES ('S010', 'Nur Aini', 'Sistem Informasi', '2005-02-11', 'Jl. Ahmad Yani No. 21, Bekasi');
INSERT INTO public.siswa VALUES ('S011', 'Eko Wijaya', 'Manajemen Informatika', '2004-10-30', 'Jl. Slamet Riyadi No. 9, Surakarta');
INSERT INTO public.siswa VALUES ('S012', 'Maya Sari', 'Manajemen Informatika', '2005-06-06', 'Jl. Khatib Sulaiman No. 6, Padang');
INSERT INTO public.siswa VALUES ('S013', 'Hendra Gunawan', 'Manajemen Informatika', '2006-01-15', 'Jl. Pettarani No. 30, Makassar');
INSERT INTO public.siswa VALUES ('S014', 'Lina Marlina', 'Manajemen Informatika', '2006-03-27', 'Jl. Tuparev No. 18, Cirebon');
INSERT INTO public.siswa VALUES ('S015', 'Yoga Pratama', 'Manajemen Informatika', '2006-07-09', 'Jl. Teuku Umar No. 11, Denpasar');
INSERT INTO public.siswa VALUES ('S016', 'Rina Susanti', 'Teknik Elektro', '2006-05-22', 'Jl. Gajah Mada No. 5, Pontianak');
INSERT INTO public.siswa VALUES ('S017', 'Andi Saputra', 'Teknik Elektro', '2006-09-13', 'Jl. Jenderal Sudirman No. 2, Balikpapan');
INSERT INTO public.siswa VALUES ('S018', 'Tri Wulandari', 'Teknik Elektro', '2006-11-04', 'Jl. Margonda Raya No. 50, Depok');
INSERT INTO public.siswa VALUES ('S019', 'Bayu Setiawan', 'Teknik Elektro', '2006-02-18', 'Jl. Imam Bonjol No. 16, Tangerang');
INSERT INTO public.siswa VALUES ('S020', 'Indah Permata', 'Teknik Elektro', '2006-08-01', 'Jl. Kartini No. 33, Bandar Lampung');
INSERT INTO public.siswa VALUES ('S021', 'Fahmi Hidayat', 'Akuntansi', '2006-04-12', 'Jl. A. Yani Km 4, Banjarmasin');
INSERT INTO public.siswa VALUES ('S022', 'Sekar Ayu', 'Akuntansi', '2006-10-26', 'Jl. Pemuda No. 27, Magelang');
INSERT INTO public.siswa VALUES ('S023', 'Galih Purnomo', 'Akuntansi', '2005-12-07', 'Jl. Dhoho No. 19, Kediri');
INSERT INTO public.siswa VALUES ('S024', 'Citra Kirana', 'Akuntansi', '2005-10-16', 'Jl. Sam Ratulangi No. 8, Manado');
INSERT INTO public.siswa VALUES ('S025', 'Irfan Maulana', 'Akuntansi', '2005-03-30', 'Jl. Orang Kayo Hitam No. 13, Jambi');
INSERT INTO public.siswa VALUES ('S002', 'Siti ', 'Teknik Informatika', '2005-07-21', 'Jl. Dago No. 25, Bandung');


--
-- TOC entry 4742 (class 2606 OID 33346)
-- Name: siswa siswa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.siswa
    ADD CONSTRAINT siswa_pkey PRIMARY KEY (kode_siswa);


-- Completed on 2026-11-18 20:10:18

--
-- PostgreSQL database dump complete
--

\unrestrict EBbkeHdXIo0QgoKmAPQhYZYBgV0npKD85FQbtX6RxbdR3qEDhNHQ7vx8s0a66H6

