import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Slider,
  Select,
  Popover,
  Collapse,
  MenuItem,
  InputBase,
  TextField,
  IconButton,
  InputLabel,
  Grid,
  Snackbar,
} from "@material-ui/core";

import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import {
  Mic,
  Send,
  ChatBubble,
  VolumeDown,
  PhotoCamera,
  CloudUpload,
  CenterFocusStrong,
  PlayCircleFilledWhite,
} from "@material-ui/icons";
import axios from "axios";
import qs from "querystringify";
import Webcam from "react-webcam";
import ReactPlayer from "react-player";
import { Link } from "react-router-dom";
import Fullscreen from "react-full-screen";
import Alert from "@material-ui/lab/Alert";

import CloseIcon from "@material-ui/icons/Close";
import { triggerBase64Download } from "react-base64-downloader";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import useWindowDimensions from "../Dimensions/useWindowDimensions";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";

// about tuch event and keyboard handler part
import { Swipeable } from "react-touch";

/* components */
import Icon from "../Icon";
import Loading from "../Loading/Loading";

/* CustomHooks */
import { useEventListener } from "../customHooks/";

/* style */
import cx from "classnames";
import style from "./visor.css";
import InputEmoji from "react-input-emoji";

/* config */
import { API_PY, CAMERA_URL } from "../../config.js";

const videoConstraints = {
  facingMode: "user",
};

function MultiAlert(props) {
  return <Alert elevation={6} variant="filled" {...props} />;
}

const SelectIcon = () => {
  return (
    <svg
      className={cx("MuiSvgIcon-root", "MuiSelect-icon", style.white)}
      focusable="false"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M7 10l5 5 5-5z"></path>
    </svg>
  );
};

