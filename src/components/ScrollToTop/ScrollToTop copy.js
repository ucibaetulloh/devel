import React, { useEffect, useState, Component } from "react";
import "./ScrollToTop.style.css";
import { KeyboardArrowUp } from "@material-ui/icons";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scorlled upto given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 10) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top cordinate to 0
  // make scrolling smooth
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="scroll-to-top">
      {isVisible && (
        <div onClick={scrollToTop}>
          <div className="boxScrollTop">
            <KeyboardArrowUp style={{ color: "blue", height: 50, width: 50 }} />
          </div>
        </div>
      )}
    </div>
  );
}
