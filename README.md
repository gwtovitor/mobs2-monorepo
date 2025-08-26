# 🚗 MOBS2 — Painel de Veículos

Aplicação **full-stack** para cadastro/autenticação de usuários, CRUD de veículos e telemetria simulada em tempo real no **Google Maps**.

- **Server**: Node.js + TypeScript (Express, JWT, `ws`, PostgreSQL via `pg-promise`)  
- **Front**: React, `@react-google-maps/api`, WebSocket nativo  
- **Arquitetura**: Clean Architecture (`domain` / `application` / `infra`)  
- **Docker**: DB (scripts `yarn docker:start`)  

---

## 🎯 Como rodar

### 🔙 Backend (`/server`)
```bash
cd server
yarn
yarn docker:start
yarn dev
yarn docker:stop  
```

### .env (server)
```env
PORT=3001
DATABASE_URL=postgres://postgres:123456@localhost:5432/app
JWT_SECRET=uma_chave_segura
JWT_EXPIRES_IN=1h
TELEMETRY_ORIGIN_LAT=-8.05
TELEMETRY_ORIGIN_LNG=-34.90
TELEMETRY_DEBUG=true
```

### SQL inicial
```sql
CREATE SCHEMA IF NOT EXISTS mobs;

CREATE TABLE IF NOT EXISTS mobs.account (
  account_id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS mobs.vehicle (
  plate TEXT PRIMARY KEY,
  model TEXT NOT NULL,
  manufacturer TEXT NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);
```

---

### 🖥️ Frontend (`/view`)
```bash
cd view
yarn
yarn dev    # http://localhost:5173
```

### .env (view)
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_WS_URL=ws://localhost:3001/ws
REACT_APP_GOOGLE_MAPS_API_KEY=SEU_API_KEY
```

---

## 🗂️ Estrutura (monorepo)
```text
.
├─ server/
│  └─ src/
│     ├─ domain/              # entidades e portas (Account, Vehicle, Telemetry*)
│     ├─ application/         # use cases e serviços (Signup, Login, Vehicles, TelemetrySimulator)
│     └─ infra/               # http, ws, controllers, db, repositories, security, telemetry store
└─ view/
   └─ src/
      ├─ services/            # clients REST (auth, vehicles)
      ├─ components/          # UI (Map, Lists, Modal CRUD)
      ├─ context/             # AuthContext GoogleMapsProvider 
      ├─ hooks/               # useTelemetry (WebSocket)
      └─ view /               # Login, Signup, Dashboard
```

---

## 🔐 API Backend (REST)

Todas as rotas exigem **JWT** no header:  
`Authorization: Bearer <token>`

### Auth

#### POST /signup
**Request Body**
```json
{ "name": "John Doe", "email": "john@doe.com", "password": "Strong#123" }
```
**Responses**
- 200 ✅
```json
{ "accountId": "uuid" }
```
- 422 ❌
```json
{ "error": "Invalid name | Invalid email | Invalid password" }
```

#### POST /login
**Request Body**
```json
{ "email": "john@doe.com", "password": "Strong#123" }
```
**Responses**
- 200 ✅
```json
{ "accessToken": "jwt" }
```
- 422 ❌
```json
{ "error": "Invalid credentials" }
```

---

### Vehicles (JWT)

#### GET /vehicles
Retorna a lista de veículos cadastrados.

**Response 200**
```json
[
  {
    "plate": "ABC-1234",
    "model": "ModelName",
    "manufacturer": "ManufacturerName",
    "year": 2020
  }
]
```

#### POST /vehicles
Cria um novo veículo.

**Request Body**
```json
{
  "plate": "ABC-1234",
  "model": "Corolla",
  "manufacturer": "Toyota",
  "year": 2020
}
```
**Responses**
- 200 ✅
```json
{ "plate": "ABC-1234" }
```
- 422 ❌
```json
{ "error": "Vehicle already exists | Invalid ..." }
```

#### GET /vehicles/:plate
Busca detalhes de um veículo pela placa.

**Responses**
- 200 ✅
```json
{ "plate": "ABC-1234", "model": "Corolla", "manufacturer": "Toyota", "year": 2020 }
```
- 422 ❌
```json
{ "error": "Vehicle not found" }
```

#### PUT /vehicles/:plate
Atualiza dados de um veículo (body pode ser parcial).

**Request Body**
```json
{ "model": "Corolla XEi", "year": 2021 }
```
**Responses**
- 200 ✅
```json
{ "plate": "ABC-1234", "model": "Corolla XEi", "manufacturer": "Toyota", "year": 2021 }
```
- 422 ❌
```json
{ "error": "Vehicle not found | Invalid ..." }
```

#### DELETE /vehicles/:plate
Remove um veículo.

**Responses**
- 200 ✅
```json
{ "success": true }
```
- 422 ❌
```json
{ "error": "Vehicle not found" }
```

---

### Telemetry (HTTP, JWT)
```json
GET /telemetry/:plate?limit=50 →  
{
  "plate": "ABC-1234",
  "history": [
    { "lat": -8.05, "lng": -34.90, "speed": 60, "fuel": 78, "timestamp": 1724523456789 }
  ]
}
```

---

## 🔌 WebSocket

**URL:** `ws://<host>:<port>/ws?token=<JWT>`  
Token ausente/inválido → close code `1008 (Policy Violation)`.

### Cliente → Servidor
- Assinar todas: `{ "type": "subscribe" }`  
- Assinar uma: `{ "type": "subscribe", "plate": "ABC-1234" }`  
- Cancelar uma: `{ "type": "unsubscribe", "plate": "ABC-1234" }`  
- Cancelar todas: `{ "type": "unsubscribe" }`  
- Pedir histórico: `{ "type": "history", "plate": "ABC-1234", "limit": 100 }`

### Servidor → Cliente
- Telemetria: `{ "type": "telemetry", "data": {...} }`  
- Histórico: `{ "type": "telemetry-batch", "plate": "ABC-1234", "history": [ ... ] }`

⏱️ Simulador: roda a cada 5000ms (configurável). Com `TELEMETRY_DEBUG=true`, logs `[SIM]` e `[WS]` aparecem no stdout.

---

## 🖥️ Frontend (UI)

- **Login** → POST /login → salva `accessToken` no localStorage  
- **Signup** → POST /signup → auto-login → dashboard  
- **Dashboard** → Sidebar (GET /vehicles), filtro por placa, status do WS  
- **Modal CRUD** → Create/Update/Delete veículos  
- **Mapa (Google Maps)** → abre WS, assina placas, plota histórico e última posição  

---

## 🧪 Testes (server)

- Unitários: entidades (Account, Vehicle), use cases (Signup, Login, Vehicles), TelemetrySimulator  
- Integração: fluxo signup → login → CRUD veículos → WS recebendo telemetry  

---

## 📄 Licença
MIT