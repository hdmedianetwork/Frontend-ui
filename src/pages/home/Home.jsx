import { Button } from "../../ui/Button";
import Footer from "../../components/footer/Footer";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col bg-bg-color">
      <nav className="bg-d-color shadow-md py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-xl font-bold text-bg-color font-head">
            AI Interview Bot
          </div>
          <div className="space-x-2">
            <Button
              variant="secondary"
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </Button>
            <Button
              onClick={() => {
                navigate("/register");
              }}
            >
              Register
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 font-head text-p-color">
            Master Your Interview Skills
          </h1>
          <p className="text-lg text-s-color mb-4 font-sub">
            Practice with our AI-powered interview bot and boost your confidence
          </p>
          <Button
            onClick={() => {
              navigate("/register");
            }}
          >
            Start Practicing Now
          </Button>
        </div>

        <div className="bg-p-color py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <h3 className="text-lg font-bold mb-2 font-head text-d-color">
                  24/7 Availability
                </h3>
                <p className="font-text text-bg-color text-sm">
                  Practice whenever you want
                </p>
              </div>
              <div className="text-center p-4">
                <h3 className="text-lg font-bold mb-2 font-head text-d-color">
                  Personalized Feedback
                </h3>
                <p className="font-text text-bg-color text-sm">
                  Get instant insights on your responses
                </p>
              </div>
              <div className="text-center p-4">
                <h3 className="text-lg font-bold mb-2 font-head text-d-color">
                  Industry Specific
                </h3>
                <p className="font-text text-bg-color text-sm">
                  Questions tailored to your field
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
