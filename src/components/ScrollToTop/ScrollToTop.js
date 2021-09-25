import React, { useState, useEffect } from "react";
import "./ScrollToTop.style.css";
import { KeyboardArrowUp } from "@material-ui/icons";
import { Grid, Tooltip, Fab } from "@material-ui/core";

// export default class ScrollToTop extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isVisible: false,
//       setIsVisible: false,
//     };
//   }

//   toggleVisibility = () => {
//     if (window.pageXOffset > 10) {
//       console.log("tes scroolll");
//       this.setState({
//         setIsVisible: true,
//       });
//     } else {
//       this.setState({
//         setIsVisible: false,
//       });
//     }
//   };

//   scrollToTop = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   componentDidMount = () => {
//     window.addEventListener("scroll", this.toggleVisibility);
//   };

//   // componentWillUnmount = () => {
//   //   window.removeEventListener("scroll", this.toggleVisibility);
//   // };

//   render() {
//     return (
//       <div className="scroll-to-top">
//         {this.state.setIsVisible === true && (
//           <div onClick={this.scrollToTop()}>
//             <Grid container justify="left">
//               <Grid item>
//                 <Tooltip title="Add" aria-label="add">
//                   <Fab style={{ backgroundColor: "#2e6da4", color: "#fff" }}>
//                     <KeyboardArrowUp style={{ height: 35, width: 35 }} />
//                   </Fab>
//                 </Tooltip>
//               </Grid>
//             </Grid>
//           </div>
//         )}
//       </div>
//     );
//   }
// }

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
          <Grid container justify="left">
            <Grid item>
              <Tooltip title="Add" aria-label="add">
                <Fab style={{ backgroundColor: "#2e6da4", color: "#fff" }}>
                  <KeyboardArrowUp style={{ height: 35, width: 35 }} />
                </Fab>
              </Tooltip>
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
}
