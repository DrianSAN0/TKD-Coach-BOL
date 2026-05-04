--
-- PostgreSQL database dump
--

\restrict 4OG1C66MSASt50xmQq54bgljm4yz6619Xm96raKCrXPZDpTN1dWwAN0vbIs8BSf

-- Dumped from database version 16.13 (Debian 16.13-1.pgdg13+1)
-- Dumped by pg_dump version 16.13 (Debian 16.13-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: club; Type: TABLE DATA; Schema: public; Owner: tkduser
--

COPY public.club (id_club, nombre_club, ciudad, created_at) FROM stdin;
0d9be495-ec7f-49a4-b613-54a0e38ed51c	Club Kundo Kwang	La Paz	2026-05-02 20:04:46.337247
dee4af3c-1088-4978-8e2e-650e9630ab2e	Club Olimpia	La Paz	2026-05-02 20:04:46.337247
fb713a9a-1fb8-45f4-8db3-5e0adf1e8430	Club Taejo	La Paz	2026-05-02 20:04:46.337247
5f4e7bcd-8495-4ec3-a6a7-e74842e527a2	Club Drag├│n	Cochabamba	2026-05-02 20:04:46.337247
\.


--
-- Data for Name: grado; Type: TABLE DATA; Schema: public; Owner: tkduser
--

COPY public.grado (id_grado, nombre_grado, color_cinturon, nivel) FROM stdin;
4ddac107-ce86-493c-9e9a-571574444662	Keup 10	Blanco	1
5379dd71-702c-4c55-a87c-2685211bf51f	Keup 9	Amarillo	2
470c179c-fa5a-4ce3-a5e9-d4edfb09284f	Keup 8	Amarillo punta	3
ef829d0a-a560-4146-8915-62c6a19a021c	Keup 7	Verde	4
f023cb57-ad27-48a0-8c19-753a38c58163	Keup 6	Verde punta	5
00772fb6-12ec-4d53-abd1-cb974ddd51df	Keup 5	Azul	6
f533ed80-acbd-4676-8be8-54e32e5dff18	Keup 4	Azul punta	7
ac5f18d0-2579-4d4c-82e1-41cab25cc1c9	Keup 3	Rojo	8
502cbce8-1b2b-4ebb-9881-ae8036e69820	Keup 2	Rojo punta	9
eae00e7e-292b-49e6-8b0e-18053dc1876a	Keup 1	Rojo doble	10
9fbe5587-82d7-4db5-9adc-d16fb5b58f5a	Dan 1	Negro	11
7e531a79-a7a9-4a62-a8e2-ec03702650dd	Dan 2	Negro	12
62731371-974b-44b9-b46c-8eae749340ee	Dan 3	Negro	13
\.


--
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: tkduser
--

COPY public.usuario (id_usuario, nombre, apellido, correo, contrasena_hash, rol, estado, created_at) FROM stdin;
4bd34a40-faad-48e5-b9ba-c5f9758c6802	Lucas	Guzm├ín Rojas	lucas@tkd.bo	hash123	atleta	activo	2026-05-02 16:18:19.707335
e95dba2b-ed7e-4145-b685-5cdd24781f4e	Juan Carlos	P├®rez Rodr├¡guez	juan@tkd.bo	hash123	atleta	activo	2026-05-02 16:18:19.707335
aec2dadb-d3e1-4a17-a9d6-175a243ba3aa	Luis Fernando	G├│mez Castillo	luis@tkd.bo	hash123	atleta	activo	2026-05-02 16:18:19.707335
4d9701bb-cd0f-49cf-8577-fd2e5eb54b85	Jos├® Antonio	Vargas L├│pez	jose@tkd.bo	hash123	atleta	activo	2026-05-02 16:18:19.707335
03670c07-f433-45b0-bd05-0b6bbf98e506	Miguel ├üngel	Torres Rojas	miguel@tkd.bo	hash123	atleta	activo	2026-05-02 16:18:19.707335
5fcef791-a710-4ae2-aa1d-9c56388931df	Adri	Admin	adri@gmail.com	48c7c6dcf833bfac288d0a16484837bb85bb3dc2c6b09d974649c50884d74ba3	atleta	activo	2026-05-02 17:02:27.121311
aaa2ec6d-f909-418e-849d-4df7965c4324	Adrian	Sanchez	adrian.sanchez.nina@gmail.com	17d3da634e60c9ebb7f0bb189d48866831a11dd1fdb06d15bd7911cd250ac8dd	atleta	activo	2026-05-02 21:14:52.435674
c386e3fa-1990-469b-a1fb-a139712a173d	Lucas	Javier Guzm├ín Rojas	lucas.guzman@tkd.bo	hash123	atleta	activo	2026-05-02 19:25:27.893241
ee0c83bd-3f18-4281-95d2-190a24e5343f	Maria Sofia	P├®rez Rodr├¡guez	maria.perez@tkd.bo	hash123	atleta	activo	2026-05-02 19:25:27.893241
e118d863-6c65-4893-a593-23e4979e1be9	Estefani Lisa	G├│mez Castillo	estefani.gomez@tkd.bo	hash123	atleta	activo	2026-05-02 19:25:27.893241
7e8af235-1281-4c39-98cc-36468d915d73	Leonel	Vargas Fernandez	leonel.vargas@tkd.bo	hash123	atleta	activo	2026-05-02 19:25:27.893241
feb3f1de-ee29-43bd-8223-7ea22f5f9311	Anahi Lucia	Torres Rojas	anahi.torres@tkd.bo	hash123	atleta	activo	2026-05-02 19:25:27.893241
1caa4d4a-d040-45ed-9d73-4ac437359273	Fernando	Sandoval Ruis	fernando.sandoval@tkd.bo	hash123	atleta	activo	2026-05-02 19:25:27.893241
a81f22c9-1016-4a85-bf32-d9bcb4f59f27	Mateo Adrian	Costa Rivera	mateo.costa@tkd.bo	hash123	atleta	activo	2026-05-02 19:25:27.893241
888af8ce-b702-422b-9491-41d1515a82ed	Natalia Isabel	Mendoza Flores	natalia.mendoza@tkd.bo	hash123	atleta	activo	2026-05-02 19:25:27.893241
8f18e032-05ba-4224-b6a3-ae3867f49c8c	Andrea Laura	Herrera S├ínchez	andrea.herrera@tkd.bo	hash123	atleta	activo	2026-05-02 19:25:27.893241
80b178e9-4fa9-41d8-9053-1587e9a52ab6	Diego Albaro	Cruz Lozano	diego.cruz@tkd.bo	hash123	atleta	activo	2026-05-02 19:25:27.893241
f2d326f7-f5c8-427c-93bd-40bc3fbcce8b	Erick Sebasti├ín	Ortiz Salazar	erick.ortiz@tkd.bo	hash123	atleta	activo	2026-05-02 19:25:27.893241
c5a1657b-f937-4fb7-bd11-fa683909411a	Luciana Erika	Ch├ívez Navarro	luciana.chavez@tkd.bo	hash123	atleta	activo	2026-05-02 19:25:27.893241
0b6d93d8-88cb-467b-9bc2-f9f4faf55801	Sarai Daniela	Ram├¡rez Silva	sarai.ramirez@tkd.bo	hash123	atleta	activo	2026-05-02 19:25:27.893241
f41f88b0-d8e9-4e94-ba57-78f2a0f452c0	Fernando Javier	Castro Paredes	fjavier.castro@tkd.bo	hash123	atleta	activo	2026-05-02 19:25:27.893241
294e1555-e198-45a5-a10a-e311db5ec929	Camila Nicole	Salazar Vega	camila.salazar@tkd.bo	hash123	atleta	activo	2026-05-02 19:25:27.893241
\.


--
-- Data for Name: atleta; Type: TABLE DATA; Schema: public; Owner: tkduser
--

COPY public.atleta (id_atleta, id_usuario, fecha_nacimiento, sexo, peso, categoria, id_club, grado_actual_id, created_at) FROM stdin;
865eaa42-e03c-4379-b310-919f9dbd0fc9	4bd34a40-faad-48e5-b9ba-c5f9758c6802	\N	masculino	58	Senior	0d9be495-ec7f-49a4-b613-54a0e38ed51c	\N	2026-05-02 16:18:33.506451
e6dc4a39-820a-46b6-9dc1-5c9061a9eac2	e95dba2b-ed7e-4145-b685-5cdd24781f4e	\N	masculino	63	Senior	0d9be495-ec7f-49a4-b613-54a0e38ed51c	\N	2026-05-02 16:18:33.506451
69f22499-6b2b-49ed-806d-b8d4b12fd56f	aec2dadb-d3e1-4a17-a9d6-175a243ba3aa	\N	masculino	74	Junior	0d9be495-ec7f-49a4-b613-54a0e38ed51c	\N	2026-05-02 16:18:33.506451
225f7f8e-bf4d-4dab-ab77-2ed7f5226a15	4d9701bb-cd0f-49cf-8577-fd2e5eb54b85	\N	masculino	58	Senior	0d9be495-ec7f-49a4-b613-54a0e38ed51c	\N	2026-05-02 16:18:33.506451
a820c8ff-b282-4cc2-9f3b-c6c4b04104d7	03670c07-f433-45b0-bd05-0b6bbf98e506	\N	masculino	68	Senior	0d9be495-ec7f-49a4-b613-54a0e38ed51c	\N	2026-05-02 16:18:33.506451
51635ed5-8864-4139-ae10-f93c51221f91	c386e3fa-1990-469b-a1fb-a139712a173d	2006-01-01	masculino	58	Senior	0d9be495-ec7f-49a4-b613-54a0e38ed51c	\N	2026-05-02 19:25:39.796049
cd25e287-1e23-4e09-8cba-114a9a57386b	ee0c83bd-3f18-4281-95d2-190a24e5343f	2008-01-01	femenino	46	Senior	0d9be495-ec7f-49a4-b613-54a0e38ed51c	\N	2026-05-02 19:25:39.796049
89986fbc-6809-4460-a615-2d3cc813bde3	e118d863-6c65-4893-a593-23e4979e1be9	2005-01-01	femenino	53	Senior	0d9be495-ec7f-49a4-b613-54a0e38ed51c	\N	2026-05-02 19:25:39.796049
65b4cb37-eb5d-4a31-b7ee-29a52f96749e	7e8af235-1281-4c39-98cc-36468d915d73	2007-01-01	masculino	63	Senior	0d9be495-ec7f-49a4-b613-54a0e38ed51c	\N	2026-05-02 19:25:39.796049
3fae380b-8a42-4894-ab3a-b167f99bf8f3	feb3f1de-ee29-43bd-8223-7ea22f5f9311	2006-01-01	femenino	49	Senior	0d9be495-ec7f-49a4-b613-54a0e38ed51c	\N	2026-05-02 19:25:39.796049
98432a2c-4984-4b92-8356-fd70bfd1bdfe	1caa4d4a-d040-45ed-9d73-4ac437359273	2001-01-01	masculino	74	Senior	0d9be495-ec7f-49a4-b613-54a0e38ed51c	\N	2026-05-02 19:25:39.796049
0a165d4c-c2dd-455a-a5e9-4e8dff0ec5e0	a81f22c9-1016-4a85-bf32-d9bcb4f59f27	2005-01-01	masculino	58	Senior	0d9be495-ec7f-49a4-b613-54a0e38ed51c	\N	2026-05-02 19:25:39.796049
891a6ea8-291f-4aa0-b0df-581dc3629ffd	888af8ce-b702-422b-9491-41d1515a82ed	2007-01-01	femenino	46	Senior	0d9be495-ec7f-49a4-b613-54a0e38ed51c	\N	2026-05-02 19:25:39.796049
b5c9d0a3-2454-4188-aa34-337bab6ae5b1	8f18e032-05ba-4224-b6a3-ae3867f49c8c	2005-01-01	femenino	62	Senior	0d9be495-ec7f-49a4-b613-54a0e38ed51c	\N	2026-05-02 19:25:39.796049
a4999aa1-ccd4-4e0d-9f3d-157656ec2500	80b178e9-4fa9-41d8-9053-1587e9a52ab6	2003-01-01	masculino	68	Senior	0d9be495-ec7f-49a4-b613-54a0e38ed51c	\N	2026-05-02 19:25:39.796049
20dba9ca-1b55-42c6-a49f-1efec1cdfd3a	f2d326f7-f5c8-427c-93bd-40bc3fbcce8b	2007-01-01	masculino	53	Senior	0d9be495-ec7f-49a4-b613-54a0e38ed51c	\N	2026-05-02 19:25:39.796049
f9e3bec1-a7ba-4fe7-baa9-0be3bff666d5	c5a1657b-f937-4fb7-bd11-fa683909411a	2008-01-01	femenino	67	Senior	0d9be495-ec7f-49a4-b613-54a0e38ed51c	\N	2026-05-02 19:25:39.796049
b914e18b-5d37-46a3-a63d-b3ed06400629	0b6d93d8-88cb-467b-9bc2-f9f4faf55801	2003-01-01	femenino	57	Senior	0d9be495-ec7f-49a4-b613-54a0e38ed51c	\N	2026-05-02 19:25:39.796049
484d49f8-6869-4cfd-90cd-96a10ab0cf86	f41f88b0-d8e9-4e94-ba57-78f2a0f452c0	2002-01-01	masculino	80	Senior	0d9be495-ec7f-49a4-b613-54a0e38ed51c	\N	2026-05-02 19:25:39.796049
807fb251-a52d-44c3-be3a-ec2f3aebed0b	294e1555-e198-45a5-a10a-e311db5ec929	2004-01-01	femenino	62	Senior	0d9be495-ec7f-49a4-b613-54a0e38ed51c	\N	2026-05-02 19:25:39.796049
\.


--
-- Data for Name: poomsae; Type: TABLE DATA; Schema: public; Owner: tkduser
--

COPY public.poomsae (id_poomsae, nombre, nivel, descripcion) FROM stdin;
6368425f-b9fa-47d7-9f6a-2c4f78ea65f9	Taegeuk Il Jang	1	Primer Taegeuk ÔÇö simboliza el cielo y la luz
cd0b3460-9056-4db4-b03f-a63fec9a7fd1	Taegeuk Ee Jang	2	Segundo Taegeuk ÔÇö simboliza el gozo interior
99d0fd81-869f-4399-bf7f-769b0da6ae80	Taegeuk Sam Jang	3	Tercer Taegeuk ÔÇö simboliza el fuego y el sol
848e858b-0a54-48cd-bffe-671f7d180c9d	Taegeuk Sa Jang	4	Cuarto Taegeuk ÔÇö simboliza el trueno
8237bff5-ac71-419d-837b-92c28a35a2f2	Taegeuk Oh Jang	5	Quinto Taegeuk ÔÇö simboliza el viento
e7cf5d9b-e9a5-4095-922f-a7544a32f0ac	Taegeuk Yuk Jang	6	Sexto Taegeuk ÔÇö simboliza el agua
afd3ddb4-cd36-49ff-abb4-311be32b99d4	Taegeuk Chil Jang	7	S├®ptimo Taegeuk ÔÇö simboliza la monta├▒a
cde76af9-ddd4-4afc-8671-7097fcb1a535	Taegeuk Pal Jang	8	Octavo Taegeuk ÔÇö simboliza la tierra
e199fc8e-64f0-4c9a-9df7-0fe865b92c7e	Koryo	9	1er Dan ÔÇö simboliza la antigua Corea
9ccfae6d-0c0d-499d-b3d1-774c347c2c21	Keumgang	10	2do Dan ÔÇö simboliza el diamante
\.


--
-- Data for Name: evaluacion; Type: TABLE DATA; Schema: public; Owner: tkduser
--

COPY public.evaluacion (id_evaluacion, id_atleta, id_poomsae, fecha_evaluacion, tipo_evaluacion, puntaje_total, resultado, observaciones, created_at) FROM stdin;
\.


--
-- Data for Name: archivo_analisis; Type: TABLE DATA; Schema: public; Owner: tkduser
--

COPY public.archivo_analisis (id_archivo, id_evaluacion, url_archivo, modelo_usado, fecha_subida) FROM stdin;
\.


--
-- Data for Name: evento; Type: TABLE DATA; Schema: public; Owner: tkduser
--

COPY public.evento (id_evento, nombre_evento, tipo_evento, fecha_inicio, fecha_fin, lugar, descripcion, estado, created_at) FROM stdin;
daaf5dd7-ee2f-4f73-b013-499743b01969	3er Ranking Nacional La Paz	competencia	2026-06-15	2026-06-15	Coliseo Municipal La Paz	Tercer ranking nacional de Taekwondo temporada 2026	programado	2026-05-04 00:29:06.535108
\.


--
-- Data for Name: competencia_resultado; Type: TABLE DATA; Schema: public; Owner: tkduser
--

COPY public.competencia_resultado (id_resultado, id_evento, id_atleta, modalidad, categoria, peso, posicion_final, puntos_ganados, es_ganador, created_at) FROM stdin;
\.


--
-- Data for Name: detalle_evaluacion; Type: TABLE DATA; Schema: public; Owner: tkduser
--

COPY public.detalle_evaluacion (id_detalle, id_evaluacion, criterio, puntaje, observacion) FROM stdin;
\.


--
-- Data for Name: entrenador; Type: TABLE DATA; Schema: public; Owner: tkduser
--

COPY public.entrenador (id_entrenador, id_usuario, id_club, especialidad, certificacion, created_at) FROM stdin;
\.


--
-- Data for Name: ranking; Type: TABLE DATA; Schema: public; Owner: tkduser
--

COPY public.ranking (id_ranking, id_atleta, categoria, puntaje_acumulado, posicion, fecha_actualizacion) FROM stdin;
a5f288b6-601d-4088-aa5f-4d8e69a898dd	865eaa42-e03c-4379-b310-919f9dbd0fc9	Senior	97	1	2026-05-02 16:18:54.505168
7144d392-c228-49e6-92de-6b163b435e89	e6dc4a39-820a-46b6-9dc1-5c9061a9eac2	Senior	93	2	2026-05-02 16:18:54.505168
6b3afb51-6170-48a9-8a6c-3bdf4de08749	69f22499-6b2b-49ed-806d-b8d4b12fd56f	Junior	90	3	2026-05-02 16:18:54.505168
090be25e-0da9-4c5c-a8b5-a03dd2dd6168	225f7f8e-bf4d-4dab-ab77-2ed7f5226a15	Senior	85	4	2026-05-02 16:18:54.505168
de63daf6-8c78-417c-9e53-dd0d66a761d0	a820c8ff-b282-4cc2-9f3b-c6c4b04104d7	Senior	80	5	2026-05-02 16:18:54.505168
\.


--
-- PostgreSQL database dump complete
--

\unrestrict 4OG1C66MSASt50xmQq54bgljm4yz6619Xm96raKCrXPZDpTN1dWwAN0vbIs8BSf

