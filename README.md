# Video Manager Cordova

A simple Cordova mobile application to manage videos—upload from the device library, record new videos, generate thumbnails, and play videos. This project is configured for Android.

## Video Example

https://github.com/user-attachments/assets/05435c23-d8fd-4b8b-9319-7c3660f267ca

## Features

- **Upload Video:** Select a video from the device's photo library.
- **Record Video:** Record a new video using the device camera.
- **Generate Thumbnails:** Create a thumbnail image from the first frame of the video.
- **Play Video:** (Example code provided; implement as needed.)
- **Permissions:** Dynamically request necessary permissions (camera, storage, audio).

## Requires

- [Node.js](https://nodejs.org/)
- [Cordova CLI](https://cordova.apache.org/) (install globally with `npm install -g cordova`)
- [Android Studio](https://developer.android.com/studio) and Android SDK
- [Gradle](https://gradle.org/install/) (ensure it is in your system's PATH)

## Setup

1. **CD Cordova Project**
  - cd VideoManager
2. **Add the Android Platform**
  - cordova platform add android
3. **Install Required Plugins**
  - cordova plugin add cordova-plugin-android-permissions
  - cordova plugin add cordova-plugin-file
  - cordova plugin add cordova-plugin-camera
  - cordova plugin add cordova-plugin-filechooser
  - cordova plugin add cordova-plugin-filepicker
  - cordova plugin add cordova-plugin-media-capture
4. **Build Project**
  - cordova build android
5. **Run Project**
  - cordova run android



    
