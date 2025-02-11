import { memo, useCallback, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

interface ReCaptchaProps {
  onVerify: (token: string | null) => void;
}

const ReCaptcha = memo(({ onVerify }: ReCaptchaProps) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const handleChange = useCallback((token: string | null) => {
    console.log('reCAPTCHA Change Event Triggered');
    if (token) {
      console.log('reCAPTCHA Verification Success - Token received');
      onVerify(token);
    } else {
      console.log('reCAPTCHA Verification Failed or Expired');
      onVerify(null);
    }
  }, [onVerify]);

  const handleExpired = useCallback(() => {
    console.log('reCAPTCHA has expired');
    onVerify(null);
  }, [onVerify]);

  const handleError = useCallback(() => {
    console.error('reCAPTCHA Error occurred');
    onVerify(null);
  }, [onVerify]);

  if (!siteKey) {
    console.error('reCAPTCHA site key:', siteKey);
    console.error('Environment variables:', import.meta.env);
    return null;
  }

  return (
    <div className="captcha-container">
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={siteKey}
        onChange={handleChange}
        onExpired={handleExpired}
        onError={handleError}
        theme="light"
        size="normal"
      />
    </div>
  );
});

ReCaptcha.displayName = 'ReCaptcha';

export default ReCaptcha;