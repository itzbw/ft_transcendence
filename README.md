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

### The pieces

Four containers on one Docker network. The browser only ever talks to Nginx; Nginx serves the website and forwards anything under `/api` to Django.

```mermaid
flowchart LR
    User([User]) --> Browser["Browser<br/>runs the website<br/>keeps login token"]
    Browser <-->|HTTPS| Nginx

    subgraph Docker
        Nginx["Nginx<br/>(serves website +<br/>forwards /api)"]
        Django["Django<br/>(the API + game logic)"]
        DB[("PostgreSQL<br/>(users, games)")]
        Nginx -->|website files| Browser
        Nginx -->|/api| Django
        Django <--> DB
    end
```

### How a user moves through the app

One picture, top to bottom: arrive → get in → use the app → play → see your stats.

```mermaid
flowchart TD
    Start([User opens the site]) --> Check{Logged in?<br/>i.e. valid token?}

    Check -->|No| Login[/"Login or Register page"/]
    Login --> Auth["Send username + password<br/>(+ 2FA code if enabled)"]
    Auth -->|wrong| Login
    Auth -->|correct| Token["Server returns a login token<br/>browser saves it"]
    Token --> Check

    Check -->|Yes| App["Full app unlocked<br/>(profile, friends, leaderboard, game)"]
    App --> Heartbeat["Every 60s: ping server<br/>so you show as 'online'"]

    App --> Play["Play Pong<br/>vs AI · vs human · tournament"]
    Play --> Finish["Match ends → send the result"]
    Finish --> Save{"Any real<br/>account playing?"}
    Save -->|No, guests/AI only| Discard["Result discarded"]
    Save -->|Yes| Record["Save the game,<br/>update wins / losses / played"]
    Record --> Stats["Shows up in your profile<br/>and the leaderboard"]
```

> **The one rule that ties it together:** every request to `/api` carries the saved login token. A small piece of Django (`JwtAuthMiddleware`) reads that token on *every* request and decides who you are — that's what gates the whole app.

### Logging in, in detail

The only non-obvious part of auth: **two-factor is checked in the same step as the password** — there's no separate 2FA screen at login. And 2FA is opt-in, set up later from your profile.

```mermaid
flowchart TD
    A["Submit login form"] --> B{Password correct?}
    B -->|No| X["Rejected"]
    B -->|Yes| C{2FA turned on<br/>for this account?}
    C -->|No| OK["Issue login token ✔"]
    C -->|Yes| D{6-digit code valid?}
    D -->|No| X
    D -->|Yes| OK

    subgraph setup["Setting up 2FA later (optional)"]
        S1["Profile → enable 2FA"] --> S2["Server shows a QR code"]
        S2 --> S3["Scan in authenticator app"]
        S3 --> S4["Enter code once to confirm"]
        S4 --> S5["2FA now required at login"]
    end
```

## Preview

![alt text](ft_02.gif)
![alt text](ft_01.gif)

## Final Marks

![alt text](ft_transcendence.png)

