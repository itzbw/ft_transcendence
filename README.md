# 42-ft_transcendence

This project is centered around the design, development, and organization of a full-stack web application

## Requirement

• This project must be created in group of 3 - 5 people\
 Groupmate :
[krozis](https://github.com/krozis)
[alessiobenincasa](https://github.com/alessiobenincasa)
[42-lbastian](https://github.com/42-lbastian)

• Modules 

1.  Use a Framework as backend (Django) 
2.  Use a front-end framework or toolkit (bootstrap) 
3.  Use a database for the backend (PostgreSQL) 
4.  Standard user management, authentication, users across tournaments 
5.  Game Customization Options 
6.  Introduce an AI Opponent 
7.  User and Game Stats Dashboards
8.  Implement Two-Factor Authentication (2FA) and JWT 
9.  Use of advanced 3D techniques (Three.js) 
10. Expanding Browser Compatibility 
11. Multiple language supports

## Architecture

The app is a single-page vanilla-JS frontend (with Three.js for the Pong game) served by Nginx, talking to a Django REST backend over HTTPS, with PostgreSQL for storage. Everything runs in Docker on a single network. Authentication is JWT-based (token kept in the browser's `localStorage`) with optional TOTP two-factor.

### Request routing

```mermaid
flowchart LR
    Browser["Browser<br/>(JWT in localStorage)"]
    subgraph net["trans_net (Docker)"]
        Nginx["Nginx · trans_front<br/>TLS :443→5555"]
        Django["Gunicorn + Django · trans_back :8000"]
        DB[("PostgreSQL · trans_db :5432")]
    end
    Browser -- "https://localhost:5555" --> Nginx
    Nginx -- "/ , /static" --> SPA["Static SPA<br/>index.html + ES modules"]
    Nginx -- "/shared_media" --> Media["avatar files<br/>(shared_media volume)"]
    Nginx -- "/api , /admin (proxy_pass)" --> Django
    Django --> DB
```

### Page load / boot

```mermaid
sequenceDiagram
    participant B as Browser (main.js)
    participant D as Django
    Note over B: DOMContentLoaded
    B->>D: GET /api/authentication/status/ (Bearer access_token)
    D->>D: JwtAuthMiddleware decodes token → request.user
    D-->>B: { isAuthenticated, username, otp_verified }
    B->>B: setHeader(status)
    B->>B: router(isAuthenticated)
    alt authenticated
        B->>B: checkHash() → #profile / #leaderboard / #game-menu / #pongvsbot / #pongvsman / #tournament
        loop every 60s
            B->>D: POST /api/users/update_status/ → last_active = now()
        end
    else not authenticated
        B->>B: checkHashMini() → #register, else login
    end
```

### Auth flows (register / login / 2FA)

```mermaid
flowchart TD
    R["POST /api/authentication/register/"] --> RV["RegisterView:<br/>unique checks → create_user(otp_secret)<br/>avatar = DEFAULT_AVATAR_URL"]

    L["POST /api/authentication/login/<br/>{username, password, otp?}"] --> AU{"authenticate()<br/>valid?"}
    AU -- no --> E401["401 Invalid credentials"]
    AU -- yes --> OTPq{"otp_secret AND<br/>otp_verified?"}
    OTPq -- no --> MINT["super().post() → {access, refresh}"]
    OTPq -- yes --> V{"verify(otp)?"}
    V -- no --> E2["401 Invalid OTP"]
    V -- yes --> MINT
    MINT --> LS["frontend stores access_token<br/>in localStorage"]

    P["GET /otp/provisioning/"] --> QR["pyotp URI → qrcode.min.js renders QR"]
    QR --> VER["POST /otp/verify/ {otp}<br/>→ otp_verified = True"]
```

### Authenticated request (JWT middleware)

```mermaid
sequenceDiagram
    participant B as Browser
    participant M as JwtAuthMiddleware
    participant V as View
    participant DB as Postgres
    B->>M: /api/... (Authorization: Bearer <access>)
    alt token valid
        M->>DB: SiteUser.objects.get(id=user_id)
        M->>M: request.user = user
    else expired / missing
        M->>M: request.user stays Anonymous (no error)
    end
    M->>V: get_response(request)
    V->>V: most views check request.user.is_authenticated
    V->>DB: query / write
    V-->>B: JsonResponse / DRF Response
```

### Gameplay → persistence

```mermaid
flowchart TD
    G["Three.js match<br/>(#pongvsbot / #pongvsman / #tournament)<br/>runs client-side"] --> END["match ends"]
    END --> SG["POST /api/users/save_game/<br/>{player1Name, score, player2Name, score}"]
    SG --> LK{"look up each name<br/>as SiteUser"}
    LK -- "both None (guest/AI)" --> SKIP["not saved, just echoed"]
    LK -- "≥1 real user" --> CR["create Game row<br/>(real = FK, guest = name string)"]
    CR --> ST["winner.totalWon++ / loser.totalLost++<br/>totalPlayed++"]
    ST --> SURF["surfaces in:<br/>GET /api/users/&lt;username&gt;/ (profile + history)<br/>GET /api/users/leaderboard/ (top 20)"]
```

## Preview

![alt text](ft_02.gif)
![alt text](ft_01.gif)

## Final Marks

![alt text](ft_transcendence.png)

