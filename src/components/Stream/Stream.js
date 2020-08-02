import React, { useRef, useState, useEffect, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import Fullscreen from "react-full-screen";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  Slider,
  IconButton,
  Box,
  Popover,
  TextField,
  Button,
  Collapse,
  Select,
  MenuItem,
  InputBase,
} from "@material-ui/core";
import {
  VolumeDown,
  PhotoCamera,
  CloudUpload,
  CenterFocusStrong,
  ChatBubble,
  PlayCircleFilledWhite,
  Send,
  Mic,
} from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import Alert from "@material-ui/lab/Alert";
import Loading from "../Loading/Loading";
import Icon from "../Icon";
import ReactPlayer from "react-player";
import useWindowDimensions from "../Dimensions/useWindowDimensions";
import qs from "querystringify";

/* style */
import cx from "classnames";
import style from "./stream.css";
import InputEmoji from "react-input-emoji";
import { API_PY, CAMERA_URL } from "../../config.js";

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
    borderRadius: 4,
    position: "relative",
    backgroundColor: "rgb(100,100,100,0)",
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "7px 26px 7px 12px",
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

const Stream = (props) => {
  const [srcUrl, setSrcurl] = useState(
    CAMERA_URL + "camera-1/output_1280x720_6500k.m3u8"
  );
  const [isFull, setFullscreen] = useState(false);
  const [isRecord, setRecord] = useState(false);
  const [message, setMessage] = useState("");
  const [volumeVal, volumeChange] = useState(30);
  const [muteFlag, setMute] = useState(true);
  const [uploadingFlag, setUploading] = useState(false);
  const [channelType, setChannel] = useState(1);
  const [resolutionType, setResolution] = useState(1);
  const [alertFlag, setOpenalert] = useState(false);
  const [alertType, setAlerttype] = useState(false);
  const [alertMessage, setAlertmeessage] = useState("");
  const { height, width } = useWindowDimensions();

  const numbers = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
  ];
  const cameraList = numbers.map((number) => (
    <MenuItem value={number}>Camera-{number}</MenuItem>
  ));

  // start part

  const mediaRecorderRef_Audio = useRef(null);
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recordedChunks_Audio, setRecordedChunks_Audio] = useState([]);
  const [capturing, setCapturing] = useState(false);
  const [capturing_Audio, setCapturing_Audio] = useState(false);

  const history = useHistory();

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

  const submitFiles = async (event) => {
    let files = event.target.files;

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      console.log("this is for part 2", files[i]);
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
  // end part

  const channelChange = (e) => {
    if (e.target.value) {
      setChannel(e.target.value);
      switch (resolutionType) {
        case 0:
          setSrcurl(
            CAMERA_URL +
              "camera-" +
              e.target.value +
              "/output_1920x1080_8000k.m3u8"
          );
          break;
        case 1:
          setSrcurl(
            CAMERA_URL +
              "camera-" +
              e.target.value +
              "/output_1280x720_6500k.m3u8"
          );
          break;
        case 2:
          setSrcurl(
            CAMERA_URL +
              "camera-" +
              e.target.value +
              "/output_960x540_2000k.m3u8"
          );
          break;
        case 3:
          setSrcurl(
            CAMERA_URL +
              "camera-" +
              e.target.value +
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
  };

  useEffect(() => {
    if (alertFlag) {
      setTimeout(() => {
        setOpenalert(false);
      }, 3000);
    }
  }, [alertFlag]);

  useEffect(() => {
    let values = qs.parse(props.location.search);
    if (typeof values.id !== "undefined") {
      setChannel(values.id);
      setSrcurl(
        CAMERA_URL + "camera-" + values.id + "/output_1280x720_6500k.m3u8"
      );
    }
  }, []);

  return uploadingFlag ? (
    <Loading />
  ) : (
    <Fullscreen enabled={isFull} onChange={() => setFullscreen(isFull)}>
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
      <div className={style.fullscreen}>
        <ReactPlayer
          url={srcUrl}
          playing={true}
          width={width + "px"}
          height={height + "px"}
          volume={volumeVal / 100}
          muted={!muteFlag}
          controls={false}
        />
        <div className={style.bottombar}>
          <span>Nombre evento...</span>
          <div className={style.recordstatus}>
            <Icon className={cx("tiny", isRecord ? style.red : style.white)}>
              fiber_manual_record
            </Icon>
            <span>EN VIVO</span>
          </div>
          <div className={style.volumeslider}>
            <VolumeDown />
            <Slider
              value={volumeVal}
              onChange={(event, newValue) => volumeChange(newValue)}
              aria-labelledby="continuous-slider"
            />
          </div>
          <div className={style.volumeMute} onClick={() => setMute(!muteFlag)}>
            <Icon className="small">
              {muteFlag ? "volume_mute" : "volume_off"}
            </Icon>
          </div>

          {/* <PopupState variant="popover" popupId="capture-popup-popover">
							{(popupState) => (
								<div className={style.alignCenter}>
									<Link to="/visor">
										<IconButton className={style.uploadGroup} color="primary" aria-label="upload picture" component="span" {...bindTrigger(popupState)}>
											<PhotoCamera />
										</IconButton>
									</Link>
								</div>
							)}
						</PopupState> */}

          {/* start */}
          <PopupState variant="popover" popupId="capture-popup-popover">
            {(popupState) => (
              <div className={style.alignCenter}>
                <IconButton
                  className={style.uploadGroup}
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                  {...bindTrigger(popupState)}
                >
                  <PhotoCamera />
                </IconButton>
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
                  <Box p={2} className={style.uploadButtonGroup}>
                    {capturing ? (
                      <IconButton
                        className={style.uploadButtonsRecord}
                        color="primary"
                        aria-label="record video"
                        component="span"
                        onClick={handleStopCaptureClick}
                      >
                        <CenterFocusStrong />
                      </IconButton>
                    ) : (
                      <IconButton
                        className={style.uploadButtons}
                        color="primary"
                        aria-label="record video"
                        component="span"
                        onClick={handleStartCaptureClick}
                      >
                        <CenterFocusStrong />
                      </IconButton>
                    )}
                    {capturing_Audio ? (
                      <IconButton
                        className={style.uploadButtonsRecord}
                        color="primary"
                        aria-label="record audio"
                        component="span"
                        onClick={handleStopCaptureClick_Audio}
                      >
                        <Mic />
                      </IconButton>
                    ) : (
                      <IconButton
                        className={style.uploadButtons}
                        color="primary"
                        aria-label="record audio"
                        component="span"
                        onClick={handleStartCaptureClick_Audio}
                      >
                        <Mic />
                      </IconButton>
                    )}
                    <IconButton
                      className={style.uploadButtons}
                      color="primary"
                      aria-label="capther picture"
                      component="span"
                      onClick={capture}
                    >
                      <PhotoCamera />
                    </IconButton>
                    <IconButton
                      className={style.uploadButtons}
                      color="primary"
                      variant="contained"
                      aria-label="upload picture"
                      component="label"
                    >
                      <CloudUpload />
                      <input
                        type="file"
                        style={{ display: "none" }}
                        accept="image/*"
                        multiple
                        onChange={submitFiles}
                      />
                    </IconButton>
                  </Box>
                </Popover>
              </div>
            )}
          </PopupState>
          {/* end */}

          <PopupState variant="popover" popupId="message-popup-popover">
            {(popupState) => (
              <div className={style.alignCenter}>
                <IconButton
                  className={style.uploadGroup}
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                  {...bindTrigger(popupState)}
                >
                  <ChatBubble />
                </IconButton>
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
                      onEnter={submitMessage}
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
          <div
            className={style.volumeMute}
            onClick={() => setFullscreen(!isFull)}
          >
            <Icon>crop_din</Icon>
          </div>
          <div className={style.volumeMute}>
            <Select
              value={channelType}
              input={<BootstrapInput />}
              // onChange={channelChange}
              onChange={(e) => {
                localStorage.setItem("channel", e.target.value);
                setChannel(e.target.value);
                if (e.target.value == "0") {
                  history.push("/visor");
                } else {
                  history.push(`/stream?id=${e.target.value}`);
                }
              }}
              IconComponent={SelectIcon}
            >
              <MenuItem value={0}>Local CAM</MenuItem>
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
              {/* <MenuItem value={0}><Link to="/visor" className={style.black}>Local CAM</Link></MenuItem>
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
								<MenuItem value={20}>Camera-20</MenuItem> */}
            </Select>
          </div>
          <div className={style.volumeMute}>
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
          </div>
        </div>
      </div>
    </Fullscreen>
  );
};
export default Stream;
