# Chami's House of Food: app and website

The same site works two ways:

- `www/index.html` is the full website in a single file. Open it in any browser, or upload it to Netlify.
- This repo also builds an Android APK on GitHub, with no Android Studio needed.

## Get the APK from GitHub

1. Create a new repository on github.com and upload everything in this folder
   (including the hidden `.github` folder, which holds the build workflow).
2. Open the **Actions** tab. The **Build Android APK** workflow starts by itself after the upload.
   You can also press **Run workflow** to start it by hand.
3. Wait about 5 to 8 minutes for the green tick.
4. Download the APK in either place:
   - **Releases** (right side of the repo page): download `Chamis-House-of-Food.apk`.
   - Or open the finished run in **Actions** and download the file under **Artifacts**.
5. Send the APK to an Android phone and open it. If Android asks, allow installs from this source.

This is a debug build for testing and showing clients. It installs fine, but Google Play needs a
signed release build. Ask for that when you are ready.

## Change the menu, prices, numbers or design

The source lives in `site-src/`.

- Menu items and prices: `site-src/src/1-data.js`
- Phone numbers: the `CONFIG` block at the top of the same file
- Colours and layout: `site-src/src/style.css`
- Photos: `site-src/assets/` (keep the same file names)

Rebuild the website file, then upload the changes to GitHub and a new APK builds itself:

```
npm install
npm run build:web
```

## Notes

- Orders open WhatsApp with the order text filled in. Nothing is paid or sent until the customer presses send.
- Photos are crops from the design mockup. Swap in real food photos when you have them.
- Fonts (Anton, Barlow, Kaushan Script) load from Google Fonts when the phone is online. Offline, the app falls back to the phone's own fonts.
