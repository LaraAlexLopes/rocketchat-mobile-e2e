#!/usr/bin/env bash
# Downloads a pinned Rocket.Chat Android release, so every run tests the same app version.
set -euo pipefail

VERSION="${ROCKETCHAT_APP_VERSION:-4.78.1}"
TARGET="${APK_PATH:-apps/rocketchat.apk}"
URL="https://github.com/RocketChat/Rocket.Chat.ReactNative/releases/download/${VERSION}/android-release.apk"

if [[ -f "$TARGET" && "${FORCE_DOWNLOAD:-false}" != "true" ]]; then
  echo "APK already present at $TARGET (set FORCE_DOWNLOAD=true to replace it)"
  exit 0
fi

mkdir -p "$(dirname "$TARGET")"
echo "Downloading Rocket.Chat Android $VERSION..."
curl --fail --location --silent --show-error --output "$TARGET" "$URL"
echo "Saved to $TARGET ($(du -h "$TARGET" | cut -f1))"