const BootstrapInput = withStyles((theme) => ({
  root: {
    "label + &": {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    color: "white",
    fontSize: 16,
    borderRadius: 4,
    position: "relative",
    border: "1px solid #ced4da",
    padding: "7px 26px 7px 12px",
    backgroundColor: "rgb(100,100,100,0)",
    transition: theme.transitions.create(["border-color", "box-shadow"]),

    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  switchTyle: {
    "& .MuiSwitch-colorSecondary.Mui-checked": {
      color: "#fbf2f5",
    },
    "& .MuiSwitch-track ": {
      backgroundColor: "white",
    },
  },
  selectStyle: {
    marginTop: "15px",
    backgroundColor: "black !important",
    color: "white !important",
    marginLeft: "-56px !important",
    "& .MuiSelect-select ": {
      width: "80px",
    },
  },
}));

var messageflag = false;
var tempflag = false;

const Visor = (props) => {
  const [popupflag, setPopupflag] = React.useState(false);
  const classes = useStyles();
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const _uploadPictureRef = useRef(null);
  const [muteFlag, setMute] = useState(true);
  const [message, setMessage] = useState("");
  const mediaRecorderRef_Audio = useRef(null);
  const [isRecord, setRecord] = useState(true);
  const [volumeVal, volumeChange] = useState(30);
  const [isFull, setFullscreen] = useState(false);
  const { height, width } = useWindowDimensions();
  const [alertFlag, setOpenalert] = useState(false);
  const [alertType, setAlerttype] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [channelType, setChannel] = useState("local");
  const [resolutionType, setResolution] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [uploadingFlag, setUploading] = useState(false);
  const [alertMessage, setAlertmeessage] = useState("");
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [inactivityTime, setIinactivityTime] = useState(5);
  const [capturing_Audio, setCapturing_Audio] = useState(false);
  const [recordedChunks_Audio, setRecordedChunks_Audio] = useState([]);
  const [settingflag, setSettingFlag] = useState(false);

  // this part is for tuch handler
  const [currentChanel, setCurrentChannel] = useState(0);
  const [open, setOpen] = useState(false);

  const [srcUrl, setSrcurl] = useState(
    CAMERA_URL + "camera-1/output_1280x720_6500k.m3u8"
  );

  const [hideflag, setHideFlag] = useState(false);

  useEffect(() => {
    setIntervalId(
      setInterval(() => {
        setIinactivityTime((prevState) => --prevState);
      }, 1000)
    );
    window.addEventListener("mousedown", handlepopupstate_mouse);
  }, []);

  useEffect(() => {
    messageflag = popupflag;
  }, [popupflag]);

  useEffect(() => {
    return () => {
      clearInterval(intervalId);
    };
  }, [intervalId]);

  useEffect(() => {
    if (alertFlag) {
      setTimeout(() => {
        setOpenalert(false);
      }, 3000);
    }
  }, [alertFlag]);

  const handlepopupstate = () => {
    setPopupflag(true);
  };
  const handletempflag = () => {
    tempflag = true;
  };
  const handlepopupstate_mouse = () => {
    setPopupflag(false);
    if (tempflag) setPopupflag(true);
    tempflag = false;
  };
  const handler = useCallback(
    ({ clientX, clientY }) => {
      setIinactivityTime(5);
    },
    [setIinactivityTime]
  );

  // Add event listener using our hook
  useEventListener("mousemove", handler);

  const channelChange = () => {
    if (currentChanel) {
      setChannel(currentChanel);
      switch (resolutionType) {
        case 0:
          setSrcurl(
            CAMERA_URL +
              "camera-" +
              currentChanel +
              "/output_1920x1080_8000k.m3u8"
          );
          break;
        case 1:
          setSrcurl(
            CAMERA_URL +
              "camera-" +
              currentChanel +
              "/output_1280x720_6500k.m3u8"
          );
          break;
        case 2:
          setSrcurl(
            CAMERA_URL +
              "camera-" +
              currentChanel +
              "/output_960x540_2000k.m3u8"
          );
          break;
        case 3:
          setSrcurl(
            CAMERA_URL +
              "camera-" +
              currentChanel +
              "/output_768x432_1200k.m3u8"
          );
          break;
      }
    }
  };

  const resolutionChange = (e) => {
    setResolution(e.target.value);
    switch (e.target.value) {
      case 0:
        setSrcurl(
          CAMERA_URL + "camera-" + channelType + "/output_1920x1080_8000k.m3u8"
        );
        break;
      case 1:
        setSrcurl(
          CAMERA_URL + "camera-" + channelType + "/output_1280x720_6500k.m3u8"
        );
        break;
      case 2:
        setSrcurl(
          CAMERA_URL + "camera-" + channelType + "/output_960x540_2000k.m3u8"
        );
        break;
      case 3:
        setSrcurl(
          CAMERA_URL + "camera-" + channelType + "/output_768x432_1200k.m3u8"
        );
        break;
    }
  };

  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setMessage(message + emoji);
  };

  const submitMessage = async () => {
    if (message) {
      await axios
        .post(
          API_PY + "message/topic",
          JSON.stringify({ user_id: 1, text: message }),
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        )
        .then((response) => {
          setMessage("");
          setAlerttype(true);
          setAlertmeessage("Message submited successfully");
          setOpenalert(true);
        })
        .catch((error) => {
          setAlerttype(false);
          setAlertmeessage("Message submit failed");
          setOpenalert(true);
        });
    } else {
      setAlerttype(false);
      setAlertmeessage("Empty Message");
      setOpenalert(true);
    }
  };

  const handleStartCaptureClick = useCallback(() => {
    try {
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: "video/webm",
      });
      mediaRecorderRef.current.addEventListener(
        "dataavailable",
        handleDataAvailable
      );
      mediaRecorderRef.current.start();
      setCapturing(true);
    } catch {
      setAlerttype(false);
      setAlertmeessage("There's no camera in your PC");
      setOpenalert(true);
    }
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleStartCaptureClick_Audio = useCallback(() => {
    try {
      mediaRecorderRef_Audio.current = new MediaRecorder(
        webcamRef.current.stream,
        {
          mimeType: "video/webm",
        }
      );
      mediaRecorderRef_Audio.current.addEventListener(
        "dataavailable",
        handleDataAvailable_Audio
      );
      mediaRecorderRef_Audio.current.start();
      setCapturing_Audio(true);
    } catch {
      setAlerttype(false);
      setAlertmeessage("There's no mic in your PC");
      setOpenalert(true);
    }
  }, [webcamRef, setCapturing_Audio, mediaRecorderRef_Audio]);

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleDataAvailable_Audio = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks_Audio((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks_Audio]
  );

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [recordedChunks, mediaRecorderRef, webcamRef, setCapturing]);

  const handleStopCaptureClick_Audio = useCallback(() => {
    mediaRecorderRef_Audio.current.stop();
    setCapturing_Audio(false);
  }, [
    recordedChunks_Audio,
    mediaRecorderRef_Audio,
    webcamRef,
    setCapturing_Audio,
  ]);

  const dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const date = new Date();
    const timestamp = date.getTime();
    const file = dataURLtoFile(imageSrc, timestamp + ".jpeg");
    const formData = new FormData();
    formData.append("files", file);
    await axios
      .post(API_PY + "upload_image", formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((response) => {
        setAlerttype(true);
        setAlertmeessage("Screenshot is uploaded successfully");
        setOpenalert(true);
      })
      .catch((error) => {
        setAlerttype(false);
        setAlertmeessage("Uploading file failed");
        setOpenalert(true);
      });
    //			triggerBase64Download(imageSrc, timestamp)
  }, [webcamRef]);

  const submitFiles = async (e) => {
    let files = event.target.files;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    await axios
      .post(API_PY + "upload_image", formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((response) => {
        setAlerttype(true);
        setAlertmeessage("Files are uploaded successfully");
        setOpenalert(true);
      })
      .catch((error) => {
        setAlerttype(false);
        setAlertmeessage("Uploading files failed");
        setOpenalert(true);
      });
  };

  const handleUploadPicture = (e) => {
    _uploadPictureRef.current.click();
  };

  const fetchData = async (url) => {
    const date = new Date();
    const timestamp = date.getTime();
    let file = await fetch(url)
      .then((r) => r.blob())
      .then(
        (blobFile) =>
          new File([blobFile], timestamp + ".h264", { type: "video/webm" })
      );
    const formData = new FormData();
    formData.append("files", file);
    await axios
      .post(API_PY + "upload_video", formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((response) => {
        setAlerttype(true);
        setAlertmeessage("Video is uploaded successfully");
        setOpenalert(true);
      })
      .catch((error) => {
        setAlerttype(false);
        setAlertmeessage("Uploading file failed");
        setOpenalert(true);
      });
  };

  const zeroPad = (nr, base) => {
    var len = String(base).length - String(nr).length + 1;
    return len > 0 ? new Array(len).join("0") + nr : nr;
  };

  const fetchData_Audio = async (url) => {
    const date = new Date();
    const hour = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();
    const timestamp =
      zeroPad(hour, 10) + "." + zeroPad(min, 10) + "." + zeroPad(sec, 10);
    let file = await fetch(url)
      .then((r) => r.blob())
      .then(
        (blobFile) =>
          new File([blobFile], "1_" + timestamp + ".wav", {
            type: "video/webm",
          })
      );
    const formData = new FormData();
    formData.append("files", file);
    await axios
      .post(API_PY + "upload_sound", formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((response) => {
        setAlerttype(true);
        setAlertmeessage("Audio is uploaded successfully");
        setOpenalert(true);
      })
      .catch((error) => {
        setAlerttype(false);
        setAlertmeessage("Uploading file failed");
        setOpenalert(true);
      });
  };

  useEffect(() => {
    if (recordedChunks.length && !capturing) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      fetchData(url);
      // const a = document.createElement("a")
      // document.body.appendChild(a)
      // a.style = "display: none"
      // a.href = url
      // a.download = "react-webcam-stream-capture.h264";
      // a.click()
      // window.URL.revokeObjectURL(url)
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  useEffect(() => {
    if (recordedChunks_Audio.length && !capturing_Audio) {
      const blob = new Blob(recordedChunks_Audio, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      fetchData_Audio(url);
      // const a = document.createElement("a")
      // document.body.appendChild(a)
      // a.style = "display: none"
      // a.href = url
      // a.download = "react-webcam-stream-capture.wav";
      // a.click()
      // window.URL.revokeObjectURL(url)
      setRecordedChunks_Audio([]);
    }
  }, [recordedChunks_Audio]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleUserKeyPress = useCallback(
    (event) => {
      if (messageflag === false) {
        const { key, keyCode } = event;
        if (keyCode === 37 || keyCode === 40) {
          if (currentChanel > 1) {
            setCurrentChannel((currentChanel) => currentChanel - 1);
          }
        }
        if (keyCode === 38 || keyCode === 39) {
          if (currentChanel < 20) {
            setCurrentChannel((currentChanel) => currentChanel + 1);
          }
        }
      }
    },
    [currentChanel]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);
    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, [handleUserKeyPress]);

  useEffect(() => {
    if (currentChanel < 21 && currentChanel > 0) {
      channelChange();
      setOpen(true);
    }
  }, [currentChanel]);

  return uploadingFlag ? (
    <Loading />
  ) : (
    <Fullscreen enabled={isFull} onChange={() => setFullscreen(isFull)}>
      <Snackbar
        open={open}
        autoHideDuration={1000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MultiAlert onClose={handleClose} severity="success">
          Channel {currentChanel}
        </MultiAlert>
      </Snackbar>
      <Swipeable
        onSwipeLeft={() => {
          if (currentChanel < 20 && messageflag === false) {
            setCurrentChannel((currentChanel) => currentChanel + 1);
          }
        }}
        onSwipeRight={() => {
          if (currentChanel > 0 && messageflag === false) {
            setCurrentChannel((currentChanel) => currentChanel - 1);
          }
        }}
        onSwipeDown={() => {
          if (currentChanel < 20 && messageflag === false) {
            setCurrentChannel((currentChanel) => currentChanel + 1);
          }
        }}
        onSwipeUp={() => {
          if (currentChanel > 0 && messageflag === false) {
            setCurrentChannel((currentChanel) => currentChanel - 1);
          }
        }}
      >
        <div>
          <Link to="/">
            <img
              src="/img/virtualium.png"
              className={cx(style.logo, {
                [`${style.hide}`]: hideflag ? null : inactivityTime <= 0,
              })}
            />
          </Link>

          <div
            className={cx(style.recordstatus, {
              [`${style.hide}`]: hideflag ? null : inactivityTime <= 0,
            })}
          >
            <Icon className={cx("tiny", isRecord ? style.red : style.white)}>
              fiber_manual_record
            </Icon>
            <span>EN VIVO</span>
          </div>

          <div className={style.alert}>
            <Collapse in={alertFlag}>
              <Alert
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setOpenalert(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                severity={alertType ? "success" : "error"}
              >
                {alertMessage}
              </Alert>
            </Collapse>
          </div>
          <div
            className={cx(style.fullscreen, {
              [`${style.hide}`]: hideflag ? null : inactivityTime <= 0,
            })}
          >
            {channelType == "local" ? (
              <Webcam
                audio={true}
                height={"100%"}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={"100%"}
                videoConstraints={videoConstraints}
              />
            ) : (
              // else
              <ReactPlayer
                url={srcUrl}
                playing={true}
                controls={false}
                muted={!muteFlag}
                width={width + "px"}
                height={height + "px"}
                volume={volumeVal / 100}
              />
            )}
            <div
              className={cx(style.bottombar, {
                [`${style.hide}`]: hideflag ? null : inactivityTime <= 0,
              })}
            >
              <div className={style.col1}>
                <span>Nombre evento...</span>
                <div className={style.volumeslider}>
                  <VolumeDown />
                  <Slider
                    value={volumeVal}
                    aria-labelledby="continuous-slider"
                    onChange={(event, newValue) => volumeChange(newValue)}
                    classes={{
                      track: style.sliderTrack,
                      thumb: style.sliderThumb,
                      rail: style.sliderRail,
                    }}
                  />
                </div>

                {/* <div
                      className={style.volumeMute}
                      onClick={() => setMute(!muteFlag)}
                    >
                      <Icon className="small">
                        {muteFlag ? "volume_mute" : "volume_off"}
                      </Icon>
                    </div> */}
              </div>

              {/*#######################################*/}
              <div className={style.col2}>
                <span onClick={capture} className={cx(style.iconButton)}>
                  <img src="/img/icons/icon-capture.svg" alt="" />
                </span>

                <span
                  className={cx(style.iconButton)}
                  onClick={() =>
                    capturing_Audio
                      ? handleStopCaptureClick_Audio()
                      : handleStartCaptureClick_Audio()
                  }
                >
                  <img
                    src={`/img/icons/icon-record-audio-${
                      capturing_Audio ? "stop" : "start"
                    }.svg`}
                    alt=""
                  />
                </span>

                <PopupState variant="popover" popupId="message-popup-popover">
                  {(popupState) => (
                    <div className={style.alignCenter}>
                      <span
                        {...bindTrigger(popupState)}
                        className={cx(style.iconButton)}
                      >
                        <img
                          src="/img/icons/icon-message.svg"
                          alt=""
                          onClick={handlepopupstate}
                        />
                      </span>
                      <Popover
                        {...bindPopover(popupState)}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
                        transformOrigin={{
                          vertical: "bottom",
                          horizontal: "center",
                        }}
                        className={style.messageBoxOut}
                      >
                        <Box p={2} className={style.messageButtonGroupEmoji}>
                          <InputEmoji
                            value={message}
                            onChange={setMessage}
                            onClick={handletempflag}
                            placeholder="Type a message"
                            className={style.customEmoji}
                          />
                          <IconButton
                            className={style.submitButton}
                            color="primary"
                            aria-label="record video"
                            component="span"
                            onClick={submitMessage}
                          >
                            <Send />
                          </IconButton>
                        </Box>
                      </Popover>
                    </div>
                  )}
                </PopupState>

                <span
                  onClick={handleUploadPicture}
                  className={cx(style.iconButton)}
                >
                  <img src="/img/icons/icon-cloud.svg" alt="" />
                  <input
                    multiple
                    type="file"
                    accept="image/*"
                    onChange={submitFiles}
                    ref={_uploadPictureRef}
                    style={{ display: "none" }}
                  />
                </span>

                <span
                  className={cx(style.iconButton)}
                  onClick={() =>
                    capturing
                      ? handleStopCaptureClick()
                      : handleStartCaptureClick()
                  }
                >
                  <img
                    src={`/img/icons/icon-record-video-${
                      capturing ? "stop" : "start"
                    }.svg?v2`}
                    alt=""
                  />
                </span>
              </div>
              {/*#######################################*/}

              {/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$*/}
              <div className={cx(style.volumeMute, style.col3)}>
                <Select
                  value={channelType}
                  onChange={(e) => setCurrentChannel(e.target.value)}
                  input={<BootstrapInput />}
                  IconComponent={SelectIcon}
                >
                  <MenuItem value={"local"}>Local CAM</MenuItem>
                  <MenuItem value={1}>Camera-1</MenuItem>
                  <MenuItem value={2}>Camera-2</MenuItem>
                  <MenuItem value={3}>Camera-3</MenuItem>
                  <MenuItem value={4}>Camera-4</MenuItem>
                  <MenuItem value={5}>Camera-5</MenuItem>
                  <MenuItem value={6}>Camera-6</MenuItem>
                  <MenuItem value={7}>Camera-7</MenuItem>
                  <MenuItem value={8}>Camera-8</MenuItem>
                  <MenuItem value={9}>Camera-9</MenuItem>
                  <MenuItem value={10}>Camera-10</MenuItem>
                  <MenuItem value={11}>Camera-11</MenuItem>
                  <MenuItem value={12}>Camera-12</MenuItem>
                  <MenuItem value={13}>Camera-13</MenuItem>
                  <MenuItem value={14}>Camera-14</MenuItem>
                  <MenuItem value={15}>Camera-15</MenuItem>
                  <MenuItem value={16}>Camera-16</MenuItem>
                  <MenuItem value={17}>Camera-17</MenuItem>
                  <MenuItem value={18}>Camera-18</MenuItem>
                  <MenuItem value={19}>Camera-19</MenuItem>
                  <MenuItem value={20}>Camera-20</MenuItem>
                </Select>
              </div>

              {/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$*/}

              {/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/}
              <div className={style.col4}>
                <div className={style.volumeMute}>
                  {/* <span
                      className={cx(style.iconButton)}
                      onClick={(e) => setSettingFlag(!settingflag)}
                    >
                      <img src="/img/icons/icon-setting.svg" alt="" />
                    </span> */}

                  <PopupState variant="popover">
                    {(popupState) => (
                      <div>
                        <span
                          {...bindTrigger(popupState)}
                          className={cx(style.iconButton)}
                        >
                          <img src="/img/icons/icon-setting.svg" alt="" />
                        </span>
                        <Popover
                          {...bindPopover(popupState)}
                          anchorOrigin={{
                            vertical: "top",
                            horizontal: "center",
                          }}
                          transformOrigin={{
                            vertical: "bottom",
                            horizontal: "center",
                          }}
                        >
                          <Box p={2} className={style.select_color}>
                            <Box>
                              <Grid container spacing={3}>
                                <Grid item xs={9}>
                                  <p style={{ color: "white" }}>
                                    Mostrar lista de mensajes
                                  </p>
                                </Grid>
                                <Grid
                                  item
                                  xs={3}
                                  style={{ paddingTop: "20px" }}
                                >
                                  <Switch
                                    className={classes.switchTyle}
                                    // checked={state.gilad}
                                    // onChange={handleChange}
                                    name="checkedA"
                                    inputProps={{
                                      "aria-label": "secondary checkbox",
                                    }}
                                  />
                                </Grid>
                              </Grid>
                            </Box>
                            <Box>
                              <Grid container spacing={3}>
                                <Grid item xs={9}>
                                  <p style={{ color: "white" }}>
                                    Barra visor siempre visible
                                  </p>
                                </Grid>
                                <Grid
                                  item
                                  xs={3}
                                  style={{ paddingTop: "20px" }}
                                >
                                  <Switch
                                    className={classes.switchTyle}
                                    checked={hideflag}
                                    onClick={() => setHideFlag(!hideflag)}
                                    name="checkedA"
                                    inputProps={{
                                      "aria-label": "secondary checkbox",
                                    }}
                                  />
                                </Grid>
                              </Grid>
                            </Box>
                            <Box>
                              <Grid container spacing={3}>
                                <Grid item xs={9}>
                                  <p style={{ color: "white" }}>Resolución </p>
                                </Grid>
                                <Grid item xs={3}>
                                  <Select
                                    className={classes.selectStyle}
                                    labelId="demo-simple-select-label"
                                    value={resolutionType}
                                    onChange={resolutionChange}
                                    IconComponent={SelectIcon}
                                  >
                                    <MenuItem value={0}>Auto 720px</MenuItem>
                                    <MenuItem value={1}>SD</MenuItem>
                                    <MenuItem value={2}>LD</MenuItem>
                                    <MenuItem value={3}>XD</MenuItem>
                                  </Select>
                                </Grid>
                              </Grid>
                            </Box>
                          </Box>
                        </Popover>
                      </div>
                    )}
                  </PopupState>
                  {/* 
                        {settingflag && (
                          <Select
                            value={resolutionType}
                            input={<BootstrapInput />}
                            onChange={resolutionChange}
                            IconComponent={SelectIcon}
                          >
                            <MenuItem value={0}>HD</MenuItem>
                            <MenuItem value={1}>SD</MenuItem>
                            <MenuItem value={2}>LD</MenuItem>
                            <MenuItem value={3}>XD</MenuItem>
                          </Select>
                        )} */}

                  <span
                    className={cx(style.iconButton)}
                    onClick={() => setFullscreen(!isFull)}
                  >
                    <img src="/img/icons/icon-fullscreem.svg" alt="" />
                  </span>
                </div>
              </div>
              {/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/}
            </div>
          </div>
        </div>
      </Swipeable>
    </Fullscreen>
  );
};

export default Visor;
