import { Link } from "react-router-dom";
import "./homepage.css";
import { TypeAnimation } from "react-type-animation";
import { useState } from "react";

const Homepage = () => {
  const [typingStatus, setTypingStatus] = useState("human1");

  return (
    <div className="homepage">
      {/* <img src="/tlo_700.png" alt="" className="orbital" /> */}
      <div className="left">
        <h1>Yogaherbs chat</h1>
        <h2>Supports the search for plant knowledge</h2>
        <h3>
          Ask what you want, chat is based on a specialized language model
          trained on scientific studies.
        </h3>
        <Link to="/dashboard">Get Started</Link>
      </div>
      <div className="right">
        <div className="imgContainer">
          <div className="bgContainer">
            <div className="bg"></div>
          </div>
          <img src="/daco.png" alt="" className="bot" />
          <div className="chat">
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                "User: What are adaptogens, and how do they work in the body?",
                2000,
                () => {
                  setTypingStatus("bot");
                },
                "AI: Adaptogens are natural substances, usually herbs, that help the body adapt to stress and maintain balance.",
                2000,
                () => {
                  setTypingStatus("human2");
                },
                "User2: Can you recommend any herbs that are considered good adaptogens?",
                2000,
                () => {
                  setTypingStatus("bot");
                },
                "AI: Some popular adaptogenic herbs include Ashwagandha, Rhodiola, and Holy Basil. ",
                2000,
                () => {
                  setTypingStatus("human1");
                },
              ]}
              wrapper="span"
              repeat={Infinity}
              cursor={true}
              omitDeletionAnimation={true}
            />
          </div>
        </div>
      </div>
      <div className="terms">
        <div className="links">
          <span>Copyright© 2024 TAKZEN | Powered by TAKZEN</span>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
