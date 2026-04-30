<!-- © Shimon Shmueli -->

# shimonshmueli.github.io

Personal one-pager. Plain HTML / CSS / JS — no build step.

## Local preview

Just open `index.html` in a browser, or serve the directory:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a new GitHub repo named **exactly** `shimonshmueli.github.io` (it must match your username for root-domain hosting).
2. From this directory:
   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/shimonshmueli/shimonshmueli.github.io.git
   git push -u origin main
   ```
3. In the repo's **Settings → Pages**, confirm source is `main` / `/ (root)`. The site will be live at https://shimonshmueli.github.io within a minute or two.

The `.nojekyll` file is included so GitHub Pages serves files as-is (skipping Jekyll processing).

## Configure the email form

The contact modal uses [Web3Forms](https://web3forms.com/) (no backend needed).

1. Go to https://web3forms.com/ and create a free access key tied to `shimon.shmueli@gmail.com`.
2. Open `index.html` and replace `YOUR_WEB3FORMS_ACCESS_KEY` with the key you got.
3. That's it — submissions will go straight to your inbox.

## Add your profile picture

Drop a square image at `assets/profile.jpg`. It will replace the "SS" initials avatar in the hero. Any reasonable size works (the avatar is ~132 px on screen, so 264×264 or larger is plenty for retina).

## Add ZoneKey Pro screenshots

See `assets/zonekey/README.md`. Drop `icon.png` and `screenshot-1.png` through `screenshot-5.png` in `assets/zonekey/`.

## Project screenshots

Project cards use [Microlink](https://microlink.io) to fetch live screenshots of each Vercel URL — no work required, they update automatically as the linked sites change. Free tier with no API key, generous for personal-site traffic.

If you ever want to swap to static images, replace each project card's `<img src="https://api.microlink.io/...">` with a local file like `assets/projects/cheatybang.png`.

## File map

```
index.html              # markup
styles.css              # all styles (Anthropic-inspired cream palette)
script.js               # modal + form handling
.nojekyll               # tells GitHub Pages to skip Jekyll
assets/
  profile.jpg           # (you add) profile picture
  zonekey/
    icon.png            # (you add) app icon
    screenshot-1.png…   # (you add) app screenshots
```
