import React, { useEffect, useRef, useState } from "react";
import { Button } from "../../ui/Button";
import Footer from "../../components/footer/Footer";
import { useNavigate } from "react-router-dom";
import Card from "../../ui/Card";

// Add a fade-in animation to each section
// import "./Home.css"; // Make sure to import your custom CSS (explained below)

const Home = () => {
  const [selectedOption, setSelectedOption] = useState("values");
  const navigate = useNavigate();
  const waveDivRef = useRef(null); // Reference for the div where the wave will appear

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const content = {
    values: (
      <div>
        <h4 className="text-xl font-bold text-p-color mb-4">Our Values</h4>
        <p className="text-sm text-s-color">
          We value integrity, transparency, and dedication to providing the best
          AI-driven solutions for our clients. Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Eius, libero?
        </p>
      </div>
    ),
    vision: (
      <div>
        <h4 className="text-xl font-bold text-p-color mb-4">Our Vision</h4>
        <p className="text-sm text-s-color">
          Our vision is to revolutionize customer engagement with cutting-edge
          AI solutions that make interactions more meaningful.
        </p>
      </div>
    ),
    mission: (
      <div>
        <h4 className="text-xl font-bold text-p-color mb-4">Our Mission</h4>
        <p className="text-sm text-s-color">
          Our mission is to empower businesses with powerful AI chatbots that
          streamline communication and improve customer satisfaction.
        </p>
      </div>
    ),
  };

  // useEffect(() => {
  //   // Create the wave animation when the component is mounted
  //   const callWave = () => {
  //     function SiriWave(opt) {
  //       this.opt = opt || {};
  //       this.K = 3.2;
  //       this.F = 3;
  //       this.speed = this.opt.speed || 0.1;
  //       this.noise = this.opt.noise || 0;
  //       this.phase = this.opt.phase || 0;

  //       if (!devicePixelRatio) devicePixelRatio = 1;
  //       this.width = devicePixelRatio * (window.innerWidth || this.opt.width); // Full width
  //       this.height = devicePixelRatio * (this.opt.height || 300); // Set a reasonable height
  //       this.MAX = this.height / 2 - 4;

  //       // Create the canvas only if the div reference exists
  //       if (!this.opt.container) return;
  //       this.canvas = this.opt.container.querySelector("canvas");
  //       if (!this.canvas) {
  //         // Create the canvas element if it doesn't already exist
  //         this.canvas = document.createElement("canvas");
  //         this.canvas.width = this.width;
  //         this.canvas.height = this.height;
  //         this.canvas.style.width = this.width / devicePixelRatio + "px";
  //         this.canvas.style.height = this.height / devicePixelRatio + "px";

  //         // Attach the canvas to the div referenced by waveDivRef
  //         this.opt.container.appendChild(this.canvas);
  //       }

  //       this.ctx = this.canvas.getContext("2d");
  //       this.run = false;
  //     }

  //     SiriWave.prototype = {
  //       _globalAttenuationFn: function (x) {
  //         return Math.pow(
  //           (this.K * 4) / (this.K * 4 + Math.pow(x, 4)),
  //           this.K * 2
  //         );
  //       },
  //       _drawLine: function (attenuation, color, width) {
  //         var checkId = document.getElementById("wave");
  //         if (checkId) {
  //           this.ctx.moveTo(0, 0);
  //           this.ctx.beginPath();
  //           this.ctx.strokeStyle = color;
  //           this.ctx.lineWidth = width || 1;
  //           var x, y;
  //           for (var i = -this.K; i <= this.K; i += 0.01) {
  //             x = this.width * ((i + this.K) / (this.K * 2));
  //             y =
  //               this.height / 2 +
  //               this.noise *
  //                 this._globalAttenuationFn(i) *
  //                 (1 / attenuation) *
  //                 Math.sin(this.F * i - this.phase);
  //             this.ctx.lineTo(x, y);
  //           }
  //           this.ctx.stroke();
  //         }
  //       },
  //       _clear: function () {
  //         var checkId = document.getElementById("wave");
  //         if (checkId) {
  //           this.ctx.globalCompositeOperation = "destination-out";
  //           this.ctx.fillRect(0, 0, this.width, this.height);
  //           this.ctx.globalCompositeOperation = "source-over";
  //         }
  //       },
  //       _draw: function () {
  //         if (!this.run) return;
  //         this.phase = (this.phase + this.speed) % (Math.PI * 64);
  //         this._clear();
  //         this._drawLine(-2, "rgba(0,0,0,0.1)");
  //         this._drawLine(2, "rgb(255, 115, 100,1)");
  //         this._drawLine(1, "rgb(54, 57, 164,1)", 1.5);
  //         requestAnimationFrame(this._draw.bind(this), 1000);
  //       },
  //       start: function () {
  //         this.phase = 0;
  //         this.run = true;
  //         this._draw();
  //       },
  //       stop: function () {
  //         this.run = false;
  //         this._clear();
  //       },
  //       setNoise: function (v) {
  //         this.noise = Math.min(v, 1) * this.MAX;
  //       },
  //       setSpeed: function (v) {
  //         this.speed = v;
  //       },
  //       set: function (noise, speed) {
  //         this.setNoise(noise);
  //         this.setSpeed(speed);
  //       },
  //     };

  //     // Initialize the wave animation
  //     const SW = new SiriWave({
  //       width: window.innerWidth, // Full width of the screen
  //       height: 250, // Height of the wave
  //       container: waveDivRef.current, // Attach the canvas to the div we referenced
  //     });

  //     SW.setSpeed(0.1);
  //     SW.setNoise(1);
  //     SW.start();
  //   };

  //   // Call the wave animation function once the component is mounted
  //   callWave();

  //   // Cleanup function (if needed) to stop the wave animation when the component unmounts
  //   return () => {
  //     const canvas = waveDivRef.current.querySelector("canvas");
  //     if (canvas) {
  //       // Stop the wave and remove the canvas if necessary
  //       canvas.remove();
  //     }
  //   };
  // }, []); // Empty array to run the effect once after the component is mounted

  useEffect(() => {
    // Create the wave animation when the component is mounted
    const callWave = () => {
      if (!waveDivRef.current) return; // Ensure the container is defined

      function SiriWave(opt) {
        this.opt = opt || {};
        this.K = 3.2;
        this.F = 3;
        this.speed = this.opt.speed || 0.1;
        this.noise = this.opt.noise || 0;
        this.phase = this.opt.phase || 0;

        if (!devicePixelRatio) devicePixelRatio = 1;
        this.width = devicePixelRatio * (window.innerWidth || this.opt.width); // Full width
        this.height = devicePixelRatio * (this.opt.height || 300); // Set a reasonable height
        this.MAX = this.height / 2 - 4;

        // Create the canvas only if the div reference exists
        this.canvas = this.opt.container.querySelector("canvas");
        if (!this.canvas) {
          // Create the canvas element if it doesn't already exist
          this.canvas = document.createElement("canvas");
          this.canvas.width = this.width;
          this.canvas.height = this.height;
          this.canvas.style.width = this.width / devicePixelRatio + "px";
          this.canvas.style.height = this.height / devicePixelRatio + "px";

          // Attach the canvas to the div referenced by waveDivRef
          this.opt.container.appendChild(this.canvas);
        }

        this.ctx = this.canvas.getContext("2d");
        this.run = false;
      }

      SiriWave.prototype = {
        _globalAttenuationFn: function (x) {
          return Math.pow(
            (this.K * 4) / (this.K * 4 + Math.pow(x, 4)),
            this.K * 2
          );
        },
        _drawLine: function (attenuation, color, width) {
          if (!this.ctx) return; // Ensure context is available
          this.ctx.moveTo(0, 0);
          this.ctx.beginPath();
          this.ctx.strokeStyle = color;
          this.ctx.lineWidth = width || 1;
          var x, y;
          for (var i = -this.K; i <= this.K; i += 0.01) {
            x = this.width * ((i + this.K) / (this.K * 2));
            y =
              this.height / 2 +
              this.noise *
                this._globalAttenuationFn(i) *
                (1 / attenuation) *
                Math.sin(this.F * i - this.phase);
            this.ctx.lineTo(x, y);
          }
          this.ctx.stroke();
        },
        _clear: function () {
          if (!this.ctx) return; // Ensure context is available
          this.ctx.globalCompositeOperation = "destination-out";
          this.ctx.fillRect(0, 0, this.width, this.height);
          this.ctx.globalCompositeOperation = "source-over";
        },
        _draw: function () {
          if (!this.run) return;
          this.phase = (this.phase + this.speed) % (Math.PI * 64);
          this._clear();
          this._drawLine(-2, "rgba(0,0,0,0.1)");
          this._drawLine(2, "rgb(255, 115, 100,1)");
          this._drawLine(1, "rgb(54, 57, 164,1)", 1.5);
          requestAnimationFrame(this._draw.bind(this), 1000);
        },
        start: function () {
          this.phase = 0;
          this.run = true;
          this._draw();
        },
        stop: function () {
          this.run = false;
          this._clear();
        },
        setNoise: function (v) {
          this.noise = Math.min(v, 1) * this.MAX;
        },
        setSpeed: function (v) {
          this.speed = v;
        },
        set: function (noise, speed) {
          this.setNoise(noise);
          this.setSpeed(speed);
        },
      };

      // Initialize the wave animation
      const SW = new SiriWave({
        width: window.innerWidth, // Full width of the screen
        height: 250, // Height of the wave
        container: waveDivRef.current, // Attach the canvas to the div we referenced
      });

      SW.setSpeed(0.1);
      SW.setNoise(1);
      SW.start();
    };

    // Call the wave animation function once the component is mounted
    callWave();

    // Cleanup function (if needed) to stop the wave animation when the component unmounts
    return () => {
      if (waveDivRef.current) {
        const canvas = waveDivRef.current.querySelector("canvas");
        if (canvas) {
          // Stop the wave and remove the canvas if necessary
          canvas.remove();
        }
      }
    };
  }, []); // Empty array to run the effect once after the component is mounted

  return (
    <div className="h-screen flex flex-col bg-bg-color pt-16">
      {/* Navigation */}
      <nav className="bg-d-color shadow-lg py-3 fixed top-0 left-0 w-full z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Brand Section */}
          <div className="text-xl font-bold text-bg-color font-head hover:text-p-color transition-colors duration-300">
            AI Interview Bot
          </div>

          {/* Navigation Buttons */}
          <div className="space-x-4 flex items-center">
            <Button
              onClick={() => {
                console.log("Navigating to /login");
                navigate("/login");
              }}
            >
              Login
            </Button>
            <Button
              onClick={() => navigate("/register")}
              className="px-6 py-2 text-lg font-medium bg-p-color text-bg-color transition duration-300 transform hover:scale-105 hover:bg-p-color-dark"
            >
              Register
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Section */}
      <main className="flex-grow overflow-y-auto overflow-x-hidden">
        <div className="container mx-auto px-4 text-center">
          {/* Boost Your Business Section */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-8">
            <div className="w-full md:w-1/2 text-center md:text-left px-4 mb-8 md:mb-0">
              <h2 className="text-6xl font-bold text-p-color mb-4 font-head">
                Boost Your Business
              </h2>
              <p className="text-lg text-s-color mb-4 font-sub">
                Chatbot is the solution master, resolves your problem faster.
              </p>
              <Button
                variant="secondary"
                onClick={() => navigate("/learn-more")}
              >
                Read More
              </Button>
            </div>

            {/* GIF Section */}
            <div className="w-full md:w-1/2 flex justify-center px-4">
              {/* <img
                src="/assets/chat.gif"
                alt="Chatbot GIF"
                className="max-w-full h-auto"
                // height={"400px"}
                // width={"400px"}
              /> */}
            </div>
          </div>
        </div>

        {/* Wave Animation Canvas Section */}
        <div
          ref={waveDivRef} // Apply the ref to the div where the wave will appear
          className="w-full bg-bg-color h-72" // Ensure it has a height for the wave to show
          id="wave"
        >
          {/* The canvas will be dynamically created here */}
        </div>

        {/* Process Section */}
        {/* <div className="bg-p-color py-8">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-4 font-head text-d-color text-center">
              Our Process
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[...Array(4)].map((_, index) => (
                <Card
                  key={index}
                  title={`Step ${index + 1}`}
                  className="transform transition-all hover:scale-105 duration-300"
                >
                  <p className="text-sm font-text text-bg-color">
                    Process description for step {index + 1}.
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div> */}
        <div className="about-us-section pt-16 pb-16 bg-p-color px-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col-reverse md:flex-row items-center">
              {/* Left Side Content */}
              <div className="w-full md:w-1/2">
                <h2 className="text-3xl font-bold text-bg-color mb-4 font-head">
                  About Us
                </h2>
                <h3 className="text-2xl font-bold text-bg-color mb-4 font-head">
                  Get to Know Our Chatbot Assistant - Chatty
                </h3>

                {/* Card with 3 options */}
                <div className="card bg-white shadow-lg p-6 rounded-md mb-8 w-full">
                  <div className="flex justify-around mb-4">
                    <button
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        selectedOption === "values"
                          ? "bg-p-color text-bg-color"
                          : "bg-bg-color text-p-color"
                      }`}
                      onClick={() => handleOptionClick("values")}
                    >
                      Our Values
                    </button>
                    <button
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        selectedOption === "vision"
                          ? "bg-p-color text-bg-color"
                          : "bg-bg-color text-p-color"
                      }`}
                      onClick={() => handleOptionClick("vision")}
                    >
                      Our Vision
                    </button>
                    <button
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        selectedOption === "mission"
                          ? "bg-p-color text-bg-color"
                          : "bg-bg-color text-p-color"
                      }`}
                      onClick={() => handleOptionClick("mission")}
                    >
                      Our Mission
                    </button>
                  </div>

                  {/* Content based on selected option */}
                  <div className="content-section">
                    {content[selectedOption]}
                  </div>
                </div>

                {/* Stats Section */}
                <div className="stats-section text-center mb-8">
                  <h3 className="text-3xl font-bold text-bg-color mb-4 font-head">
                    50+ Happy Users
                  </h3>
                  <p className="text-lg text-s-color mb-4 font-sub">
                    Join the growing number of satisfied users who trust Talkie
                    for efficient communication.
                  </p>

                  <h3 className="text-3xl font-bold text-bg-color mb-4 font-head">
                    200+ Best Products
                  </h3>
                  <p className="text-lg text-s-color mb-4 font-sub">
                    Explore our top products that offer cutting-edge solutions
                    with unmatched quality.
                  </p>
                </div>
              </div>

              {/* Right Side Image */}
              <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                {/* <img
                  src="/assets/know.png"
                  alt="Chatbot Assistant"
                  className="max-w-full h-auto"
                /> */}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
};

export default Home;
