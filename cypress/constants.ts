export const CY_TIMEOUT = 4000;
export const CY_IPHONE_X_USER_AGENT =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 15_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1";

export const CY_MOBILE_SIZE = [375, 812]; // iphone x
export const CY_DESKTOP_SIZE = [1440, 900];

export const CY_DEVICES = {
  mobile: {
    type: "mobile",
    size: CY_MOBILE_SIZE,
    userAgent: CY_IPHONE_X_USER_AGENT,
  },
  desktop: {
    type: "desktop",
    size: CY_DESKTOP_SIZE,
  },
};

export const mobileHeaders = {
  headers: {
    "user-agent": CY_DEVICES.mobile.userAgent,
  },
};
