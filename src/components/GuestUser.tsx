import React, { useEffect, useRef, useState } from "react";
import DashboardHeader from "./DashboardHeader";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import axios from "../api/axios";
import { AxiosError } from "axios";
import { ErrorResponse, Frame } from "./Types";
import AddIcon from "../assets/add.svg";
import "./GuestUser.scss";

const GuestUser = () => {
  const [frameImage, setFrameImage] = useState<boolean>(false);
  const [frameImageInput, setFrameImageInput] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const [imageSrc, setImageSrc] = useState<string>("");
  const [framesData, setFramesData] = useState<any[]>([]);
  const [errMsg, setErrMsg] = useState<{ msg: string }[] | string>("");
  const errRef = useRef<HTMLParagraphElement>(null);
  const imgSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchSharedData = async () => {
      try {
        const response = await axios.get(`/api/share-data/${id}`);
        if (response.status === 200) {
          setImageSrc(response.data.imageUrl);
          setFramesData(response.data.framesData);
        }
      } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        if (error.response && error.response.data) {
          if (Array.isArray(error.response.data.errors)) {
            setErrMsg(error.response.data.errors);
          } else {
            setErrMsg([{ msg: error.response.data.message }]);
          }
        } else {
          setErrMsg([{ msg: "No Server Response!" }]);
        }
        errRef?.current?.focus();
      }
    };

    fetchSharedData();
  }, [id]);

  const handleFrameChange = (id: number, updatedFrame: Frame) => {
    setFramesData(
      framesData.map((frame) => (frame.id === id ? updatedFrame : frame))
    );
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        handleFrameChange(id, {
          ...framesData.find((frame) => frame.id === id)!,
          innerImage: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
      setFrameImageInput(true);
    }
  };

  const handleDownloadClick = async () => {
    if (imageSrc && imgSectionRef.current) {
      const canvas = await html2canvas(imgSectionRef.current as HTMLElement, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });
  
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "avatar.png";
      link.click();
    }
  };
  
  return (
    <div className="container">
      <DashboardHeader
        admin={false}
        handleDownloadClick={handleDownloadClick}
      />
      <div className="details guest">
        <div className="event-details">
          <h2>Event Details</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>

        {Array.isArray(errMsg) ? (
          errMsg.map((error, index) => (
            <p
              key={index}
              ref={index === 0 ? errRef : null}
              className={errMsg ? "errmsg" : "offscreen"}
              aria-live="assertive"
            >
              {error.msg}
            </p>
          ))
        ) : (
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
        )}

        {!frameImageInput && (
          <div className="page-body">
            <div
              className={frameImage ? "img-section center" : "img-section"}
              style={{
                position: "relative",
                width: "450px",
                height: "450px",
              }}
            >
              <div
                className="img"
                ref={imgSectionRef}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                  position: "relative",
                }}
              >
                <img
                  src={imageSrc}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
                {framesData.length > 0 &&
                  framesData.map((frame) => (
                    <div
                      key={frame.id}
                      className="frame-img"
                      style={{
                        position: "absolute",
                        top: frame.position.top,
                        left: frame.position.left,
                        width: `${frame.size}px`,
                        height: `${frame.size}px`,
                        borderRadius: frame.type === "circle" ? "50%" : "0",
                        overflow: "hidden",
                      }}
                    >
                      {frame.innerImage ? (
                        <img
                          src={frame.innerImage}
                          alt={`Frame ${frame.id}`}
                          className="inner-image"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: frame.type === "circle" ? "50%" : "0",
                          }}
                        />
                      ) : (
                        <div>
                          <input
                            type="file"
                            onChange={(e) => handleFileChange(e, frame.id)}
                            style={{ display: "none" }}
                            id={`innerImageInput-${frame.id}`}
                          />
                          <label
                            htmlFor={`innerImageInput-${frame.id}`}
                            className="upload-btn"
                          >
                            <img
                              src={AddIcon}
                              alt=""
                              style={{ cursor: "pointer" }}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
            {!frameImage && (
              <div
                className="ins"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  marginLeft: "2rem",
                }}
              >
                <h2
                  style={{
                    lineHeight: "2.45rem",
                    fontWeight: 800,
                    fontSize: "1.5rem",
                    fontFamily: '"Montserrat", sans-serif',
                    marginTop: 0,
                  }}
                >
                  UPLOAD YOUR IMAGE
                </h2>
                <p
                  style={{
                    margin: 0,
                    borderRadius: "1.438rem",
                    textDecoration: "none",
                    color: "#ffffff",
                    fontWeight: 500,
                    fontSize: "15px",
                    fontFamily: '"Montserrat", sans-serif',
                    lineHeight: "1.5rem",
                    textAlign: "center",
                  }}
                >
                  Click the “+” sign to add your image
                </p>
              </div>
            )}
          </div>
        )}

        {frameImageInput && (
          <>
            <div className="page-body">
              <div className="guest-img">
                {framesData.length > 0 &&
                  framesData.map((frame) => (
                    <div
                      className="frame-section"
                      style={{
                        width: `${frame.size}px`,
                        height: `${frame.size}px`,
                        overflow: "hidden",
                        border: "1px dashed white",
                      }}
                    >
                      <div
                        key={frame.id}
                        className="frame-img"
                        style={{
                          width: `${frame.size}px`,
                          height: `${frame.size}px`,
                          borderRadius: frame.type === "circle" ? "50%" : "0",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={frame.innerImage}
                          alt={`Frame ${frame.id}`}
                          className="inner-image"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: frame.type === "circle" ? "50%" : "0",
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="btn-sec">
              <button
                onClick={() => {
                  setFrameImage(true);
                  setFrameImageInput(false);
                }}
              >
                OK
              </button>
              {framesData.length > 0 &&
                framesData.map((frame) => (
                  <div className="file-input">
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, frame.id)}
                      style={{ display: "none" }}
                      id={`innerImageInput-${frame.id}`}
                    />
                    <label
                      htmlFor={`innerImageInput-${frame.id}`}
                      className="upload-btn"
                    >
                      CHANGE IMAGE
                    </label>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GuestUser;
