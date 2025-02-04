document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  const btnUpload = document.getElementById("btnUpload");
  const btnRecord = document.getElementById("btnRecord");
  const videoList = document.getElementById("videoList");

  btnUpload.addEventListener("click", () => {
        checkPermissionsForUpload();
    });

    btnRecord.addEventListener("click", () => {
        checkPermissionsForRecord();
    });

    function checkPermissionsForUpload() {
        const permissions = cordova.plugins.permissions;
        const requiredPermissions = [
            permissions.READ_EXTERNAL_STORAGE,
            permissions.WRITE_EXTERNAL_STORAGE
        ];
    
        permissions.requestPermissions(requiredPermissions, (status) => {
            if (!status.hasPermission) {
                // Permissions granted, open photo library to select video
                openPhotoLibrary();
            } else {
                // If user denied, request again
                permissions.requestPermissions(requiredPermissions, (status) => {
                    if (status.hasPermission) {
                        openPhotoLibrary();
                    } else {
                        alert("You need to grant storage permissions to select a video.");
                    }
                });
            }
        });
    }

    function checkPermissionsForRecord() {
        const permissions = cordova.plugins.permissions;
        const requiredPermissions = [
            permissions.CAMERA,
            permissions.RECORD_AUDIO
        ];
    
        permissions.requestPermissions(requiredPermissions, (status) => {
            if (!status.hasPermission) {
                // Permissions granted, open camera to record video
                openCameraForRecording();
            } else {
                // If user denied, request again
                permissions.requestPermissions(requiredPermissions, (status) => {
                    if (status.hasPermission) {
                        openCameraForRecording();
                    } else {
                        alert("You need to grant camera and audio permissions to record a video.");
                    }
                });
            }
        });
    }
    
function openPhotoLibrary() {    
    navigator.camera.getPicture(onSuccess, onError, {
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        mediaType: Camera.MediaType.VIDEO,
        destinationType: Camera.DestinationType.FILE_URI,
    });
}

function openCameraForRecording() {
    navigator.device.capture.captureVideo(onRecordSuccess, onError, {
        limit: 1,
        duration: 60,
        quality: 1,
    });
}


  function onSuccess(videoURI) {
    resolveLocalFileSystemURL(videoURI, (fileEntry) => {
      fileEntry.file((file) => {
        addVideoToList(fileEntry.toURL(), file.name);
      }, onError);
    }, onError);
  }

  function onRecordSuccess(mediaFiles) {
    const videoFile = mediaFiles[0];
    resolveLocalFileSystemURL(videoFile.fullPath, (fileEntry) => {
      fileEntry.file((file) => {
        addVideoToList(fileEntry.toURL(), file.name);
      }, onError);
    }, onError);
  }

  function addVideoToList(videoURI, videoName) {
    // Create the video card container
    const videoItem = document.createElement("div");
    videoItem.className = "video-item";

    // Create the thumbnail container
    const thumbnailDiv = document.createElement("div");
    thumbnailDiv.className = "video-thumbnail";

    // Create a hidden video element to capture the thumbnail
    const videoElement = document.createElement("video");
    videoElement.src = videoURI;
    videoElement.currentTime = 1; // capture frame at 1 second
    videoElement.muted = true;
    videoElement.style.display = "none";

    // Generate thumbnail when video data is available
    videoElement.addEventListener("loadeddata", () => {

        // Set the desired thumbnail width (adjust as needed)
        const desiredWidth = 320;
        // Calculate the height to maintain the video's aspect ratio
        const aspectRatio = videoElement.videoWidth / videoElement.videoHeight;
        const desiredHeight = desiredWidth / aspectRatio;

      const canvas = document.createElement("canvas");
      canvas.width = desiredWidth;
      canvas.height = desiredHeight;
      const context = canvas.getContext("2d");
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      try {
        context.drawImage(videoElement, 0, 0, desiredWidth, desiredHeight);
        const thumbnailImg = document.createElement("img");
        thumbnailImg.src = canvas.toDataURL("image/jpeg", 0.85);
        thumbnailImg.alt = "Video Thumbnail";
        thumbnailImg.addEventListener("click", () => navigateToVideoPlayer(videoURI));
        // Clear any existing content and add the thumbnail image
        thumbnailDiv.innerHTML = "";
        thumbnailDiv.appendChild(thumbnailImg);
      } catch (error) {
        console.error("Error generating thumbnail:", error);
        addFallbackThumbnail();
      }
    });

    videoElement.addEventListener("error", () => {
      addFallbackThumbnail();
    });

    // Append the hidden video element so it can load
    thumbnailDiv.appendChild(videoElement);

    function addFallbackThumbnail() {
      thumbnailDiv.innerHTML = "";
      const fallbackImg = document.createElement("img");
      fallbackImg.src = "logo.png"; // Default fallback image path
      fallbackImg.alt = "Fallback Thumbnail";
      fallbackImg.addEventListener("click", () => navigateToVideoPlayer(videoURI));
      thumbnailDiv.appendChild(fallbackImg);
    }

    // Append thumbnail to the video card
    videoItem.appendChild(thumbnailDiv);

    // Create and append the title element
    const titleDiv = document.createElement("div");
    titleDiv.className = "video-title";
    titleDiv.textContent = videoName || "Unknown Video";
    videoItem.appendChild(titleDiv);

    // Add the complete video card to the list
    videoList.appendChild(videoItem);
  }

  function navigateToVideoPlayer(videoURI) {
    window.location.href = `playVideo.html?videoURI=${encodeURIComponent(videoURI)}`;
  }

  function onError(error) {
    alert("Error: " + JSON.stringify(error));
  }
}
