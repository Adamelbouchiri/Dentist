import { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppContext from "../../context/AppProvider";
import { PageLoader } from "../../components/ui/Spinner";

/** Shared OAuth callback: stores the token and continues onboarding. */
export const OAuthSuccess = () => {
  const { signIn } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      signIn(token, true);
      navigate("/second-registration", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <PageLoader />;
};

export const GoogleAuthSuccess = OAuthSuccess;
