const YAN_URL_REDIRECT = import.meta.env.VITE_YANDEX_URL_REDIRECT;
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID
export const openYandexOAuth = () => {
  const client_id = CLIENT_ID;
  const redirect_uri = YAN_URL_REDIRECT;
  const authUrl = `https://oauth.yandex.ru/authorize?response_type=token&client_id=${client_id}&redirect_uri=${redirect_uri}`;

  const width = 600;
  const height = 600;
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;

  const popup = window.open(
    authUrl,
    "yandex_oauth",
    `width=${width},height=${height},top=${top},left=${left}`
  );

  const popupCheck = setInterval(() => {
    if (!popup || popup.closed) {
      clearInterval(popupCheck);
    }
  }, 500);

  const messageListener = async (event) => {
    if (event.data.type === "ya-auth-success") {
      const token = event.data.token;
      const expiresIn = event.data.expiresIn;

      localStorage.setItem(
        "token",
        JSON.stringify({ authToken: token, expiration: expiresIn })
      );

      try {
        const res = await fetch("https://login.yandex.ru/info?format=json", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const profile = await res.json();
        localStorage.setItem("profile", JSON.stringify(profile));
      } catch (e) {
        console.error("Ошибка получения профиля:", e);
      }

      popup?.close();
      clearInterval(popupCheck);
      window.removeEventListener("message", messageListener);

      window.location.href = "/";
    }
  };

  window.addEventListener("message", messageListener);
};