import React, { useEffect, useState } from "react";
import "./clock.css";
import "animate.css";

import ClipLoader from "react-spinners/ClipLoader";

function Clock() {
  const [detailActive, setDetailActive] = useState("");
  const [activeTheme, setActiveTheme] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [detailAnimate, setDetailAnimate] = useState("none");
  const [wrapperAnimate, setWrapperAnimate] = useState("");

  const [clientIp, setClientIp] = useState("");
  const [timeData, setTimeData] = useState("");
  const [cityData, setCityData] = useState("");
  const [quoteData, setQuoteData] = useState("");

  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");

  const getTime = async () => {
    try {
      const ipResponse = await fetch(process.env.REACT_APP_IP_API_URL);
      const ipData = await ipResponse.json();
      setClientIp(ipData);

      const timeResponse = await fetch(
        `${process.env.REACT_APP_TIME_API_URL}/${clientIp}`
      );
      const timeData = await timeResponse.json();
      setTimeData(timeData);

      const cityResponse = await fetch(
        `${process.env.REACT_APP_CITY_API_URL}/${clientIp}?fields=status,message,countryCode,city`
      );
      const cityData = await cityResponse.json();
      setCityData(cityData);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getQuote = () => {
    fetch(`${process.env.REACT_APP_QUOTE_API_URL}/random`)
      .then((res) => res.json())
      .then((data) => setQuoteData(data));
  };

  useEffect(() => {
    getQuote();
    getTime();

    setInterval(() => {
      getTime();
    }, 5000);
  }, []);

  useEffect(() => {
    const datetimeString = timeData.datetime;
    const dateObj = new Date(datetimeString);
    setHour(String(dateObj.getHours()).padStart(2, "0"));
    setMinute(String(dateObj.getMinutes()).padStart(2, "0"));
  }, [timeData]);

  useEffect(() => {
    if (detailActive === true) {
      setDetailAnimate("animate__animated animate__fadeInUp");
      setWrapperAnimate("scrollUp");
    }

    if (detailActive === false) {
      setDetailAnimate("animate__animated animate__fadeOutDown");
      setWrapperAnimate("scrollDown");
    }
  }, [detailActive]);

  useEffect(() => {
    if (Number(hour) < 12 && Number(hour) >= 0) setActiveTheme("morning");
    if (Number(hour) > 12 && Number(hour) < 18) setActiveTheme("afternoon");
    if (Number(hour) > 18 && Number(hour) < 24) setActiveTheme("evening");
  }, [hour]);

  useEffect(() => {
    if (activeTheme !== "") {
      setIsLoading(true);
    }
  }, [activeTheme]);

  return (
    <div>
      {!isLoading ? (
        <div className="loadWrapper">
          <ClipLoader size={150} />{" "}
        </div>
      ) : (
        <div className="clock">
          {(activeTheme === "morning" || activeTheme === "afternoon") && (
            <img
              src="assets/desktop/bg-image-daytime.jpg"
              alt=""
              className="clockBg"
            />
          )}

          {activeTheme === "evening" && (
            <img
              src="assets/desktop/bg-image-nighttime.jpg"
              alt=""
              className="clockBg"
            />
          )}

          {(activeTheme === "morning" || activeTheme === "afternoon") && (
            <img
              src="assets/tablet/bg-image-daytime.jpg"
              alt=""
              className="clockBgTablet"
            />
          )}

          {activeTheme === "evening" && (
            <img
              src="assets/tablet/bg-image-nighttime.jpg"
              alt=""
              className="clockBgTablet"
            />
          )}

          <div className="blackOutBg"></div>
          <div className={`clockWrapper ${wrapperAnimate}`}>
            <div className={"clockWrapperTop"}>
              <div className="clockWrapperQuote">
                <div className="clockWrapperQuoteTop">
                  <p className="clockWrapperQuoteTopDesc">
                    “{quoteData.quote}”
                  </p>
                  <img
                    src="assets/desktop/icon-refresh.svg"
                    alt=""
                    className="clockWrapperQuoteTopIcon"
                    onClick={getQuote}
                  />
                </div>
                <div className="clockWrapperQuoteBottom">
                  <h5 className="clockWrapperQuoteBottomAuthor">
                    {quoteData.author}
                  </h5>
                </div>
              </div>
            </div>
            <div className="clockWrapperBottom">
              <div className="clockTime">
                <div className="clockTimeTop">
                  <img
                    src="assets/desktop/icon-sun.svg"
                    alt=""
                    className="clockTimeTopIcon"
                  />
                  <h4 className="clockTimeTopTitle">
                    GOOD {activeTheme}{" "}
                    <span className="currently"> , IT’S CURRENTLY</span>
                  </h4>
                </div>
                <div className="clockTimeMiddle">
                  <h1 className="clockTimeMiddleTitle">
                    {hour}:{minute}
                  </h1>
                  <p className="clockTimeMiddleDesc">BST</p>
                </div>
                <div className="clockTimeBottom">
                  <h3 className="clokTimeBottomTitle">
                    IN {cityData.city}, {cityData.countryCode}
                  </h3>
                </div>
              </div>
              <button
                className="clockMoreButton"
                onClick={() => setDetailActive(!detailActive)}
              >
                {detailActive ? "LESS" : "MORE"}
                <div className="clockMoreButtonIconWrapper">
                  <img
                    src="assets/desktop/icon-arrow-down.svg"
                    className={
                      detailActive
                        ? "clockMoreButtonIcon reverse"
                        : "clockMoreButtonIcon"
                    }
                    alt="clockMoreButtonIcon"
                  />
                </div>
              </button>
            </div>
          </div>
          <div
            className={
              activeTheme === "evening"
                ? `detailComponent detailComponentNight ${detailAnimate}`
                : `detailComponent ${detailAnimate}`
            }
          >
            <div className="detailComponentLeft">
              <div className="detailComponentItem">
                <h4 className="detailComponentItemTitle">CURRENT TIMEZONE</h4>
                <h2 className="detailComponentItemDesc">{timeData.timezone}</h2>
              </div>
              <div className="detailComponentItem">
                <h4 className="detailComponentItemTitle">Day of the year</h4>
                <h2 className="detailComponentItemDesc">
                  {timeData.day_of_year}
                </h2>
              </div>
            </div>
            <hr className="detailComponentSep" />
            <div className="detailComponentRight">
              <div className="detailComponentItem">
                <h4 className="detailComponentItemTitle">Day of the week</h4>
                <h2 className="detailComponentItemDesc">
                  {timeData.day_of_week}
                </h2>
              </div>
              <div className="detailComponentItem">
                <h4 className="detailComponentItemTitle">Week number</h4>
                <h2 className="detailComponentItemDesc">
                  {timeData.week_number}
                </h2>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clock;
